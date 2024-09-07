"use server";

import { eq } from "drizzle-orm";

import { getVerificationTokenByToken } from "@/model/auth";
import { getUserByEmail } from "@/model/user";
import { db } from "@/../../db/db";
import { users, verificationToken } from "@/../../db/schema";

export async function EmailVerification({ token }: { token: string | null }) {
  if (!token) {
    throw new Error("Token is required. Please provide token.");
  }

  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    throw new Error("Token does not exists!");
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    throw new Error("Token has expired.");
  }

  const exisitingUser = await getUserByEmail(existingToken.email);

  if (!exisitingUser) {
    throw new Error("Email does not exits!");
  }

  await db
    .update(users)
    .set({ emailVerified: new Date(), email: existingToken.email })
    .where(eq(users.id, exisitingUser.id));

  await db
    .delete(verificationToken)
    .where(eq(verificationToken.email, existingToken.email));

  return { success: "User verified successsfully." };
}
