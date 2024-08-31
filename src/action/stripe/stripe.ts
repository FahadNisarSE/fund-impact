"use server";

import { auth } from "@/../auth";
import { db } from "@/../db/db";
import { paymentAccount } from "@/../db/schema";
import stripe from "@/lib/stripe";
import { getPaymentAccountById } from "@/model/stripe";
import { redirect } from "next/navigation";

export async function paymentAccountExists(userId: string) {
  return await getPaymentAccountById(userId);
}

export async function getPaymentAccountByIdAction(userId: string) {
  return await getPaymentAccountById(userId);
}

export async function createPaymentAccount(userId: string, email: string) {
  const accountLink = await stripe.accounts.create({
    email: email,
    controller: {
      losses: {
        payments: "application",
      },
      fees: {
        payer: "application",
      },
      stripe_dashboard: {
        type: "express",
      },
    },
  });

  const result = await db
    .insert(paymentAccount)
    .values({
      userId: userId,
      stripeAccountId: accountLink.id,
    })
    .returning();

  return result[0];
}

export async function createStripeAccountLink() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized Access");
  }

  const paymentAccount = await getPaymentAccountById(session?.user.id);

  if (paymentAccount) {
    const accountLink = await stripe.accountLinks.create({
      account: paymentAccount?.stripeAccountId,
      refresh_url: "http://localhost:3000/support/paymentAccount?refresh=true",
      return_url: "http://localhost:3000/support/paymentAccount?linked=true",
      type: "account_onboarding",
    });

    return redirect(accountLink.url);
  }
}
