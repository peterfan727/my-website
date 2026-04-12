'use client';

import ChatbotPage from './chatbot';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ChatbotPageContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [embedding, setEmbedding] = useState('gemini');

    // On mount or when searchParams change, sync embedding from URL
    useEffect(() => {
        const urlEmbedding = searchParams.get('embedding') || 'gemini';
        setEmbedding(urlEmbedding);
    }, [searchParams]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setEmbedding(value);
        // Use Next.js router to update URL with client-side navigation
        const params = new URLSearchParams(searchParams.toString());
        params.set('embedding', value);
        router.push(`${pathname}?${params.toString()}`);
    }, [router, pathname, searchParams]);

    return (
        <div className="w-full mx-auto p-4">
            <div className="mb-4">
                <div className="mb-2 text-gray-700">
                    Choose between the old OpenAi-Ada-002 embedding and the new Gemini-embedding-001 to see how much improvement has been made in V2.
                    <br/>For example, &quot;What courses have Peter taken?&quot; works much better with the new embedding.
                </div>
                <select
                    className="border rounded px-2 py-1 bg-white"
                    value={embedding}
                    onChange={handleChange}
                >
                    <option value="gemini">Gemini-embedding-001 (V2, Recommended)</option>
                    <option value="openai">OpenAi-Ada-002 (V1, Old)</option>
                </select>
            </div>
            <ChatbotPage embedding={embedding} />
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<div className="w-full mx-auto p-4">Loading...</div>}>
            <ChatbotPageContent />
        </Suspense>
    );
}
