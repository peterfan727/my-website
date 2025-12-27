import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'

// Mock global fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
            countryCode: 'US',
            countryFlag: '🇺🇸',
            latitude: 37,
            longitude: -122,
            city: 'San Francisco'
        }),
    })
) as jest.Mock;

describe('Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders a heading', async () => {
        render(<Page />)

        const heading = screen.getByRole('heading', { level: 1 })

        expect(heading).toBeInTheDocument()
        expect(heading).toHaveTextContent('👋 Hello! Bonjour! Hola! 你好!')

        // Wait for the async effect to complete to avoid act() warnings
        await screen.findByText(/Visitor from San Francisco, US 🇺🇸!/i)
    })

    it('renders the chatbot link', async () => {
        render(<Page />)
        const link = screen.getByRole('link', { name: /Talk to My Chatbot/i })
        expect(link).toBeInTheDocument()

        // Wait for the async effect to complete to avoid act() warnings
        await screen.findByText(/Visitor from San Francisco, US 🇺🇸!/i)
    })
})
