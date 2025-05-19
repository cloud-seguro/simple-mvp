import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import Stripe from "stripe";
import { UserRole, Prisma } from "@prisma/client";

// Define a proper interface that extends Stripe.Subscription
interface StripeSubscriptionWithPeriod extends Stripe.Subscription {
  current_period_end: number;
}

// Define an interface for the update data to fix TypeScript errors
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

// Helper function to get a date 1 month from now
function getOneMonthFromNow(): Date {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date;
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
          // Update both role and Stripe fields in a single operation
          const customerId = subscription.customer as string;
          const priceId = subscription.items.data[0]?.price.id || null;

          // Safely convert the period_end to Date
          const periodEndTimestamp = (
            subscription as unknown as StripeSubscriptionWithPeriod
          ).current_period_end;
          console.log(
            `🕒 Subscription period_end timestamp: ${periodEndTimestamp}`
          );
          const periodEnd = safelyConvertTimestampToDate(periodEndTimestamp);

          // Create a fallback date 1 month from now
          const oneMonthFromNow = getOneMonthFromNow();

          console.log(`📊 Stripe data to save:
            - Customer ID: ${customerId}
            - Subscription ID: ${subscriptionId}
            - Price ID: ${priceId}
            - Period End: ${periodEnd ? periodEnd.toISOString() : "using fallback: " + oneMonthFromNow.toISOString()}
          `);

          // Create update data object with correct camelCase field names
          const updateData: ProfileStripeUpdate = {
            role: UserRole.PREMIUM,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
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
          console.error(`❌ Error updating user profile:`, error);

          // Try updating just the role if the full update failed
          try {
            await db.profile.update({
              where: { userId },
              data: {
                role: UserRole.PREMIUM,
              } as unknown as Prisma.ProfileUpdateInput,
            });
            console.log(
              `⚠️ Only updated user role, stripe details update failed`
            );
          } catch (secondError) {
            console.error(`❌ Error updating role:`, secondError);
          }
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
        // Safely convert the period_end to Date
        const periodEndTimestamp = (
          subscription as unknown as StripeSubscriptionWithPeriod
        ).current_period_end;
        console.log(
          `🕒 Subscription period_end timestamp: ${periodEndTimestamp}`
        );
        const periodEnd = safelyConvertTimestampToDate(periodEndTimestamp);
        const priceId = subscription.items.data[0]?.price.id || null;

        // Create a fallback date 1 month from now
        const oneMonthFromNow = getOneMonthFromNow();

        console.log(`📊 Stripe data to save:
          - Customer ID: ${customerId}
          - Subscription ID: ${subscription.id}
          - Price ID: ${priceId}
          - Period End: ${periodEnd ? periodEnd.toISOString() : "using fallback: " + oneMonthFromNow.toISOString()}
        `);

        // Create update data object with correct camelCase field names
        const updateData: ProfileStripeUpdate = {
          role: UserRole.PREMIUM,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription.id,
          stripePriceId: priceId,
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
        console.error(`❌ Error updating user profile:`, error);

        // Try updating just the role if the full update failed
        try {
          await db.profile.update({
            where: { userId },
            data: {
              role: UserRole.PREMIUM,
            } as unknown as Prisma.ProfileUpdateInput,
          });
          console.log(
            `⚠️ Only updated user role, stripe details update failed`
          );
        } catch (secondError) {
          console.error(`❌ Error updating role:`, secondError);
        }
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
        // Safely convert the period_end to Date
        const periodEndTimestamp = (
          subscription as unknown as StripeSubscriptionWithPeriod
        ).current_period_end;
        const periodEnd = safelyConvertTimestampToDate(periodEndTimestamp);
        const priceId = subscription.items.data[0]?.price.id || null;

        // Create a fallback date 1 month from now
        const oneMonthFromNow = getOneMonthFromNow();

        try {
          // Create update data object with correct camelCase field names
          const updateData: ProfileStripeUpdate = {
            role: UserRole.PREMIUM,
            stripeSubscriptionId: subscription.id,
            stripePriceId: priceId,
            // Use the period end from Stripe or fall back to one month from now
            stripeCurrentPeriodEnd: periodEnd || oneMonthFromNow,
          };

          await db.profile.update({
            where: { userId },
            data: updateData as unknown as Prisma.ProfileUpdateInput,
          });
          console.log(`✅ User profile updated on subscription update`);
        } catch (error) {
          console.error(`❌ Error updating user profile:`, error);
        }
      } else if (
        subscription.status === "past_due" ||
        subscription.status === "canceled" ||
        subscription.status === "unpaid"
      ) {
        // Downgrade user if subscription is no longer active
        try {
          if (subscription.status === "canceled") {
            await db.profile.update({
              where: { userId },
              data: {
                role: UserRole.FREE,
                stripeSubscriptionId: null,
                stripePriceId: null,
                stripeCurrentPeriodEnd: null,
              } as unknown as Prisma.ProfileUpdateInput,
            });
          } else {
            await db.profile.update({
              where: { userId },
              data: {
                role: UserRole.FREE,
                stripeSubscriptionId: subscription.id,
              } as unknown as Prisma.ProfileUpdateInput,
            });
          }
          console.log(
            `✅ User downgraded to FREE due to subscription status: ${subscription.status}`
          );
        } catch (error) {
          console.error(`❌ Error downgrading user:`, error);
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
      // Downgrade user to FREE plan and clear subscription details
      try {
        await db.profile.update({
          where: { userId },
          data: {
            role: UserRole.FREE,
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
          } as unknown as Prisma.ProfileUpdateInput,
        });
        console.log(`✅ User subscription details cleared on deletion`);
      } catch (error) {
        console.error(`❌ Error clearing user subscription details:`, error);
      }
    } else {
      console.error("No userId found in customer metadata");
    }
  } catch (error) {
    console.error("Error handling subscription deleted event:", error);
  }
}
