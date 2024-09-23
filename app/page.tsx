"use client"
import { useChat } from "ai/react";
import Textarea from "react-textarea-autosize";


export default function Home() {
  const {messages, input, handleInputChange, handleSubmit} = useChat({
    api: '/api',
  })

  return (
   <div className="min-h-screen bg-neutral-300 flex justify-center ">
    {messages.length !== 0 ? (
         <div className="pb-32 pt-5 space-y-5 w-[75%] mx-auto relative"> 
            {messages.map((message, index) => (
              <div key={message.id} className="w-full">
               {message.role === "user" ? (
                <div>
                {message.content}
                </div>
               ) : (<div>
                test
                </div>)}
              </div>
            ))}
       </div>
    ) : (
      <div className="w-full flex justify-center pt-32">
        <h1 className="font-bold text-3xl">
          Please use the input filed.
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
        autoFocus
        placeholder="Type your message here..."
        className="w-full focus:outline-none shadow-teal-700 shadow-xl placeholder-gray-400 text-sm pr-16 text-gray-900 p-5 rounded-lg"
        />
                <button type="submit" className="absolute bg-teal-500 p-2 rounded-lg right-0 mr-5">
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
