'use client'

import { useRef, useEffect, useCallback } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import { MarkerClusterer } from "@googlemaps/markerclusterer"
import { queryClient, useMapQuery, useAddMapHistory } from "./useMapQuery"
import styles from './map.module.css'

type Coordinate = {
    lat: number,
    lng: number
}

type MapProps = {
    country?: string,
    lat?: string | number,
    long?: string | number,
}

const VANCOUVER = { lat: 49.2827, lng: -123.1207 }

const DEFAULT_MAP_OPTIONS = {
    center: VANCOUVER,
    zoom: 1,
    mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
    fullscreenControlOptions: {},
    restriction: {
        latLngBounds: { north: 85, south: -85, west: -180, east: 180 },
        strictBounds: true,
    },
}

const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    version: "weekly",
});

/**
 * Create a Google Map with geocoding UI and markers retrieved from NoSQL database. Allow adding new Markers to the database and on the map.
 * @param props MapProps
 * @returns JSX.Element
 */
export default function Map(props: MapProps) {
    const detectedCountry = props.country || undefined;
    const parsedLat = props.lat !== undefined && props.lat !== null ? Number(props.lat) : null;
    const parsedLong = props.long !== undefined && props.long !== null ? Number(props.long) : null;
    const geoLat = parsedLat !== null && !Number.isNaN(parsedLat) ? parsedLat : null;
    const geoLong = parsedLong !== null && !Number.isNaN(parsedLong) ? parsedLong : null;

    // Element ref
    const mapRef = useRef<HTMLDivElement>(null);

    // Get map history from Firestore
    const { data: history } = useMapQuery();
    // set up useMutation
    const { mutate: addPin } = useAddMapHistory();

    // Map instance & Google API refs (persist across renders without triggering state-based infinite loops)
    const mapCanvasRef = useRef<google.maps.Map | null>(null);
    const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
    const geocoderRef = useRef<google.maps.Geocoder | null>(null);
    const clustererRef = useRef<MarkerClusterer | null>(null);
    const uiDivRef = useRef<HTMLDivElement | null>(null);
    const isNewSessionRef = useRef<boolean>(true);
    const isInitializedRef = useRef<boolean>(false);

    // Inner Functions
    function clearCursorMarker() {
        if (markerRef.current) {
            markerRef.current.position = null;
        }
    }

    const populateMarkers = useCallback(async (map: google.maps.Map, coordinates: Coordinate[] | undefined) => {
        if (!coordinates || coordinates.length === 0) {
            if (clustererRef.current) {
                clustererRef.current.clearMarkers();
            }
            return;
        }

        try {
            const { AdvancedMarkerElement } = await loader.importLibrary('marker');
            const markers = coordinates.map((latlng) => {
                return new AdvancedMarkerElement({ position: latlng });
            });

            if (clustererRef.current) {
                clustererRef.current.clearMarkers();
                clustererRef.current.addMarkers(markers);
            } else {
                clustererRef.current = new MarkerClusterer({ markers, map });
            }
        } catch (e) {
            console.error("Failed to populate markers:", e);
        }
    }, []);

    // Geocode the location and zoom onto it
    const geocode = useCallback((request: google.maps.GeocoderRequest) => {
        if (!geocoderRef.current || !mapCanvasRef.current || !markerRef.current) return;
        geocoderRef.current
            .geocode(request, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                    mapCanvasRef.current?.setZoom(8);
                    mapCanvasRef.current?.setCenter(results[0].geometry.location);
                    if (markerRef.current) {
                        markerRef.current.position = results[0].geometry.location;
                    }
                } else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
                    alert("Location not found on Google Map.");
                }
            })
            .catch((e) => {
                console.error("Geocode was not successful: " + e);
            });
    }, []);

    // Initialize map on mount
    useEffect(() => {
        if (!mapRef.current || isInitializedRef.current) return;
        isInitializedRef.current = true;

        let isMounted = true;

        const init = async () => {
            try {
                const [{ Map: GoogleMap }, { Geocoder }, { AdvancedMarkerElement, PinElement }] = await Promise.all([
                    loader.importLibrary('maps'),
                    loader.importLibrary('geocoding'),
                    loader.importLibrary('marker'),
                ]);

                if (!isMounted || !mapRef.current) return;

                geocoderRef.current = new Geocoder();

                let initialCenter: google.maps.LatLngLiteral = VANCOUVER;
                if (geoLat !== null && geoLong !== null) {
                    initialCenter = { lat: geoLat, lng: geoLong };
                }

                const mapOptions: google.maps.MapOptions = {
                    ...DEFAULT_MAP_OPTIONS,
                    center: initialCenter,
                    fullscreenControlOptions: { position: google.maps.ControlPosition.BOTTOM_LEFT },
                };

                const map = new GoogleMap(mapRef.current, mapOptions);
                mapCanvasRef.current = map;

                // Orange pin for user's location
                const pinBackground = new PinElement({
                    background: '#FBBC04',
                });
                const marker = new AdvancedMarkerElement({
                    map,
                    position: initialCenter,
                    title: 'You',
                    content: pinBackground.element,
                });
                markerRef.current = marker;

                // If only country was provided initially, geocode it
                if (geoLat === null && detectedCountry && geocoderRef.current) {
                    geocoderRef.current.geocode({ address: detectedCountry }, (results, status) => {
                        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                            const location = results[0].geometry.location;
                            map.setCenter(location);
                            marker.position = location;
                        }
                    });
                }

                // Populate history markers if already loaded
                if (history && history.length > 0) {
                    populateMarkers(map, history);
                }

                // Geocode UI
                const uiDiv = document.createElement('div');
                uiDiv.classList.add(styles.div);
                uiDivRef.current = uiDiv;

                const inputText = document.createElement('input');
                inputText.type = 'text';
                inputText.placeholder = 'Enter a location';
                inputText.classList.add(styles.input);
                inputText.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        searchButton.click();
                    }
                });

                const searchButton = document.createElement('input');
                searchButton.type = 'button';
                searchButton.value = 'Search';
                searchButton.classList.add(styles.input, styles.buttonPrimary);
                searchButton.addEventListener('click', () => {
                    geocode({ address: inputText.value });
                });

                const submitButton = document.createElement('input');
                submitButton.type = 'button';
                submitButton.value = 'Submit';
                submitButton.classList.add(styles.input, styles.buttonSecondary);
                submitButton.addEventListener('click', () => {
                    if (markerRef.current && markerRef.current.position) {
                        const pos = markerRef.current.position;
                        const new_lat: number = typeof pos.lat === 'function' ? pos.lat() : Number(pos.lat);
                        const new_lng: number = typeof pos.lng === 'function' ? pos.lng() : Number(pos.lng);

                        try {
                            addPin({ lat: new_lat, lng: new_lng }, {
                                onSuccess: () => {
                                    queryClient.invalidateQueries({
                                        queryKey: ['mapHistory']
                                    }).then(() => {
                                        clearCursorMarker();
                                        isNewSessionRef.current = false;
                                    });
                                },
                                onError: (e) => {
                                    console.error(e);
                                }
                            });
                        } catch (e) {
                            console.error('Error adding document: ', e);
                        }
                    }
                });

                uiDiv.appendChild(inputText);
                uiDiv.appendChild(searchButton);
                uiDiv.appendChild(submitButton);
                map.controls[google.maps.ControlPosition.TOP_LEFT].push(uiDiv);

                map.addListener('click', (e: google.maps.MapMouseEvent) => {
                    if (e.latLng) {
                        geocode({ location: e.latLng });
                    }
                });
            } catch (e) {
                console.error('Failed to initialize map:', e);
            }
        };

        init();

        return () => {
            isMounted = false;
            if (clustererRef.current) {
                clustererRef.current.clearMarkers();
            }
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Update map center & marker when geolocation props arrive after mount
    useEffect(() => {
        if (!mapCanvasRef.current || !isNewSessionRef.current) return;

        if (geoLat !== null && geoLong !== null) {
            const location = { lat: geoLat, lng: geoLong };
            mapCanvasRef.current.setCenter(location);
            if (markerRef.current) {
                markerRef.current.position = location;
            }
        } else if (detectedCountry && geocoderRef.current) {
            geocoderRef.current.geocode({ address: detectedCountry }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                    const location = results[0].geometry.location;
                    mapCanvasRef.current?.setCenter(location);
                    if (markerRef.current) {
                        markerRef.current.position = location;
                    }
                }
            });
        }
    }, [geoLat, geoLong, detectedCountry]);

    // Update history markers when history data updates
    useEffect(() => {
        if (mapCanvasRef.current && history) {
            populateMarkers(mapCanvasRef.current, history);
        }
    }, [history, populateMarkers]);

    return <div style={{ width: "100%", height: "400px", minWidth: "20em" }} ref={mapRef} />;
}
