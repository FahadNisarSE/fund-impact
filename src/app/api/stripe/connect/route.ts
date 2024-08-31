import stripe from "@/lib/stripe";
import { headers } from "next/headers";
import { db } from "@/../../db/db"
import { paymentAccount } from "@/../../db/schema";
import { eq } from "drizzle-orm";

const STRIPE_CONNECT_WEBHOOK_SECRET = process.env
  .STRIPE_CONNECT_WEBHOOK_SECRET as string;

if (!STRIPE_CONNECT_WEBHOOK_SECRET) {
  throw new Error("Stipe webhook secret env variable not provided.");
}

export async function POST(req: Request) {
  const body = await req.text();

  const signature = headers().get("Stripe-Signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_CONNECT_WEBHOOK_SECRET
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        data: null,
        code: 400,
        message: "Webhook Error.",
      })
    );
  }

  switch (event.type) {
    case "account.updated": {
      const payment_Account = event.data.object;
      await db
        .update(paymentAccount)
        .set({
          stripeLinked:
            payment_Account.capabilities?.transfers === "inactive" ||
            payment_Account.capabilities?.transfers === "pending"
              ? false
              : true,
        })
        .where(eq(paymentAccount.stripeAccountId, payment_Account.id));
      break;
    }
    default: {
      console.log("undandled event");
    }
  }

  return new Response(
    JSON.stringify({
      data: null,
      code: 200,
      message: "event handled successfully.",
    })
  );
}
