"use client"
import { useChat } from "ai/react";


export default function Home() {
  const {messages, input, handleInputChange, handleSubmit} = useChat({
    api: '/api',
  })

  return (
   <div className="min-h-screen bg-neutral-300">
    {messages.length !== 0 ? (
      messages.map((message, i) => (
        <div key={i} className="flex justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p>{message}</p>
          </div>
        </div>
      ))
    ) : (
      <div className="w-full flex justify-center pt-32">
        <h1 className="font-bold text-3xl">
          Please use the input filed.
        </h1>
      </div>
    )}
    
   </div>
  );
}
