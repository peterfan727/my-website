import { NextRequest } from 'next/server';
import { getAgent } from './llmAgent';
import { AIMessage, AIMessageChunk, HumanMessage } from '@langchain/core/messages';

export async function POST(req: NextRequest) {
    // Parse user query from request
    const { messages, llm, threadId } = await req.json(); // llm: 'openai' | 'gemini'
    console.log("Query:", messages);
    // Convert incoming messages to Langchain message format
    const lcMessages = messages.map((m: any) => {
        if (m.role === 'user') {
            // console.log("User message:", m.content);
            return new HumanMessage(m.content);
        } else if (m.role === 'assistant') {
            // console.log("Assistant message:", m.content);
            return new AIMessage(m.content);
        }
        // Optionally handle system or other roles
        return null;
    }).filter(Boolean);

    const query: HumanMessage = lcMessages.findLast((msg: HumanMessage | AIMessage) => msg instanceof HumanMessage);
    // Get persistent agent, memory, llm, and retrieverTool
    const { agent } = await getAgent(llm === 'openai' ? 'openai' : 'gemini');


    // Create a ReadableStream from the agent's async iterator
    const threadConfig = {
        configurable: { thread_id: threadId },
        streamMode: ["messages" as const, "values" as const],
    };

    const stream = new ReadableStream({
        async start(controller) {
            for await (const step of await agent.stream({messages: query}, threadConfig)) {
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
					console.log("Values:", step[1]);
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