import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { UserRole, Prisma } from "@prisma/client";
import { redirect } from "next/navigation";

// Interface for the update data to fix TypeScript errors
interface ProfileStripeUpdate {
  role: UserRole;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  stripePriceId?: string | null;
  stripeCurrentPeriodEnd?: Date | null;
}

// Helper function to safely convert Stripe timestamp to Date
function safelyConvertTimestampToDate(
  timestamp: number | undefined
): Date | null {
  try {
    if (!timestamp) return null;

    // Stripe returns timestamps in seconds, convert to milliseconds
    const timestampMs = timestamp * 1000;
    const date = new Date(timestampMs);

    // Validate the date is valid
    if (isNaN(date.getTime())) {
      console.error(`❌ Invalid date created from timestamp: ${timestamp}`);
      return null;
    }

    return date;
  } catch (error) {
    console.error(`❌ Error converting timestamp to Date:`, error);
    return null;
  }
}

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

        console.log(
          `🕒 Subscription retrieved with current_period_end:`,
          subscription.current_period_end
        );

        // Validate and safely convert the period end timestamp
        const periodEnd = safelyConvertTimestampToDate(
          subscription.current_period_end
        );

        // Create a fallback date 1 month from now
        const oneMonthFromNow = new Date();
        oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

        if (periodEnd) {
          console.log(
            `✅ Valid period end date created: ${periodEnd.toISOString()}`
          );
        } else {
          console.log(
            `⚠️ Could not create a valid period end date from Stripe, using fallback: ${oneMonthFromNow.toISOString()}`
          );
        }

        // Upgrade user to PREMIUM
        console.log(
          `⬆️ Upgrading user ${userId} to PREMIUM role directly via success URL`
        );

        try {
          // Create update data object with the correct camelCase field names
          const updateData: ProfileStripeUpdate = {
            role: UserRole.PREMIUM,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: subscription.items.data[0]?.price.id || null,
            // Use the period end from Stripe or fall back to one month from now
            stripeCurrentPeriodEnd: periodEnd || oneMonthFromNow,
          };

          await db.profile.update({
            where: { userId },
            data: updateData as unknown as Prisma.ProfileUpdateInput,
          });
          console.log(
            `✅ User profile updated to PREMIUM with subscription details`
          );
        } catch (error) {
          console.error(`❌ Error upgrading user:`, error);
          // Try updating just the role if the full update failed
          try {
            await db.profile.update({
              where: { userId },
              data: {
                role: UserRole.PREMIUM,
              },
            });
            console.log(
              `⚠️ Only updated user role, stripe details update failed`
            );
          } catch (secondError) {
            console.error(
              `❌ Error updating role after stripe details failed:`,
              secondError
            );
            return NextResponse.redirect(
              new URL("/dashboard?error=upgrade_failed", req.url)
            );
          }
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
