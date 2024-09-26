import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
declare module "next-auth" {  
    interface User {
        username: string | null
    }
    interface Session extends DefaultSession {
        user: {
          username: string
        } & DefaultSession["user"];
      }
    // interface Session { 
    //     user: User & {
    //         username: string
    //     }
    // }
    interface JWT {
        username: string;
    }
}