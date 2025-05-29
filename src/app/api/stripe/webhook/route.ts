import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import Stripe from "stripe";
import { UserRole, Prisma } from "@prisma/client";
import { Resend } from "resend";
import { SubscriptionPaymentSuccessEmail } from "@/components/emails/subscription-payment-success";
import { SubscriptionPaymentFailedEmail } from "@/components/emails/subscription-payment-failed";
import React from "react";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Define a proper interface that extends Stripe.Subscription
interface StripeSubscriptionWithPeriod extends Stripe.Subscription {
  current_period_end: number;
}

// Define interface for invoice with subscription
interface StripeInvoiceWithSubscription extends Stripe.Invoice {
  subscription: string | Stripe.Subscription | null;
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

// Helper function to find user by customer ID
async function findUserByCustomerId(
  customerId: string
): Promise<string | null> {
  try {
    const customer = (await stripe.customers.retrieve(
      customerId
    )) as Stripe.Customer;
    return customer.metadata?.userId || null;
  } catch (error) {
    console.error(`❌ Error retrieving customer ${customerId}:`, error);
    return null;
  }
}

// Helper function to get user profile data
async function getUserProfile(userId: string) {
  try {
    const profile = await db.profile.findUnique({
      where: { userId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        stripeSubscriptionId: true,
        stripePriceId: true,
        stripeCurrentPeriodEnd: true,
      },
    });
    return profile;
  } catch (error) {
    console.error(`❌ Error retrieving user profile ${userId}:`, error);
    return null;
  }
}

// Helper function to format amount from Stripe (cents to currency)
function formatAmountFromStripe(amount: number): string {
  return (amount / 100).toFixed(2);
}

// Helper function to format date to readable string
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

// Helper function to get subscription type from price ID
function getSubscriptionType(priceId: string | null): string {
  // You can customize this based on your actual price IDs
  if (!priceId) return "Premium";

  // Add logic to determine subscription type based on price ID
  // This is a placeholder - adjust based on your actual pricing structure
  if (priceId.includes("monthly")) return "Premium Mensual";
  if (priceId.includes("yearly")) return "Premium Anual";
  return "Premium";
}

// Helper function to send payment success email
async function sendPaymentSuccessEmail(
  userId: string,
  invoice: StripeInvoiceWithSubscription
) {
  try {
    const profile = await getUserProfile(userId);
    if (!profile || !profile.email) {
      console.error(`❌ No profile or email found for user ${userId}`);
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const amount = formatAmountFromStripe(invoice.amount_paid || 0);
    const currency = (invoice.currency || "usd").toLowerCase();

    // Calculate next billing date (current period end + 1 month/year)
    const currentPeriodEnd = profile.stripeCurrentPeriodEnd;
    const nextBillingDate = currentPeriodEnd
      ? formatDate(currentPeriodEnd)
      : "Próximamente";

    const subscriptionType = getSubscriptionType(profile.stripePriceId);

    console.log(`📧 Sending payment success email to ${profile.email}`);

    const { data, error } = await resend.emails.send({
      from: "Facturación SIMPLE <info@ciberseguridadsimple.com>",
      to: [profile.email],
      subject: "✅ Pago procesado exitosamente - SIMPLE",
      react: React.createElement(SubscriptionPaymentSuccessEmail, {
        firstName: profile.firstName || "Usuario",
        baseUrl,
        amount,
        currency,
        nextBillingDate,
        subscriptionType,
      }),
    });

    if (error) {
      console.error("❌ Error sending payment success email:", error);
    } else {
      console.log(`✅ Payment success email sent - ID: ${data?.id}`);
    }
  } catch (error) {
    console.error("❌ Error in sendPaymentSuccessEmail:", error);
  }
}

// Helper function to send payment failed email
async function sendPaymentFailedEmail(
  userId: string,
  invoice: StripeInvoiceWithSubscription,
  subscription: Stripe.Subscription
) {
  try {
    const profile = await getUserProfile(userId);
    if (!profile || !profile.email) {
      console.error(`❌ No profile or email found for user ${userId}`);
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const amount = formatAmountFromStripe(invoice.amount_due || 0);
    const currency = (invoice.currency || "usd").toLowerCase();

    // Calculate retry date (usually next attempt is in a few days)
    const retryDate = new Date();
    retryDate.setDate(retryDate.getDate() + 3); // Stripe typically retries in 3 days
    const formattedRetryDate = formatDate(retryDate);

    const subscriptionType = getSubscriptionType(profile.stripePriceId);

    // Get failure reason if available
    const failureReason = subscription.latest_invoice
      ? "Fondos insuficientes o tarjeta rechazada"
      : "Error en el procesamiento del pago";

    console.log(`📧 Sending payment failed email to ${profile.email}`);

    const { data, error } = await resend.emails.send({
      from: "Facturación SIMPLE <info@ciberseguridadsimple.com>",
      to: [profile.email],
      subject: "⚠️ Problema con tu pago - SIMPLE",
      react: React.createElement(SubscriptionPaymentFailedEmail, {
        firstName: profile.firstName || "Usuario",
        baseUrl,
        amount,
        currency,
        failureReason,
        retryDate: formattedRetryDate,
        subscriptionType,
      }),
    });

    if (error) {
      console.error("❌ Error sending payment failed email:", error);
    } else {
      console.log(`✅ Payment failed email sent - ID: ${data?.id}`);
    }
  } catch (error) {
    console.error("❌ Error in sendPaymentFailedEmail:", error);
  }
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
    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          console.log(`💰 Checkout session completed: ${session.id}`);
          await handleCheckoutSessionCompleted(session);
          break;
        }

        case "checkout.session.expired": {
          const session = event.data.object as Stripe.Checkout.Session;
          console.log(`⏰ Checkout session expired: ${session.id}`);
          await handleCheckoutSessionExpired(session);
          break;
        }

        case "customer.created": {
          const customer = event.data.object as Stripe.Customer;
          console.log(`👤 Customer created: ${customer.id}`);
          await handleCustomerCreated(customer);
          break;
        }

        case "customer.subscription.created": {
          const subscription = event.data.object as Stripe.Subscription;
          console.log(`🆕 Subscription created: ${subscription.id}`);
          await handleSubscriptionCreated(subscription);
          break;
        }

        case "customer.subscription.updated": {
          const subscription = event.data.object as Stripe.Subscription;
          console.log(`🔄 Subscription updated: ${subscription.id}`);
          await handleSubscriptionUpdated(subscription);
          break;
        }

        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription;
          console.log(`🗑️ Subscription deleted: ${subscription.id}`);
          await handleSubscriptionDeleted(subscription);
          break;
        }

        case "invoice.payment_succeeded": {
          const invoice = event.data.object as StripeInvoiceWithSubscription;
          console.log(`💳 Payment succeeded for invoice: ${invoice.id}`);
          await handleInvoicePaymentSucceeded(invoice);
          break;
        }

        case "invoice.payment_failed": {
          const invoice = event.data.object as StripeInvoiceWithSubscription;
          console.log(`💸 Payment failed for invoice: ${invoice.id}`);
          await handleInvoicePaymentFailed(invoice);
          break;
        }

        default:
          console.log(`ℹ️ Unhandled event type: ${event.type}`);
      }

      // Always return 200 to acknowledge successful processing
      return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
      console.error(`❌ Error processing event ${event.type}:`, error);
      // Return 500 for processing errors to trigger Stripe retry
      return NextResponse.json(
        { error: "Error processing webhook event" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ Critical error processing webhook:", error);
    return NextResponse.json(
      { error: "Critical error processing webhook" },
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
  try {
    // Extract the userId from session metadata
    const userId = session.metadata?.userId;

    if (!userId) {
      console.error("❌ No userId found in session metadata");
      return;
    }

    console.log(`📋 Processing checkout session for user: ${userId}`);

    if (session.mode === "subscription" && session.subscription) {
      // Get subscription details
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

        // Update user profile with Stripe info and set to PREMIUM if active
        if (subscription.status === "active") {
          await updateUserSubscription(userId, subscription);
        }
      } catch (error) {
        console.error("❌ Error retrieving subscription details:", error);
        throw error;
      }
    } else {
      console.log(`ℹ️ Session mode is not subscription: ${session.mode}`);
    }
  } catch (error) {
    console.error("❌ Error handling checkout session completed:", error);
    throw error;
  }
}

/**
 * Handle checkout.session.expired event
 */
async function handleCheckoutSessionExpired(session: Stripe.Checkout.Session) {
  try {
    // Extract the userId from session metadata
    const userId = session.metadata?.userId;

    if (!userId) {
      console.error("❌ No userId found in session metadata");
      return;
    }

    console.log(`⏰ Checkout session expired: ${session.id}`);

    // Downgrade user to FREE plan and clear subscription details
    await downgradeUser(userId, true);
  } catch (error) {
    console.error("❌ Error handling checkout session expired:", error);
    throw error;
  }
}

/**
 * Handle customer.created event
 */
async function handleCustomerCreated(customer: Stripe.Customer) {
  try {
    console.log(`👤 Customer created: ${customer.id}`);

    const userId = customer.metadata?.userId;

    if (!userId) {
      console.log(
        "ℹ️ No userId found in customer metadata - likely a direct Stripe customer creation"
      );
      return;
    }

    console.log(`👤 User ID from metadata: ${userId}`);

    // Try to update user profile with customer ID
    try {
      await db.profile.update({
        where: { userId },
        data: {
          stripeCustomerId: customer.id,
        } as unknown as Prisma.ProfileUpdateInput,
      });
      console.log(`✅ User profile updated with Stripe customer ID`);
    } catch (error) {
      console.error(`❌ Error updating user profile with customer ID:`, error);
    }
  } catch (error) {
    console.error("❌ Error handling customer created event:", error);
    throw error;
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

    const customerId = subscription.customer as string;
    const userId = await findUserByCustomerId(customerId);

    if (!userId) {
      console.error("❌ No userId found in customer metadata");
      return;
    }

    console.log(`👤 User ID from metadata: ${userId}`);

    // Update user profile with Stripe info if subscription is active
    if (subscription.status === "active") {
      await updateUserSubscription(userId, subscription);
    }
  } catch (error) {
    console.error("❌ Error handling subscription created event:", error);
    throw error;
  }
}

/**
 * Handle customer.subscription.updated event
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    console.log(
      `🔄 Subscription updated: ${subscription.id}, status: ${subscription.status}`
    );

    const customerId = subscription.customer as string;
    const userId = await findUserByCustomerId(customerId);

    if (!userId) {
      console.error("❌ No userId found in customer metadata");
      return;
    }

    // Handle different subscription statuses
    if (subscription.status === "active") {
      // Subscription is active - update user to premium
      await updateUserSubscription(userId, subscription);
    } else if (
      subscription.status === "past_due" ||
      subscription.status === "canceled" ||
      subscription.status === "unpaid" ||
      subscription.status === "incomplete_expired"
    ) {
      // Subscription is no longer active - downgrade user
      await downgradeUser(userId, subscription.status === "canceled");
    }
  } catch (error) {
    console.error("❌ Error handling subscription updated event:", error);
    throw error;
  }
}

/**
 * Handle customer.subscription.deleted event
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    console.log(`🗑️ Subscription deleted: ${subscription.id}`);

    const customerId = subscription.customer as string;
    const userId = await findUserByCustomerId(customerId);

    if (!userId) {
      console.error("❌ No userId found in customer metadata");
      return;
    }

    // Downgrade user to FREE plan and clear subscription details
    await downgradeUser(userId, true);
  } catch (error) {
    console.error("❌ Error handling subscription deleted event:", error);
    throw error;
  }
}

/**
 * Handle invoice.payment_succeeded event (for subscription renewals)
 */
async function handleInvoicePaymentSucceeded(
  invoice: StripeInvoiceWithSubscription
) {
  try {
    console.log(`💳 Payment succeeded for invoice: ${invoice.id}`);

    // Check if this is for a subscription
    if (!invoice.subscription) {
      console.log("ℹ️ Invoice is not for a subscription, skipping");
      return;
    }

    const subscriptionId =
      typeof invoice.subscription === "string"
        ? invoice.subscription
        : invoice.subscription.id;

    // Get the subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const customerId = subscription.customer as string;
    const userId = await findUserByCustomerId(customerId);

    if (!userId) {
      console.error("❌ No userId found in customer metadata");
      return;
    }

    console.log(`💰 Subscription payment succeeded for user: ${userId}`);

    // Update the subscription details (this extends the period)
    if (subscription.status === "active") {
      await updateUserSubscription(userId, subscription);
      console.log(`✅ Subscription renewed for user: ${userId}`);
    }

    await sendPaymentSuccessEmail(userId, invoice);
  } catch (error) {
    console.error("❌ Error handling invoice payment succeeded:", error);
    throw error;
  }
}

/**
 * Handle invoice.payment_failed event
 */
async function handleInvoicePaymentFailed(
  invoice: StripeInvoiceWithSubscription
) {
  try {
    console.log(`💸 Payment failed for invoice: ${invoice.id}`);

    // Check if this is for a subscription
    if (!invoice.subscription) {
      console.log("ℹ️ Invoice is not for a subscription, skipping");
      return;
    }

    const subscriptionId =
      typeof invoice.subscription === "string"
        ? invoice.subscription
        : invoice.subscription.id;

    // Get the subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const customerId = subscription.customer as string;
    const userId = await findUserByCustomerId(customerId);

    if (!userId) {
      console.error("❌ No userId found in customer metadata");
      return;
    }

    console.log(`💸 Subscription payment failed for user: ${userId}`);

    // If subscription is past due or unpaid, downgrade user
    if (
      subscription.status === "past_due" ||
      subscription.status === "unpaid"
    ) {
      await downgradeUser(userId, false);
      console.log(`⬇️ User downgraded due to payment failure: ${userId}`);
    }

    await sendPaymentFailedEmail(userId, invoice, subscription);
  } catch (error) {
    console.error("❌ Error handling invoice payment failed:", error);
    throw error;
  }
}

/**
 * Helper function to update user subscription to premium
 */
async function updateUserSubscription(
  userId: string,
  subscription: Stripe.Subscription
) {
  try {
    console.log(`⬆️ Upgrading user ${userId} to PREMIUM role`);

    const customerId = subscription.customer as string;
    const priceId = subscription.items.data[0]?.price.id || null;

    // Safely convert the period_end to Date
    const periodEndTimestamp = (
      subscription as unknown as StripeSubscriptionWithPeriod
    ).current_period_end;
    console.log(`🕒 Subscription period_end timestamp: ${periodEndTimestamp}`);
    const periodEnd = safelyConvertTimestampToDate(periodEndTimestamp);

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

    console.log(`✅ User profile updated to PREMIUM with subscription details`);
  } catch (error) {
    console.error(`❌ Error updating user subscription:`, error);

    // Try updating just the role if the full update failed
    try {
      await db.profile.update({
        where: { userId },
        data: {
          role: UserRole.PREMIUM,
        } as unknown as Prisma.ProfileUpdateInput,
      });
      console.log(`⚠️ Only updated user role, stripe details update failed`);
    } catch (secondError) {
      console.error(`❌ Error updating role:`, secondError);
      throw secondError;
    }
  }
}

/**
 * Helper function to downgrade user from premium
 */
async function downgradeUser(userId: string, clearSubscriptionData: boolean) {
  try {
    console.log(`⬇️ Downgrading user ${userId} to FREE role`);

    const updateData: Partial<ProfileStripeUpdate> = {
      role: UserRole.FREE,
    };

    if (clearSubscriptionData) {
      updateData.stripeSubscriptionId = null;
      updateData.stripePriceId = null;
      updateData.stripeCurrentPeriodEnd = null;
    }

    await db.profile.update({
      where: { userId },
      data: updateData as unknown as Prisma.ProfileUpdateInput,
    });

    console.log(
      `✅ User downgraded to FREE${clearSubscriptionData ? " and subscription data cleared" : ""}`
    );
  } catch (error) {
    console.error(`❌ Error downgrading user:`, error);
    throw error;
  }
}
