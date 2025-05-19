import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

// Default subscription price ID from environment variable
const DEFAULT_PRICE_ID =
  process.env.STRIPE_SUBSCRIPTION_PRICE_ID;

/**
 * API route to create a Stripe checkout session
 * POST /api/checkout/session
 */
export async function POST(req: NextRequest) {
  try {
    // Initialize Supabase client - IMPORTANT: We need to pass cookies() as a function
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
    const body = await req.json();
    const { priceId } = body;

    // Use provided priceId or default from environment variable
    const actualPriceId = priceId || DEFAULT_PRICE_ID;

    // Get user profile to have email for Stripe
    const userProfile = await db.profile.findUnique({
      where: { userId },
    });

    if (!userProfile || !userProfile.email) {
      return NextResponse.json(
        { error: "User profile or email not found" },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: userProfile.email,
      line_items: [
        {
          price: actualPriceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/pricing`,
      metadata: {
        userId: userId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    );
  }
}
