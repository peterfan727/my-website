import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";

/**
 * Get a PineconeStore instance.
 * @returns Promise<PineconeStore | null>
 */
export default async function getPineconeStore(): Promise<PineconeStore | null> {
    const INDEX_NAME = process.env.PINECONE_INDEX_NAME!
    const API_KEY = process.env.PINECONE_API_KEY!
    const HOST_URL = process.env.PINECONE_INDEX_HOST!

    const pinecone = new Pinecone({ 
        apiKey: API_KEY,
    })
    // get list of indices, and create one if it doesn't exist
    const indexList = await pinecone.listIndexes()
        .catch((e) => { console.error(e); return null });
    const embedding = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName:"text-embedding-ada-002"
    })
    // If the index doesn't exist because Pinecone deleted it, return null
    if (indexList === null || 
        (indexList != null && !(indexList.indexes?.find((i) => i.name == INDEX_NAME )))) {
        // uh-oh. it got deleted.
        console.error("no index found")
        return Promise.resolve(null);
    } else { 
        const index = pinecone.index(INDEX_NAME, HOST_URL)
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