import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import Map from '../../app/components/map'

// Mock Google Maps Loader
jest.mock('@googlemaps/js-api-loader', () => ({
    Loader: jest.fn().mockImplementation(() => ({
        importLibrary: jest.fn().mockResolvedValue({
            Map: jest.fn().mockImplementation(() => ({
                setZoom: jest.fn(),
                setCenter: jest.fn(),
                addListener: jest.fn(),
                controls: [
                    [], // 0
                    [], // 1: TOP_LEFT
                    [], // 2: BOTTOM_LEFT
                    [], // 3
                    [], // 4
                    [], // 5
                    [], // 6
                    [], // 7
                    [], // 8
                    [], // 9
                    [], // 10
                    [], // 11
                    [], // 12
                ]
            })),
            AdvancedMarkerElement: jest.fn(),
            PinElement: jest.fn(),
            Geocoder: jest.fn(),
        })
    }))
}))

// Mock MarkerClusterer
jest.mock('@googlemaps/markerclusterer', () => ({
    MarkerClusterer: jest.fn()
}))

// Mock custom hooks
jest.mock('../../app/components/useMapQuery', () => ({
    useMapQuery: jest.fn().mockReturnValue({
        data: [],
        isLoading: false,
        error: null
    }),
    useAddMapHistory: jest.fn().mockReturnValue({
        mutate: jest.fn(),
        isSuccess: false,
        isError: false
    }),
    queryClient: {
        invalidateQueries: jest.fn()
    }
}))

// Mock global google object
global.google = {
    maps: {
        ControlPosition: {
            TOP_LEFT: 1,
            BOTTOM_LEFT: 2
        },
        GeocoderStatus: {
            OK: 'OK',
            ZERO_RESULTS: 'ZERO_RESULTS'
        },
        Map: jest.fn().mockImplementation(() => ({
            setZoom: jest.fn(),
            setCenter: jest.fn(),
            addListener: jest.fn(),
            controls: [
                [], // 0
                [], // 1: TOP_LEFT
                [], // 2: BOTTOM_LEFT
                [], // 3
                [], // 4
                [], // 5
                [], // 6
                [], // 7
                [], // 8
                [], // 9
                [], // 10
                [], // 11
                [], // 12
            ]
        })),
        LatLng: jest.fn(),
    }
} as any;


describe('Map', () => {
    it('renders without crashing', () => {
        const { container } = render(<Map />)
        expect(container.firstChild).toBeInTheDocument()
    })
})
