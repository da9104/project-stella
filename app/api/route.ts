import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { prisma } from '../../lib/db'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const SYSTEM_PROMPT = `
You are a helpful assistant that can help with writing.
`

export async function POST(req: NextRequest) {
    try {
    const { prompt } = await req.json()
  
    if (typeof prompt !== 'string' || prompt.length === 0) {
        return NextResponse.json({ error: 'Invalid prompt format' }, { status: 400 });
    }

     // Get the user's session to retrieve the user ID
     const session = await getServerSession(authOptions);
     const userId = session?.user?.id; // Get the user ID from the session

     if (!userId) {
         return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
     }

    const { text } = await generateText({ 
        model: google('gemini-1.5-flash'), 
        system: SYSTEM_PROMPT,
        prompt: prompt,
        temperature: 0.7,
    })

    await prisma.message.create({
        data: {
            answer: text.trim(),
            question: prompt,
            userId: userId,
        },
    });

    return NextResponse.json({ improvedPrompt: text.trim() });
    
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}