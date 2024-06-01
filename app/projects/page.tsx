import Card from "../components/card"
import Link from "next/link"
import Image from "next/image"
import { all_projects } from "./projects"

/**
 * Renders the project page.
 * @returns JSX.Element
 */
export default function ProjectPage() {

    const projects = all_projects.map((p) => {
        return (
        <Card key={p.name}>
                <h2 className='w-full bg-sky-400 p-1'>
                    {p.name}
                </h2>
                <Link href={p.href}>
                    <Image 
                    className="hover:shadow-xl mt-3"
                    src={p.imageHref} width={500} height={300} 
                    alt={p.imageAlt}/>
                    <div className="
                    my-3 p-6 rounded drop-shadow-2xl
                    text-white bg-blue-600 hover:bg-blue-800 
                    ">
                    {p.buttonDescription} 
                    </div>
                </Link>
                <p>{p.description}</p>
                <p><strong>Tech Stack:<br/></strong>
                {p.techs.map((t, idx, t_arr)=> {
                    if (idx == t_arr.length - 1)
                        return (<span key={"span_" + idx}>{t}</span>)
                    else
                        return (<span key={"span_" + idx}>{t}, </span>)
                })}
                </p>
                <p><strong>Tags:<br/></strong>
                {p.tags.map((t, idx, t_arr)=> {
                    if (idx == t_arr.length - 1)
                        return (<span key={"span_" + idx}>{t}</span>)
                    else
                        return (<span key={"span_" + idx}>{t}, </span>)
                })}</p>
        </Card>)
    })


    return (
        <>
            <h1>Projects</h1>
            {projects}
        </>
    );
}