'use client'

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import styles from './map.module.css'
import { db } from '../firebase/firebaseConfig'
import { collection, addDoc, getDocs } from "firebase/firestore"; 
import { QueryClient, useQuery} from "@tanstack/react-query";

type Coordinate = {
    lat : number ,
    lng : number 
}

type MapProps = {
    country?: string,
}

const queryClient = new QueryClient()
const getMapHistory = async() => {
    const querySnapshot = await getDocs(collection(db, "map_history"));
    const history: Coordinate[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const lat = data.lat;
        const lng = data.lng;
        return { lat, lng };
    });
    return history;
}

export default function Map( props: MapProps ) {
    // props
    let detectedCountry = props.country

    // Get map history from Firestore
    const { data: history, error } = useQuery<Coordinate[]>({
        queryKey: ['mapHistory'], 
        queryFn: getMapHistory,
        initialData: [],
    }, queryClient) 
    if (error) {
        console.error(error)
    }

    const [ hasSubmitted, setHasSubmitted ] = useState(false) // TODO: use Cookie

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
        fullscreenControlOptions: {},
        restriction: {
            latLngBounds: {north: 85, south: -85, west: -180, east: 180},
            strictBounds: true,
        },
    }
    let marker: google.maps.marker.AdvancedMarkerElement
    let geocoder: google.maps.Geocoder

    // Rerender Map when history is updated
    useEffect(() => {
        if (!mapRef.current) return;
        initMap(history)
    }, [history]);

    function initMap(history: Coordinate[]) {
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
            if (!hasSubmitted) {
                uiDiv.appendChild(submitButton)
            }
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(uiDiv);

            // Inner Functions 
            function clearCursorMarker() {
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
                        console.error("Geocode was not successful for the following reason: " + e);
                    });
            }

            // Event Listeners
            map.addListener("click", (e: google.maps.MapMouseEvent) => {
                geocode({ location: e.latLng });
            });
            searchButton.addEventListener("click", () =>
                geocode({ address: inputText.value })
            );
            submitButton.addEventListener("click", async () => {
                if (marker.position && !hasSubmitted) {
                    let new_lat: number =  typeof marker.position.lat === 'function' ? marker.position.lat() : marker.position.lat;
                    let new_lng: number =  typeof marker.position.lng === 'function' ? marker.position.lng() : marker.position.lng;
                    // add to Cloud Firestore 
                    try {
                        addDoc(collection(db, "map_history"), {
                          lat: new_lat,
                          lng: new_lng
                        }).then( (_docRef) => {
                            // update UI
                            queryClient.fetchQuery({
                                queryKey: ['mapHistory'], 
                                queryFn: getMapHistory}
                            )
                        }).then( (_data) => {
                            mapOptions.center = {lat:new_lat, lng:new_lng};
                            setHasSubmitted(true)
                            clearCursorMarker()
                        });
                    } catch (e) {
                        console.error("Error adding document: ", e);
                    }
                } else if (hasSubmitted) {
                    alert("Already submitted a location.");
                }
            });
        })
        .catch((e) => {
            // do something
            console.error(e)
        });
    }
    // return Map component
    return <div style={{ width: "100%", height: "400px", minWidth: "20em"}} ref={mapRef} />;
}
