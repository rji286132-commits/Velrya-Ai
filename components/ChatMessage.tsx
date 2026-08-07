'use client';
import type { Message } from '@/types';

export default function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`w-full px-4 py-5 border-b border-black/[0.06] ${isUser? 'bg-white' : 'bg-[#f7f7f8]'}`}>
      <div className="max-w-3xl mx-auto flex gap-3">
        <div className={`w-7 h-7 rounded-full grid place-items-center text-[11px] font-bold shrink-0 ${isUser? 'bg-zinc-200 text-zinc-700' : 'bg-black text-white'}`}>
          {isUser? 'U' : 'V'}
        </div>
        <div className="flex-1 min-w-0 whitespace-pre-wrap break-words text-[14.5px] leading-7 text-zinc-800">{message.content}</div>
      </div>
    </div>
  );
}
