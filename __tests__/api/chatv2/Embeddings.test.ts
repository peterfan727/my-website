import { OpenAiEmbedding, GeminiEmbedding } from '../../../app/api/chatv2/Embeddings'

// Mock external dependencies
jest.mock('@langchain/openai', () => ({
    OpenAIEmbeddings: jest.fn().mockImplementation(() => ({
        embedQuery: jest.fn().mockResolvedValue([])
    }))
}))

jest.mock('@langchain/google-genai', () => ({
    GoogleGenerativeAIEmbeddings: jest.fn().mockImplementation(() => ({
        embedQuery: jest.fn().mockResolvedValue([])
    }))
}))

describe('Embeddings', () => {
    it('initializes OpenAI embeddings', () => {
        expect(OpenAiEmbedding).toBeDefined()
    })

    it('initializes Gemini embeddings', () => {
        expect(GeminiEmbedding).toBeDefined()
    })
})
