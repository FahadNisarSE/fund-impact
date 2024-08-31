"use server";

import { getUserByEmail } from "@/model/user";

export default async function getUserByEmailAction(email: string) {
  return getUserByEmail(email);
}
