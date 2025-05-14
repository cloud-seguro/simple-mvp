import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { stripe, formatAmountForStripe } from "@/lib/stripe";
import { db } from "@/lib/db";

/**
 * API route to create a payment intent
 * POST /api/payment/intent
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
    const { amount, currency = "usd", paymentMethodType = "card" } = body;

    if (!amount) {
      return NextResponse.json(
        { error: "Amount is required" },
        { status: 400 }
      );
    }

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

    // Create a PaymentIntent with the order amount and currency
    const params = {
      amount: formatAmountForStripe(amount),
      currency,
      customer: customer.id,
      payment_method_types: [paymentMethodType] as string[],
      metadata: {
        userId: userId,
      },
    };

    const paymentIntent = await stripe.paymentIntents.create(params);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Error creating payment intent" },
      { status: 500 }
    );
  }
}
