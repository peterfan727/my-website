import { useState, useEffect } from "react"

/**
 * A custom hook to determine if the screen size matches a given query.
 * @param query string that describes the screen size
 * @returns boolean
 */
const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState<boolean>();

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        window.addEventListener("resize", listener);
        return () => window.removeEventListener("resize", listener);
    }, [matches, query]);

    return matches;
}

export default useMediaQuery;
