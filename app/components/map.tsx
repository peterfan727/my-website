'use client'

import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import styles from './map.module.css'

const history = [
    { lat: -31.56391, lng: 147.154312 },
    { lat: -33.718234, lng: 150.363181 },
    { lat: -33.727111, lng: 150.371124 },
    { lat: -33.848588, lng: 151.209834 },
    { lat: -33.851702, lng: 151.216968 },
    { lat: -34.671264, lng: 150.863657 },
    { lat: -35.304724, lng: 148.662905 },
    { lat: -36.817685, lng: 175.699196 },
    { lat: -36.828611, lng: 175.790222 },
    { lat: -37.75, lng: 145.116667 },
    { lat: -37.759859, lng: 145.128708 },
    { lat: -37.765015, lng: 145.133858 },
    { lat: -37.770104, lng: 145.143299 },
    { lat: -37.7737, lng: 145.145187 },
    { lat: -37.774785, lng: 145.137978 },
    { lat: -37.819616, lng: 144.968119 },
    { lat: -38.330766, lng: 144.695692 },
    { lat: -39.927193, lng: 175.053218 },
    { lat: -41.330162, lng: 174.865694 },
    { lat: -42.734358, lng: 147.439506 },
    { lat: -42.734358, lng: 147.501315 },
    { lat: -42.735258, lng: 147.438 },
    { lat: -43.999792, lng: 170.463352 },
  ];

const mapOptions = {
    center: {
        lat: 49.2827,       // Vancouver Lat-Lng
        lng: -123.1207
      },
    zoom: 2,
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

export default function Map() {

    const mapRef = useRef<HTMLDivElement>(null)


    let marker: google.maps.marker.AdvancedMarkerElement
    let geocoder: google.maps.Geocoder

    useEffect(() => {
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
        .importLibrary('maps')
        .then( async ({Map}) => {
            // Focus and add markers
            const map = new Map(mapRef.current!, mapOptions);
            const {Marker, AdvancedMarkerElement, PinElement} = await loader.importLibrary('marker');
            const pinBackground = new PinElement({
                background: '#FBBC04',
            });
            marker = new AdvancedMarkerElement({
                map, 
                position: mapOptions.center, 
                title: 'You',
                content: pinBackground.element});
            let oldMarkers = history.map((latlng) => {
                return new Marker({ position: latlng })
            })
            new MarkerClusterer({markers: oldMarkers, map: map})

            // Geocode
            const {Geocoder} = await loader.importLibrary('geocoding')
            geocoder = new Geocoder()
            const inputText = document.createElement("input");
            inputText.type = "text";
            inputText.placeholder = "Enter a location";
            inputText.classList.add(styles.input)
            
            const submitButton = document.createElement("input");
            submitButton.type = "button";
            submitButton.value = "Search";
            submitButton.classList.add(styles.input, styles.buttonPrimary);

            const clearButton = document.createElement("input");
            clearButton.type = "button";
            clearButton.value = "Clear";
            clearButton.classList.add(styles.input, styles.buttonSecondary);
          
            // const instructionsElement = document.createElement("p");
            // instructionsElement.id = "instructions";
            // instructionsElement.innerHTML =
            //   "Search in the textbox or click on the map.";
            // instructionsElement.classList.add(styles.instructions)
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputText);
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(submitButton);
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(clearButton);
            // map.controls[google.maps.ControlPosition.LEFT_TOP].push(instructionsElement);
            /** Inner Functions */
            function clear() {
                marker.position = null;
            }
            
            function geocode(request: google.maps.GeocoderRequest) {
                clear();
                geocoder
                    .geocode(request)
                    .then((result) => {
                        const { results } = result;
                        map.setCenter(results[0].geometry.location);
                        marker.position = results[0].geometry.location;
                        return results;
                    })
                    .catch((e) => {
                    alert("Geocode was not successful for the following reason: " + e);
                    });
            }
            map.addListener("click", (e: google.maps.MapMouseEvent) => {
                geocode({ location: e.latLng });
            });
            submitButton.addEventListener("click", () =>
                geocode({ address: inputText.value })
            );
            clearButton.addEventListener("click", () => {
                clear();
            });
            // clear();

        })
        .catch((e) => {
            // do something
            console.log(e)
        });
    }



    return <div style={{ width: "100%", height: "400px" }} ref={mapRef} />;
}
