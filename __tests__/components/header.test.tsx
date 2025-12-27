import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Header from '../../app/components/header'

describe('Header', () => {
    it('renders the title and description', () => {
        render(<Header />)
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Peter Fan')
        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('my journey exploring the world of information technology')
    })
})
