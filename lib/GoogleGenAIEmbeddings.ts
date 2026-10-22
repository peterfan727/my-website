import { GoogleGenAI } from "@google/genai";
import { Embeddings, type EmbeddingsParams } from "@langchain/core/embeddings";
import { chunkArray } from "@langchain/core/utils/chunk_array";

type GoogleEmbeddingTask = "RETRIEVAL_QUERY" | "RETRIEVAL_DOCUMENT";

interface GoogleGenAIEmbeddingsParams extends EmbeddingsParams {
    apiKey?: string;
    model: string;
    taskType: GoogleEmbeddingTask;
}

export class GoogleGenAIEmbeddings extends Embeddings {
    private readonly client: GoogleGenAI;
    private readonly model: string;
    private readonly taskType: GoogleEmbeddingTask;

    constructor(fields: GoogleGenAIEmbeddingsParams) {
        super(fields);
        const apiKey = fields.apiKey ?? process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            throw new Error("Please set GOOGLE_API_KEY or pass apiKey to GoogleGenAIEmbeddings.");
        }
        this.client = new GoogleGenAI({ apiKey });
        this.model = fields.model;
        this.taskType = fields.taskType;
    }

    private cleanText(text: string): string {
        return text.replace(/\n/g, " ");
    }

    private async embedContents(contents: string[]): Promise<number[][]> {
        const response = await this.client.models.embedContent({
            model: this.model,
            contents,
            config: { taskType: this.taskType },
        });
        return response.embeddings?.map(({ values }) => values ?? []) ?? [];
    }

    embedQuery(document: string): Promise<number[]> {
        return this.caller.call(async () => {
            const [embedding] = await this.embedContents([this.cleanText(document)]);
            return embedding ?? [];
        });
    }

    async embedDocuments(documents: string[]): Promise<number[][]> {
        const batches = chunkArray(documents.map((document) => this.cleanText(document)), 100);
        const responses = await Promise.allSettled(
            batches.map((batch) => this.caller.call(this.embedContents.bind(this), batch))
        );
        return responses.flatMap((response, index) =>
            response.status === "fulfilled"
                ? response.value
                : Array(batches[index].length).fill([])
        );
    }
}
