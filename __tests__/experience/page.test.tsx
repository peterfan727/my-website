import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import ExperiencePage from '../../app/experience/page'

// Mock the Timeline component to simplify page testing
jest.mock('../../app/experience/timeline', () => {
    return function MockTimeline() {
        return <div data-testid="mock-timeline">Timeline Component</div>
    }
})

describe('ExperiencePage', () => {
    it('renders the heading', () => {
        render(<ExperiencePage />)
        expect(screen.getByRole('heading', { level: 1, name: /Work Experience/i })).toBeInTheDocument()
    })

    it('renders the meme image', () => {
        render(<ExperiencePage />)
        const img = screen.getByAltText(/a pancake tech stack meme/i)
        expect(img).toBeInTheDocument()
    })

    it('renders the timeline', () => {
        render(<ExperiencePage />)
        expect(screen.getByTestId('mock-timeline')).toBeInTheDocument()
    })
})
