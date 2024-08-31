import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

import { db } from "@/../db/db";
import { passwordResetToken, verificationToken } from "../../db/schema";

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verification_token = await db
      .select()
      .from(verificationToken)
      .where(eq(verificationToken.email, email));
    if (!verification_token.length) return null;
    return verification_token[0];
  } catch (error) {
    return null;
  }
};

export const updateVerificationToken = async (
  id: string,
  email: string,
  token: string,
  expires: Date
) => {
  try {
    return await db
      .update(verificationToken)
      .set({
        token,
        expires,
      })
      .where(eq(verificationToken.email, email))
      .returning();
  } catch (error) {
    return null;
  }
};

export const createVerificationToken = async (
  id: string,
  email: string,
  token: string,
  expires: Date
) => {
  try {
    return await db
      .insert(verificationToken)
      .values({
        userId: id,
        email,
        token,
        expires,
      })
      .returning();
  } catch (error) {
    console.log("Error: ", error);
    return null;
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verification_token = await db
      .select()
      .from(verificationToken)
      .where(eq(verificationToken.token, token));
    if (!verification_token.length) return null;
    return verification_token[0];
  } catch (error) {
    return null;
  }
};

export async function getPasswordResetToken(email: string) {
  try {
    const token = await db
      .select()
      .from(passwordResetToken)
      .where(eq(passwordResetToken.email, email));

    if (token.length !== 0) return token[0];
    return null;
  } catch (error) {
    return null;
  }
}

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

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const password_reset_token = await db
      .select()
      .from(passwordResetToken)
      .where(eq(passwordResetToken.token, token));
    if (!password_reset_token.length) return null;
    return password_reset_token[0];
  } catch (error) {
    return null;
  }
};
