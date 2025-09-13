"use client"
import { useState, useRef } from "react";
import Link from 'next/link'
import Textarea from "react-textarea-autosize";
import { signOut } from "next-auth/react"
import GoogleSignInButton from "@/components/ui/GoogleSignInButton";
import { Session } from "next-auth";
import { toast } from "sonner"
import { RefreshCw } from "lucide-react";
import { DiffViewer } from "./diff-viewer";

interface ChatProps {
  session: Session | null;
}

const Chat: React.FC<ChatProps> = ({ session }) => {
  const messagesEndRef = useRef<HTMLInputElement>(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  };
  const [originalPrompt, setOriginalPrompt] = useState("")
  const [improvedPrompt, setImprovedPrompt] = useState("")
  const [showDiffViewer, setShowDiffViewer] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleImprove = async () => {
    if (!originalPrompt.trim()) {
      toast("Please write a prompt", {
        description: "Enter the prompt you want to improve.",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: originalPrompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to improve prompt")
      }

      const data = await response.json()
      setImprovedPrompt(data.improvedPrompt)
      setShowDiffViewer(true)
    } catch (error) {
      toast("Error", {
        description: "Failed to improve prompt. Please try again.",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 엔터키 허용 Enter key press
  // const handleKeyDown = useCallback(
  //   (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  //     if (e.key === 'Enter' && !e.shiftKey) {  // Ensure Enter is pressed without Shift for a new line
  //       e.preventDefault(); 
  //       handleImprove(e as any);
  //     }
  //   },
  //   [handleImprove]
  // );

  // const isKorean = (text: string): boolean => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text);

  return (
    <div className="min-h-screen bg-transparent flex flex-col justify-center">

      {originalPrompt.length !== 0 ? (
        <div className="pb-32 pt-5 space-y-5 w-[75%] mx-auto relative ">
          <div className="flex flex-row w-full">
            {/* Display the user message */}
            <div className="flex flex-col !w-1/2 space-y-4">
                {originalPrompt}
            </div>
            
            </div>
          
            {/* Diff Viewer */}
            {originalPrompt && improvedPrompt && showDiffViewer && (
              <DiffViewer original={originalPrompt} improved={improvedPrompt} />
            )}

          </div>
          ) : (
          <div className="flex flex-col justify-center">
            <div className="container mx-auto flex flex-col justify-center items-center px-8 sm:px-8 pb-40">
              <h1 className="font-bold text-[3rem] leading-10 mb-4"> Discover your {' '}
                <strong className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                  smart writing checker
                </strong>
              </h1>
              <p>
                Write faster, write better. Our {''}
                <code className="bg-gray-100 text-blue-800 p-1">generative AI</code>
                {''} is your writing efficiency expert.
              </p>
              {/* <button className="bg-gray-100 text-blue-800 p-1">Google Sign In</button> */}
              <div className="w-full max-w-2xl grid grid-cols-1 lg:grid-cols-2 gap-4 my-8 px-4 lg:mx-0">
                <Link href={session ? "/dashboard/admin" : "#"} className="group/item p-5 border rounded border-gray-200 hover:border-purple-400">
                  {session ? (
                    <>
                      <h3 className="pb-3">Welcome, {session.user.username || session.user.name}</h3>
                    </>
                  )
                    : (
                      <>
                        <h3 className="pb-3">Join and Start Today →</h3>
                        <p className="pb-3">Save your writing checker</p>
                      </>
                    )}
                  {session ?
                    (
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md group-hover/item:bg-purple-400"> Logout </button>
                    ) : (
                      <GoogleSignInButton className="group-hover/item:bg-purple-400"> Google Sign In</GoogleSignInButton>
                    )}
                </Link>

                <Link href={session ? "/dashboard" : "#"} className="p-5 border rounded border-gray-200 hover:border-purple-400">
                  {session ? (
                    <>
                      <h3 className="pb-3">Check Your Saved Prompt →</h3>
                      <p className="leading-10"> Check your last prompt</p>
                    </>

                  ) : (
                    <>
                      <h3 className="pb-3">Your Previous Prompt →</h3>
                      <p className="leading-10"> Sign up and start today.</p>
                      <p> Don&apos;t miss out your previous writing.</p>
                    </>
                  )
                  }
                </Link>
              </div>
            </div>
          </div>
      )}

          {/* 메시지 입력창 Message input */}
          {/* {isLoading && (
            <div className="grid mt-4 text-gray-500 justify-center self-center place-items-center place-content-center">
              <div>Loading...</div>
              <button
                type="button"
                className="px-4 py-2 mt-4 text-blue-500 border border-blue-500 rounded-md"
                onClick={stop}
              >
                Stop
              </button>
            </div>
          )} */}

          <div className="relative flex flex-row items-center w-full md:p-10 p-5">
            <Textarea
              tabIndex={0}
              required
              rows={1}
              value={originalPrompt}
              onChange={(e) => setOriginalPrompt(e.target.value)}
              disabled={!session}
              autoFocus
              placeholder={session ? "Type your prompt here..." : "Sign in to start chatting..."}
              className="w-full focus:outline-none shadow-orange-200 shadow-xl placeholder-gray-400 text-sm pr-16 text-gray-900 p-5 rounded-lg"
            />
            <button
              onClick={handleImprove}
              disabled={isLoading || !originalPrompt.trim()}
              className="absolute bg-orange-400 p-2 px-6 rounded-lg right-0 md:mr-14 mr-8 text-white">
              {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : ""}
              {isLoading ? "" : "Send"}
            </button>
          </div>
          <p className="z-50 pt-3 text-center text-sm">
            {session ? 'Press Shift+Enter for a new line.' : '(C) 2024 CheckYourWriting made with love'}
          </p>
        </div>
     );
}


export default Chat