"use server";

import stripe from "@/lib/stripe";
import { redirect } from "next/navigation";

export async function AddSupport(productId: string, supportAmount: number) {
  // fetch prject details first

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.round(supportAmount * 100), // stripe takes cents base unit
          product_data: {
            name: "Fund Impact",
            description: "fund impact project",
            images: ["1", "2"], // project image
          },
        },
      },
    ],
    success_url: "http://localhost:3000/support/success?projectId=1&amount=45",
    cancel_url: "http://localhost:3000/support/error",
  });

  return redirect(session.url as string);
}
