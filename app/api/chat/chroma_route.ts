import { StreamingTextResponse, LangChainStream, Message } from 'ai'
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Chroma } from "langchain/vectorstores/chroma";
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { AIMessage, HumanMessage } from 'langchain/schema'
import { PromptTemplate } from "langchain/prompts";

// export const runtime = 'edge'

export async function POST(req: Request) {
    const { messages } = await req.json()
    const chat_history = (messages as Message[]).map(m =>
        m.role == 'user'
        ? new HumanMessage(m.content)
        : new AIMessage(m.content)
    )
    
    const { stream, handlers } = LangChainStream()
    
    // LLM model for generating response
    const llm = new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        streaming: true,
        temperature: 1.2,
        maxConcurrency: 1,
        maxTokens: 1000,
        callbacks: [handlers]
    })

    // LLM model for questions
    const nonStreamingModel = new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        streaming: false,
        temperature: 1.0,
        maxConcurrency: 1,
        maxTokens: 1000
        // callbacks: [{ StoreChatHistory()}]
    })

    // get vectorstore from ChromaDB
    const vectorStore = await Chroma.fromExistingCollection(
        new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY,
            modelName:"text-embedding-ada-002"
            },
        ), {collectionName: "my_collection", url:"http://localhost:8000", }
    )
    
    const qa_prompt = PromptTemplate.fromTemplate(CUSTOM_QA_PROMPT_TEMPLATE)
    const chain = ConversationalRetrievalQAChain.fromLLM(
        llm,
        vectorStore.asRetriever(),
        {  
            verbose: true,
            returnSourceDocuments: false,
            questionGeneratorChainOptions: {
                llm: nonStreamingModel,
                template: CUSTOM_QUESTION_GENERATOR_CHAIN_PROMPT
            },
            qaChainOptions: {
                type:'stuff',
                prompt:qa_prompt
            }
        }
    );

    chain
        .call({
            question: chat_history.findLast(m => typeof m == typeof HumanMessage ),
            chat_history: chat_history,
        })
        .catch(console.error)
    
    return new StreamingTextResponse(stream)
}

const CUSTOM_QA_PROMPT_TEMPLATE = `
Your name is pGPT. You are an AI assistant of Peter Fan. Peter is also known as Chih-Chung Fan.

You are talking to a visitor to Peter's website. Your goal is to have a talk to the person you are talking to learn more about Peter. The visitor is most likely a tech recruiter looking at Peter's website to evaluate Peter for a job application, so you need to answer the visitor's questions professionally. 

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

For questions that you cannot answer because the answer is not in the context nor the chat history, simply say "Sorry I am unable to answer that question."

Question: {question}
Helpful and polite answer that will help Peter impress the person:
`;

const CUSTOM_QUESTION_GENERATOR_CHAIN_PROMPT = `
Given the following chat history with the visitor and a follow up input from the visitor, rephrase the follow up input to be a standalone question while considering the context from the chat history.

Exceptions:
- If the follow up input from the visitor is not a question, simply repeat the follow up input.

Chat History:
{chat_history}
Follow Up Input: {question}
Rephrased question given the chat history:`;