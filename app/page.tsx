'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Chat() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('velrya_user') || localStorage.getItem('user');
    if (!user) router.push('/login');
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: userMsg }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: data.response || 'No response from AI' },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: '❌ Error: Something went wrong' },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#08080f] text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 border-b border-gray-800">
        <Link href="/" className="text-xl font-bold">🔥 VELRYA AI</Link>
        <button
          onClick={() => {
            localStorage.removeItem('velrya_user');
            localStorage.removeItem('user');
            router.push('/login');
          }}
          className="text-sm text-gray-400 hover:text-white"
        >
          Logout
        </button>
      </nav>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 max-w-3xl mx-auto w-full space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-2xl font-bold text-white">Start chatting</h2>
            <p className="text-sm">Ask anything to VELRYA AI</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl max-w-[80%] ${
                msg.role === 'user'
                  ? 'bg-white text-black ml-auto'
                  : 'bg-[#1c1c2e] mr-auto'
              }`}
            >
              {msg.content}
            </div>
          ))
        )}
        {loading && (
          <div className="bg-[#1c1c2e] p-4 rounded-xl max-w-[80%] text-gray-400 animate-pulse">
            AI is thinking...
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-800 p-4 bg-[#0f0f1a]">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask anything..."
            className="flex-1 bg-[#1c1c2e] border border-gray-700 p-3 rounded-xl outline-none text-white"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-200 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
