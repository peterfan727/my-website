import Country from "./components/country"
import Map from "./components/map"
import { headers } from "next/headers"

export default function HomePage() {
  const headersList = headers()
  const code = headersList.get('X-Geo-Country')
  const country = Country(code || undefined)
  return(
    <>
        <h1>👋 Hello! Bonjour! Hola! 你好!</h1>
        <p>
          {country ?  <>Visitor from {country}! <br/></> : null}
          Welcome to my humble software developer portfolio
          <br/>Feel free to pin your city on the guestbook map!
        </p>
        <Map  country={country}/>
    </>
  )
}
