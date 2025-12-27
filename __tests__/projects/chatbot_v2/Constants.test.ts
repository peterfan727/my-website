import { PC_INDEX_NAME, V1_PC_INDEX_NAME } from '../../../app/projects/chatbot_v2/Constants'

describe('Chatbot Constants', () => {
    it('exports correct index names', () => {
        expect(PC_INDEX_NAME).toBe('my-chatbot-v2')
        expect(V1_PC_INDEX_NAME).toBe('my-chatbot')
    })
})
