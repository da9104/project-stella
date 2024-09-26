import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { compare } from 'bcrypt'
import Google from 'next-auth/providers/google'
import { prisma as db} from './db'

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/api/auth',
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

            if(existingUser.password) {
                const passwordMatch = await compare(credentials.password, existingUser.password)
                if(!passwordMatch) {
                    return null
                }
            }

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
                token.username = user.username;
            }
            return token;
        }
  }
}