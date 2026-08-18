import { useCallback, useSyncExternalStore } from "react";

/**
 * A custom hook to determine if the screen size matches a given query.
 * @param query string that describes the screen size
 * @returns boolean
 */
const useMediaQuery = (query: string) => {
    const subscribe = useCallback(
        (callback: () => void) => {
            if (typeof window === "undefined") return () => {};
            const media = window.matchMedia(query);
            media.addEventListener("change", callback);
            return () => media.removeEventListener("change", callback);
        },
        [query]
    );

    const getSnapshot = () => {
        if (typeof window === "undefined") return false;
        return window.matchMedia(query).matches;
    };

    const getServerSnapshot = () => false;

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

export default useMediaQuery;
