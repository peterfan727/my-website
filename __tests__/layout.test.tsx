import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import RootLayout from '../app/layout'

// Mock styles
jest.mock('../app/globals.css', () => ({}))

// Mock font
jest.mock('next/font/google', () => ({
    Ubuntu: () => ({ variable: 'mock-font' })
}))

// Mock components
jest.mock('../app/components/header', () => () => <div data-testid="header">Header</div>)
jest.mock('../app/components/NavbarClient', () => () => <div data-testid="navbar">Navbar</div>)

// Mock Vercel analytics
jest.mock('@vercel/analytics/react', () => ({
    Analytics: () => <div data-testid="analytics">Analytics</div>
}))
jest.mock('@vercel/speed-insights/next', () => ({
    SpeedInsights: () => <div data-testid="speed-insights">SpeedInsights</div>
}))

describe('RootLayout', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('renders children and required components', () => {
        const { container } = render(
            <RootLayout>
                <div data-testid="child">Child Content</div>
            </RootLayout>
        )

        expect(screen.getByTestId('header')).toBeInTheDocument()
        expect(screen.getByTestId('navbar')).toBeInTheDocument()
        expect(screen.getByTestId('child')).toBeInTheDocument()
        expect(screen.getByTestId('analytics')).toBeInTheDocument()
        expect(screen.getByTestId('speed-insights')).toBeInTheDocument()

        // title and metadata cannot be easily tested in unit tests for layout as they are handled by Next.js framework
    })
})
