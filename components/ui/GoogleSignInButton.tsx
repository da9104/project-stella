"use client"
import { FC, ReactNode, useState } from 'react'
import { signIn } from 'next-auth/react'

interface GoogleSignInButtonProps {
  children: ReactNode,
  className?: string
}   

const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({ children, className }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const loginWithGoogle = async () => {
       try {
        setIsLoading(true)
        await signIn('google', { callbackUrl: '/dashboard/admin' })
       } catch(err) {
        setIsLoading(false) 
        console.error(err)
       } finally {
        setIsLoading(false)
       }
    }

    return (
        <button 
        disabled={isLoading}
        onClick={loginWithGoogle} 
        className={`inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-purple-400 ${className}`}
        >
            {isLoading && (
                <svg
                 xmlns='http://www.w3.org/2000/svg'
                 viewBox='0 0 24 24'
                 fill='none'
                 stroke='currentColor'
                 strokeWidth={2}
                 strokeLinecap='round'
                 strokeLinejoin='round'
                 className='h-4 w-4 mr-2 animate-spin'
                 >
                    <path d='M21 12a9 9 0 1 1-6.219-8.56' />
                 </svg>
            )}
            {children}
        </button>
    )
}

export default GoogleSignInButton