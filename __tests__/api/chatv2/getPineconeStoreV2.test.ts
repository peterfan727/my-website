import getPineconeStoreV2 from '../../../app/api/chatv2/getPineconeStoreV2'
import { Pinecone } from '@pinecone-database/pinecone'
import { PineconeStore } from '@langchain/pinecone'

// Helper to Create a Promise that also has a catch property that returns itself
// This mimics the behavior expected by the implementation: await pinecone.listIndexes().catch(...)
const createMockPromise = (resolveValue: any) => {
    return {
        then: (cb: any) => createMockPromise(cb(resolveValue)),
        catch: jest.fn().mockImplementation(() => createMockPromise(resolveValue)),
        // We need to be able to await it
        [Symbol.toStringTag]: 'Promise',
    }
}

// But since the code awaits it, it expects a real promise.
// The issue is `await pinecone.listIndexes().catch(...)`.
// Standard Promises HAVE a .catch method. The error says "Cannot read properties of undefined (reading 'catch')".
// This implies pinecone.listIndexes() returned undefined, NOT a promise.

// Mock Pinecone
jest.mock('@pinecone-database/pinecone', () => ({
    Pinecone: jest.fn()
}))

// Mock Langchain PineconeStore
jest.mock('@langchain/pinecone', () => ({
    PineconeStore: {
        fromExistingIndex: jest.fn()
    }
}))

describe('getPineconeStoreV2', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        process.env.PINECONE_API_KEY = 'test-key'
    })

    it('returns null if index does not exist', async () => {
        const listIndexesMock = jest.fn().mockReturnValue(Promise.resolve({ indexes: [{ name: 'other-index' }] }))
        // @ts-ignore
        Pinecone.mockImplementation(() => ({
            listIndexes: listIndexesMock
        }))

        const store = await getPineconeStoreV2('target-index', {} as any, null)
        expect(store).toBeNull()
    })

    it('returns store if index exists', async () => {
        const listIndexesMock = jest.fn().mockReturnValue(Promise.resolve({ indexes: [{ name: 'target-index' }] }))
        // @ts-ignore
        Pinecone.mockImplementation(() => ({
            listIndexes: listIndexesMock,
            index: jest.fn()
        }))

            ; (PineconeStore.fromExistingIndex as jest.Mock).mockReturnValue(Promise.resolve({}))

        const store = await getPineconeStoreV2('target-index', {} as any, null)
        expect(store).not.toBeNull()
    })
})
