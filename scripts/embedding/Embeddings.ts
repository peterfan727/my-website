import { GoogleGenAIEmbeddings } from "../../lib/GoogleGenAIEmbeddings";
import { GOOGLE_API_KEY } from "./private_docs/ApiKeys";


export const GeminiEmbedding = new GoogleGenAIEmbeddings({
        apiKey: GOOGLE_API_KEY,
        taskType: "RETRIEVAL_DOCUMENT",
        model: "gemini-embedding-001",
    });
