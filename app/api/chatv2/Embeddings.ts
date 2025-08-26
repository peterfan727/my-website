import { OpenAIEmbeddings } from "@langchain/openai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";

export const OpenAiEmbedding = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName:"text-embedding-ada-002"
    });

export const GeminiEmbedding = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY,
        taskType: TaskType.RETRIEVAL_QUERY,
        model: "gemini-embedding-001",
    });