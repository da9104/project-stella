import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import Chat from "@/components/Chat"
import Link from "next/link"
import Image from "next/image"
import { FC } from "react"

 const Admin: FC = async () => {
  let session

  try {
    session = await getServerSession(authOptions)
    console.log("Session from admin page:", session)
  } catch (error) {
    console.error("Error getting server session:", error)
    return <div>Error: Unable to authenticate</div>
  }

  if (!session) {
    console.log("No session found")
    return <div>Access Denied</div>
  }

  if (!session.user) {
    console.log("Session has no user object")
    return <div>Invalid Session</div>
  }


    if (session) {
     return (
        <div>
         {/* <div className="flex flex-row justify-center content-center items-center">
            <Image 
            width={30}
            height={30}
            src={session.user.image || '/default-image.png'}
            alt={session.user.username || session.user.name || 'User'} 
            className="rounded-full mr-3"
            />
            <p>Welcome, {session.user.username || session.user.name}</p>
        </div> */}
        
           <Chat session={session} />
        </div>
     )
    } 
    return (
    <div className="text-center">
        <h2 className="mt-10 mb-5"> Please log in in </h2>
        <Link href='/' className="rounded border-2 px-3 py-3 "> Back to main page </Link> 
    </div>
)
}

export default Admin