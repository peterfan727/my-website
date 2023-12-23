import { StreamingTextResponse, LangChainStream, Message } from 'ai'
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Chroma } from "langchain/vectorstores/chroma";
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { RetrievalQAChain, loadQAStuffChain } from "langchain/chains";
import { AIMessage, ChainValues, HumanMessage, SystemMessage } from 'langchain/schema'
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChainTool } from "langchain/tools";
import { PromptTemplate } from "langchain/prompts";
import { OpenAI } from 'langchain/llms/openai';

// export const runtime = 'edge'

export async function POST(req: Request) {
    const { messages } = await req.json()
    const history : ChainValues = (messages as Message[]).map(m => {
        m.role == 'user'
        ? new HumanMessage(m.content)
        : new AIMessage(m.content)}
    )
    
    const { stream, handlers } = LangChainStream()
    
    const llm = new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        streaming: true,
        temperature: 1.0,
        // callbacks: [handlers]
    })

    const boring_llm = new OpenAI({
        modelName: "gpt-3.5-turbo",
        streaming: true,
        temperature: 1.0,
        // callbacks: [handlers]
    })

    // get vectorstore from ChromaDB
    const vectorStore = await Chroma.fromExistingCollection(
        new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY,
            modelName:"text-embedding-ada-002"
            },
        ), {collectionName: "my_collection", url:"http://localhost:8000", }
    )
    
    const chain = RetrievalQAChain.fromLLM(
        boring_llm,
        vectorStore.asRetriever(),
        { verbose: false}
    );
    const tools = [new ChainTool({
        name: "peter-fan-qa",
        description:
          "Useful for when you are need information about Peter Fan.",
        chain: chain,
        returnDirect: false
    })]
    const executor = await initializeAgentExecutorWithOptions(tools, llm, {
        agentType: "chat-conversational-react-description",
        verbose: false,
        
        // agentArgs: {
        //     humanMessage: prefix
        // }
    });
    const msg = (messages as Message[]).findLast(m => m.role == 'user')
    // console.log(msg?.content)
    executor
        .run({
            input: msg?.content
            // chat_history: chat_history,
        }, {callbacks: [handlers]})
        .catch(console.error)

    // llm
    // .call(
    //   (messages as Message[]).map(m =>
    //     m.role == 'user'
    //       ? new HumanMessage(m.content)
    //       : new AIMessage(m.content)
    //   ),
    //   {},
    //   [handlers]
    // )
    // .catch(console.error)
    
    return new StreamingTextResponse(stream)
}

const prefix = `
You are an AI assistant for a human male called Chih-Chung Fan, who is also know as Peter Fan. Your goal is to greet and answer questions for visitors to Peter's website.

The visitor is most likely a tech recruiter evaluating Peter for a job application, so you must answer the questions professionally. For questions that are related to private life, unprofessional, or offensive, decline to answer respectfully. For questions that you cannot answer because you do not know about that information, first try the tools provided, and if you still cannot find the answer with the tools, then say "Sorry I cannot answer that question."

Here are the courses Peter has completed or will be completing soon at SFU (Simon Fraser University). Use these course information to calculate the most up-to-date cumulative GPA and answer questions regarding your schooling experience. It is in the format of "Course Code", "Course Description", "Term", "Letter Grade", "Credit Units", "Status":
	
CMPT 225
Data Structures/Programming	
2022 Spring
B+
3.00
 Course taken and graded
CMPT 276
Intro Software Engineering	
2022 Summer
A-
3.00
 Course taken and graded
CMPT 295
Intro. to Computer Systems	
2022 Spring
A-
3.00
 Course taken and graded
CMPT 300
Operating Systems I	
2022 Fall
A
3.00
 Course taken and graded
CMPT 307
Data Structures	
2022 Fall
B+
3.00
 Course taken and graded
CMPT 310
Intro Artificial Intelligence	
2022 Fall
A-
3.00
 Course taken and graded
CMPT 340
Biomedical Computing	
2023 Fall
 
3.00
 Registered in course
CMPT 353
Computational Data Science	
2022 Fall
A
3.00
 Course taken and graded
CMPT 354
Database Systems I	
2023 Spring
A
3.00
 Course taken and graded
CMPT 362
Mobile App Programming	
2022 Fall
A-
3.00
 Course taken and graded
CMPT 371
Data Communications/Networking	
2022 Spring
A
3.00
 Transferred
CMPT 376W
Tech.Writing and Group Dynamic	
2023 Spring
A
3.00
 Course taken and graded
CMPT 404
Cryptography and Protocols	
2023 Spring
A
3.00
 Course taken and graded
CMPT 410
Machine Learning	
2023 Spring
A
3.00
 Course taken and graded
CMPT 431
Distributed Systems	
2023 Fall
 
3.00
 Registered in course
CMPT 441
Computational Biology	
2023 Fall
 
3.00
 Registered in course
CMPT 473
Software Testing, Reliab & Sec	
2023 Fall
 
3.00
 Registered in course
FAL X99
Foundations Acad. Literacy	
2022 Spring
TR
0.00
 Transferred
FAN X99
Analytical/Quant Reasoning	
2022 Spring
TR
0.00
 Transferred
MACM 201
Discrete Math II	
2022 Spring
A+
3.00
 Course taken and graded
MACM 316
Numerical Analysis I	
2022 Summer
B+
3.00
 Course taken and graded
MATH 232
Applied Linear Algebra	
2022 Spring
A+
3.00
 Course taken and graded

`;

const CUSTOM_QUESTION_GENERATOR_CHAIN_PROMPT = `Given the following conversation and a follow up question, return the conversation history excerpt that includes any relevant context to the question if it exists and rephrase the follow up question to be a standalone question.
Chat History:
{chat_history}
Follow Up Input: {question}
Your answer should follow the following format:
\`\`\`
Use the following pieces of context to answer the users question.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
----------------
<Relevant chat history excerpt as context here>
Standalone question: <Rephrased question here>
\`\`\`
Your answer:`;