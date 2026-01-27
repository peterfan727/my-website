import Image from "next/image";
import me from "../../public/me.jpeg";
import Card from "../components/card";

export default function AboutPage() {
    return (
        <div className="w-full">
            <h1 className="mb-6 animate-fade-in">About Me</h1>

            {/* Profile Image with glow effect */}
            <div className="relative inline-block animate-fade-in-up delay-1">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 blur-xl opacity-30 animate-pulse"></div>
                <Image
                    className="relative rounded-full ring-4 ring-white shadow-xl"
                    src={me}
                    alt='Peter Fan'
                    width={200}
                    height={200}
                    priority
                />
            </div>

            <p className="mt-4 text-lg animate-fade-in-up delay-2">
                I&apos;m not quite Peter &quot;Pan&quot;, but people often say I don&apos;t look my age.
            </p>

            <h2 className="mt-8 mb-4 animate-fade-in-up delay-3">When I am not coding...</h2>
            <Card className="delay-3">
                <p className="text-center">
                    I am an avid gym-goer. Healthy body, healthy mind.️
                    <br />On weekends, I like go for a drive to clear my mind.
                </p>
            </Card>

            <h2 className="mt-6 mb-4">People see me as...</h2>
            <Card>
                <p className="text-center">
                    A helpful and resourceful friend and co-worker.
                    <br />An adventurous traveller and open to trying new things.
                </p>
            </Card>

            <h2 className="mt-6 mb-4">🤓 My Education Background</h2>
            <Card>
                <ul className="space-y-3 list-none p-0">
                    <li className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-1">
                        <span className="font-bold text-blue-600">BSc in Computing Science 🖥️</span>
                        <span className="text-slate-500">Simon Fraser University, Canada 🇨🇦</span>
                    </li>
                    <li className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-1">
                        <span className="font-bold text-blue-600">BSc in Biochemistry 🔬</span>
                        <span className="text-slate-500">University of British Columbia, Canada 🇨🇦</span>
                    </li>
                </ul>
            </Card>

            <h2 className="mt-6 mb-4">Areas of Interest</h2>

            <Card>
                <h3 className="text-lg font-semibold text-blue-600 mb-2">🤖 AI Engineering & Agentic Workflows</h3>
                <p className="text-justify text-slate-600">
                    I specialize in building LLM Agents and RAG (Retrieval-Augmented Generation) architectures.
                    Beyond simple prompting, I am focused on creating autonomous, goal-oriented systems that leverage tools,
                    multi-step reasoning, and long-term memory. My current work at Siemens EDA involves deploying AI agents to
                    automate complex semiconductor design workflows, demonstrating the tangible impact of AI in specialized industrial domains.
                </p>
            </Card>

            <Card>
                <h3 className="text-lg font-semibold text-purple-600 mb-2">☁️ Distributed Systems & Cloud-Native Architecture</h3>
                <p className="text-justify text-slate-600">
                    To support large-scale AI and data workloads, I am passionate about designing scalable microservices and
                    resilient cloud infrastructure. I focus on building systems that handle massive data throughput while maintaining
                    high availability and low latency. My experience spans from developing real-time ROS stacks for robotics to
                    orchestrating high-performance ML pipelines in the cloud.
                </p>
            </Card>

            <Card>
                <h3 className="text-lg font-semibold text-teal-600 mb-2">🔬 Computational Science & Data Analytics</h3>
                <p className="text-justify text-slate-600">
                    Leveraging my dual background in Computing Science and Biochemistry, I apply data-driven approaches
                    to solve complex analytical problems. I build robust data pipelines and use computational
                    modeling to extract insights from large-scale datasets. Whether optimizing algorithms
                    or analyzing data, I thrive on turning raw data into actionable engineering solutions.
                </p>
            </Card>


        </div>
    );
}