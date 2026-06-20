import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import RootLayout from '../app/layout'

// Mock styles
jest.mock('../app/globals.css', () => ({}))

// Mock font
jest.mock('next/font/google', () => ({
    Ubuntu: () => ({ variable: 'mock-font' }),
    Inter: () => ({ variable: 'mock-inter' })
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

    /**
     * Test Case: Renders children and required components
     * 
     * Verifies that RootLayout correctly renders children and injects core page components 
     * (Header, NavbarClient, Vercel Analytics, and Vercel Speed Insights) into the DOM.
     */
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

    /**
     * Test Case: Contains the correct layout classes to support full-width background colors
     * 
     * Verifies the structural fix for background color seams on desktop viewports.
     * 1. The <body> must span the full width of the viewport (using `w-full`) and must not limit 
     *    its width (must not have `max-w-6xl` or centering margins like `mx-auto` or `mx-3`), 
     *    which originally caused the background gradient to only render in a centered column.
     * 2. Content constraints (width limit, centering, padding) are delegated to the immediate 
     *    wrapper <div> inside the body, which we verify has `w-full`, `max-w-6xl`, and `px-3`.
     */
    it('contains the correct layout classes to support full-width background colors', () => {
        const { container } = render(
            <RootLayout>
                <div data-testid="child">Child Content</div>
            </RootLayout>
        )

        // JSDOM mounts the <body> attributes onto the global document.body
        const bodyElement = document.body
        expect(bodyElement).toBeInTheDocument()

        // Assert body is full width and doesn't restrict layout width/margins
        expect(bodyElement.className).toContain('w-full')
        expect(bodyElement.className).not.toContain('max-w-6xl')
        expect(bodyElement.className).not.toContain('mx-auto')
        expect(bodyElement.className).not.toContain('mx-3')

        // Assert the presence of the new centered wrapper div that constrains content width
        // JSDOM strips nested <html>/<body> tags, so the container's first element is our wrapper div
        const wrapperDiv = container.firstElementChild
        expect(wrapperDiv).toBeInTheDocument()
        expect(wrapperDiv?.tagName.toLowerCase()).toBe('div')
        expect(wrapperDiv?.className).toContain('w-full')
        expect(wrapperDiv?.className).toContain('max-w-6xl')
        expect(wrapperDiv?.className).toContain('px-3')
    })
})
