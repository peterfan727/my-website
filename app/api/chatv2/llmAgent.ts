import getPineconeStore from '../chat/getPineconeStore';
import getPineconeStoreV2 from './getPineconeStoreV2';
import { MemorySaver } from '@langchain/langgraph';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { tool } from '@langchain/core/tools';
import { ChatOpenAI } from '@langchain/openai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { z } from 'zod';
import { OpenAiEmbedding, GeminiEmbedding } from './Embeddings';
import { V1_PC_INDEX_NAME, PC_INDEX_NAME } from '../../projects/chatbot_v2/Constants';

// Singleton objects
let memoryInstance: any = null;
let adderToolInstance: any = null;
let avgToolInstance: any = null;


function getAvgTool() {
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

function getAdderTool() {
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

async function getRetrieverTools(useV1: boolean) {
    /**
     * Performs a vector search using Pinecone to retrieve relevant documents.
     */ 
    const retrieveSchema = z.object({
        query: z.string(),
    })
    let embedding = useV1 ? OpenAiEmbedding : GeminiEmbedding;
    let indexName = useV1 ? V1_PC_INDEX_NAME : PC_INDEX_NAME;
    const descriptionTemplate = (name: string, keyword: string) => {
        return `Searches the ${name} for content related to Peter Fan, who can also be referred to as Chih-Chung Fan,` 
        + ` Chih-Chung, or Peter. Use this tool to find specific information about Peter's ${keyword} in the document.`;
    }
    const rag_tools = [
        { namespace: "resume", name: "search_resume", description: descriptionTemplate("resume", "resume-related information"), },
        { namespace: "projects", name: "search_projects_page", description: descriptionTemplate("projects page", "coding projects"), },
        { namespace: "about", name: "search_about_page", description: descriptionTemplate("about page", "introduction"), },
        { namespace: "transcript", name: "search_transcript", description: descriptionTemplate("transcript", "courses"), }
    ]
    return await Promise.all(rag_tools.map(async (t) => {
        let namespace = useV1 ? null : t.namespace;
        let vectorStore = await getPineconeStoreV2(indexName, embedding, namespace);
        return tool(
            async ({query}: { query: string }) => {
                if (!vectorStore) console.error("Vector store is not initialized.");
                if (!vectorStore) return 'Vector store not available.';
                const retrievedDocs = await vectorStore.similaritySearch(query, 10);
                const serialized = retrievedDocs.map((doc) => {
                    let tags = 'None';
                    if (doc.metadata.tags) {
                        if (Array.isArray(doc.metadata.tags)) {
                            tags = doc.metadata.tags.join(', ');
                        } else {
                            tags = String(doc.metadata.tags);
                        }
                    }
                    return `Source: ${doc.metadata.source} Content: ${doc.pageContent} Tags: ${tags} `;
                }).join("\n");
                return [serialized, retrievedDocs];
            },
            {
                name: t.name,
                description: t.description,
                schema: retrieveSchema,
                responseFormat: "content_and_artifact"
            }
        ) as any;
    }))
       
}

export async function getAgent(llmType: 'gemini' | 'openai' = 'gemini', useV1: boolean = false) {
    if (!memoryInstance) memoryInstance = new MemorySaver();
    let llmInstance: any = null;
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

    const retrievalTools = await getRetrieverTools(useV1);
    const adderTool = getAdderTool();
    const avgTool = getAvgTool();
    
    const agentInstance = createReactAgent({
            llm: llmInstance,
            tools: [...retrievalTools, adderTool, avgTool],
            checkpointer: memoryInstance,
            prompt: CUSTOM_QA_PROMPT_TEMPLATE,
        });
    return { 
        agent: agentInstance, 
        memory: memoryInstance, 
        llm: llmInstance
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

Cleanly Format your response in plaintext. Use new lines to separate different parts of your answer. Use bullet points if necessary and separate them with new lines.

Helpful and polite answer that will help Peter impress the person:
`;
