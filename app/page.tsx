import Country from "./components/country"
import { headers } from "next/headers"
import Link from "next/link";
import Map from "./components/map";

// const DynamicMap = dynamic(() => import('./components/map'), { 
//     ssr: false,
//     loading: () => <p>Loading...</p>
// })

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
            <Link href="/projects/chatbot">
                <div className="
                    my-3 p-6 rounded drop-shadow-2xl
                    text-white bg-blue-600 hover:bg-blue-800 
                ">
                    🤖 Talk to my GPT chatbot! 
                </div>
            </Link>
            <Map country={country}/>
        </>
    )
}
