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

const chatbot_v2: Project = {
    name: "LLM Agent Chatbot",
    description: `
    Since the my last time building a chatbot, the field of Agentic AI has advanced significantly. 
    In this project, I built a chatbot using a multi-step, reasoning LLM that can use various tools 
    (ie. RAG tool, math tool, etc.) to better answer the user's question. The chatbot can also remember 
    past interactions, making it more conversational and personalized.`,
    href: "/projects/chatbot_v2",
    imageHref: "/previews/chatbot_v2.png",
    imageAlt: "chatbot_v2_screenshot",
    buttonDescription: '🤖 Talk to My Chatbot (LLM Agent)',
    tags: ["AI", "Chatbot", "LLM Agent", "RAG", "Tool Calling"],
    techs: ["LangGraph", "OpenAI", "Google Gemini", "ReAct Agent", "Pinecone"],
}

const chatbot: Project = {
    name: "GPT-3 Chatbot (deprecated)",
    description: `
    I engineered a RAG LLM chatbot that can answer questions about myself. Through this hobby project, 
    I learned how to use OpenAI's embedding model and the Langchain framework to create a vectorized knowledge 
    base (KB), host the vectorized knowledge on a vector database, and query the database using a Conversational 
    Q&A Chain. It was a fun project that taught me a lot about the challenges in prompt engineering and the 
    importance of a good knowledge base using structured data.`,
    href: "",
    imageHref: "/previews/chatbot.png",
    imageAlt: "chatbot_screenshot",
    buttonDescription: '🤖 This version is deprecated',
    tags: ["AI", "Chatbot", "OpenAI", "LLM", "Prompt Engineering", "RAG"],
    techs: ["Langchain", "OpenAI", "Python", "React", "Pinecone"],
}

const website: Project = {
    name: "NextJS Website",
    description: `
    Instead of using a cut-and-paste template, I decided to build my website from scratch using NextJS 
    and Tailwind CSS. I learned a lot about server-side versus client-side rendering, edge computing, 
    and different web app hosting solutions.`, 
    href: "/",
    imageHref: "/previews/website.png",
    imageAlt: "website_screenshot",
    buttonDescription: '👨‍💻 Link to Homepage',
    tags: ["Web Development", "RESTful API"],
    techs: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Firebase"],
}

export const all_projects = [chatbot_v2, chatbot, website]