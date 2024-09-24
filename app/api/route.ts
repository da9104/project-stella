import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";
import { prisma } from '../db'
// import { NextRequest } from "next/server";
import DiffMatchPatch from 'diff-match-patch'

const config = new Configuration({ 
    apiKey: process.env.OPENAI_API_KEY
}) 

const openai = new OpenAIApi(config)
const dmp = new DiffMatchPatch()

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

    let fullCompletion = '';

        // chunk & diff 핸들링 
        const transformStream = new TransformStream({
            transform(chunk, controller) {
                const text = new TextDecoder().decode(chunk);
                fullCompletion += text;

                const diffs = dmp.diff_main(userInput, fullCompletion);
                dmp.diff_cleanupSemantic(diffs);
                // const diffHtml = dmp.diff_prettyHtml(diffs);

                //  log the diff for debugging
                //  console.log("Diff HTML: ", diffHtml);

                controller.enqueue(chunk);
            },
            flush() {
                // DB 저장 Save the full completion to the database
                prisma.message.create({
                    data: {
                        answer: fullCompletion,
                        question: userInput,
                    },
                }).catch(error => console.error('Error saving to database:', error));
            }
        });

        // 사용자 인풋 제일 마지막 메세지 Assuming the user input is the last message in the array
        const userInput = messages[messages.length - 1].content;;

        const stream = OpenAIStream(response);

        // Pipe the OpenAI stream 
        // 사용자 인풋과 diff를 핸들링하는 transform stream으로 연결
        const transformedStream = stream.pipeThrough(transformStream);

        return new StreamingTextResponse(transformedStream);

    } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
    }
}
