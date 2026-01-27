import Timeline from "./timeline"
import Image from "next/image"
import tech_stack_meme from "../../public/tech_stack_meme.jpg"

/**
 * Renders the experience page with modern styling.
 * @returns JSX.Element
 */
export default function ExperiencePage() {
    return (
        <div className="w-full">
            <h1 className="mb-6 animate-fade-in">Work Experience</h1>

            {/* Fun meme with improved styling */}
            <div className="animate-fade-in-up delay-1 mb-6">
                <div className="glass-card p-4 inline-block">
                    <Image
                        className="rounded-lg"
                        src={tech_stack_meme}
                        alt='a pancake tech stack meme: so you wanna know what I can stack'
                        width={400}
                        priority
                    />
                </div>
            </div>

            {/* Timeline */}
            <div className="animate-fade-in-up delay-2">
                <Timeline />
            </div>
        </div>
    );
}