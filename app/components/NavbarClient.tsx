"use client"
import dynamic from "next/dynamic"

// Dynamically import the Navbar with SSR disabled
const DynamicNavbar = dynamic(() => import("./navbar"), { ssr: false })

export default function NavbarClient() {
  return <DynamicNavbar />
}
