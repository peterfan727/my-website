import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import AboutPage from '../../app/about/page'

describe('AboutPage', () => {
    it('renders the heading', () => {
        render(<AboutPage />)
        expect(screen.getByRole('heading', { level: 1, name: /About Me/i })).toBeInTheDocument()
    })

    it('renders the profile image', () => {
        render(<AboutPage />)
        const img = screen.getByAltText('Peter Fan')
        expect(img).toBeInTheDocument()
    })

    it('renders section headings', () => {
        render(<AboutPage />)
        expect(screen.getByText('When I am not coding...')).toBeInTheDocument()
        expect(screen.getByText('People see me as...')).toBeInTheDocument()
        expect(screen.getByText(/My Education Background/i)).toBeInTheDocument()
    })

    it('renders interests', () => {
        render(<AboutPage />)
        expect(screen.getByText('Machine Learning')).toBeInTheDocument()
        expect(screen.getByText('Bioinformatics')).toBeInTheDocument()
        expect(screen.getByText('Microservices')).toBeInTheDocument()
    })
})
