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
        token.role = (user as any).role;
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
        token.name = user.name;
        token.email = user.email;
      }
      if (trigger === "update" && session) {
        // When session.update is called from the client
        if ((session as any).name !== undefined) token.name = (session as any).name as string;
        if ((session as any).email !== undefined) token.email = (session as any).email as string;
        if ((session as any).firstName !== undefined) token.firstName = (session as any).firstName as string;
        if ((session as any).lastName !== undefined) token.lastName = (session as any).lastName as string;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub!;
      session.user.role = token.role as string;
      // Assign strings only, avoid undefined to satisfy types
      session.user.firstName = (token.firstName as string) || (session.user.firstName as string) || "";
      session.user.lastName = (token.lastName as string) || (session.user.lastName as string) || "";
      // Ensure header and UI get updated name/email
      session.user.name = (token.name as string) || (session.user.name as string) || "";
      session.user.email = (token.email as string) || (session.user.email as string) || "";
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
});
