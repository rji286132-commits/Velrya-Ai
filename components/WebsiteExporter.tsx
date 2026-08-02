'use client';
import { Download, Share2, Globe } from 'lucide-react';

interface WebsiteExporterProps {
  html: string;
  css: string;
  js: string;
}

export function WebsiteExporter({ html, css, js }: WebsiteExporterProps) {
  const exportWebsite = () => {
    const fullHTML = `<!DOCTYPE html><html><head><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`;
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2">
      <button onClick={exportWebsite} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm flex items-center gap-2">
        <Download className="h-4 w-4" /> Export
      </button>
      <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm flex items-center gap-2">
        <Share2 className="h-4 w-4" /> Share
      </button>
      <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm flex items-center gap-2">
        <Globe className="h-4 w-4" /> Publish
      </button>
    </div>
  );
}