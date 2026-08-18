import { renderHook, act } from '@testing-library/react'
import useMediaQuery from '../../app/components/useMediaQuery'

describe('useMediaQuery', () => {
    let matchMediaListeners: Record<string, ((e: MediaQueryListEvent) => void)[]> = {}
    let matchesMap: Record<string, boolean> = {}

    beforeEach(() => {
        matchMediaListeners = {}
        matchesMap = {}

        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation((query: string) => {
                if (!matchMediaListeners[query]) {
                    matchMediaListeners[query] = []
                }
                return {
                    matches: matchesMap[query] ?? false,
                    media: query,
                    onchange: null,
                    addEventListener: jest.fn((event: string, callback: (e: MediaQueryListEvent) => void) => {
                        if (event === 'change') {
                            matchMediaListeners[query].push(callback)
                        }
                    }),
                    removeEventListener: jest.fn((event: string, callback: (e: MediaQueryListEvent) => void) => {
                        if (event === 'change') {
                            matchMediaListeners[query] = matchMediaListeners[query].filter(cb => cb !== callback)
                        }
                    }),
                    dispatchEvent: jest.fn(),
                }
            })
        })
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('returns true when media query matches', () => {
        matchesMap['(min-width: 768px)'] = true

        const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
        expect(result.current).toBe(true)
    })

    it('returns false when media query does not match', () => {
        matchesMap['(min-width: 768px)'] = false

        const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
        expect(result.current).toBe(false)
    })

    it('updates state when media query change event fires', () => {
        matchesMap['(min-width: 768px)'] = false

        const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
        expect(result.current).toBe(false)

        act(() => {
            matchesMap['(min-width: 768px)'] = true
            matchMediaListeners['(min-width: 768px)'].forEach(cb => cb({ matches: true } as MediaQueryListEvent))
        })

        expect(result.current).toBe(true)
    })

    it('removes listener upon unmount', () => {
        const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'))
        expect(matchMediaListeners['(min-width: 768px)'].length).toBe(1)

        unmount()
        expect(matchMediaListeners['(min-width: 768px)'].length).toBe(0)
    })

    it('updates subscription when query changes', () => {
        matchesMap['(min-width: 768px)'] = true
        matchesMap['(min-width: 1024px)'] = false

        const { result, rerender } = renderHook(
            ({ query }) => useMediaQuery(query),
            { initialProps: { query: '(min-width: 768px)' } }
        )

        expect(result.current).toBe(true)

        rerender({ query: '(min-width: 1024px)' })
        expect(result.current).toBe(false)
        expect(matchMediaListeners['(min-width: 768px)'].length).toBe(0)
        expect(matchMediaListeners['(min-width: 1024px)'].length).toBe(1)
    })
})
