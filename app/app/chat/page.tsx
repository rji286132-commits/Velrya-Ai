"use client"
import { useState } from 'react'
import Link from 'next/link'

export default function ChatPage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi Deepak! 👋 Main Velrya AI hu. Batao kya help chahiye?" }
  ])

  const sendMessage = () => {
    if (!input.trim()) return
    const newMsgs = [...messages, { role: "user", text: input }, { role: "ai", text: "Velrya AI soch raha hai... 🤔 \n\nTumhara app ab 100% working hai! Ab isko main real AI se connect kar dunga!" }]
    setMessages(newMsgs)
    setInput("")
  }

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white">
      {/* Sidebar */}
      <div className="w-[260px] bg-[#171717] border-r border-zinc-800 p-4 hidden md:flex flex-col">
        <Link href="/" className="font-bold text-xl mb-6">VELRYA AI</Link>
        <button className="bg-white text-black p-3 rounded-full font-bold text-sm">+ New Chat</button>
        <div className="mt-6 text-xs text-zinc-500">History</div>
        <div className="mt-2 text-sm bg-zinc-800 p-3 rounded-xl">Welcome Chat</div>
        <Link href="/login" className="mt-auto text-sm text-zinc-400">← Logout</Link>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user'? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-4 rounded-2xl ${m.role === 'user'? 'bg-white text-black rounded-br-sm' : 'bg-zinc-800 rounded-bl-sm'}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-zinc-800">
          <div className="max-w-3xl mx-auto flex gap-2 bg-zinc-900 border border-zinc-800 p-2 rounded-full">
            <input
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==='Enter' && sendMessage()}
              placeholder="Ask anything to Velrya AI..."
              className="flex-1 bg-transparent outline-none px-4"
            />
            <button onClick={sendMessage} className="bg-white text-black px-6 py-2 rounded-full font-bold">Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}
