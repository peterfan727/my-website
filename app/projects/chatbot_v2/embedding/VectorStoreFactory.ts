import { loadAllDocsWithNamespaces } from "./DocSplitter";
import { PineconeStore, PineconeStoreParams } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { GeminiEmbedding } from "./Embeddings";
import { PINECONE_API_KEY } from "./private_docs/ApiKeys";
import { PC_INDEX_NAME } from "./Constants";

export let INDEX_HOST_NAME: string | null;

const pc = new PineconeClient({ apiKey: PINECONE_API_KEY });

async function createPineconeIndex() {
    await pc.createIndex({
        name: PC_INDEX_NAME,
        vectorType: 'dense',
        dimension: 3072,
        metric: 'cosine',
        spec: {
            serverless: {
            cloud: 'aws',
            region: 'us-east-1'
            }
        }
    });
}


export async function createVectorStore() {
    let namespace_docs = await loadAllDocsWithNamespaces();

    await createPineconeIndex().catch((e) => { 
        console.error("Error creating Pinecone index (it might already exist):", e); 
    }).then(() => { 
        const index = pc.index(PC_INDEX_NAME); 
        for (const ns_docs of namespace_docs) {
            let docs = ns_docs[1];
            // Add documents to the Pinecone index
            PineconeStore.fromDocuments(docs, GeminiEmbedding, { 
                pineconeIndex: index,
            } as PineconeStoreParams).catch((e) => { 
                console.error("Error creating PineconeStore from documents:", e); 
            }
            ).then(() => {
                console.log(`Successfully added ${docs.length} documents.`);
            });
        }
    })
}


/**
 * put api keys (PINECONE_API_KEY and GOOGLE_API_KEY) in private_docs/ApiKeys.ts
 * run `npx tsc VectorStoreFactory.ts` to compile this file
 * then run `node VectorStoreFactory.js` to execute it and create the Pinecone index
 */

createVectorStore();
