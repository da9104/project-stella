import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import Link from "next/link"
import Image from "next/image"
import { FC } from "react"
import Chat from "@/components/Chat"

 const Admin: FC = async () => {
    const session = await getServerSession(authOptions)
    console.log(session?.user, 'from admin page')

    if (session?.user) {
     return (
        <div>
         <div className="flex flex-col justify-center content-center items-center">
            <Image 
            width={100}
            height={100}
            src={session.user.image || '/default-image.png'}
            alt={session.user.username || session.user.name || 'User'} 
            className="rounded-full"
            />
            <p>Welcome, {session.user.username || session.user.name}</p>
        </div>
        
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