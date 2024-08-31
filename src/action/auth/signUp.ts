"use server";

import { hash } from "bcryptjs";

import { db } from "@/../db/db";
import { users } from "@/../db/schema";
import { generateVerificationToken } from "@/model/auth";
import { sendVerificationEmail } from "@/model/mail";
import { getUserByEmail } from "@/model/user";
import {
  TUserSignUpSchema,
  userSignUpSchema
} from "@/schema/auth.schema";

export const signUp = async (values: TUserSignUpSchema) => {
  const validatedFeilds = userSignUpSchema.safeParse(values);

  if (!validatedFeilds.success) {
    return { error: "Invalid feilds." };
  }

  const { email, name, password, userRole } = validatedFeilds.data;
  const hashedPassword = await hash(password, 10);

  const exisitingUser = await getUserByEmail(email);

  if (exisitingUser) {
    return { error: "Email already in use." };
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
      verificationToken[0].email,
      verificationToken[0].token
    );

  return { success: "Verification email has been sent to you email." };
};
