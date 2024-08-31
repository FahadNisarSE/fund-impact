import { eq } from "drizzle-orm";

import { db } from "../../db/db";
import { paymentAccount } from "../../db/schema";

export const getPaymentAccountByUserId = async (user_id: string) => {
  const paymentAccounts = await db
    .select()
    .from(paymentAccount)
    .where(eq(paymentAccount.userId, user_id));
  if (paymentAccounts.length === 0) return null;
  return paymentAccounts[0];
};
