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
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub!;
      session.user.role = token.role as string;
      session.user.firstName = token.firstName as string;
      session.user.lastName = token.lastName as string;
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
});
