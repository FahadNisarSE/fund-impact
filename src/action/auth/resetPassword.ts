"use server";

import { generatePasswordResetTokens } from "@/model/auth";
import { getUserByEmail } from "@/model/user";
import {
    ResetPasswordSchema,
    TresetPasswordSchema
} from "@/schema/auth.schema";
import { sendPasswordResetEmail } from "@/model/mail";

export default async function resetPassword(values: TresetPasswordSchema) {
  try {
    const validatedFeilds = ResetPasswordSchema.safeParse(values);

    if (!validatedFeilds.success) {
      return { error: "Invalid email." };
    }

    const { email } = validatedFeilds.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return { error: "Email does not exists" };
    }

    const resetPasswordToken = await generatePasswordResetTokens(
      existingUser.id,
      email
    );

    if (!resetPasswordToken || resetPasswordToken.length === 0) {
      throw new Error("Someting went wrong.");
    }

    await sendPasswordResetEmail(email, resetPasswordToken[0].token);

    return { success: "Reset Email send..." };
  } catch (error) {
    return { error: "Oops! Someting went wrong." };
  }
}