/**
 * @jest-environment node
 */
import { GET } from '../../../app/api/geo/route'
import { geolocation } from '@vercel/functions'

// Mock @vercel/functions
jest.mock('@vercel/functions', () => ({
    geolocation: jest.fn()
}))

describe('Geo API', () => {
    it('returns geolocation data', async () => {
        // Mock implementation
        (geolocation as jest.Mock).mockReturnValue({
            city: 'Vancouver',
            country: 'CA',
            flag: '🇨🇦',
            latitude: 49.2827,
            longitude: -123.1207
        })

        const request = new Request('http://localhost/api/geo')
        const response = await GET(request)
        const data = await response.json()

        expect(data).toEqual({
            city: 'Vancouver',
            countryCode: 'CA',
            countryFlag: '🇨🇦',
            latitude: 49.2827,
            longitude: -123.1207
        })
    })
})
