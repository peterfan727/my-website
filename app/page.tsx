import Country from "./components/country"
import Map from "./components/map"
import { headers } from "next/headers"

export default function HomePage() {
  const headersList = headers()
  const code = headersList.get('X-Geo-Country')
  const country = Country(code || undefined)
  return(
    <section>
      <h1>👋 Hello! Bonjour! Hola! 你好!</h1>
      {/* if country is not undefined, have this component rendered, else empty */}
      {country ?  (<p>Visitor from {country}! </p>) : null}
      <p>
        Welcome to my humble software developer portfolio
      </p>
      <p>
        Feel free to pin your city on the map to let me know where you are from!
      </p>
      <Map />
    </section>
  )
}
