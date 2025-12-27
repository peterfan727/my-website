import { getAgent } from '../../../app/api/chatv2/llmAgent'

// Mock dependencies
jest.mock('../../../app/api/chatv2/getPineconeStoreV2', () => jest.fn())
jest.mock('@langchain/langgraph', () => ({
    MemorySaver: jest.fn()
}))
jest.mock('@langchain/langgraph/prebuilt', () => ({
    createReactAgent: jest.fn().mockReturnValue({
        stream: jest.fn()
    })
}))

// Mock OpenAI and Google GenAI with constructor implementation
jest.mock('@langchain/openai', () => {
    return {
        ChatOpenAI: jest.fn(),
        OpenAIEmbeddings: jest.fn().mockImplementation(() => ({
            embedQuery: jest.fn().mockResolvedValue([])
        }))
    }
})

jest.mock('@langchain/google-genai', () => {
    return {
        ChatGoogleGenerativeAI: jest.fn(),
        GoogleGenerativeAIEmbeddings: jest.fn().mockImplementation(() => ({
            embedQuery: jest.fn().mockResolvedValue([])
        })),
        TaskType: { RETRIEVAL_QUERY: 'RETRIEVAL_QUERY' }
    }
})
jest.mock('@langchain/core/tools', () => ({
    tool: jest.fn().mockReturnValue({})
}))


describe('llmAgent', () => {
    it('creates a gemini agent by default', async () => {
        const result = await getAgent('gemini', false)
        expect(result.agent).toBeDefined()
        expect(result.llm).toBeDefined()
    })

    it('creates a openai agent if requested', async () => {
        const result = await getAgent('openai', false)
        expect(result.agent).toBeDefined()
    })
})
