import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

// Default subscription price ID from environment variable
const DEFAULT_PRICE_ID = process.env.STRIPE_SUBSCRIPTION_PRICE_ID;

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
    console.log(`Creating checkout session for user: ${userId}`);

    const body = await req.json();
    const { priceId } = body;

    // Use provided priceId or default from environment variable
    const actualPriceId = priceId || DEFAULT_PRICE_ID;
    console.log(`Using price ID: ${actualPriceId}`);

    // Get user profile to have email for Stripe
    const userProfile = await db.profile.findUnique({
      where: { userId },
    });

    if (!userProfile || !userProfile.email) {
      console.error(`User profile or email not found for user: ${userId}`);
      return NextResponse.json(
        { error: "User profile or email not found" },
        { status: 400 }
      );
    }

    console.log(`Creating checkout session with email: ${userProfile.email}`);

    // First check if customer already exists in Stripe
    let customerId;
    const existingCustomers = await stripe.customers.list({
      email: userProfile.email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id;

      // Update customer metadata to ensure userId is set
      await stripe.customers.update(customerId, {
        metadata: {
          userId: userId,
        },
      });
      console.log(`Using existing Stripe customer: ${customerId}`);
    } else {
      // Create a new customer with proper metadata
      const customer = await stripe.customers.create({
        email: userProfile.email,
        name: `${userProfile.firstName || ""} ${userProfile.lastName || ""}`.trim(),
        metadata: {
          userId: userId,
        },
      });
      customerId = customer.id;
      console.log(`Created new Stripe customer: ${customerId}`);
    }

    // Create Stripe checkout session with customer ID (better than just email)
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: actualPriceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/api/stripe/success?session_id={CHECKOUT_SESSION_ID}&customer_id=${customerId}`,
      cancel_url: `${req.headers.get("origin")}/pricing?canceled=true`,
      metadata: {
        userId: userId, // Set metadata on both customer and session for redundancy
      },
    });

    console.log(`Checkout session created: ${session.id}, URL: ${session.url}`);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    );
  }
}
