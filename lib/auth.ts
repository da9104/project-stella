import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma as db } from './db'
// import { AdapterUser } from 'next-auth/adapters'
// import { Account } from '@prisma/client'


export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/auth/signin',
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "" },
                password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
            if(!credentials?.email || !credentials?.password) {
                return null
            }

            const existingUser = await db.user.findUnique({
                where: { email: credentials?.email }
            })
            if (!existingUser) {
                return null
            }

            // if(existingUser.password) {
            //     const passwordMatch = await compare(credentials.password, existingUser.password)
            //     if(!passwordMatch) {
            //         return null
            //     }
            // }

            return {
                id: `${existingUser.id}`,
                username: existingUser.username,
                email: existingUser.email
            }
        }
    })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username as string;
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.username = token.username as string;
            }
            return session;
        },
        async signIn({ user, account }) {
            if (!user.email) {
                console.error('Email is required for sign in');
                return false;
            }
        
            let dbUser = await db.user.findUnique({
                where: { email: user.email },
            });
        
            if (!dbUser) {
                // Create a new user if one doesn't exist
                dbUser = await db.user.create({
                    data: {
                        email: user.email,
                        name: user.name || '',
                        image: user.image || '',
                        // Generate a username based on the email or name
                        username: user.name?.replace(/\s+/g, '').toLowerCase() || user.email.split('@')[0],
                    },
                });
            }
        
            if (account) {
                const existingAccount = await db.account.findFirst({
                    where: { userId: dbUser.id, provider: account.provider },
                });
        
                if (!existingAccount) {
                    await db.account.create({
                        data: {
                            userId: dbUser.id,
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                            access_token: account.access_token || '',
                            refresh_token: account.refresh_token || '',
                            expires_at: account.expires_at,
                            type: account.type || "oauth",
                        },
                    });
                }
            }
            return true; // Allow sign-in
        },
    },
    events: {
        async createUser({ user }) {
            console.log("New user created:", user);
        },
    },
}