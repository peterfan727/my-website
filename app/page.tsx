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
        {country ?  (<p>Visitor from {country}! </p>) : null}
        <p>Welcome to my humble software developer portfolio</p>
        <p>Feel free to pin your city on the Guestbook map!</p>
        <Map country={country}/>
    </section>
  )
}
