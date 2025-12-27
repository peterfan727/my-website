import { NextRequest } from 'next/server';
import { getAgent } from './llmAgent';
import { AIMessage, AIMessageChunk, HumanMessage } from '@langchain/core/messages';

export async function POST(req: NextRequest) {
    // Parse user query from request
    const { messages, llm, threadId, useV1 } = await req.json(); // llm: 'openai' | 'gemini', useV1: boolean
    // console.log("Query:", messages);
    // Convert incoming messages to Langchain message format
    const lcMessages = messages.map((m: any) => {
        if (m.role === 'user') {
            return new HumanMessage(m.content);
        } else if (m.role === 'assistant') {
            return new AIMessage(m.content);
        }
        return null;
    }).filter(Boolean);

    const query: HumanMessage = lcMessages.findLast((msg: HumanMessage | AIMessage) => msg instanceof HumanMessage);
    // Get persistent agent, memory, llm, and retrieverTool
    const { agent } = await getAgent(llm === 'openai' ? 'openai' : 'gemini', !!useV1);

    // Create a ReadableStream from the agent's async iterator
    const threadConfig = {
        configurable: { thread_id: threadId },
        streamMode: ["messages" as const, "values" as const],
    };

    const stream = new ReadableStream({
        async start(controller) {
            for await (const step of await agent.stream({ messages: query }, threadConfig)) {
                if (step[0] === 'messages') {
                    const valuesArr = Array.from(step[1].values());
                    for (const msg of valuesArr) {
                        // console.log("Message:", msg);
                        if (msg instanceof AIMessageChunk && typeof msg.content === 'string' && msg.content.length > 0) {
                            controller.enqueue(msg.content);
                        }
                    }
                }
                if (step[0] === 'values') {
                    // console.log("Values:", step[1]); Disabled for production
                }
            }
            controller.close();
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
        },
    });
}
