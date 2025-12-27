/**
 * @jest-environment node
 */
import { POST } from '../../../app/api/chatv2/route'
import { getAgent } from '../../../app/api/chatv2/llmAgent'
import { AIMessageChunk } from '@langchain/core/messages'

// Mock getAgent
jest.mock('../../../app/api/chatv2/llmAgent', () => ({
    getAgent: jest.fn()
}))

// Mock Message Classes
jest.mock('@langchain/core/messages', () => ({
    HumanMessage: class { constructor(public content: string) { } },
    AIMessage: class { constructor(public content: string) { } },
    AIMessageChunk: class { constructor(public content: string) { } }
}))

describe('Chat API Route', () => {
    it('processes POST request and returns stream', async () => {
        // Mock Agent Stream
        const mockStream = {
            async *[Symbol.asyncIterator]() {
                yield ['messages', new Map([['key', new AIMessageChunk('Hello')]])];
            }
        };

        (getAgent as jest.Mock).mockResolvedValue({
            agent: { stream: jest.fn().mockReturnValue(mockStream) }
        })

        const req = new Request('http://localhost/api/chatv2', {
            method: 'POST',
            body: JSON.stringify({
                messages: [{ role: 'user', content: 'Hi' }],
                llm: 'gemini',
                threadId: '123',
                useV1: false
            })
        })

        const res = await POST(req as any)
        expect(res.body).toBeDefined()
    })
})
