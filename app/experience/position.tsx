import Link from "next/link";
import Card from "../components/card";
import { Experience } from './experiences'

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
                className="m-2 underline hover:text-blue-900">
                <h3>{props.company}</h3>
            </Link>
            <div className="text-gray-500">{props.startDate} ({props.duration})</div>
            <p className="px-3 font-normal text-justify">
                {props.jobDescription}
            </p>
            <p><strong>Tech used:</strong><br/>{tech_stack}</p>
            <p><strong>Tags:</strong><br/>{tags}</p>
        </Card>
    )
}