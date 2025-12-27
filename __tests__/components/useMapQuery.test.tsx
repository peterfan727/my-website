import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMapQuery } from '../../app/components/useMapQuery'

// Mock Firebase
jest.mock('firebase/firestore', () => ({
    getDocs: jest.fn(),
    collection: jest.fn(),
    getFirestore: jest.fn(),
}))
jest.mock('../../app/firebase/firebaseConfig', () => ({
    db: {}
}))

import { getDocs } from 'firebase/firestore'

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    })
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
}

describe('useMapQuery', () => {
    it('fetches and returns map history', async () => {
        // Mock getDocs response
        (getDocs as jest.Mock).mockResolvedValue({
            docs: [
                {
                    data: () => ({ lat: 10, lng: 20 })
                }
            ]
        })

        const { result } = renderHook(() => useMapQuery(), {
            wrapper: createWrapper()
        })

        await waitFor(() => {
            expect(result.current.data).toEqual([{ lat: 10, lng: 20 }])
        })
    })
})
