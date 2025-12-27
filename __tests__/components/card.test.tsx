import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Card from '../../app/components/card'

describe('Card', () => {
    it('renders children correctly', () => {
        render(<Card><div>Test Child</div></Card>)
        expect(screen.getByText('Test Child')).toBeInTheDocument()
    })

    it('applies default classes', () => {
        const { container } = render(<Card>Content</Card>)
        const div = container.firstChild as HTMLElement
        expect(div).toHaveClass('flex', 'flex-col', 'rounded', 'drop-shadow-lg', 'bg-sky-100')
    })

    it('applies additional className prop', () => {
        const { container } = render(<Card className="custom-class">Content</Card>)
        const div = container.firstChild as HTMLElement
        expect(div).toHaveClass('custom-class')
    })
})
