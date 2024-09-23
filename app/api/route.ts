import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";

const config = new Configuration({ 
    apiKey: process.env.OPENAI_API_KEY
}) 

const openai = new OpenAIApi(config)

export const runtime = "edge"

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
        const stream = OpenAIStream(response)
        return new StreamingTextResponse(stream)
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
