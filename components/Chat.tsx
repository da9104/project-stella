"use client"
import { useCallback, useEffect, useState, useRef } from "react";
import { useChat } from "ai/react";
import Link from 'next/link'
import Textarea from "react-textarea-autosize";
import DiffMatchPatch from 'diff-match-patch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import GoogleSignInButton from "@/components/ui/GoogleSignInButton";
import { Session } from "next-auth";

interface ChatProps {
  session: Session | null;
}

const Chat: React.FC<ChatProps> = ({ session }) => {
  const {messages, input, handleInputChange, handleSubmit, isLoading} = useChat({
    api: '/api',
  })
    // State to hold the diff HTML
    const [diffHtml, setDiffHtml] = useState("");
    // 자동 스크롤링 auto scrolling
    const messagesEndRef = useRef<HTMLInputElement>(null)

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    };

    useEffect(() => {
      scrollToBottom()
    }, [messages])

   // 엔터키 허용 Enter key press
   const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {  // Ensure Enter is pressed without Shift for a new line
        e.preventDefault(); 
        handleSubmit(e);  
      }
    },
    [handleSubmit]
  );

  // Function to compute and set the diff
  const computeDiff = (userInput: string, generatedText: string) => {
    const dmp = new DiffMatchPatch();
    const diffs = dmp.diff_main(userInput, generatedText);
    dmp.diff_cleanupSemantic(diffs);
    return dmp.diff_prettyHtml(diffs);
  };

 // Effect to compute the diff when the latest message pair (user and bot) changes
 useEffect(() => {
  if (messages.length >= 2) {
    const secondLastMessage = messages[messages.length - 2];
    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage.role === 'assistant' && secondLastMessage.role === 'user') {
      const userInput = secondLastMessage.content;  // User message
      
      console.log(userInput)

      const generatedText = lastMessage.content;    // AI-generated message
      const diff = computeDiff(userInput, generatedText);
     
      console.log("Diff HTML: ", diff)
      setDiffHtml(diff);  
    }
  }
}, [messages]);

  const isKorean = (text: string): boolean => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text);

  return (
   <div className="min-h-screen bg-transparent flex justify-center">
    
    {messages.length !== 0 ? (
         <div className="pb-32 pt-5 space-y-5 w-[75%] mx-auto relative "> 
           <div className="flex flex-row w-full">
             {/* Display the user message */}
            <div className="flex flex-col !w-1/2 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="w-full">
               {message.role === "user" ? (
                <div className={`flex gap-x-2 user-message ${isKorean(message.content) ? 'korean-text' : ''}`}>
                {/* 유저 아이콘 Heroicons user icon */}
                <div className="bg-gray-500 h-12 w-12 rounded-lg">
                  <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className="w-full h-full p-2 self-center text-white">
                    <path fillRule="evenodd" d="M10.497 3.744a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-3.275l-5.357 15.002h2.632a.75.75 0 1 1 0 1.5h-7.5a.75.75 0 1 1 0-1.5h3.275l5.357-15.002h-2.632a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                  </svg>
                </div>
                    <p className="rounded-lg p-3 w-full border-gray-400 border-2 text-sm">
                    {message.content}
                    </p>
                </div>
               ) : ( "" )}
               </div>
            ))}
            </div>
          {/* Display the diff HTML */}
          <div className="ml-5 w-1/2"> 
          {diffHtml && (
            <div className="flex  gap-x-2">
             <div className="bg-orange-500 h-12 w-12 rounded-lg justify-center"> 
             <DropdownMenu>
                <DropdownMenuTrigger>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className="w-full h-full p-2 pt-[10px] self-center content-center text-white ">
                    <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clipRule="evenodd" />
                  </svg>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Save</DropdownMenuItem>
                  <DropdownMenuItem>Copy</DropdownMenuItem>
                  <DropdownMenuItem>Share</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
             </div>
            <div 
            className="diff-output rounded-lg p-3 w-full border-orange-400 border-2 text-sm" 
            dangerouslySetInnerHTML={{ __html: diffHtml }}
            />
            </div>
           )}
          </div>
        </div>

          <div ref={messagesEndRef} />
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
            <Link href={ session ? "/dashboard/admin" : "#" } className="group/item p-5 border rounded border-gray-200 hover:border-purple-400">
             { session? (
                <>
                 <h3 className="pb-3">Dashboard →</h3>
                </>
             ) 
             : ( 
                <>
                    <h3 className="pb-3">Join and Start Today →</h3>
                    <p className="pb-3">Save your writing checker</p>
                </>
             ) }
             { session? ( <p className="leading-10"> Welcome, {session.user.username || session.user.name} </p>) :( <GoogleSignInButton className="group-hover/item:bg-purple-400"> Google Sign In</GoogleSignInButton>) }
            </Link>
            
            <Link href="/dashboard" className="p-5 border rounded border-gray-200 hover:border-purple-400">
              { session? (
                <>
                 <h3 className="pb-3">Check Your Saved Prompt →</h3>
                 <p className="leading-10"> Check your last prompt</p>
                </>

              ) : (
                <>
                <h3 className="pb-3">Your Previous Prompt →</h3>
                <p className="leading-10"> Check your last prompt</p>
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
    <form onSubmit={handleSubmit} className=" bg-transparents p-5 fixed bottom-0 w-[75%]">

    {isLoading && (
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
      )}

      <div className="relative flex items-center">
        <Textarea 
        tabIndex={0}
        required
        rows={1}
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        // autoFocus
        placeholder="Type your message here..."
        className="w-full focus:outline-none shadow-orange-200 shadow-xl placeholder-gray-400 text-sm pr-16 text-gray-900 p-5 rounded-lg"
        />
            <button type="submit" className="absolute bg-orange-400 p-2 px-6 rounded-lg right-0 mr-5 text-white">
              첨삭
            </button>
      </div>
      <p className="z-50 pt-3 text-center text-sm"> Press Shift+Enter for a new line.</p>
    </form>
   </div>
  );
}


export default Chat