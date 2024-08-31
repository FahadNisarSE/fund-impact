import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "@auth/core/jwt";

export type ExtendedUser = DefaultSession["user"] & {
  role: "Creator" | "Supporter" | "Investor";
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role: "Creator" | "Supporter" | "Investor";
  }
}
