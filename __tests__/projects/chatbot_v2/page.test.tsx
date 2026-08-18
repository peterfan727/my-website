import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import Page from '../../../app/projects/chatbot_v2/page'

const mockPush = jest.fn()
let mockSearchParams = new URLSearchParams()

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
        replace: jest.fn(),
        prefetch: jest.fn(),
    }),
    usePathname: () => '/projects/chatbot_v2',
    useSearchParams: () => mockSearchParams,
}))

// Mock Chatbot component
jest.mock('../../../app/projects/chatbot_v2/chatbot', () => {
    return function MockChatbot({ embedding }: { embedding: string }) {
        return <div data-testid="chatbot">Chatbot with embedding: {embedding}</div>
    }
})

describe('ChatbotPage Wrapper', () => {
    beforeEach(() => {
        mockPush.mockClear()
        mockSearchParams = new URLSearchParams()
        jest.spyOn(console, 'error').mockImplementation(() => { })
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('renders and defaults to gemini embedding when URL param is absent', () => {
        render(<Page />)
        expect(screen.getByText('Chatbot with embedding: gemini')).toBeInTheDocument()
        const select = screen.getByRole('combobox') as HTMLSelectElement
        expect(select.value).toBe('gemini')
    })

    it('initializes with embedding from searchParams', () => {
        mockSearchParams = new URLSearchParams('embedding=openai')
        render(<Page />)
        expect(screen.getByText('Chatbot with embedding: openai')).toBeInTheDocument()
        const select = screen.getByRole('combobox') as HTMLSelectElement
        expect(select.value).toBe('openai')
    })

    it('updates embedding on user selection and triggers router.push', () => {
        render(<Page />)
        const select = screen.getByRole('combobox')
        fireEvent.change(select, { target: { value: 'openai' } })

        expect(screen.getByText('Chatbot with embedding: openai')).toBeInTheDocument()
        expect(mockPush).toHaveBeenCalledWith('/projects/chatbot_v2?embedding=openai')
    })

    it('syncs embedding when URL search parameter changes on re-render', () => {
        mockSearchParams = new URLSearchParams('embedding=gemini')
        const { rerender } = render(<Page />)
        expect(screen.getByText('Chatbot with embedding: gemini')).toBeInTheDocument()

        // User changes to openai
        const select = screen.getByRole('combobox')
        fireEvent.change(select, { target: { value: 'openai' } })
        expect(screen.getByText('Chatbot with embedding: openai')).toBeInTheDocument()

        // URL changes externally to custom or different value
        mockSearchParams = new URLSearchParams('embedding=gemini-custom')
        rerender(<Page />)
        expect(screen.getByText('Chatbot with embedding: gemini-custom')).toBeInTheDocument()
    })
})
