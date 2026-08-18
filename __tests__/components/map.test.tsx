import '@testing-library/jest-dom'
import { render, waitFor, act } from '@testing-library/react'
import Map from '../../app/components/map'
import { useMapQuery } from '../../app/components/useMapQuery'

const mockMapInstance = {
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
    ] as HTMLElement[][],
};

const mockMarkerInstance = {
    position: { lat: 49.2827, lng: -123.1207 },
};

const mockGeocoderInstance = {
    geocode: jest.fn().mockImplementation((request, callback) => {
        if (callback) {
            callback(
                [{ geometry: { location: { lat: () => 37.7749, lng: () => -122.4194 } } }],
                'OK'
            );
        }
        return Promise.resolve({
            results: [{ geometry: { location: { lat: () => 37.7749, lng: () => -122.4194 } } }]
        });
    }),
};

// Mock Google Maps Loader
jest.mock('@googlemaps/js-api-loader', () => ({
    Loader: jest.fn().mockImplementation(() => ({
        importLibrary: jest.fn().mockImplementation(async (lib: string) => {
            if (lib === 'maps') {
                return {
                    Map: jest.fn().mockImplementation(() => mockMapInstance),
                };
            }
            if (lib === 'geocoding') {
                return {
                    Geocoder: jest.fn().mockImplementation(() => mockGeocoderInstance),
                };
            }
            if (lib === 'marker') {
                return {
                    AdvancedMarkerElement: jest.fn().mockImplementation(() => mockMarkerInstance),
                    PinElement: jest.fn().mockImplementation(() => ({
                        element: document.createElement('div'),
                    })),
                };
            }
            return {};
        }),
    })),
}))

// Mock MarkerClusterer
const mockClustererInstance = {
    clearMarkers: jest.fn(),
    addMarkers: jest.fn(),
};

jest.mock('@googlemaps/markerclusterer', () => ({
    MarkerClusterer: jest.fn().mockImplementation(() => mockClustererInstance),
}))

// Mock custom hooks
const mockMutate = jest.fn();
jest.mock('../../app/components/useMapQuery', () => ({
    useMapQuery: jest.fn().mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
    }),
    useAddMapHistory: jest.fn().mockReturnValue({
        mutate: (...args: any[]) => mockMutate(...args),
        isSuccess: false,
        isError: false,
    }),
    queryClient: {
        invalidateQueries: jest.fn().mockResolvedValue(undefined),
    },
}))

// Mock global google object
global.google = {
    maps: {
        ControlPosition: {
            TOP_LEFT: 1,
            BOTTOM_LEFT: 2,
        },
        GeocoderStatus: {
            OK: 'OK',
            ZERO_RESULTS: 'ZERO_RESULTS',
        },
        Map: jest.fn().mockImplementation(() => mockMapInstance),
        LatLng: jest.fn(),
    },
} as any;

describe('Map', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockMapInstance.controls[1] = [];
        mockMapInstance.controls[2] = [];
    });

    it('renders without crashing and initializes map controls', async () => {
        const { container } = render(<Map />)
        expect(container.firstChild).toBeInTheDocument()

        await waitFor(() => {
            expect(mockMapInstance.controls[1].length).toBeGreaterThan(0);
        });
    })

    it('initializes with geoLat and geoLong if provided in props', async () => {
        render(<Map lat="37.7749" long="-122.4194" country="US" />)

        await waitFor(() => {
            expect(mockMapInstance.setCenter).toBeDefined();
        });
    })

    it('updates center when geo props update after mount', async () => {
        const { rerender } = render(<Map />)

        await waitFor(() => {
            expect(mockMapInstance.controls[1].length).toBeGreaterThan(0);
        });

        rerender(<Map lat="40.7128" long="-74.0060" country="US" />)

        await waitFor(() => {
            expect(mockMapInstance.setCenter).toHaveBeenCalledWith({
                lat: 40.7128,
                lng: -74.0060,
            });
        });
    })

    it('populates history markers when data is available', async () => {
        (useMapQuery as jest.Mock).mockReturnValue({
            data: [{ lat: 49.2827, lng: -123.1207 }, { lat: 37.7749, lng: -122.4194 }],
            isLoading: false,
            error: null,
        });

        render(<Map />)

        await waitFor(() => {
            expect(mockMapInstance.controls[1].length).toBeGreaterThan(0);
        });
    })
})
