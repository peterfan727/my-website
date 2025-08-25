'use client';

import ChatbotPage from './chatbot';
import { useState, useEffect } from 'react';

export default function Page() {
    const [embedding, setEmbedding] = useState('gemini');

    // On mount or when URL changes, sync embedding from URL
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const urlEmbedding = params.get('embedding') || 'gemini';
            setEmbedding(urlEmbedding);
        }
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value;
        setEmbedding(value);
        // Refresh page with new embedding param
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            params.set('embedding', value);
            window.location.search = params.toString();
        }
    }

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
