"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/../auth";
import { sendVerificationEmail } from "@/model/mail";
import { generateVerificationToken } from "@/model/auth";
import { getUserByEmail } from "@/model/user";
import { TloginUserSchema, loginUserSchema } from "@/schema/auth.schema";

export const signInAction = async (values: TloginUserSchema) => {
  try {
    const validatedFeilds = loginUserSchema.safeParse(values);

    if (!validatedFeilds.success) {
      return { error: "Invalid feilds." };
    }

    const { email, password } = validatedFeilds.data;

    const exisitingUser = await getUserByEmail(email);

    if (!exisitingUser || !exisitingUser.email || !exisitingUser.password) {
      return { error: "Invalid Email or Password." };
    }

    if (!exisitingUser.emailVerified) {
      const verificationToken = await generateVerificationToken(
        exisitingUser.id,
        exisitingUser.email
      );

      if (verificationToken)
        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );

      return {
        success: "Confirmation email sent.",
      };
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      return {
        login: true,
      };
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "Invalid credentials" };
          default:
            return { error: "Something went wrong" };
        }
      }

      throw error;
    }
  } catch (error) {
    return { error: "Something went wrong" };
  }
};
