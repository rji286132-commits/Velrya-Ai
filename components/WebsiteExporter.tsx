'use client';
import { Download, Share2, Globe } from 'lucide-react';

interface WebsiteExporterProps {
  html: string;
  css: string;
  js: string;
}

export function WebsiteExporter({ html, css, js }: WebsiteExporterProps) {
  const exportWebsite = () => {
    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="generator" content="VELRYA AI">
<title>Built with VELRYA AI</title>
<style>${css}</style>
</head>
<body>${html}<script>${js}<\/script></body>
</html>`;
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'velrya-ai-website.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const text = 'Built with VELRYA AI - https://velrya-ai.vercel.app';
    if (navigator.share) {
      await navigator.share({ title: 'VELRYA AI Website', text });
    } else {
      await navigator.clipboard.writeText(text);
      alert('Link copied! - VELRYA AI');
    }
  };

  return (
    <div className="flex flex-wrap gap-2 w-full">
      <button onClick={exportWebsite} className="px-4 md:px-5 py-2.5 bg-white hover:bg-gray-200 rounded-full text-black text-sm font-bold flex items-center gap-2 shadow-[0_4px_16px_rgba(255,255,255,0.15)] active:scale-[0.98] transition-all">
        <Download className="h-4 w-4" /> Export
      </button>
      <button onClick={handleShare} className="px-4 md:px-5 py-2.5 bg-[#12121f] border border-white/10 hover:bg-white/10 rounded-full text-white text-sm font-semibold flex items-center gap-2 transition-all">
        <Share2 className="h-4 w-4" /> Share
      </button>
      <button
        onClick={() => window.open('https://vercel.com/new', '_blank')}
        className="px-4 md:px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-full text-white text-sm font-bold flex items-center gap-2 shadow-[0_4px_20px_rgba(124,58,237,0.4)] active:scale-[0.98] transition-all"
      >
        <Globe className="h-4 w-4" /> Publish
      </button>
    </div>
  );
}
