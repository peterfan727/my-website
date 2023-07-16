import MuiTimeline from "./mui_timeline";
import tech_stack_meme from "../../public/tech_stack_meme.jpg";
import Image from "next/image";

export default function ExperiencePage() {
    return (
        <>
            <h1>Work Experience</h1>
            <Image 
                className="mt-6"
                src={tech_stack_meme}
                alt='a pancake tech stack meme: so you wanna know what I can stack'
                priority 
            />
            <MuiTimeline />
        </>
    );
}