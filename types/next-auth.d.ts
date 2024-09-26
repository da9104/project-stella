import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {  
    interface User {
        id: string;
        username: string | null;
    }
    interface Session extends DefaultSession {
        user: {
            id: string;
            username: string;
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        username: string;
    }
}