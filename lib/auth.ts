import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { JWT } from "next-auth/jwt"
import { Session } from "next-auth"
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
// import { compare } from 'bcrypt'
import { prisma as db} from './db'

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.AUTH_SECRET,
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
        async session({ session, token }: { session: Session; token: JWT }) {
          if (session.user) {
            session.user.username = token.username as string;
          }
          return session;
        },
      }
}