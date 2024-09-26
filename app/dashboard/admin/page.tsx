import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import Link from "next/link"

 const Admin = async () => {
    const session = await getServerSession(authOptions)
    console.log(session?.user)

    if (session?.user) {
     return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome, {session.user.username}</p>
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