import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

/**
 * This route handles the success redirect from Stripe Checkout
 * It verifies the session, upgrades the user, and redirects to the dashboard
 */
export async function GET(req: NextRequest) {
  // Get the session ID and customer ID from the URL query parameters
  const searchParams = req.nextUrl.searchParams;
  const sessionId = searchParams.get("session_id");
  const customerId = searchParams.get("customer_id");

  console.log(`🔍 Processing checkout success with session ID: ${sessionId}`);

  try {
    if (!sessionId || !customerId) {
      console.error("❌ Missing session_id or customer_id in success URL");
      return NextResponse.redirect(
        new URL("/dashboard?error=missing_session", req.url)
      );
    }

    // Verify the session with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.payment_status !== "paid") {
      console.error(`❌ Session not found or not paid: ${sessionId}`);
      return NextResponse.redirect(
        new URL("/dashboard?error=payment_incomplete", req.url)
      );
    }

    console.log(`✅ Verified paid session: ${sessionId}`);

    // Get customer details to find the user
    const customer = await stripe.customers.retrieve(customerId);

    if (!customer || customer.deleted) {
      console.error(`❌ Customer not found: ${customerId}`);
      return NextResponse.redirect(
        new URL("/dashboard?error=customer_not_found", req.url)
      );
    }

    // Get userId from customer metadata
    const userId = customer.metadata?.userId;

    if (!userId) {
      console.error(`❌ No userId found in customer metadata: ${customerId}`);
      return NextResponse.redirect(
        new URL("/dashboard?error=missing_user_id", req.url)
      );
    }

    console.log(`👤 Found user ID from customer metadata: ${userId}`);

    // Get subscription details if present
    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;

    if (!subscriptionId) {
      console.error("❌ No subscription found in the session");
    } else {
      console.log(`📝 Found subscription ID: ${subscriptionId}`);

      try {
        // Retrieve subscription details
        const subscription =
          await stripe.subscriptions.retrieve(subscriptionId);

        // Upgrade user to PREMIUM
        console.log(
          `⬆️ Upgrading user ${userId} to PREMIUM role directly via success URL`
        );

        try {
          // Update the user role
          await db.profile.update({
            where: { userId },
            data: {
              role: UserRole.PREMIUM,
            },
          });
          console.log(`✅ User role updated to PREMIUM`);

          // Update Stripe-related fields in the profile
          await db.$queryRaw`
            UPDATE profiles 
            SET 
              stripe_customer_id = ${customerId},
              stripe_subscription_id = ${subscriptionId},
              stripe_price_id = ${subscription.items.data[0]?.price.id || null},
              stripe_current_period_end = ${new Date(subscription.current_period_end * 1000)}
            WHERE 
              "userId" = ${userId}
          `;
          console.log(`✅ Stripe subscription details saved to profile`);
        } catch (error) {
          console.error(`❌ Error upgrading user:`, error);
          return NextResponse.redirect(
            new URL("/dashboard?error=upgrade_failed", req.url)
          );
        }
      } catch (error) {
        console.error(`❌ Error retrieving subscription details:`, error);
      }
    }

    // Redirect to dashboard with success parameter
    return NextResponse.redirect(
      new URL("/dashboard?subscription_success=true", req.url)
    );
  } catch (error) {
    console.error("❌ Error processing checkout success:", error);
    return NextResponse.redirect(
      new URL("/dashboard?error=processing_failed", req.url)
    );
  }
}
