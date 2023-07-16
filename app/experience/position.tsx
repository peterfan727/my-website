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
    return (
        <Paper 
            elevation={2} 
            className="w-full py-2 px-3 my-1 bg-sky-100">
            {<div className="p-3">
                <div className='w-full bg-sky-400 p-1'>
                        <div>{props.startDate}</div><div>{props.duration}</div>
                </div>
                <h3 className="pt-1 no-underline font-bold">{props.jobTitle}</h3>
                <Link   
                    href={props.companyHref || ""} 
                    className="underline hover:text-blue-900">
                    {props.company}
                </Link>
                <p className="font-normal text-justify">{props.jobDescription}</p>
                <p><strong>Tech used:</strong><br/>{tech_stack}</p>
                <p><strong>Tags:</strong><br/>{tags}</p>
            </div>}
        </Paper>
    )
}