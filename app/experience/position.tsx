import Link from "next/link"
import Image from "next/image"
import Card from "../components/card"
import { Experience } from './experiences'

/**
 * A component that renders a position card.
 * @param \{jobTitle : string, company : string, companyHref? : string, companyLogoHref : string, startDate : string, duration : string, jobDescription : string, tags : string[], techs : string[]\} : Experience
 * @returns JSX.Element
 */
export default function Position( props: Experience ) {
    const tags = props.tags.map( (value, index, arr) => {
        const len = arr.length
        const sep = index < (len-1) ? ", ": ""
        return (value + sep)
    })
    const tech_stack = props.techs.map( (value, index, arr) => {
        const len = arr.length
        const sep = index < (len-1) ? ", ": ""
        return (value + sep)
    })
    return (
        <Card>
            <div className='w-full bg-sky-400 p-1'>
                <h2 className="pt-1">{props.jobTitle}</h2>
            </div>
            <Link   
                href={props.companyHref || ""} 
                className="m-2 flex flex-col items-center justify-center
                hover:text-blue-900">
                <h3 className="underline">{props.company}</h3>
                <Image 
                    src={props.companyLogoHref}
                    width={200}
                    height={200}
                    alt="company_logo"
                />
            </Link>
            <div className="text-gray-500">{props.startDate} ({props.duration})</div>
            <p className="px-3 font-normal text-justify">
                {props.jobDescription}
            </p>
            <p><strong>Tech Stack:</strong><br/>{tech_stack}</p>
            <p><strong>Tags:</strong><br/>{tags}</p>
        </Card>
    )
}
