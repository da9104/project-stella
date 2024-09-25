import { FC, ReactNode } from 'react'
import { signIn } from 'next-auth/react'

interface GoogleSignInButtonProps {
  children: ReactNode
}   

const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({ children }) => {
    const loginWithGoogle = async () => {
        // await signIn('google')
        console.log('sign in with google')
    }

    return (
        <button onClick={loginWithGoogle} className='w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600'>
            {children}
        </button>
    )
}
