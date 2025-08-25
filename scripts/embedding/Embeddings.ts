import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { GOOGLE_API_KEY } from "./private_docs/ApiKeys";
import { TaskType } from "@google/generative-ai";


export const GeminiEmbedding = new GoogleGenerativeAIEmbeddings({
        apiKey: GOOGLE_API_KEY,
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        model: "gemini-embedding-001",
    });