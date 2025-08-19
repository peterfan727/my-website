// 'use client'
 
// import { useChat } from '@ai-sdk/react'
// import { useState, useRef, useEffect } from 'react'
// import { db } from '../../firebase/firebaseConfig'
// import { Timestamp, doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore"
// import { v4 as uuidv4 } from 'uuid'
// import { DefaultChatTransport, UIMessage } from 'ai'

// const MESSAGE_LIMIT = 20;
// const FIREBASE_COLLECTION_NAME : string= 'chat_sessions'

// /**
//  * Extracts the message content from a UIMessage instance.
//  * @param message UIMessage
//  * @returns string
//  */
// export function extractUIMessageContent(message: UIMessage): string {
//     if (!message.parts || message.parts.length === 0) return ''

//     message.parts.forEach(part => {
//       switch (part.type) {
//         case 'text':
//           console.log('Text:', part.text);
//           return part.text;
//         // catch other cases
//         default:
//           console.log('Unhandled Message Type received:', part.type);
//       }
//     })
//     return ''
// }

// /**
//  * Create a new chat session on Firebase
//  */
// async function createChatSession(uuid: string, message: UIMessage) {
//     await setDoc(doc(db, FIREBASE_COLLECTION_NAME, uuid), {
//         chat_history: [{
//             id: message.id,
//             role: message.role,
//             content: extractUIMessageContent(message),
//             createdAt: message.metadata?.timestamp ? Timestamp.fromDate(message.metadata.timestamp) : null,
//         }]
//     })
// }

// /**
//  * Update an existing chat session on Firebase
//  */
// async function updateChatSession(uuid: string, message: UIMessage) {
//     await updateDoc(doc(db, FIREBASE_COLLECTION_NAME, uuid), {
//         chat_history: arrayUnion({
//             id: message.id,
//             role: message.role,
//             content: extractUIMessageContent(message),
//             createdAt: message.metadata?.timestamp ? Timestamp.fromDate(message.metadata.timestamp) : null,
//         })
//     })
// }


// /**
//  * The chat component that uses the useChat hook to interact with the AI assistant.
//  * @returns JSX.Element
//  */
// export default function Chat() {
//     // Chat session uuid
//     const [ uuid, setUuid] = useState<string>(new Date().toISOString() + uuidv4())
//     const [ input, setInput] = useState<string>('')

//     const chatContainerRef = useRef<HTMLDivElement | null>(null);

//     // helper callback function to update chat history after AI stream finishes
//     const onAiStreamFinishCb = async(m : UIMessage) => {
//         await updateChatSession(uuid, m);
//     }

//     const { messages, sendMessage, status } = useChat({
//         transport: new DefaultChatTransport({
//             api: 'api/chatv2',
//         }),
//         id: uuid,
//         onFinish: ({ message }: { message: UIMessage }) => {
//             if (message) {
//                 onAiStreamFinishCb(message);
//             }
//         },
//         onError(error) {
//             console.error(error)
//         },
//     })

//     useEffect(() => {
//         // Scroll to the bottom when messages change
//         if (chatContainerRef.current != null) {
//             chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//         }
//         // Log chat history of human input to Firebase
//         const updateHistory = async() => {
//             if (messages.length == 1) {
//                 const m = messages.findLast(m => m.role === 'user')
//                 // initialize a new Doc on Firestore
//                 await createChatSession(uuid, m!);
//             } else if (messages.length > 1) {
//                 // update Doc on Firestore
//                 const m = messages.findLast(m => m.role === 'user')
//                 await updateChatSession(uuid, m!);
//             }
//         }
//         updateHistory();
//     }, [messages, uuid]);

//   return ( 
//     <div ref={chatContainerRef} 
//         className="w-full h-[36rem] overflow-y-scroll py-5 flex flex-col bg-sky-100">
//         <p className='m-2'>Disclaimer:<br/>Unexpected behaviour can happen. AI can generate false information.<br/>Chat history is monitored to prevent abuse.<br/>Max 20 questions per session.</p>
//         {messages.map( m => (
//             <div
//                 key={m.id + m.role} 
//                 className={"flex flex-row " + 
//                 (m.role === 'user' ? 'self-start': 'self-end')}>
//                 {m.role === 'user' ? <label className="m-2">User</label> : null} 
//                 <div key={m.id} 
//                     className={"w-fit my-2 p-2 border-2 border-black rounded text-left " + 
//                     (m.role === 'user' ? 'mr-10 bg-white ' : 'ml-10 bg-green-300 ')}>
//                     {m.parts.map((part, index) => 
//                         part.type === 'text' ? <span key={index}>{part.text}</span> : null,
//                     )}
//                 </div>
//                 {m.role === 'assistant' ? <label className="m-2">AI</label> : null} 
//             </div>
            
//         ))}
//         {(messages.length >= MESSAGE_LIMIT) ? <p className='m-2'>Sorry Message Limit Reached</p> : null}
//         <form 
//         onSubmit={(e) => {
//             e.preventDefault();
//             if (input.trim()) {
//                 sendMessage({ text: input});
//             }
//         }}
//         className='w-full flex flex-row bottom-0 left-0 right-0 sticky'>
//             <input
//                 className="w-full p-5 border border-gray-300 rounded shadow-xl"
//                 placeholder={messages.length >= MESSAGE_LIMIT ? 'Sorry message limit reached.' : 'Ask the AI assistant about Peter'}
//                 value={input}
//                 contentEditable="true"
//                 onChange={(e) => setInput(e.target.value)}
//                 disabled={status != 'ready'}
//             />
//             <button type="submit" 
//                 disabled={messages.length >= MESSAGE_LIMIT ? true : false}
//                 className={'w-fit p-5 border border-gray-300 rounded shadow-xl text-white ' + (messages.length >= MESSAGE_LIMIT ? 'bg-gray-500':'bg-blue-600')}>
//                 Send
//             </button>
//         </form>
//     </div>
//   )
// }
