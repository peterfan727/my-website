import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

export default async function getPineconeStore(): Promise<PineconeStore | null > {
    const INDEX_NAME = process.env.PINECONE_INDEX_NAME!
    const pinecone = new Pinecone({ 
        apiKey: process.env.PINECONE_API_KEY!,
        environment: process.env.PINECONE_ENVIRONMENT! 
    })
    // get list of indices, and create one if it doesn't exist
    const indexList = await pinecone.listIndexes()
        .catch((e) => { console.error(e); return null });
    const embedding = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName:"text-embedding-ada-002"
    })
    if (indexList === null || 
        (indexList != null && !(indexList.find((i) => i.name == INDEX_NAME )))) {
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