import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { ZodError } from "zod";
import { prisma } from "@/prisma";
import { signInSchema } from "@/lib/validations";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          // Verify credentials via API route to avoid Edge Runtime issues
          const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/verify-credentials`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            return null;
          }

          const user = await response.json();
          return user;
        } catch (error) {
          if (error instanceof ZodError) {
            return null;
          }
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        // On sign in, copy fields from user
        const u = user as {
          role?: string;
          firstName?: string;
          lastName?: string;
          name?: string | null;
          email?: string | null;
        };
        const t = token as Record<string, unknown>;
        if (typeof u.role === "string") t.role = u.role;
        if (typeof u.firstName === "string") t.firstName = u.firstName;
        if (typeof u.lastName === "string") t.lastName = u.lastName;
        if (typeof u.name === "string") t.name = u.name;
        if (typeof u.email === "string") t.email = u.email;
      }
      if (trigger === "update" && session && typeof session === "object") {
        // When session.update is called from the client
        const s = session as {
          name?: string;
          email?: string;
          firstName?: string;
          lastName?: string;
        };
        const t = token as Record<string, unknown>;
        if (typeof s.name === "string") t.name = s.name;
        if (typeof s.email === "string") t.email = s.email;
        if (typeof s.firstName === "string") t.firstName = s.firstName;
        if (typeof s.lastName === "string") t.lastName = s.lastName;
      }
      return token;
    },
    session({ session, token }) {
      // id
      if (typeof token.sub === "string") {
        session.user.id = token.sub;
      }
      const t = token as Record<string, unknown>;
      // role
      if (typeof t.role === "string") {
        type MutableUser = typeof session.user & { role?: string };
        (session.user as MutableUser).role = t.role;
      }
      // first/last name
      const firstName = typeof t.firstName === "string" ? t.firstName : undefined;
      const lastName = typeof t.lastName === "string" ? t.lastName : undefined;
      session.user.firstName = firstName || (session.user.firstName as string) || "";
      session.user.lastName = lastName || (session.user.lastName as string) || "";
      // name/email
      const name = typeof t.name === "string" ? t.name : undefined;
      const email = typeof t.email === "string" ? t.email : undefined;
      session.user.name = name || (session.user.name as string) || "";
      session.user.email = email || (session.user.email as string) || "";
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
});
