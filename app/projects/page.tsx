import Card from "../components/card"
import Link from "next/link"
import Image from "next/image"
import { all_projects } from "./projects"

/**
 * Renders the project page with modern card design.
 * @returns JSX.Element
 */
export default function ProjectPage() {
    const projects = all_projects.map((p, idx) => {
        const isDisabled = !p.href;

        return (
            <Card
                key={p.name}
                className="animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
                aria-disabled={isDisabled}
                aria-label={isDisabled ? `${p.name} - Currently unavailable` : p.name}
            >
                {/* Project Header */}
                <h2 className='w-full text-xl font-bold text-slate-700 mb-4'>
                    {p.name}
                </h2>

                {/* Project Image & CTA */}
                <div className="w-full max-w-md">
                    {p.href ? (
                        <Link href={p.href} className="block group">
                            <div className="relative overflow-hidden rounded-xl mb-4">
                                <Image
                                    className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                                    src={p.imageHref}
                                    width={500}
                                    height={300}
                                    alt={p.imageAlt}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <span className="btn-primary w-full block text-center">
                                {p.buttonDescription}
                            </span>
                        </Link>
                    ) : (
                        <div className="opacity-60" role="status" aria-label="Project unavailable">
                            <div className="relative overflow-hidden rounded-xl mb-4">
                                <Image
                                    className="w-full h-auto grayscale"
                                    src={p.imageHref}
                                    width={500}
                                    height={300}
                                    alt={p.imageAlt}
                                />
                            </div>
                            <div className="w-full py-3 px-6 rounded-full bg-slate-300 text-slate-500 text-center font-medium">
                                {p.buttonDescription}
                            </div>
                        </div>
                    )}
                </div>

                {/* Description */}
                <p className="mt-4 text-slate-600 text-sm">{p.description}</p>

                {/* Tech Stack */}
                <div className="mt-4 w-full">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tech Stack</span>
                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                        {p.techs.map((t) => (
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
                        {p.tags.map((t) => (
                            <span key={t} className="px-3 py-1 text-xs font-medium bg-purple-50 text-purple-600 rounded-full">
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
            </Card>
        )
    })

    return (
        <div className="w-full">
            <h1 className="mb-6 animate-fade-in">Projects</h1>
            {projects}
        </div>
    );
}