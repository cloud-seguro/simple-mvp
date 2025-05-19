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
    // Check for required environment variables
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error(
        "❌ STRIPE_WEBHOOK_SECRET is missing from environment variables"
      );
      return NextResponse.json(
        { error: "Webhook configuration error" },
        { status: 500 }
      );
    }

    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature") || "";

    console.log(
      `🔒 Webhook received with signature: ${signature.substring(0, 10)}...`
    );

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error(
        `❌ Webhook signature verification failed: ${errorMessage}`
      );

      // Detailed error logging
      if (err instanceof Error && err.message.includes("No signatures found")) {
        console.error(
          "💡 Tip: Make sure your webhook secret is correctly configured"
        );
        console.error(`💡 Signature header: ${signature.substring(0, 20)}...`);
        console.error(`💡 Body length: ${body.length} characters`);
      }

      return NextResponse.json(
        { error: `Webhook signature verification failed: ${errorMessage}` },
        { status: 400 }
      );
    }

    console.log(
      `🔔 Webhook received! Event type: ${event.type} | Event ID: ${event.id}`
    );

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`💰 Checkout session completed: ${session.id}`);

        // Log all metadata to debug
        console.log(`📄 Session metadata:`, session.metadata);
        console.log(`📄 Customer ID: ${session.customer}`);
        console.log(`📄 Subscription ID: ${session.subscription}`);

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
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
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

  console.log(`📋 Processing checkout session for user: ${userId}`);

  if (session.mode === "subscription") {
    // Get subscription details
    if (session.subscription) {
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription.id;

      console.log(`📝 Subscription ID from session: ${subscriptionId}`);

      try {
        console.log(`🔍 Retrieving subscription details from Stripe...`);
        const subscription =
          await stripe.subscriptions.retrieve(subscriptionId);

        console.log(
          `✅ Retrieved subscription: ${subscription.id}, status: ${subscription.status}`
        );
        console.log(`👤 Customer ID: ${subscription.customer}`);

        // Update user profile with Stripe info and set to PREMIUM if active
        console.log(
          `⬆️ Upgrading user ${userId} to PREMIUM role via Stripe subscription`
        );

        try {
          // First try to update the role using Prisma
          console.log(`🔄 Updating user role to PREMIUM`);
          await db.profile.update({
            where: { userId },
            data: {
              role: UserRole.PREMIUM,
            },
          });
          console.log(`✅ User role updated successfully`);
        } catch (error) {
          console.error(`❌ Error updating user role:`, error);
        }

        try {
          // Then update stripe fields using raw query
          console.log(`🔄 Updating Stripe fields in profile`);
          const customerId = subscription.customer as string;
          const priceId = subscription.items.data[0]?.price.id || null;
          const periodEnd = new Date(
            (subscription as unknown as StripeSubscriptionWithPeriod)
              .current_period_end * 1000
          );

          console.log(`📊 Stripe data to save:
            - Customer ID: ${customerId}
            - Subscription ID: ${subscriptionId}
            - Price ID: ${priceId}
            - Period End: ${periodEnd}
          `);

          await db.$queryRaw`
            UPDATE profiles 
            SET 
              stripe_customer_id = ${customerId},
              stripe_subscription_id = ${subscriptionId},
              stripe_price_id = ${priceId},
              stripe_current_period_end = ${periodEnd}
            WHERE 
              "userId" = ${userId}
          `;
          console.log(`✅ Stripe fields updated successfully`);
        } catch (error) {
          console.error(`❌ Error updating Stripe fields:`, error);
        }
      } catch (error) {
        console.error("❌ Error retrieving subscription details:", error);
      }
    } else {
      console.error(
        "❌ No subscription found in the completed checkout session"
      );
    }
  } else {
    console.log(`ℹ️ Session mode is not subscription: ${session.mode}`);
  }
}

/**
 * Handle customer.subscription.created event
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    console.log(
      `🆕 New subscription created: ${subscription.id}, status: ${subscription.status}`
    );

    // Extract customer ID and get customer details
    const customerId = subscription.customer as string;
    console.log(`🔍 Retrieving customer details for: ${customerId}`);

    const customer = (await stripe.customers.retrieve(
      customerId
    )) as Stripe.Customer;

    // Find user by customer metadata
    const userId = customer.metadata.userId;
    console.log(`👤 User ID from metadata: ${userId || "not found"}`);

    if (userId) {
      // Update user profile with Stripe info
      console.log(
        `⬆️ Upgrading user ${userId} to PREMIUM role via subscription creation`
      );

      try {
        // First update the role (safe with Prisma schema)
        console.log(`🔄 Updating user role to PREMIUM`);
        await db.profile.update({
          where: { userId },
          data: {
            role: UserRole.PREMIUM,
          },
        });
        console.log(`✅ User role updated successfully`);
      } catch (error) {
        console.error(`❌ Error updating user role:`, error);
      }

      try {
        // Then update stripe fields using raw query to bypass validation
        console.log(`🔄 Updating Stripe fields in profile`);
        const priceId = subscription.items.data[0]?.price.id || null;
        const periodEnd = new Date(
          (subscription as unknown as StripeSubscriptionWithPeriod)
            .current_period_end * 1000
        );

        console.log(`📊 Stripe data to save:
          - Customer ID: ${customerId}
          - Subscription ID: ${subscription.id}
          - Price ID: ${priceId}
          - Period End: ${periodEnd}
        `);

        await db.$queryRaw`
          UPDATE profiles 
          SET 
            stripe_customer_id = ${customerId},
            stripe_subscription_id = ${subscription.id},
            stripe_price_id = ${priceId},
            stripe_current_period_end = ${periodEnd}
          WHERE 
            "userId" = ${userId}
        `;
        console.log(`✅ Stripe fields updated successfully`);
      } catch (error) {
        console.error(`❌ Error updating Stripe fields:`, error);
      }
    } else {
      console.error("❌ No userId found in customer metadata");
    }
  } catch (error) {
    console.error("❌ Error handling subscription created event:", error);
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
