'use client'
 
import { useChat } from 'ai/react'
import { useState, useRef, useEffect } from 'react';
import { db } from '../../firebase/firebaseConfig'
import { Timestamp, doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore"; 
import { v4 as uuidv4 } from 'uuid';
import { Message } from 'ai';

const MESSAGE_LIMIT = 20;
const FIREBASE_COLLECTION_NAME : string= 'chat_sessions'

export default function Chat() {
    // helper callback function to update chat history after AI stream finishes
    const onAiStreamFinishCb = async(m : Message) => {
        await updateDoc(doc(db, FIREBASE_COLLECTION_NAME, uuid), {
            chat_history : arrayUnion({
                id: m.id,
                role: m.role,
                content: m.content,
                createdAt: m.createdAt ? Timestamp.fromDate(m.createdAt) : null,
                name: m.name || null,
                function: m.function_call?.toString() || null,
            })
        })
    }

    const [uuid, setUuid] = useState<string>(new Date().toISOString() + uuidv4())
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        id:uuid,
        onFinish(message) {
            onAiStreamFinishCb(message)
        },
        onError(error) {
            console.error(error)
        },
    })
    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Scroll to the bottom when messages change
        if (chatContainerRef.current != null) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
        // Log chat history of human input to Firebase
        const updateHistory = async() => {
            if (messages.length == 1) {
                const m = messages.findLast(m => m.role === 'user')
                // initialize a new Doc on Firestore
                await setDoc(doc(db, FIREBASE_COLLECTION_NAME, uuid), {
                    chat_history:[{
                        id: m!.id,
                        role: m!.role,
                        content: m!.content,
                        createdAt: m!.createdAt != undefined ? Timestamp.fromDate(m!.createdAt) : null,
                        name: m!.name || null,
                        function: m!.function_call?.toString() || null,
                    }]
                })
            } else if (messages.length > 1) {
                // update Doc on Firestore
                const m = messages.findLast(m => m.role === 'user')
                await updateDoc(doc(db, FIREBASE_COLLECTION_NAME, uuid), {
                    chat_history: arrayUnion({
                        id: m!.id,
                        role: m!.role,
                        content: m!.content,
                        createdAt: m!.createdAt != undefined ? Timestamp.fromDate(m!.createdAt) : null,
                        name: m!.name || null,
                        function: m!.function_call?.toString() || null,
                    })
                })
            }
        }
        updateHistory();
    }, [messages]);

  return ( 
    <div ref={chatContainerRef} 
        className="w-full h-[36rem] overflow-y-scroll py-5 flex flex-col bg-sky-100">
        <p className='m-2'>Disclaimer:<br/>Unexpected behaviour can happen. AI can generate false information.<br/>Chat history is monitored to prevent abuse.<br/>Max 20 questions per session.</p>
        {messages.map( m => (
            <div
                key={m.id + m.role} 
                className={"flex flex-row " + 
                (m.role === 'user' ? 'self-start': 'self-end')}>
                {m.role === 'user' ? <label className="m-2">User</label> : null} 
                <div key={m.id} 
                    className={"w-fit my-2 p-2 border-2 border-black rounded text-left " + 
                    (m.role === 'user' ? 'mr-10 bg-white ' : 'ml-10 bg-green-300 ')}>
                    {m.content}
                </div>
                {m.role === 'assistant' ? <label className="m-2">AI</label> : null} 
            </div>
            
        ))}
        {(messages.length >= MESSAGE_LIMIT) ? <p className='m-2'>Sorry Message Limit Reached</p> : null}
        <form 
        onSubmit={handleSubmit}
        className='w-full flex flex-row bottom-0 left-0 right-0 sticky'>
            <input
                className="w-full p-5 border border-gray-300 rounded shadow-xl"
                placeholder={messages.length >= MESSAGE_LIMIT ? 'Sorry message limit reached.' : 'Ask the AI assistant about Peter'}
                value={input}
                contentEditable="true"
                onChange={handleInputChange}
            />
            <button type="submit" 
                disabled={messages.length >= MESSAGE_LIMIT ? true : false}
                className={'w-fit p-5 border border-gray-300 rounded shadow-xl text-white ' + (messages.length >= MESSAGE_LIMIT ? 'bg-gray-500':'bg-blue-600')}>
                Send
            </button>
        </form>
    </div>
    
    
  )
}