import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import Navbar from '../../app/components/navbar'

// Mock useMediaQuery
jest.mock('../../app/components/useMediaQuery', () => ({
    __esModule: true,
    default: jest.fn()
}))

import useMediaQuery from '../../app/components/useMediaQuery'

// Mock usePathname
jest.mock('next/navigation', () => ({
    usePathname: () => '/',
}))

describe('Navbar', () => {
    it('renders all links in desktop mode', () => {
        // Mock desktop view
        (useMediaQuery as jest.Mock).mockReturnValue(true)

        render(<Navbar />)

        const links = ['Home', 'About', 'Experience', 'Projects', 'Contact']
        links.forEach(linkText => {
            expect(screen.getByText(linkText)).toBeInTheDocument()
        })

        // Should be in a nav row
        const nav = screen.getByRole('navigation')
        expect(nav).toHaveClass('flex-row')
    })

    it('renders collapsed view in mobile mode', () => {
        // Mock mobile view
        (useMediaQuery as jest.Mock).mockReturnValue(false)

        render(<Navbar />)

        // Should show current page label (Home based on mocked pathname)
        expect(screen.getByText('Home ▼')).toBeInTheDocument()

        // Should be in a nav col
        const nav = screen.getByRole('navigation')
        expect(nav).toHaveClass('flex-col')
    })

    it('expands when clicked in mobile mode', () => {
        (useMediaQuery as jest.Mock).mockReturnValue(false)
        render(<Navbar />)

        const toggleButton = screen.getByText('Home ▼')
        fireEvent.click(toggleButton)

        const links = ['Home', 'About', 'Experience', 'Projects', 'Contact']
        links.forEach(linkText => {
            expect(screen.getByText(linkText)).toBeInTheDocument()
        })
    })
})
