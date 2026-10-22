import { OpenAIEmbeddings } from "@langchain/openai";
import { GoogleGenAIEmbeddings } from "../../../lib/GoogleGenAIEmbeddings";

export const OpenAiEmbedding = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName:"text-embedding-ada-002"
    });

export const GeminiEmbedding = new GoogleGenAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY,
        taskType: "RETRIEVAL_QUERY",
        model: "gemini-embedding-001",
    });
