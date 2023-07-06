import Country from "./components/country"

export default function HomePage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const code = searchParams['country'] 
  const country = Country(code)
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
    </section>
  )
}
