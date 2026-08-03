"use client"
import { useState } from 'react'

export default function ChatPage(){
  const [msg, setMsg] = useState("")
  const [chats, setChats] = useState([{role:"ai", text:"Hi Deepak! I'm Velrya AI. How can I help?"}])

  const send = () => {
    if(!msg) return;
    setChats([...chats, {role:"user", text: msg}, {role:"ai", text:"This is Velrya AI response! Your app is working perfectly 🚀"}])
    setMsg("")
  }

  return (
    <div className="h-screen bg-[#0a0a0a] text-white flex flex-col">
      <div className="p-4 border-b border-zinc-800 font-bold">VELRYA AI CHAT</div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {chats.map((c,i)=><div key={i} className={c.role==='user'?'text-right':''}><span className={`inline-block p-3 rounded-2xl ${c.role==='user'?'bg-white text-black':'bg-zinc-800'}`}>{c.text}</span></div>)}
      </div>
      <div className="p-4 border-t border-zinc-800 flex gap-2">
        <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} className="flex-1 bg-zinc-900 border border-zinc-800 p-3 rounded-full outline-none" placeholder="Ask anything..." />
        <button onClick={send} className="bg-white text-black px-6 rounded-full font-bold">Send</button>
      </div>
    </div>
  )
}
