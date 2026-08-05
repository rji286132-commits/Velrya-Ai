'use client';
import { useEffect, useRef, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { Eye, Code, Download, Copy, Check } from 'lucide-react';

export function Preview({ chatId = null }: { chatId?: string | null }) {
  const chatData: any = useChat();
  const messages = chatData?.messages || [];
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [js, setJs] = useState('');
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const last = messages.filter((m: any) => m.role === 'assistant').pop();
    if (last) {
      const content = last.content;
      const htmlMatch = content.match(/```html\n([\s\S]*?)\n```/);
      const cssMatch = content.match(/```css\n([\s\S]*?)\n```/);
      const jsMatch = content.match(/```javascript\n([\s\S]*?)\n```/);
      if (htmlMatch) setHtml(htmlMatch[1]);
      if (cssMatch) setCss(cssMatch[1]);
      if (jsMatch) setJs(jsMatch[1]);
    }
  }, [messages]);

  useEffect(() => {
    if (iframeRef.current && html) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(`<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`);
        doc.close();
      }
    }
  }, [html, css, js]);

  const copyCode = async () => {
    await navigator.clipboard.writeText(html || css || js || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!chatId) {
    return (
      <div className="h-full min-h-[300px] w-full flex items-center justify-center bg-[#0f0f18]/50 backdrop-blur p-6">
        <div className="text-center">
          <div className="w-14 h-14 rounded-xl bg-[#12121f] border border-white/10 flex items-center justify-center mx-auto mb-3 text-2xl shadow-[0_8px_20px_rgba(0,0,0,0.4)]">🖥️</div>
          <p className="text-gray-400 text-sm">Start a chat in Velrya AI to preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-[400px] md:min-h-0 w-full flex flex-col bg-[#08080f] border-l border-white/10">
      <div className="border-b border-white/10 p-2 md:p-3 flex items-center justify-between bg-[#0f0f18]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex gap-1 bg-[#1c1c2e] rounded-full p-1 border border-white/10">
          <button onClick={() => setView('preview')} className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${view === 'preview'? 'bg-white text-black shadow' : 'text-gray-400 hover:text-white'}`}>
            <Eye className="h-3.5 w-3.5" /> Preview
          </button>
          <button onClick={() => setView('code')} className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${view === 'code'? 'bg-white text-black shadow' : 'text-gray-400 hover:text-white'}`}>
            <Code className="h-3.5 w-3.5" /> Code
          </button>
        </div>
        <div className="flex gap-1">
          <button onClick={copyCode} className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition">
            {copied? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
          <button
            onClick={() => {
              const blob = new Blob([`<!DOCTYPE html><html><head><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`], { type: 'text/html' });
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = 'velrya-ai-website.html';
              a.click();
            }}
            className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {view === 'preview'? (
          <div className="h-full w-full bg-white">
            {html? <iframe ref={iframeRef} className="w-full h-full border-0" title="Velrya AI Preview" /> : <div className="h-full flex items-center justify-center text-gray-500 text-sm p-6 text-center">No website generated yet in Velrya AI</div>}
          </div>
        ) : (
          <div className="h-full overflow-auto p-3 md:p-4 bg-[#08080f] space-y-4">
            {html && (
              <div className="bg-[#12121f]/80 border border-white/10 rounded-xl overflow-hidden">
                <div className="text-[11px] font-bold text-gray-400 px-3 py-2 border-b border-white/10">HTML • VELRYA AI</div>
                <pre className="p-3 text-xs text-gray-300 overflow-auto max-h-[400px]"><code>{html}</code></pre>
              </div>
            )}
            {css && (
              <div className="bg-[#12121f]/80 border border-white/10 rounded-xl overflow-hidden">
                <div className="text-[11px] font-bold text-gray-400 px-3 py-2 border-b border-white/10">CSS</div>
                <pre className="p-3 text-xs text-gray-300 overflow-auto max-h-[400px]"><code>{css}</code></pre>
              </div>
            )}
            {js && (
              <div className="bg-[#12121f]/80 border border-white/10 rounded-xl overflow-hidden">
                <div className="text-[11px] font-bold text-gray-400 px-3 py-2 border-b border-white/10">JavaScript</div>
                <pre className="p-3 text-xs text-gray-300 overflow-auto max-h-[400px]"><code>{js}</code></pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Preview;
