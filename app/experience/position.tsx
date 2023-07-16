import Link from "next/link";
import { Paper } from "@mui/material";
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

    const content = 
        <div>
            <h3 className="no-underline font-bold">{props.jobTitle}</h3>
            <Link   
                href={props.companyHref || ""} 
                className="underline hover:text-blue-900">
                {props.company}
            </Link>
            <p className="font-semibold">{props.jobDescription}</p>
            <p><strong>Tech used:</strong><br/>{tech_stack}</p>
            <p><strong>Tags:</strong><br/>{tags}</p>
        </div>

    return (
        <Paper 
            elevation={2} 
            className="w-full py-2 px-3 bg-cyan-300 bg-opacity-20" 
            children={content}
        />
    )
}