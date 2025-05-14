import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

// Default subscription price ID from environment variable
const DEFAULT_PRICE_ID =
  process.env.STRIPE_SUBSCRIPTION_PRICE_ID || "price_1RMxsbF2MXFhAfNVcJUhp2DL";

/**
 * API route to create a subscription
 * POST /api/subscriptions/create
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

    // Get user profile
    const userProfile = await db.profile.findUnique({
      where: { userId },
    });

    if (!userProfile || !userProfile.email) {
      return NextResponse.json(
        { error: "User profile or email not found" },
        { status: 400 }
      );
    }

    // Create a new Stripe customer or get existing one
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: userProfile.email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: userProfile.email,
        name: `${userProfile.firstName} ${userProfile.lastName}`.trim(),
        metadata: {
          userId: userId,
        },
      });
    }

    // Create a subscription checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          price: actualPriceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/dashboard?subscription_success=true`,
      cancel_url: `${req.headers.get("origin")}/pricing`,
      metadata: {
        userId: userId,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Error creating subscription" },
      { status: 500 }
    );
  }
}
