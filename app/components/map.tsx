'use client'

import { useRef, useState, useEffect } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import { MarkerClusterer } from "@googlemaps/markerclusterer"
import { queryClient, useMapQuery, useAddMapHistory } from "./useMapQuery"
import styles from './map.module.css'

type Coordinate = {
    lat : number ,
    lng : number 
}

type MapProps = {
    country?: string,
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
    let detectedCountry = props.country

    // Hooks
    const mapRef = useRef<HTMLDivElement>(null);
    const [isNewSession, setIsNewSession] = useState(true)

    // Get map history from Firestore
    const {  data: history, isLoading: mapDataIsLoading, error: mapDataError } = useMapQuery()
    // set up useMutation
    const { mutate: addPin, isSuccess: addPinSuccess, isError: addPinError} = useAddMapHistory()
    
    // Variables (must be refs to persist across renders)
    const mapCanvasRef = useRef<google.maps.Map | null>(null);
    const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
    const geocoderRef = useRef<google.maps.Geocoder | null>(null);
    const [mapInitialized, setMapInitialized] = useState(false);

    // Effect: Initialize map as soon as mapRef is available, and update when history loads
    useEffect(() => {
        if (!mapRef.current || mapInitialized) return;
        // If data is loading or errored, show map with no markers
        if (mapDataIsLoading || !history || mapDataError) {
            initMap(loader, []);
            if (mapDataError) console.error(mapDataError);
            setMapInitialized(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapRef, mapDataIsLoading, history, mapDataError, mapInitialized]); // ESLint is safe to ignore for now, as initMap is a local function and not recreated on every render.

    // Effect: When history loads, re-initialize map with markers
    useEffect(() => {
        if (!mapRef.current || !history || mapDataIsLoading || mapDataError) return;
        initMap(loader, history);
        setMapInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapRef, history, mapDataIsLoading, mapDataError]); 

    // return Map component
    return <div style={{ width: "100%", height: "400px", minWidth: "20em"}} ref={mapRef} />;


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

    // Initialize and paint the map with objects
    function initMap(loader: Loader, history: Coordinate[]) {
        // Load the Google Maps API
        loader
        .importLibrary('core')
        .then( async () => {
            // geocode the countryCode from middleware first, centre the map on visitor's country
            const {Geocoder} = await loader.importLibrary('geocoding')
            geocoderRef.current = new Geocoder()
            let mapOptions = { ...DEFAULT_MAP_OPTIONS }
            if (detectedCountry && isNewSession) {
                await geocoderRef.current.geocode({ address: detectedCountry}, (results, status) => {
                    if (status === google.maps.GeocoderStatus.OK && results) {
                        const location = results[0].geometry.location;
                        mapOptions.center = { lat: location.lat(), lng: location.lng() }
                    }
                });
            }
            // Focus and add markers
            const { Map } = await loader.importLibrary('maps')
            mapOptions.fullscreenControlOptions = {position: google.maps.ControlPosition.BOTTOM_LEFT}
            mapCanvasRef.current = new Map(mapRef.current!, mapOptions);
            populateMarkers(loader, mapCanvasRef.current, history)
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
            const uiDiv = document.createElement('div');
            uiDiv.classList.add(styles.div)

            const inputText = document.createElement("input");
            inputText.type = "text";
            inputText.placeholder = "Enter a location";
            inputText.classList.add(styles.input)
            
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
                                    mapOptions.center = {lat:new_lat, lng:new_lng}
                                    mapOptions.zoom = 8
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
    }

    function populateMarkers(loader: Loader, map: google.maps.Map, history: Coordinate[]) {
        loader.importLibrary('core')
        .then( async () => {
            const { AdvancedMarkerElement } = await loader.importLibrary('marker');
            let oldMarkers = history.map((latlng) => {
                return new AdvancedMarkerElement({ position: latlng })
            })
            new MarkerClusterer({markers: oldMarkers, map: map})
        })
    }
}
