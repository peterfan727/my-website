import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import NotFound from '../app/not-found'

describe('NotFound', () => {
    it('renders 404 message', () => {
        render(<NotFound />)
        expect(screen.getByText('Page Not Found')).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /Go Back to Home/i })).toBeInTheDocument()
    })
})
