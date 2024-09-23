import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";
import { prisma } from '../db'
import DiffMatchPatch from 'diff-match-patch'

const config = new Configuration({ 
    apiKey: process.env.OPENAI_API_KEY
}) 

const openai = new OpenAIApi(config)
const dmp = new DiffMatchPatch()

// export const runtime = "edge"

export async function POST(req: Request) {
    try {
        const { messages } = await req.json()
    // message 형태 확인  Validate the message format
    if (!Array.isArray(messages) || messages.length === 0) {
        return new Response(JSON.stringify({ error: 'Invalid message format' }), { status: 400 });
    }

    const response = await openai.createChatCompletion({ 
        model: "gpt-3.5-turbo", 
        stream: true, // stream the response
        messages: messages,
    })
        const stream = OpenAIStream(response, {
            onCompletion: async (completion: string) => {
                const _data = await prisma.message.create({
                    data: {
                        answer: completion,
                        question: messages.slice(-1)[0].content,
                    },
                });
            }
        });
        // Assuming the user input is the last message in the array
        const userInput = messages[messages.length - 1].content;

        // Pass the stream as a response without converting to a string
        return new StreamingTextResponse(stream, {
            async onChunk(chunk: string) {
            // Compare diff on each chunk received (adjust logic as needed)
            const diffs = dmp.diff_main(userInput, chunk);
            dmp.diff_cleanupSemantic(diffs);
            const diffHtml = dmp.diff_prettyHtml(diffs);
    
            // Optionally, log the diff for debugging
            console.log("Diff HTML: ", diffHtml);
            },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
