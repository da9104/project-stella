import { FC, ReactNode } from 'react'
import { signIn } from 'next-auth/react'

interface GoogleSignInButtonProps {
  children: ReactNode,
  className?: string
}   

const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({ children, className }) => {
    const loginWithGoogle = async () => {
        await signIn('google', { callbackUrl: '/dashboard/admin' })
        // console.log('sign in with google')
    }

    return (
        <button 
        onClick={loginWithGoogle} 
        className={`w-full px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-purple-400 ${className}`}
        >
            {children}
        </button>
    )
}

export default GoogleSignInButton