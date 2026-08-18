"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Helper to get storage keys
const getStorageKeys = (embeddingType: string) => ({
    uuid: `chatbot_v2_uuid_${embeddingType}`,
    messages: `chatbot_v2_messages_${embeddingType}`,
});

const getInitialMessage = () => ({
    role: 'assistant',
    content: `Hi! I am Peter's AI chatbot. I can do multi-step reasoning and tool calling to help you ` +
        `with your questions. Tools available currently are: RAG (retrieval augmented generation), number ` +
        `addition, average calculation. Ask away!`
});

// Accept embedding prop from parent
export default function ChatbotPage({ embedding = 'gemini' }: { embedding?: string }) {
    const initialMessage = getInitialMessage();

    // Initialize with consistent default values to avoid hydration mismatch
    const [messages, setMessages] = useState<Array<{ role: string, content: string }>>([initialMessage]);
    const [uuid, setUuid] = useState<string>('');
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [embeddingState, setEmbeddingState] = useState<string>(embedding);
    const isInitialized = useRef(false);

    // Restore state from localStorage after mount (client-only)
    useEffect(() => {
        if (isInitialized.current && embeddingState === embedding) return;

        const keys = getStorageKeys(embedding);

        // Restore or create UUID for this embedding
        let currentUuid = localStorage.getItem(keys.uuid);
        if (!currentUuid) {
            currentUuid = new Date().toISOString() + uuidv4();
            localStorage.setItem(keys.uuid, currentUuid);
        }
        setUuid(currentUuid);

        // Restore messages for this embedding, or reset to initial
        const storedMessages = localStorage.getItem(keys.messages);
        if (storedMessages) {
            try {
                const parsed = JSON.parse(storedMessages);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setMessages(parsed);
                } else {
                    setMessages([initialMessage]);
                }
            } catch (e) {
                console.error('Failed to parse stored messages:', e);
                setMessages([initialMessage]);
            }
        } else {
            setMessages([initialMessage]);
        }

        setInput('');
        setEmbeddingState(embedding);
        isInitialized.current = true;
    }, [embedding]); // eslint-disable-line react-hooks/exhaustive-deps

    // Persist messages to localStorage whenever they change
    useEffect(() => {
        if (!isInitialized.current) return;
        if (embeddingState && messages.length > 0) {
            const keys = getStorageKeys(embeddingState);
            localStorage.setItem(keys.messages, JSON.stringify(messages));
        }
    }, [messages, embeddingState]);

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const aiResponseRef = useRef<string>('');

    const scrollToBottom = useCallback(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, []);

    useEffect(() => {
        // Scroll to the bottom when messages change
        scrollToBottom();
    }, [messages, scrollToBottom]);

    async function sendMessage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!input.trim()) return;
        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);
        try {
            const res = await fetch('/api/chatv2', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newMessages,
                    llm: 'gemini',
                    useV1: embeddingState === 'openai',
                    threadId: uuid
                }),
            });
            if (!res.body) throw new Error('No response body');
            const reader = res.body.getReader();
            aiResponseRef.current = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                aiResponseRef.current += new TextDecoder().decode(value);
                setMessages((msgs) => {
                    // If last message is assistant, update it; otherwise, add new
                    if (msgs[msgs.length - 1]?.role === 'assistant') {
                        return [
                            ...msgs.slice(0, -1),
                            { role: 'assistant', content: aiResponseRef.current },
                        ];
                    } else {
                        return [
                            ...msgs,
                            { role: 'assistant', content: aiResponseRef.current },
                        ];
                    }
                });
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setMessages((msgs) => [
                ...msgs,
                { role: 'assistant', content: 'Sorry, there was an error.' },
            ]);
        }
    }

    function resetConversation() {
        const newUuid = new Date().toISOString() + uuidv4();
        const keys = getStorageKeys(embeddingState);

        // Clear localStorage and set new UUID
        localStorage.setItem(keys.uuid, newUuid);
        localStorage.setItem(keys.messages, JSON.stringify([initialMessage]));

        // Reset state
        setUuid(newUuid);
        setMessages([initialMessage]);
        setInput('');
    }

    return (
        <div className="w-full mx-auto p-4">
            <h1 className="text-2xl font-bold mb-2">Chatbot</h1>
            <button
                onClick={resetConversation}
                className="bg-red-200 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors mb-4"
                title="Clear conversation and start fresh"
            >
                Reset Conversation
            </button>
            <div
                ref={chatContainerRef}
                className="w-full h-96 overflow-y-auto border rounded p-4 bg-white mb-4 flex flex-col"
            >
                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={
                            (m.role === 'user'
                                ? 'text-right ml-8 mb-2' // left margin for user
                                : 'text-left mr-8 mb-2') // right margin for assistant
                        }
                    >
                        <div
                            className={
                                (m.role === 'user'
                                    ? 'bg-blue-100'
                                    : 'bg-gray-100') +
                                ' px-2 py-1 rounded inline-block text-left'
                            }
                        >
                            {typeof m.content === 'string'
                                ? m.content.split('\n').map((line, idx) => (
                                    <span key={idx}>
                                        {line}
                                        {idx < m.content.split('\n').length - 1 && <br />}
                                    </span>
                                ))
                                : m.content}
                        </div>
                    </div>
                ))}
                {loading && <div className="text-gray-400">Chat Agent is thinking...</div>}
            </div>
            <form onSubmit={sendMessage} className="flex gap-2">
                <input
                    className="flex-1 border rounded px-2 py-1 bg-white"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={loading}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-1 rounded disabled:opacity-50"
                    type="submit"
                    disabled={loading || !input.trim()}
                >
                    Send
                </button>
            </form>
        </div>
    );
}
