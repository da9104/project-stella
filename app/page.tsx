"use client"
import { useCallback } from "react";
import { useChat } from "ai/react";
import Textarea from "react-textarea-autosize";


export default function Home() {
  const {messages, input, handleInputChange, handleSubmit} = useChat({
    api: '/api',
  })

   // 엔터키 허용 Enter key press
   const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {  // Ensure Enter is pressed without Shift for a new line
        e.preventDefault(); 
        handleSubmit(e);  
      }
    },
    [handleSubmit]
  );

  return (
   <div className="min-h-screen bg-neutral-300 flex justify-center ">
    
    {messages.length !== 0 ? (
         <div className="pb-32 pt-5 space-y-5 w-[75%] mx-auto relative"> 
            {messages.map((message, index) => (
              <div key={message.id} className="w-full">
               {message.role === "user" ? (
                <div className="flex gap-x-2">
                {/* 유저 아이콘 Heroicons user icon */}
                <div className="bg-gray-500 h-12 w-12 rounded-lg flex justify-center">
                  <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className="w-[75%] h-full self-center text-white">
                    <path fillRule="evenodd" d="M10.497 3.744a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-3.275l-5.357 15.002h2.632a.75.75 0 1 1 0 1.5h-7.5a.75.75 0 1 1 0-1.5h3.275l5.357-15.002h-2.632a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                  </svg>
                </div>
                    <p className="rounded-lg p-3 w-full border-gray-400 border-2 text-sm">
                    {message.content}
                    </p>
                </div>
               ) : (
                <div className="flex gap-x-2"> 
                   {/* 챗봇 아이콘 Heroicons chatbot icon */}
                   <div className="bg-orange-500 h-12 w-12 rounded-lg relative top-1">
                      <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="currentColor" 
                      className="w-full h-full p-1 text-white">
                        <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clipRule="evenodd" />
                      </svg>
                   </div>
                    <p className="rounded-lg p-3 w-full border-orange-400 border-2 text-sm">
                      {message.content}
                    </p>
                </div>
              )}
              </div>
            ))}
       </div>
    ) : (
      <div className="w-full flex justify-center pt-32">
        <h1 className="font-bold text-3xl">
        ⬇️ Type your essay and get started ⬇️
        </h1>
      </div>
    )}
    <form onSubmit={handleSubmit} className=" bg-transparents p-5 fixed bottom-0 w-[75%]">
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
            <button type="submit" className="absolute bg-orange-400 p-2 rounded-lg right-0 mr-5">
              {/* Heroicons */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-white">
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
      </div>
    </form>
   </div>
  );
}
