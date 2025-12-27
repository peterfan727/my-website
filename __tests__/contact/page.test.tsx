import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import ContactPage from '../../app/contact/page'

describe('ContactPage', () => {
    it('renders the heading', () => {
        render(<ContactPage />)
        expect(screen.getByRole('heading', { level: 1, name: /Contact Me/i })).toBeInTheDocument()
    })

    it('renders the LinkedIn link', () => {
        render(<ContactPage />)
        const link = screen.getByRole('link', { name: /Please reach me through LinkedIn!/i })
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('href', 'https://ca.linkedin.com/in/cc-peter-fan')
    })

    it('renders the LinkedIn logo', () => {
        render(<ContactPage />)
        expect(screen.getByAltText('LinkedIn Logo')).toBeInTheDocument()
    })
})
