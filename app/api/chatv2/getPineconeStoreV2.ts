import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore, PineconeStoreParams } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

/**
 * Get a PineconeStore instance.
 * @returns Promise<PineconeStore | null>
 */
export default async function getPineconeStoreV2(
    indexName: string, 
    embedding: GoogleGenerativeAIEmbeddings | OpenAIEmbeddings,
    namespace: string | null
): Promise<PineconeStore | null> {
    const API_KEY = process.env.PINECONE_API_KEY!

    const pinecone = new Pinecone({ 
        apiKey: API_KEY,
    })
    // get list of indices, and create one if it doesn't exist
    const indexList = await pinecone.listIndexes()
        .catch((e) => { console.error(e); return null });
    // If the index doesn't exist because Pinecone deleted it, return null
    if (indexList === null || 
        (indexList != null && !(indexList.indexes?.find((i) => i.name == indexName )))) {
        // uh-oh. it got deleted.
        console.error("no index found")
        return Promise.resolve(null);
    } else { 
        const index = pinecone.index(indexName)
        const param = namespace ? {
            pineconeIndex: index,
            namespace: namespace
        } : {
            pineconeIndex: index
        };
        return (await PineconeStore.fromExistingIndex(
           embedding, param as PineconeStoreParams
        ).catch(async (e) => { 
            console.error(e); 
            return null })
        ) as PineconeStore;
    } 
}