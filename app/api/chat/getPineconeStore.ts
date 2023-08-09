import { PineconeClient, CreateRequest } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

const INDEX_NAME = "chatbot-daef9fa"

export default async function getPineconeStore(): Promise<PineconeStore | null > {
    const pinecone = new PineconeClient();
    await pinecone.init({
        apiKey: process.env.PINECONE_API_KEY!,
        environment: process.env.PINECONE_ENV!,
    })
    .catch((e) => { console.error(e); return null });
    // get list of indices, and create one if it doesn't exist
    const indices = await pinecone.listIndexes()
        .catch((e) => { console.error(e); return null });
    const embedding = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName:"text-embedding-ada-002"
    })
    if (indices === null || (indices != null && !(indices.includes(INDEX_NAME)))) {
        // uh-oh. it got deleted.
        console.error("no index found")
        return Promise.resolve(null);
    } else { 
        const index = pinecone.Index(INDEX_NAME)
        return (await PineconeStore.fromExistingIndex(
           embedding, {
                pineconeIndex: index
           }
        ).catch(async (e) => { 
            console.error(e); 
            return null })
        ) as PineconeStore;
    } 
}