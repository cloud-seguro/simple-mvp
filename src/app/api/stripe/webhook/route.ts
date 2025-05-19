import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import Stripe from "stripe";
import { UserRole } from "@prisma/client";

// Define a proper interface that extends Stripe.Subscription
interface StripeSubscriptionWithPeriod extends Stripe.Subscription {
  current_period_end: number;
}

/**
 * API route to handle Stripe webhooks
 * POST /api/webhooks/stripe
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature") || "";

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error(`Webhook signature verification failed: ${errorMessage}`);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${errorMessage}` },
        { status: 400 }
      );
    }

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }
}

/**
 * Handle checkout.session.completed event
 */
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  // Extract the userId from session metadata
  const userId = session.metadata?.userId;

  if (!userId) {
    console.error("No userId found in session metadata");
    return;
  }

  if (session.mode === "subscription") {
    // Get subscription details
    if (session.subscription) {
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription.id;

      try {
        const subscription =
          await stripe.subscriptions.retrieve(subscriptionId);

        // Update user profile with Stripe info and set to PREMIUM if active
        console.log(
          `Upgrading user ${userId} to PREMIUM role via Stripe subscription`
        );

        await db.profile.update({
          where: { userId },
          data: {
            role: UserRole.PREMIUM,
          },
        });

        // Update stripe-specific fields in a separate query to avoid Prisma validation errors
        await db.$queryRaw`
          UPDATE profiles 
          SET 
            stripe_customer_id = ${subscription.customer as string},
            stripe_subscription_id = ${subscriptionId},
            stripe_price_id = ${subscription.items.data[0]?.price.id || null},
            stripe_current_period_end = ${new Date((subscription as unknown as StripeSubscriptionWithPeriod).current_period_end * 1000)}
          WHERE 
            "userId" = ${userId}
        `;
      } catch (error) {
        console.error("Error retrieving subscription details:", error);
      }
    }
  }
}

/**
 * Handle customer.subscription.created event
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    // Extract customer ID and get customer details
    const customerId = subscription.customer as string;
    const customer = (await stripe.customers.retrieve(
      customerId
    )) as Stripe.Customer;

    // Find user by customer metadata
    const userId = customer.metadata.userId;

    if (userId) {
      // Update user profile with Stripe info
      console.log(
        `Upgrading user ${userId} to PREMIUM role via subscription creation`
      );

      // First update the role (safe with Prisma schema)
      await db.profile.update({
        where: { userId },
        data: {
          role: UserRole.PREMIUM,
        },
      });

      // Then update stripe fields using raw query to bypass validation
      await db.$queryRaw`
        UPDATE profiles 
        SET 
          stripe_customer_id = ${customerId},
          stripe_subscription_id = ${subscription.id},
          stripe_price_id = ${subscription.items.data[0]?.price.id || null},
          stripe_current_period_end = ${new Date((subscription as unknown as StripeSubscriptionWithPeriod).current_period_end * 1000)}
        WHERE 
          "userId" = ${userId}
      `;
    } else {
      console.error("No userId found in customer metadata");
    }
  } catch (error) {
    console.error("Error handling subscription created event:", error);
  }
}

/**
 * Handle customer.subscription.updated event
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    // Extract customer ID and get customer details
    const customerId = subscription.customer as string;
    const customer = (await stripe.customers.retrieve(
      customerId
    )) as Stripe.Customer;

    // Find user by customer metadata
    const userId = customer.metadata.userId;

    if (userId) {
      // Check subscription status
      if (subscription.status === "active") {
        // Update user profile role (safe with Prisma schema)
        await db.profile.update({
          where: { userId },
          data: {
            role: UserRole.PREMIUM,
          },
        });

        // Update stripe fields using raw query
        await db.$queryRaw`
          UPDATE profiles 
          SET 
            stripe_subscription_id = ${subscription.id},
            stripe_price_id = ${subscription.items.data[0]?.price.id || null},
            stripe_current_period_end = ${new Date((subscription as unknown as StripeSubscriptionWithPeriod).current_period_end * 1000)}
          WHERE 
            "userId" = ${userId}
        `;
      } else if (
        subscription.status === "past_due" ||
        subscription.status === "canceled" ||
        subscription.status === "unpaid"
      ) {
        // Downgrade user if subscription is no longer active
        await db.profile.update({
          where: { userId },
          data: {
            role: UserRole.FREE,
          },
        });

        // Update stripe fields based on status
        if (subscription.status === "canceled") {
          await db.$queryRaw`
            UPDATE profiles 
            SET 
              stripe_subscription_id = NULL,
              stripe_price_id = NULL,
              stripe_current_period_end = NULL
            WHERE 
              "userId" = ${userId}
          `;
        } else {
          await db.$queryRaw`
            UPDATE profiles 
            SET 
              stripe_subscription_id = ${subscription.id}
            WHERE 
              "userId" = ${userId}
          `;
        }
      }
    } else {
      console.error("No userId found in customer metadata");
    }
  } catch (error) {
    console.error("Error handling subscription updated event:", error);
  }
}

/**
 * Handle customer.subscription.deleted event
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    // Extract customer ID and get customer details
    const customerId = subscription.customer as string;
    const customer = (await stripe.customers.retrieve(
      customerId
    )) as Stripe.Customer;

    // Find user by customer metadata
    const userId = customer.metadata.userId;

    if (userId) {
      // Downgrade user to FREE plan (safe with Prisma schema)
      await db.profile.update({
        where: { userId },
        data: {
          role: UserRole.FREE,
        },
      });

      // Clear subscription details
      await db.$queryRaw`
        UPDATE profiles 
        SET 
          stripe_subscription_id = NULL,
          stripe_price_id = NULL,
          stripe_current_period_end = NULL
        WHERE 
          "userId" = ${userId}
      `;
    } else {
      console.error("No userId found in customer metadata");
    }
  } catch (error) {
    console.error("Error handling subscription deleted event:", error);
  }
}
