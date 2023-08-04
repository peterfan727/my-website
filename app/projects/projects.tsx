export type Project = {
    name: string,
    description: string,
    href: string,
    imageHref: string,
    imageAlt: string,
    buttonDescription: string,
    tags: string[],
    techs: string[],
}

const chatbot: Project = {
    name: "GPT Chatbot",
    description: `
    I engineered a GPT chatbot that can answer questions about myself. 
    Through this hobby project, I learned how to use OpenAI's API and the Langchain framework to create a vectorized knowledge base (KB), host the vectorized KB on a vector database, and query the database using a Conversational Q&A Chain. It was a fun project that taught me a lot about the challenges in prompt engineering and the importance of a good knowledge base using structured data.
    `,
    href: "/chatbot",
    imageHref: "/previews/chatbot.png",
    imageAlt: "chatbot_screenshot",
    buttonDescription: '🤖 Try the chatbot!',
    tags: ["AI", "Chatbot", "OpenAI", "LLM", "Prompt Engineering"],
    techs: ["Langchain", "OpenAI", "Python", "React", "Pinecone"],
}

const website: Project = {
    name: "NextJS Website",
    description: `
    Instead of using a cut-and-paste template, I decided to build my website from scratch using NextJS and Tailwind CSS. I learned a lot about server-side versus client-side rendering, edge computing, and different web app hosting solutions.
    `, 
    href: "/",
    imageHref: "/previews/website.png",
    imageAlt: "website_screenshot",
    buttonDescription: '👨‍💻 Link to Homepage',
    tags: ["Web Development", "RESTful API"],
    techs: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Firebase"],
}

export const all_projects = [chatbot, website]