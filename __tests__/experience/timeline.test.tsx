import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Timeline from '../../app/experience/timeline'

// Mock the experiences data
jest.mock('../../app/experience/experiences', () => ({
    Experiences: [
        {
            jobTitle: 'Test Job 1',
            company: 'Test Company 1',
            companyHref: 'https://test1.com',
            companyLogoHref: '/logo1.png',
            startDate: 'Jan 2023',
            duration: '1 year',
            tags: ['Tag1', 'Tag2'],
            jobDescription: 'Description of Test Job 1',
            techs: ['Tech1', 'Tech2']
        },
        {
            jobTitle: 'Test Job 2',
            company: 'Test Company 2',
            companyHref: 'https://test2.com',
            companyLogoHref: '/logo2.png',
            startDate: 'Jan 2022',
            duration: '1 year',
            tags: ['TagA'],
            jobDescription: 'Description of Test Job 2',
            techs: ['TechA']
        }
    ]
}))

describe('Timeline', () => {
    it('renders all positions', () => {
        render(<Timeline />)
        expect(screen.getByText('Test Job 1')).toBeInTheDocument()
        expect(screen.getByText('Test Job 2')).toBeInTheDocument()
    })

    it('renders position details correctly', () => {
        render(<Timeline />)

        // Check company name and link
        const companyLink = screen.getByRole('link', { name: /Test Company 1/i })
        expect(companyLink).toHaveAttribute('href', 'https://test1.com')

        // Check duration
        expect(screen.getByText(/Jan 2023 \(1 year\)/)).toBeInTheDocument()

        // Check description
        expect(screen.getByText('Description of Test Job 1')).toBeInTheDocument()

        // Check tags and techs (using regex for partial match due to potential formatting)
        expect(screen.getByText(/Tag1/)).toBeInTheDocument()
        expect(screen.getByText(/Tech1/)).toBeInTheDocument()
    })
})
