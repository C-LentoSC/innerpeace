import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";
import { prisma } from "@/prisma";
import { signInSchema } from "@/lib/validations";
import { verifyPassword } from "@/lib/password";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
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

          // Find user in database
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) {
            throw new Error("Invalid credentials.");
          }

          // Verify password
          const isPasswordValid = await verifyPassword(password, user.password);

          if (!isPasswordValid) {
            throw new Error("Invalid credentials.");
          }

          // Return user object
          return {
            id: user.id,
            email: user.email,
            name: user.name || `${user.firstName} ${user.lastName}`,
            firstName: user.firstName || undefined,
            lastName: user.lastName || undefined,
            role: user.role,
            image: user.image,
          };
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
