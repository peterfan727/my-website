'use client'

import { useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import styles from './map.module.css'
import { queryClient, useMapQuery, useAddMapHistory } from "./useMapQuery";

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

export default function Map( props: MapProps ) {
    // props
    let detectedCountry = props.country

    // Hooks
    const mapRef = useRef<HTMLDivElement>(null);
    // Bundle to prevent error

    // Get map history from Firestore
    const {  data: history, isLoading: mapDataIsLoading, error: mapDataError } = useMapQuery()
    // set up useMutation
    const { mutate: addPin, isSuccess: addPinSuccess, isError: addPinError} = useAddMapHistory()
    
    // Variables
    let mapCanvas: google.maps.Map
    let mapOptions = DEFAULT_MAP_OPTIONS
    let marker: google.maps.marker.AdvancedMarkerElement
    let geocoder: google.maps.Geocoder


    if (mapDataIsLoading || !history || mapDataError) {
        if (typeof window !== 'undefined') {
            initMap(loader, [])
            if (mapDataError) console.error(mapDataError)
        }
    }
    if (history) {
        if (typeof window !== 'undefined') {
            initMap(loader, history)
        }
    }
    // return Map component
    return <div style={{ width: "100%", height: "400px", minWidth: "20em"}} ref={mapRef} />;


    // Inner Functions
    function clearCursorMarker() {
        marker.position = null;
    }

    // Geocode the location and zoom onto it
    function geocode(request: google.maps.GeocoderRequest) {
        geocoder
            .geocode(request, (results, status) => {
                if (status == google.maps.GeocoderStatus.OK && results) {
                    mapCanvas.setZoom(8)
                    mapCanvas.setCenter(results[0].geometry.location);
                    marker.position = results[0].geometry.location;
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
            geocoder = new Geocoder()
            if (detectedCountry) {
                await geocoder.geocode({ address: detectedCountry}, (results, status) => {
                    if (status === google.maps.GeocoderStatus.OK && results) {
                        const location = results[0].geometry.location;
                        mapOptions.center.lat = location.lat()
                        mapOptions.center.lng = location.lng()
                    }
                });
            }
            
            // Focus and add markers
            const { Map } = await loader.importLibrary('maps')
            mapOptions.fullscreenControlOptions = {position: google.maps.ControlPosition.BOTTOM_LEFT}
            mapCanvas = new Map(mapRef.current!, mapOptions);
            populateMarkers(loader, mapCanvas, history)
            // Orange pin for user's location
            const { AdvancedMarkerElement, PinElement} = await loader.importLibrary('marker');
            const pinBackground = new PinElement({
                background: '#FBBC04',
            });
            marker = new AdvancedMarkerElement({
                map: mapCanvas, 
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
            mapCanvas.controls[google.maps.ControlPosition.TOP_LEFT].push(uiDiv);

            // Set Event Listeners
            mapCanvas.addListener("click", (e: google.maps.MapMouseEvent) => {
                geocode({ location: e.latLng });
            });
            searchButton.addEventListener("click", () =>
                geocode({ address: inputText.value })
            );
            submitButton.addEventListener("click", async () => {
                if (marker.position) {
                    let new_lat: number =  typeof marker.position.lat === 'function' ? marker.position.lat() : marker.position.lat;
                    let new_lng: number =  typeof marker.position.lng === 'function' ? marker.position.lng() : marker.position.lng;
                    // add to Cloud Firestore 
                    try {
                        addPin({lat: new_lat, lng: new_lng},{ 
                            onSuccess: () => {
                                    queryClient.invalidateQueries({queryKey: ['mapHistory']})
                                    .then(() => {
                                        mapCanvas.setZoom(8)
                                        mapOptions.center = {lat:new_lat, lng:new_lng}
                                        mapCanvas.setCenter(mapOptions.center)
                                        clearCursorMarker()
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
            const {Marker} = await loader.importLibrary('marker');
            let oldMarkers = history.map((latlng) => {
                return new Marker({ position: latlng })
            })
            new MarkerClusterer({markers: oldMarkers, map: map})
        })
    }
}
