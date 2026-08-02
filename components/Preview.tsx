'use client';
import { useEffect, useRef, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { Eye, Code, Download, Copy, Check } from 'lucide-react';

export function Preview({ chatId }: { chatId: string | null }) {
  const { messages } = useChat();
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [js, setJs] = useState('');
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const last = messages.filter(m => m.role === 'assistant').pop();
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
        doc.write(`<!DOCTYPE html><html><head><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`);
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
      <div className="h-full flex items-center justify-center text-gray-400">
        <div className="text-center"><div className="text-4xl mb-2">🖥</div><p>Start a chat to preview</p></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="border-b border-gray-800 p-2 flex items-center justify-between">
        <div className="flex gap-1 bg-gray-800 rounded p-0.5">
          <button onClick={() => setView('preview')} className={`px-2 py-1 rounded text-xs ${view === 'preview' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>
            <Eye className="h-3 w-3 inline" /> Preview
          </button>
          <button onClick={() => setView('code')} className={`px-2 py-1 rounded text-xs ${view === 'code' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>
            <Code className="h-3 w-3 inline" /> Code
          </button>
        </div>
        <div className="flex gap-1">
          <button onClick={copyCode} className="text-gray-400 hover:text-white p-1">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
          <button onClick={() => { const blob = new Blob([html], { type: 'text/html' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'index.html'; a.click(); }} className="text-gray-400 hover:text-white p-1">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex-1">
        {view === 'preview' ? (
          <div className="h-full bg-white">{html ? <iframe ref={iframeRef} className="w-full h-full" /> : <div className="h-full flex items-center justify-center text-gray-400"><p>No website generated yet</p></div>}</div>
        ) : (
          <div className="h-full overflow-auto p-4 bg-gray-950 space-y-4">
            {html && <div><div className="text-xs font-medium text-gray-400">HTML</div><pre className="bg-gray-800 p-3 rounded text-xs text-gray-300"><code>{html}</code></pre></div>}
            {css && <div><div className="text-xs font-medium text-gray-400">CSS</div><pre className="bg-gray-800 p-3 rounded text-xs text-gray-300"><code>{css}</code></pre></div>}
            {js && <div><div className="text-xs font-medium text-gray-400">JavaScript</div><pre className="bg-gray-800 p-3 rounded text-xs text-gray-300"><code>{js}</code></pre></div>}
            {!html && !css && !js && <div className="h-full flex items-center justify-center text-gray-400"><p>No code generated</p></div>}
          </div>
        )}
      </div>
    </div>
  );
}