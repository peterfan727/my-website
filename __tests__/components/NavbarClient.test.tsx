import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import NavbarClient from '../../app/components/NavbarClient'

// Mock dynamic import
jest.mock('next/dynamic', () => () => {
    const MockNav = () => <div>Mock Navbar</div>
    return MockNav
})

describe('NavbarClient', () => {
    it('renders the dynamic navbar', () => {
        render(<NavbarClient />)
        expect(screen.getByText('Mock Navbar')).toBeInTheDocument()
    })
})
