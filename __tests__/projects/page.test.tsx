import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import ProjectPage from '../../app/projects/page'

// Mock the projects data to make the test deterministic and independent of data changes
jest.mock('../../app/projects/projects', () => ({
    all_projects: [
        {
            name: 'Test Project 1',
            href: '/test-project-1',
            imageHref: '/img1.jpg',
            imageAlt: 'Test Image 1',
            buttonDescription: 'View Project 1',
            description: 'Description 1',
            techs: ['React', 'Jest'],
            tags: ['Frontend', 'Testing']
        },
        {
            name: 'Test Project 2',
            // No href to test the "disabled" state if applicable or just non-link display
            href: null,
            imageHref: '/img2.jpg',
            imageAlt: 'Test Image 2',
            buttonDescription: 'Coming Soon',
            description: 'Description 2',
            techs: ['Node'],
            tags: ['Backend']
        }
    ]
}))

describe('ProjectPage', () => {
    it('renders the heading', () => {
        render(<ProjectPage />)
        expect(screen.getByRole('heading', { level: 1, name: /Projects/i })).toBeInTheDocument()
    })

    it('renders project list', () => {
        render(<ProjectPage />)
        expect(screen.getByText('Test Project 1')).toBeInTheDocument()
        expect(screen.getByText('Test Project 2')).toBeInTheDocument()
    })

    it('renders project details', () => {
        render(<ProjectPage />)
        expect(screen.getByText('Description 1')).toBeInTheDocument()
        expect(screen.getByText(/React/)).toBeInTheDocument() // Check tech stack rendering
        expect(screen.getByText(/Frontend/)).toBeInTheDocument() // Check tags
    })

    it('renders links for active projects', () => {
        render(<ProjectPage />)
        const link = screen.getByRole('link', { name: /View Project 1/i })
        expect(link).toHaveAttribute('href', '/test-project-1')
    })
})
