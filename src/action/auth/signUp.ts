"use server";

import { hash } from "bcryptjs";

import { db } from "@/../db/db";
import { users } from "@/../db/schema";
import { generateVerificationToken } from "@/model/auth";
import { getUserByEmail } from "@/model/user";
import { TUserSignUpSchema, userSignUpSchema } from "@/schema/auth.schema";
import { sendVerificationEmail } from "@/utils/email/transporter";

export const signUp = async (values: TUserSignUpSchema) => {
  const validatedFeilds = userSignUpSchema.safeParse(values);

  if (!validatedFeilds.success) {
    throw new Error("Invalid data passed. Please provide valid data.");
  }

  const { email, name, password, userRole } = validatedFeilds.data;
  const hashedPassword = await hash(password, 10);

  const exisitingUser = await getUserByEmail(email);

  if (exisitingUser) {
    throw new Error("User already exists. Please try logging in.");
  }

  const user = await db
    .insert(users)
    .values({
      email,
      name,
      password: hashedPassword,
      userRole,
    })
    .returning();

  const verificationToken = await generateVerificationToken(user[0].id, email);
  if (verificationToken)
    await sendVerificationEmail(
      email,
      `${process.env.URL}/auth/newVerification?token=${verificationToken.token}`
    );

  return { success: "Verification email has been sent to you email." };
};
