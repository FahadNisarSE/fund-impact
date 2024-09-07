import { compare } from "bcryptjs";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { DrizzleAdapter } from "@auth/drizzle-adapter";

import {
  getUserByEmail,
  getUserById,
  updateUserEmailStatus,
} from "@/model/user";
import { loginUserSchema } from "@/schema/auth.schema";
import { db } from "./db/db";

class InvalidLoginError extends CredentialsSignin {
  code = "InvalidLoginError";
}

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
      const provider = account?.provider as string;
      if (["credentials", "http-email"].includes(provider)) {
        if (!user?.id) return false;

        const existingUser = await getUserById(user.id);

        if (!existingUser) return "/auth/signup";

        if (provider === "credentials" && existingUser.emailVerified) {
          return true;
        }

        return false;
      }

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as "Creator" | "Supporter";
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

          if (!user || !user.password) {
            throw new InvalidLoginError("Invalid email or password");
          }

          const passwordMatch = await compare(password, user.password);

          if (passwordMatch) {
            console.log("Authorization successful for user:", user.id);
            return user;
          }
        }

        throw new InvalidLoginError("Invalid email or password.");
      },
    }),
  ],
});
