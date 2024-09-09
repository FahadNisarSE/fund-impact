"use server";

import { redirect } from "next/navigation";

import { auth } from "@/../../auth";
import stripe from "@/lib/stripe";
import { addSupport, getProjectById } from "@/model/project";
import { getPaymentAccountById } from "@/model/stripe";

export async function AddSupport({
  projectId,
  supportAmount,
}: {
  projectId: string;
  supportAmount: number;
}) {
  const session = await auth();

  if (!session?.user.id) {
    redirect("/auth/signin");
    return;
  }

  const project = await getProjectById(projectId);
  const paymentAccount = await getPaymentAccountById(session?.user.id);

  if (!project) {
    throw new Error("No project found with the provided ID.");
  }

  if (!paymentAccount) {
    throw new Error("No payment account found for the authenticated user.");
  }

  const Stripe_session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd", // Currency in which the payment will be processed
          unit_amount: Math.round(supportAmount * 100), // Convert amount to cents as Stripe uses the smallest currency unit
          product_data: {
            name: project?.title,
            description: project?.description,
            images: [project.image],
          },
        },
      },
    ],

    payment_intent_data: {
      application_fee_amount: Math.round(supportAmount * 100) * 0.1, // Calculate application fee as 10% of the support amount
      transfer_data: {
        destination: paymentAccount.stripeAccountId, // Destination Stripe account to receive the funds
      },
    },

    success_url: `${process.env.URL}/support/success?projectId=${project.projectId}&amount=${supportAmount}`, // Redirect URL on successful payment
    cancel_url: `${process.env.URL}/support/error`, // Redirect URL on payment cancellation
  });

  await addSupport(
    project.projectId,
    session.user.id,
    String(supportAmount),
    Stripe_session.id
  );

  return redirect(Stripe_session.url as string);
}
