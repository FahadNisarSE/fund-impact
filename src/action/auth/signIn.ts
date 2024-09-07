"use server";

import { signIn } from "@/../auth";
import { generateVerificationToken } from "@/model/auth";
import { sendVerificationEmail } from "@/utils/email/transporter";
import { getUserByEmail } from "@/model/user";
import { TloginUserSchema, loginUserSchema } from "@/schema/auth.schema";
import { redirect } from "next/navigation";

export const signInAction = async (values: TloginUserSchema) => {
  const validatedFeilds = loginUserSchema.safeParse(values);

  if (!validatedFeilds.success) {
    throw new Error("Invalid email or Password.");
  }

  const { email, password } = validatedFeilds.data;

  const exisitingUser = await getUserByEmail(email);

  if (!exisitingUser || !exisitingUser.email || !exisitingUser.password) {
    throw new Error("Invalid email or Password.");
  }

  if (!exisitingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      exisitingUser.id,
      exisitingUser.email
    );

    if (verificationToken)
      await sendVerificationEmail(
        verificationToken.email,
        `${process.env.URL}/auth/newVerification?token=${verificationToken.token}`
      );

    return {
      type: "UNVERIFIED",
      success: "Confirmation email sent.",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { type: "Logged in!", success: "Logged in successfully." };
  } catch (error: any) {
    if (error?.type) {
      switch (error.type) {
        case "CallbackRouteError":
          throw new Error("Invalid email or password");
        default:
          throw new Error("Something went wrong. please");
      }
    }

    throw error;
  }
};
