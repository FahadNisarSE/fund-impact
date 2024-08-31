import { eq } from "drizzle-orm";
import { db } from "@/../db/db";
import { paymentAccount } from "@/../db/schema";

export async function getPaymentAccountById(userId: string) {
  try {
    const payment_account = await db
      .select()
      .from(paymentAccount)
      .where(eq(paymentAccount.userId, userId));

    if (payment_account.length !== 0) return payment_account[0];
    else return null;
  } catch (error) {
    return null;
  }
}
