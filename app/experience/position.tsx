import Link from "next/link"
import Image from "next/image"
import Card from "../components/card"
import { Experience } from './experiences'

/**
 * A modern position card with improved styling.
 * @param Experience props
 * @returns JSX.Element
 */
export default function Position(props: Experience) {
    return (
        <Card>
            {/* Job Title */}
            <h2 className='text-xl font-bold text-slate-700 mb-2'>
                {props.jobTitle}
            </h2>

            {/* Company Info */}
            <Link
                href={props.companyHref || ""}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center mb-3"
            >
                <div className="relative overflow-hidden rounded-xl p-4 bg-white shadow-sm group-hover:shadow-md transition-shadow duration-200">
                    <Image
                        src={props.companyLogoHref}
                        width={180}
                        height={180}
                        alt="company_logo"
                        className="transition-transform duration-200 group-hover:scale-105"
                    />
                </div>
                <h3 className="mt-2 text-blue-600 font-medium group-hover:text-blue-800 transition-colors">
                    {props.company}
                </h3>
            </Link>

            {/* Date & Duration */}
            <div className="text-sm text-slate-500 mb-3">
                <span className="font-medium">{props.startDate}</span>
                <span className="mx-2">•</span>
                <span>{props.duration}</span>
            </div>

            {/* Description */}
            <p className="px-2 text-sm text-slate-600 text-justify leading-relaxed">
                {props.jobDescription}
            </p>

            {/* Tech Stack */}
            <div className="mt-4 w-full">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tech Stack</span>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {props.techs.map((t) => (
                        <span key={t} className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full">
                            {t}
                        </span>
                    ))}
                </div>
            </div>

            {/* Tags */}
            <div className="mt-3 w-full">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tags</span>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {props.tags.map((t) => (
                        <span key={t} className="px-3 py-1 text-xs font-medium bg-purple-50 text-purple-600 rounded-full">
                            {t}
                        </span>
                    ))}
                </div>
            </div>
        </Card>
    )
}
