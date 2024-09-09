"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { auth } from "@/../auth";
import { db } from "@/../db/db";
import { paymentAccount } from "@/../db/schema";
import stripe from "@/lib/stripe";
import { getPaymentAccountById } from "@/model/stripe";

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
    redirect("/auth/signin");
  }

  const paymentAccount = await getPaymentAccountById(session?.user.id);

  if (paymentAccount) {
    const accountLink = await stripe.accountLinks.create({
      account: paymentAccount?.stripeAccountId,
      refresh_url: `${process.env.URL}/support/paymentAccount?refresh=true`,
      return_url: `${process.env.URL}/support/paymentAccount?linked=true`,
      type: "account_onboarding",
    });

    return redirect(accountLink.url);
  }
}

export async function getStripeDashboardLink() {
  const session = await auth();

  if (!session?.user.id) {
    redirect("/auth/signin");
  }

  const data = await db
    .select()
    .from(paymentAccount)
    .where(
      and(
        eq(paymentAccount.userId, session.user.id),
        eq(paymentAccount.stripeLinked, true)
      )
    );

  const loginLink = await stripe.accounts.createLoginLink(
    data[0].stripeAccountId as string
  );

  return redirect(loginLink.url);
}
