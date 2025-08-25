import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { TextLoader } from "langchain/document_loaders/fs/text";


const aboutPageTextLoader = new TextLoader("../../../about/page.tsx");
const aboutPageSplitter = new RecursiveCharacterTextSplitter({
	chunkSize: 800,
	chunkOverlap: 0,
	separators: ["</p>", "\n\n", "\n", " ", ""]
});

const projectPageTextLoader = new TextLoader("../../../projects/projects.tsx");
const projectPageSplitter = new RecursiveCharacterTextSplitter({
	chunkSize: 800,
	chunkOverlap: 0,
	separators: ["const", "\n\n", "\n", " ", ""]
});

const transcriptTextLoader = new TextLoader("./private_docs/SFU_transcript.txt");
const transcriptSplitter = new RecursiveCharacterTextSplitter({
	chunkSize: 500,
	chunkOverlap: 0,
});

const resumeTextLoader = new TextLoader("./private_docs/Resume.txt");
const resumeSplitter = new RecursiveCharacterTextSplitter({
	chunkSize: 1000,
	chunkOverlap: 500,
});

export async function loadAboutPageDocs(): Promise<[string, Document[]]> {
	const aboutPageDocs: Document[] = await aboutPageTextLoader.load();
	let aboutPageChunks = await aboutPageSplitter.splitDocuments(aboutPageDocs);
	aboutPageChunks = aboutPageChunks.map((chunk) => {
		chunk.pageContent = chunk.pageContent.replace(/<[^>]+>/g, "");
		chunk.metadata.source = "Peter Fan's About Page";
		chunk.metadata.tags = ["about", "interests", "education", "hobbies", "aspirations", "goals"];
		return chunk;
	});
	return ["about", aboutPageChunks];
}

export async function loadProjectPageDocs(): Promise<[string, Document[]]> {
	const projectPageDocs: Document[] = await projectPageTextLoader.load();
	let projectPageChunks = await projectPageSplitter.splitDocuments(projectPageDocs);
	projectPageChunks = projectPageChunks.map((chunk) => {
		chunk.metadata.source = "Peter Fan's Projects Page";
		chunk.metadata.tags = ["personal coding projects", "portfolio", "github", "coding", "tech stack"];
		return chunk;
	});
	return ["projects", projectPageChunks];
}

export async function loadTranscriptDocs(): Promise<[string, Document[]]> {
	const transcriptDocs: Document[] = await transcriptTextLoader.load();
	// It's better to also attach a non-split version of the transcript for larger context
	let transcriptUnsplit = transcriptDocs.map((doc) => {
		doc.metadata.source = "SFU Transcript";
		doc.metadata.tags = ["courses", "grades", "academic history", "GPA", "degree"];
		return doc;
	});
	let transcriptChunks = await transcriptSplitter.splitDocuments(transcriptDocs);
	transcriptChunks = transcriptChunks.map((chunk) => {
		chunk.metadata.source = "SFU Transcript";
		chunk.metadata.tags = ["courses", "grades", "academic history", "GPA", "degree"];
		return chunk;
	})
	return ["transcript", [...transcriptChunks, ...transcriptUnsplit]];
}

export async function loadResumeDocs(): Promise<[string, Document[]]> {
	const resumeDocs: Document[] = await resumeTextLoader.load();
	let resumeChunks = await resumeSplitter.splitDocuments(resumeDocs);
	resumeChunks = resumeChunks.map((chunk) => {
		chunk.metadata.source = "Peter Fan's Resume";
		chunk.metadata.tags = ["resume", "work experience", "education", "skills", "projects", "internships"];
		return chunk;
	});
	return ["resume", resumeChunks];
}

export async function loadAllDocsWithNamespaces(): Promise<[string, Document[]][]> {
	const loaders = [
		loadAboutPageDocs,
		loadProjectPageDocs,
		loadTranscriptDocs,
		loadResumeDocs
	];
	const results: [string, Document[]][] = [];
	for (const loader of loaders) {
		const tuple = await loader();
		results.push(tuple);
	}
	return results;
}
