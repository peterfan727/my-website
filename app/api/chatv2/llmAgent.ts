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
            async ({ numbers }) => {
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
        );
    }
    return avgToolInstance;
}

async function getAdderTool() {
    const adderSchema = z.object({
        a: z.number(),
        b: z.number(),
    })
    if (!adderToolInstance) {
        adderToolInstance = tool(
            async ({ a, b }) => {
                return [`The sum of ${a} and ${b}`, (a + b).toString()];
            },
            {
                name: 'adder',
                description: 'Adds two numbers together.',
                schema: adderSchema,
                responseFormat: "content_and_artifact"
            }
        );
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
            async ({query}) => {
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
        );
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
            // prompt: "You are a helpful assistant. \
            // Use the provided tools to answer user queries as accurately as possible.\
            // If you don't know the answer, say 'I don't know'.",
        });
    }
    return { 
        agent: agentInstance, 
        memory: memoryInstance, 
        llm: llmInstance, retrieverTool 
    };
}
