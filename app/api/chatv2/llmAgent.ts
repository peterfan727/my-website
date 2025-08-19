import getPineconeStore from '../chat/getPineconeStore';
import { MemorySaver } from '@langchain/langgraph';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { tool } from '@langchain/core/tools';
import { ChatOpenAI } from '@langchain/openai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { z } from 'zod';


// Singleton objects
let agentInstance: any = null;
let memoryInstance: any = null;
let retrieverToolInstance: any = null;
let adderToolInstance: any = null;
let avgToolInstance: any = null;
let llmInstance: any = null;


async function getAvgTool() {
    const avgSchema = z.object({
        numbers: z.array(z.number()),
    });
    if (!avgToolInstance) {
        avgToolInstance = tool(
            async ({ numbers }: { numbers: number[] }) => {
                if (!Array.isArray(numbers) || numbers.length === 0) {
                    return 'No numbers provided.';
                }
                const sum = numbers.reduce((acc, num) => acc + num, 0);
                const average = sum / numbers.length;
                return [`The average of ${numbers}`, average.toString()];
            },
            {
                name: 'average_calculator',
                description: 'Calculates the average of a list of numbers.',
                schema: avgSchema,
                responseFormat: "content_and_artifact"
            }
        ) as any;
    }
    return avgToolInstance;
}

async function getAdderTool() {
    const adderSchema = z.object({
        numbers: z.array(z.number()),
    })
    if (!adderToolInstance) {
        adderToolInstance = tool(
            async ({ numbers }: { numbers: number[] }) => {
                if (!Array.isArray(numbers) || numbers.length === 0) {
                    return 'No numbers provided.';
                }
                const sum = numbers.reduce((acc, num) => acc + num, 0);
                return [`The sum of ${numbers}`, sum.toString()];
            },
            {
                name: 'adder',
                description: 'Adds multiple numbers together.',
                schema: adderSchema,
                responseFormat: "content_and_artifact"
            }
        ) as any;
    }
    return adderToolInstance;
}

async function getRetrieverTool() {
    /**
     * Performs a vector search using Pinecone to retrieve relevant documents.
     */
    if (!retrieverToolInstance) {
        const retrieveSchema = z.object({
            query: z.string(),
        })
        const vectorStore = await getPineconeStore();
        retrieverToolInstance = tool(
            async ({query}: { query: string }) => {
                if (!vectorStore) return 'Vector store not available.';
                const retrievedDocs = await vectorStore.similaritySearch(query, 4);
                const serialized = retrievedDocs.map((doc) =>
                    `Source: ${doc.metadata.source}\nContent: ${doc.pageContent}`
                ).join("\n");
                return [serialized, retrievedDocs];
            },
            {
                name: 'pinecone_search',
                description: 'Searches documents relevant to information about Peter Fan, '
                + 'who can also be referred to as Chih-Chung Fan, Chih-Chung, or Peter.',
                schema: retrieveSchema,
                responseFormat: "content_and_artifact"
            }
        ) as any;
    }
    return retrieverToolInstance;
}

export async function getAgent(llmType: 'gemini' | 'openai' = 'gemini') {
    if (!memoryInstance) memoryInstance = new MemorySaver();
    if (!llmInstance) {
        if (llmType === 'gemini') {
            llmInstance = new ChatGoogleGenerativeAI({
                apiKey: process.env.GOOGLE_API_KEY,
                streaming: true,
                model: 'gemini-2.5-flash',
            });
        } else {
            llmInstance = new ChatOpenAI({
                openAIApiKey: process.env.OPENAI_API_KEY,
                streaming: true,
                modelName: 'gpt-5-mini',
            });
        }
    }

    const retrieverTool = await getRetrieverTool();
    const adderTool = await getAdderTool();
    const avgTool = await getAvgTool();
    
    if (!agentInstance) {
        agentInstance = createReactAgent({
            llm: llmInstance,
            tools: [retrieverTool, adderTool, avgTool],
            checkpointer: memoryInstance,
            prompt: CUSTOM_QA_PROMPT_TEMPLATE,
        });
    }
    return { 
        agent: agentInstance, 
        memory: memoryInstance, 
        llm: llmInstance, retrieverTool 
    };
}

const CUSTOM_QA_PROMPT_TEMPLATE = `
Your name is pGPT. You are an AI assistant of Peter Fan. Peter is also known as Chih-Chung Fan.

You are talking to a visitor to Peter's website. Your goal is to have a conversation with the visitor, and help the visitor learn more about Peter. The visitor is most likely a tech recruiter looking at Peter's website to evaluate Peter for a job application, so you need to answer the visitor's questions professionally. 

Respectfully decline to answer the following types of questions:
- Questions about Peter's private information such as age, address, phone number, sexual orientation, etc.
- Questions about Peter's personal life such as family, friends, etc.
- Questions that are would not be appropriate to ask in a job interview such as political views, religious views, etc.
- Questions that are rude or offensive.

Use the chat history with the visitor and the context about Peter to answer the question at the end. 
Chat History with the Human Visitor:
"
{chat_history}
"

Context about Peter:
"
{context}
"

For undefined questions, use the chat history and context to generate a question that would be appropriate to ask the visitor.
Question: {question}
Helpful and polite answer that will help Peter impress the person:
`;
