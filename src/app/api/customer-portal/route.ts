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
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 400 }
      );
    }

    // Check if user has a Stripe customer ID
    if (!userProfile.stripeCustomerId) {
      return NextResponse.json(
        { error: "No Stripe customer ID found for this user" },
        { status: 400 }
      );
    }

    // Create a Stripe customer portal session
    const returnUrl = req.headers.get("Referer") || "/settings";

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: userProfile.stripeCustomerId,
      return_url: returnUrl,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Error creating customer portal session:", error);
    return NextResponse.json(
      { error: "Error creating customer portal session" },
      { status: 500 }
    );
  }
}
