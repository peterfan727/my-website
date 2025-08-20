'use client'

import { useRef, useState, useEffect, useCallback } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import { MarkerClusterer } from "@googlemaps/markerclusterer"
import { queryClient, useMapQuery, useAddMapHistory } from "./useMapQuery"
import styles from './map.module.css'

type Coordinate = {
    lat : number ,
    lng : number 
}

type MapProps = {
    country? : string,
    lat? : string,
    long? : string,
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
        latLngBounds: {north: 85, south: -85, west: -180, east: 180},
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
export default function Map( props: MapProps ) {
    // props
    let detectedCountry = props.country || undefined
    let geoLat = props.lat ? parseFloat(props.lat) : null
    let geoLong = props.long ? parseFloat(props.long) : null

    // Hooks
    const mapRef = useRef<HTMLDivElement>(null);
    const [isNewSession, setIsNewSession] = useState(true)
    const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({ lat: 49.2827, lng: -123.1207 });
    const [mapZoom, setMapZoom] = useState(1);

    // Get map history from Firestore
    const {  data: history, isLoading: mapDataIsLoading, error: mapDataError } = useMapQuery()
    // set up useMutation
    const { mutate: addPin, isSuccess: addPinSuccess, isError: addPinError} = useAddMapHistory()
    
    // Variables (must be refs to persist across renders)
    const mapCanvasRef = useRef<google.maps.Map | null>(null);
    const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
    const geocoderRef = useRef<google.maps.Geocoder | null>(null);
    const uiDivRef = useRef<HTMLDivElement | null>(null);



    // Inner Functions
    function clearCursorMarker() {
        if (markerRef.current) markerRef.current.position = null;
    }

    // Geocode the location and zoom onto it
    function geocode(request: google.maps.GeocoderRequest) {
        if (!geocoderRef.current || !mapCanvasRef.current || !markerRef.current) return;
        geocoderRef.current
            .geocode(request, (results, status) => {
                if (status == google.maps.GeocoderStatus.OK && results) {
                    mapCanvasRef.current!.setZoom(8)
                    mapCanvasRef.current!.setCenter(results[0].geometry.location);
                    markerRef.current!.position = results[0].geometry.location;
                    return results;
                } else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
                    alert("Location not found on Google Map.");
                }
            })
            .catch((e) => {
                console.error("Geocode was not successful for the following reason: " + e);
            });
    }

    // Initialize and paint the map with objects. Memoize to avoid re-initialization.
    const initMap = useCallback(
        (history: Coordinate[]) => {
        // Load the Google Maps API
        loader
        .importLibrary('core')
        .then( async () => {
            // geocode the countryCode or LatLng, centre the map on visitor's country
            const {Geocoder} = await loader.importLibrary('geocoding')
            geocoderRef.current = new Geocoder()
            let mapOptions = { ...DEFAULT_MAP_OPTIONS }
            if (isNewSession) {
                if (geoLat && geoLong) {
                    mapOptions.center = {lat: geoLat, lng: geoLong};
                    setMapCenter(mapOptions.center);
                }
                else if (detectedCountry) {
                    await geocoderRef.current.geocode({ address: detectedCountry}, (results, status) => {
                        if (status === google.maps.GeocoderStatus.OK && results) {
                            const location = results[0].geometry.location;
                            mapOptions.center = { lat: location.lat(), lng: location.lng() }
                            setMapCenter(mapOptions.center);
                        }
                    });
                }
            } else {
                mapOptions.center = mapCenter;
                mapOptions.zoom = mapZoom;
            }
            // Focus and add markers
            const { Map } = await loader.importLibrary('maps')
            mapOptions.fullscreenControlOptions = {position: google.maps.ControlPosition.BOTTOM_LEFT}
            mapCanvasRef.current = new Map(mapRef.current!, mapOptions);
            populateMarkers(mapCanvasRef.current, history)
            // Orange pin for user's location
            const { AdvancedMarkerElement, PinElement} = await loader.importLibrary('marker');
            const pinBackground = new PinElement({
                background: '#FBBC04',
            });
            markerRef.current = new AdvancedMarkerElement({
                map: mapCanvasRef.current, 
                position: mapOptions.center, 
                title: 'You',
                content: pinBackground.element});

            // Geocode UI
            // Remove previous UI div if it exists
            if (uiDivRef.current && mapCanvasRef.current) {
                // Remove from controls array
                const controlsArray = mapCanvasRef.current.controls[google.maps.ControlPosition.TOP_LEFT];
                const idx = controlsArray.getArray().indexOf(uiDivRef.current);
                if (idx !== -1) {
                    controlsArray.removeAt(idx);
                }
            }

            const uiDiv = document.createElement('div');
            uiDiv.classList.add(styles.div)
            uiDivRef.current = uiDiv; // Save reference

            const inputText = document.createElement("input");
            inputText.type = "text";
            inputText.placeholder = "Enter a location";
            inputText.classList.add(styles.input)
            inputText.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    searchButton.click();
                }
            });
            
            const searchButton = document.createElement("input");
            searchButton.type = "button";
            searchButton.value = "Search";
            searchButton.classList.add(styles.input, styles.buttonPrimary);

            const submitButton = document.createElement("input");
            submitButton.type = "button";
            submitButton.value = "Submit";
            submitButton.classList.add(styles.input, styles.buttonSecondary);
          
            uiDiv.appendChild(inputText)
            uiDiv.appendChild(searchButton)
            uiDiv.appendChild(submitButton)
            mapCanvasRef.current.controls[google.maps.ControlPosition.TOP_LEFT].push(uiDiv);

            // Set Event Listeners
            mapCanvasRef.current.addListener("click", (e: google.maps.MapMouseEvent) => {
                geocode({ location: e.latLng });
            });
            searchButton.addEventListener("click", () =>
                geocode({ address: inputText.value })
            );
            submitButton.addEventListener("click", async () => {
                if (markerRef.current && markerRef.current.position) {
                    let new_lat: number =  typeof markerRef.current.position.lat === 'function' ? markerRef.current.position.lat() : markerRef.current.position.lat;
                    let new_lng: number =  typeof markerRef.current.position.lng === 'function' ? markerRef.current.position.lng() : markerRef.current.position.lng;
                    // add to Cloud Firestore 
                    try {
                        addPin({lat: new_lat, lng: new_lng},{ 
                            onSuccess: () => {
                                queryClient.invalidateQueries({
                                    queryKey: ['mapHistory']
                                }).then(() => {
                                    setMapCenter({lat:new_lat, lng:new_lng})
                                    // get current map zoom 
                                    const currentZoom = mapCanvasRef.current?.getZoom() || 1;
                                    setMapZoom(currentZoom);
                                    clearCursorMarker()
                                }).then(() => {
                                    setIsNewSession(false)
                                })
                            },
                            onError: (e) => { console.error(e) }
                        })
                    } catch (e) {
                        console.error("Error adding document: ", e);
                    }
                }
            });
        })
        .catch((e) => {
            // do something
            console.error(e)
        });
    }, // useCallback dependencies
        [detectedCountry, geoLat, geoLong, addPin, isNewSession, mapCenter, mapZoom]
    )

    function populateMarkers(map: google.maps.Map, history: Coordinate[]) {
        loader.importLibrary('core')
        .then( async () => {
            const { AdvancedMarkerElement } = await loader.importLibrary('marker');
            let oldMarkers = history.map((latlng) => {
                return new AdvancedMarkerElement({ position: latlng })
            })
            new MarkerClusterer({markers: oldMarkers, map: map})
        })
    }

    // Effect: Initialize map as soon as mapRef is available, and update when history loads
    useEffect(() => {
        if (!mapRef.current) return;
        initMap(history);
    }, [mapRef, history, mapDataIsLoading, mapDataError, initMap]); 

    // return Map component
    return <div style={{ width: "100%", height: "400px", minWidth: "20em"}} ref={mapRef} />;
}
