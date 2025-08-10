"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import Map from "./components/map";

export default function HomePage() {
    const [geo, setGeo] = useState({
        countryCode: undefined,
        countryFlag: undefined,
        geoLat: undefined,
        geoLong: undefined,
        city: undefined,
    });

    useEffect(() => {
        async function fetchGeo() {
            try {
                const res = await fetch("/api/geo", { cache: "no-store" });
                if (res.ok) {
                    const data = await res.json();
                    setGeo({
                        countryCode: data.countryCode,
                        countryFlag: data.countryFlag,
                        geoLat: data.latitude,
                        geoLong: data.longitude,
                        city: data.city,
                    });
                }
            } catch (e) {
                // fallback: do nothing
            }
        }
        fetchGeo();
    }, []);

    return (
        <>
            <h1>👋 Hello! Bonjour! Hola! 你好!</h1>
            <p>
                {geo.countryCode ? (
                    <>Visitor from {geo.city ? `${geo.city}, ` : ""}{geo.countryCode} {geo.countryFlag || ""}!<br/></>
                ) : null}
                Welcome to my humble software developer portfolio
                <br />Feel free to pin your city on the guestbook map!
            </p>
            <Link href="">
                <div className="
                    my-3 p-6 rounded drop-shadow-2xl
                    text-white bg-blue-600 hover:bg-blue-800 
                ">
                    🤖 GPT-5 chat bot coming soon
                </div>
            </Link>
            <Map country={geo.countryCode} lat={geo.geoLat} long={geo.geoLong} />
        </>
    );
}
