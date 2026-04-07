import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { db } from "./db";

export const authOptions: NextAuthOptions = {
  adapter: {
    ...PrismaAdapter(db),
    createUser: ({ image, name, email, emailVerified }: { image?: string | null; name?: string | null; email: string; emailVerified?: Date | null }) =>
      db.user.create({ data: { email, name, emailVerified, avatar: image ?? null } }),
    getUser: async (id: string) => {
      const user = await db.user.findUnique({ where: { id } });
      if (!user) return null;
      return { ...user, image: user.avatar };
    },
    getUserByEmail: async (email: string) => {
      const user = await db.user.findUnique({ where: { email } });
      if (!user) return null;
      return { ...user, image: user.avatar };
    },
    getUserByAccount: async (provider_providerAccountId: { provider: string; providerAccountId: string }) => {
      const account = await db.account.findUnique({
        where: { provider_providerAccountId },
        include: { user: true },
      });
      if (!account) return null;
      return { ...account.user, image: account.user.avatar };
    },
    updateUser: async ({ id, image, ...data }: { id: string; image?: string | null; [key: string]: unknown }) => {
      const user = await db.user.update({ where: { id }, data: { ...data, avatar: image ?? undefined } });
      return { ...user, image: user.avatar };
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    newUser: "/dashboard",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        if (!user.password) {
          throw new Error("This account uses social login. Please sign in with Google or Facebook.");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.avatar,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // For OAuth providers, link account if email already exists
      if (account?.provider !== "credentials" && user.email) {
        const existing = await db.user.findUnique({
          where: { email: user.email },
          include: { accounts: true },
        });

        if (existing) {
          const alreadyLinked = existing.accounts.some(
            (a) => a.provider === account?.provider
          );
          if (!alreadyLinked && account) {
            await db.account.create({
              data: {
                userId: existing.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state as string | undefined,
              },
            });
          }
          // Point NextAuth to the existing user
          user.id = existing.id;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        const role = (user as { role?: Role }).role;
        if (role) token.role = role;
      }
      // For OAuth users, role may not be on the user object — fetch from DB
      if (!token.role && token.sub) {
        const dbUser = await db.user.findUnique({ where: { id: token.sub } });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
