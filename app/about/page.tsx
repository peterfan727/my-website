import { Avatar } from "@mui/material";
import { Paper } from "@mui/material";

export default function AboutPage() {
    return (
        <>
            <h1>About Me</h1>
            <Avatar
                className="mt-6"
                alt="Peter Fan"
                src="/me.jpeg"
                sx={{width:200, height: 200}}
            />
            <p>
                I&apos;m not quite Peter &quot;Pan&quot;, but people often say I don&apos;t look my age.
            </p>

            <h2 className="m-3">When I am not coding...</h2>
            <Paper
                elevation={2} 
                className="w-full py-2 px-6 my-1 bg-sky-100">
                <p>
                    I enjoy reading financial markets 📈 news and Japanese manga
                    <br/>On weekends, I like go for a long hike 🥾 ⛰️ to clear my mind
                </p>
            </Paper>
            <h2 className="m-3">People see me as...</h2>
            <Paper
                elevation={2} 
                className="w-full py-2 px-6 my-1 bg-sky-100">
                <p>
                    a helpful and resourceful friend and co-worker
                    <br/>an adventurous traveller and open to trying new things
                </p>
            </Paper>
            <h2 className="m-3">🤓 My Education Background...</h2>
            <Paper
                elevation={2} 
                className="w-full py-2 px-6 my-1 bg-sky-100">
                <ul className="px-3">
                I am an interdisciplinary scholar.<br/>
                        <li>
                            <div className="flex flex-wrap justify-center">
                                <span className="font-bold">BSc in Biochemistry 🔬&nbsp;</span><span>University of British Columbia</span>
                            </div>
                        </li>
                        <li>
                            <div className="flex flex-wrap justify-center">
                            <span className="font-bold">BSc in Computing Science 🖥️&nbsp;</span><span>Simon Fraser University</span>
                            </div>
                        </li>
                </ul>
            </Paper>
            <h2 className="m-3">Areas of Interest</h2>
            <Paper
                elevation={2} 
                className="w-full py-2 px-6 my-1 bg-sky-100">
                <h3>Machine Learning</h3>
                <p className="text-justify">
                    In this golden age of Machine Learning (ML), I am captivated by the transformative potential it holds. 
                    Having seen this field grow from the early mass-adoption of recommendation systems to transformer models, 
                    the future of ML fascinates me.
                    I am eager to utilize my current knowledge and hands-on experience in ML to drive innovative solutions. 
                    By leveraging these skills, I aim to push the boundaries of AI applications to benefit humanity and the 
                    companies I align myself with.
                </p>
            </Paper>
            <Paper
                elevation={2} 
                className="w-full py-2 px-6 my-1 bg-sky-100">
                <h3>Bioinformatics</h3>
                <p className="text-justify">
                    Bridging my background in pre-clinical drug research and my interest in big data, 
                    I find bioinformatics an exciting field.
                    My training has equipped me with a deep understanding of how to solve complex issues that 
                    traditional science faces with the help of computational tools. I am eager to harness this unique 
                    interdisciplinary expertise to revolutionize the medical field and contribute to a company that values 
                    cutting-edge, life-saving solutions.
                </p>
            </Paper>
            <Paper
                elevation={2} 
                className="w-full py-2 px-6 my-1 bg-sky-100">
                <h3>Microservices</h3>
                <p className="text-justify">
                    Microservices perfectly blend my social inclination and my problem-solving passion as 
                    a software engineer and a scientist. This field enables me to interact with professionals 
                    from various sectors, grasp their unique challenges, and engineer tailored solutions. 
                    My past experiences have honed my skills in crafting efficient, scalable, and robust solutions. 
                    Through microservices, I hope to address multifaceted problems by leveraging the power of domain-driven design.
                </p>
            </Paper>
        </>
    );
}
  