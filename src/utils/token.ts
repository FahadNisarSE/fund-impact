import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

import { db } from "@/../db/db";
import {
    createVerificationToken,
    getPasswordResetToken,
    getVerificationTokenByEmail,
    updateVerificationToken
} from "@/model/auth";
import { passwordResetToken } from "../../db/schema";

export const generatePasswordResetTokens = async (
  id: string,
  email: string
) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // token expires in 1 hour

  const exisitingToken = await getPasswordResetToken(email);

  if (exisitingToken) {
    return await db
      .update(passwordResetToken)
      .set({ token, expires })
      .where(eq(passwordResetToken.email, email))
      .returning();
  } else {
    return await db
      .insert(passwordResetToken)
      .values({
        email,
        token,
        expires,
        userId: id,
      })
      .returning();
  }
};

export const generateVerificationToken = async (id: string, email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // token expires in 1 hour

  const exisitingToken = await getVerificationTokenByEmail(email);

  if (exisitingToken) {
    return await updateVerificationToken(id, email, token, expires);
  } else {
    return await createVerificationToken(id, email, token, expires);
  }
};
