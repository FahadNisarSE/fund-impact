import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import {
  createPaymentAccount,
  paymentAccountExists,
} from "@/action/stripe/stripe";
import {
  getUserByEmail,
  getUserById,
  updateUserEmailStatus,
} from "@/model/user";
import { loginUserSchema } from "@/schema/auth.schema";
import { db } from "./db/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      if (user.id) updateUserEmailStatus(user.id);
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      const exisitingUser = await getUserById(user?.id!);

      // Prevent signin without email verification
      if (account?.provider === "credentials") {
        if (!exisitingUser?.emailVerified) return false;
        else return true;
      }

      // In case of google auth if user with password exists then
      // google oAuth should not work
      if (account?.type === "oauth") {
        if (exisitingUser?.password) return false;
        else return true;
      }

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as "Creator" | "Supporter" | "Investor";
      }
      return session;
    },
    async jwt({ token, trigger }) {
      if (token.sub) {
        const existingUser = await getUserById(token.sub);

        if (!existingUser) return token;

        token.role = existingUser.userRole;
      }
      return token;
    },
  },
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      authorize: async (credentials) => {
        const validatedFeild = loginUserSchema.safeParse(credentials);

        if (validatedFeild.success) {
          const { email, password } = validatedFeild.data;

          const user = await getUserByEmail(email);

          if (!user || !user.password) return null;

          const passwordMatch = await compare(password, user.password);

          if (passwordMatch) return user;
        }

        return null;
      },
    }),
  ],
});
