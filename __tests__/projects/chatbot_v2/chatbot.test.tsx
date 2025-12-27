import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ChatbotPage from '../../../app/projects/chatbot_v2/chatbot'

// Mock global fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        body: {
            getReader: () => ({
                read: jest.fn()
                    .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode('Hello') })
                    .mockResolvedValueOnce({ done: true })
            })
        }
    })
) as jest.Mock;

describe('Chatbot Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders initial state', () => {
        render(<ChatbotPage />)
        expect(screen.getByText(/Hi! I am Peter's AI chatbot/i)).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument()
    })

    it('allows typing and sending message', async () => {
        render(<ChatbotPage />)
        const input = screen.getByPlaceholderText('Type your message...')
        fireEvent.change(input, { target: { value: 'Hello AI' } })
        expect(input).toHaveValue('Hello AI')

        const button = screen.getByText('Send')
        fireEvent.click(button)

        expect(screen.getByText('Hello AI')).toBeInTheDocument()
        expect(input).toHaveValue('') // should clear input

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalled()
        })
    })
})
