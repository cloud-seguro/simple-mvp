import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

/**
 * API route to create a Stripe Customer Portal session
 * POST /api/customer-portal
 */
export async function POST(req: NextRequest) {
  try {
    // Initialize Supabase client with cookies() as a function
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Get user session from Supabase
    const {
      data: { session: authSession },
    } = await supabase.auth.getSession();

    if (!authSession) {
      return NextResponse.json(
        { error: "Unauthorized, please sign in" },
        { status: 401 }
      );
    }

    const userId = authSession.user.id;
    console.log(`Accessing customer portal for user: ${userId}`);

    // Get user profile with Stripe customer ID
    const userProfile = await db.profile.findUnique({
      where: { userId },
      select: {
        id: true,
        userId: true,
        role: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        stripePriceId: true,
        stripeCurrentPeriodEnd: true,
      },
    });

    if (!userProfile) {
      console.error(`User profile not found for user: ${userId}`);
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 400 }
      );
    }

    // Check if user has a Stripe customer ID
    if (!userProfile.stripeCustomerId) {
      console.log(
        `No Stripe customer ID found for user: ${userId}, redirecting to upgrade page`
      );
      // Return a redirect URL to the upgrade page instead of an error
      return NextResponse.json({ url: "/upgrade", needsUpgrade: true });
    }

    // Create a Stripe customer portal session
    const returnUrl = req.headers.get("Referer") || "/settings";
    console.log(
      `Creating portal session for customer: ${userProfile.stripeCustomerId}`
    );

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: userProfile.stripeCustomerId,
      return_url: returnUrl,
    });

    console.log(
      `Portal session created: ${portalSession.id}, URL: ${portalSession.url}`
    );
    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Error creating customer portal session:", error);
    return NextResponse.json(
      { error: "Error creating customer portal session" },
      { status: 500 }
    );
  }
}
