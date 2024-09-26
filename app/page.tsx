import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { Session } from "next-auth";
import Chat from "@/components/Chat";
import './page.module.scss'

export default async function Home() {
  const session: Session | null = await getServerSession(authOptions)
 
  // if (!session) {
  //   return (
  //     <div>
  //       <p>You need to be logged in to access this feature.</p>
  //       {/* You can add a sign-in button here */}
  //     </div>
  //   );
  // }

  if (session) {
    console.log(session.user, 'From Home page'); 
  }

  return (
   <div>
    { session && <h1 className="text-center hidden"> Welcome, {session.user.username || session.user.name}</h1>}
     <Chat session={session} />
   </div>
  );
}
