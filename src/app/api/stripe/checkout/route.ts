import stripe from "@/lib/stripe";
import { headers } from "next/headers";
import { db } from "@/../../db/db";
import { paymentAccount } from "@/../../db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";
import { addSupport, updateSupport } from "@/model/project";

const STRIPE_CONNECT_WEBHOOK_SECRET_CHECKOUT = process.env
  .STRIPE_CONNECT_WEBHOOK_SECRET_CHECKOUT as string;

if (!STRIPE_CONNECT_WEBHOOK_SECRET_CHECKOUT) {
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
      STRIPE_CONNECT_WEBHOOK_SECRET_CHECKOUT
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
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("Session: ", session);

      if (session.id) {
        try {
          await updateSupport(session.id);
        } catch (error) {
          console.error("Error updating project support status:", error);
        }
      }
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
