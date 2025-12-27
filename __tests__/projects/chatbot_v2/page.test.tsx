import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import Page from '../../../app/projects/chatbot_v2/page'

// Mock Chatbot component
jest.mock('../../../app/projects/chatbot_v2/chatbot', () => {
    return function MockChatbot({ embedding }: { embedding: string }) {
        return <div data-testid="chatbot">Chatbot with embedding: {embedding}</div>
    }
})

describe('ChatbotPage Wrapper', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('renders and defaults to gemini embedding', () => {
        render(<Page />)
        expect(screen.getByText('Chatbot with embedding: gemini')).toBeInTheDocument()
    })

    it('updates embedding on selection', () => {
        render(<Page />)
        const select = screen.getByRole('combobox')
        fireEvent.change(select, { target: { value: 'openai' } })
        expect(screen.getByText('Chatbot with embedding: openai')).toBeInTheDocument()
    })
})
