'use client'

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import styles from './map.module.css'

type Coordinate = {
    lat : number ,
    lng : number 
}

type MapProps = {
    history: Coordinate[],
    country?: string,
}

export default function Map( props: MapProps ) {
    // props
    let detectedCountry = props.country

    const [ history, setHistory ] = useState<Coordinate[]>(props.history);
    const [ hasSubmitted, setHasSubmitted ] = useState(false)
    const mapRef = useRef<HTMLDivElement>(null)
    const VANCOUVER = { lat: 49.2827, lng: -123.1207 }

    let mapOptions = {
        center: VANCOUVER,
        zoom: 1,
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        restriction: {
            latLngBounds: {north: 85, south: -85, west: -180, east: 180},
            strictBounds: true,
        },
    }
    let marker: google.maps.marker.AdvancedMarkerElement
    let geocoder: google.maps.Geocoder

    useEffect(() => {
        console.log('useEffect called')
        if (!mapRef.current) return;
        initMap()
    }, [history]);

    function initMap() {
        const loader = new Loader({
            apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
            version: "weekly",
        });
        
        // Load the Google Maps API
        loader
        .importLibrary('core')
        .then( async () => {
            // geocode the countryCode first
            const {Geocoder} = await loader.importLibrary('geocoding')
            geocoder = new Geocoder()
            if (detectedCountry && !hasSubmitted) {
                console.log("ip-header country")
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
            const map = new Map(mapRef.current!, mapOptions);
            const {Marker, AdvancedMarkerElement, PinElement} = await loader.importLibrary('marker');
            const pinBackground = new PinElement({
                background: '#FBBC04',
            });
            if (!hasSubmitted) {
                marker = new AdvancedMarkerElement({
                    map, 
                    position: mapOptions.center, 
                    title: 'You',
                    content: pinBackground.element});
            }
            let oldMarkers = history.map((latlng) => {
                return new Marker({ position: latlng })
            })
            new MarkerClusterer({markers: oldMarkers, map: map})

            // Geocode UI
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
          
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputText);
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchButton);
            if (!hasSubmitted) {
                map.controls[google.maps.ControlPosition.TOP_LEFT].push(submitButton);
            }

            /** Inner Functions */
            function clear() {
                marker.position = null;
            }
            
            function geocode(request: google.maps.GeocoderRequest) {
                geocoder
                    .geocode(request, (results, status) => {
                        if (status == google.maps.GeocoderStatus.OK && results) {
                            map.setZoom(4)
                            map.setCenter(results[0].geometry.location);
                            if (!hasSubmitted) {
                                marker.position = results[0].geometry.location;
                            }
                            return results;
                        } else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
                            alert("Location not found on Google Map.");
                        }
                    })
                    .catch((e) => {
                        console.log("Geocode was not successful for the following reason: " + e);
                    });
            }
            map.addListener("click", (e: google.maps.MapMouseEvent) => {
                geocode({ location: e.latLng });
            });
            searchButton.addEventListener("click", () =>
                geocode({ address: inputText.value })
            );
            submitButton.addEventListener("click", () => {
                if (marker.position && !hasSubmitted) {
                    let lat = marker.position.lat;
                    let lng = marker.position.lng;
                    let newHistory = [...history, {lat, lng}];
                    mapOptions.center = {lat, lng};
                    setHistory(newHistory);
                    setHasSubmitted(true);
                    clear();
                } else if (hasSubmitted) {
                    alert("Already submitted a location.");
                }
            });
        })
        .catch((e) => {
            // do something
            console.log(e)
        });
    }
    // return Map component
    return <div style={{ width: "100%", height: "400px" }} ref={mapRef} />;
}
