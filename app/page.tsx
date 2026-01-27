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
        <div className="w-full">
            {/* Hero Section */}
            <section className="py-8 animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    👋 Hello! Bonjour! Hola! 你好!
                </h1>

                {geo.countryCode && (
                    <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-4 animate-fade-in delay-2">
                        <span className="text-slate-600">
                            Visitor from {geo.city ? `${geo.city}, ` : ""}{geo.countryCode}
                        </span>
                        <span className="text-2xl">{geo.countryFlag || ""}</span>
                    </div>
                )}

                <p className="text-lg text-slate-500 max-w-md mx-auto">
                    Welcome to my humble software developer portfolio
                    <br />Feel free to pin your city on the guestbook map!
                </p>
            </section>

            {/* CTA Button */}
            <section className="py-6 animate-fade-in-up delay-3">
                <Link href="/projects/chatbot_v2" className="btn-primary text-lg inline-block">
                    🤖 Talk to My Chatbot (LLM Agent!)
                </Link>
            </section>

            {/* Map Section */}
            <section className="w-full py-6 animate-fade-in-up delay-4">
                <Map country={geo.countryCode} lat={geo.geoLat} long={geo.geoLong} />
            </section>
        </div>
    );
}
