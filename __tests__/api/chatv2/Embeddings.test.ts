import { OpenAiEmbedding, GeminiEmbedding } from '../../../app/api/chatv2/Embeddings'
import { GoogleGenAIEmbeddings } from '../../../lib/GoogleGenAIEmbeddings'
import { GoogleGenAI } from '@google/genai'

// Mock external dependencies
jest.mock('@langchain/openai', () => ({
    OpenAIEmbeddings: jest.fn().mockImplementation(() => ({
        embedQuery: jest.fn().mockResolvedValue([])
    }))
}))

jest.mock('../../../lib/GoogleGenAIEmbeddings', () => ({
    GoogleGenAIEmbeddings: jest.fn().mockImplementation(() => ({
        embedQuery: jest.fn().mockResolvedValue([]),
        embedDocuments: jest.fn().mockResolvedValue([]),
    }))
}))

jest.mock('@google/genai', () => ({
    GoogleGenAI: jest.fn().mockImplementation(() => ({
        models: {
            embedContent: jest.fn().mockResolvedValue({
                embeddings: [{ values: [0.1, 0.2] }]
            })
        }
    }))
}))

describe('Embeddings', () => {
    it('initializes OpenAI embeddings', () => {
        expect(OpenAiEmbedding).toBeDefined()
    })

    it('uses the Gemini retrieval-query model and task type', async () => {
        expect(GeminiEmbedding).toBeDefined()
        expect(GoogleGenAIEmbeddings).toHaveBeenCalledWith({
            apiKey: process.env.GOOGLE_API_KEY,
            model: 'gemini-embedding-001',
            taskType: 'RETRIEVAL_QUERY',
        })

        const { GoogleGenAIEmbeddings: ActualGoogleGenAIEmbeddings } = jest.requireActual('../../../lib/GoogleGenAIEmbeddings') as typeof import('../../../lib/GoogleGenAIEmbeddings')
        const embedding = new ActualGoogleGenAIEmbeddings({
            apiKey: 'test-key',
            model: 'gemini-embedding-001',
            taskType: 'RETRIEVAL_QUERY',
        })
        await expect(embedding.embedQuery('a\nsearch query')).resolves.toEqual([0.1, 0.2])

        const mockClient = (GoogleGenAI as jest.Mock).mock.results[0].value
        expect(mockClient.models.embedContent).toHaveBeenCalledWith({
            model: 'gemini-embedding-001',
            contents: ['a search query'],
            config: { taskType: 'RETRIEVAL_QUERY' }
        })
    })
})
