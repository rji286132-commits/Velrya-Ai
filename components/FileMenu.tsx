'use client';

import { useState } from 'react';
import { Download, Code, Share2, Upload, X, Copy, Check } from 'lucide-react';

interface FileMenuProps {
  onClose: () => void;
  isOpen: boolean;
}

export default function FileMenu({ onClose, isOpen }: FileMenuProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownloadHTML = () => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Built with VELRYA AI</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #fff; color: #000; }
    .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; text-align: center; }
    h1 { font-size: 3em; margin-bottom: 20px; }
    p { font-size: 1.2em; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h1>✨ Built with VELRYA AI</h1>
    <p>Your AI-powered website builder</p>
  </div>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onClose();
  };

  const handleDownloadZip = () => {
    const code = `project/
├── index.html
├── styles.css
├── script.js
└── assets/
    ├── images/
    └── fonts/`;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project-structure.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onClose();
  };

  const handleExportCode = () => {
    const code = `// VELRYA AI Generated Code
// Copy this to your project

const config = {
  name: 'My VELRYA Project',
  version: '1.0.0',
  author: 'VELRYA AI'
};

export default config;`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setTimeout(onClose, 1000);
  };

  const handleCopyCode = () => {
    const code = `import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    console.log('VELRYA AI App Ready');
  }, []);

  return <div>Welcome to VELRYA AI</div>;
}`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">File Options</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          <button
            onClick={() => alert('File upload - select image or document')}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition text-gray-700 text-sm font-medium"
          >
            <Upload size={18} />
            <span>Upload File</span>
          </button>

          <button
            onClick={handleDownloadHTML}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition text-gray-700 text-sm font-medium"
          >
            <Download size={18} />
            <span>Download HTML</span>
          </button>

          <button
            onClick={handleDownloadZip}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition text-gray-700 text-sm font-medium"
          >
            <Download size={18} />
            <span>Download Project</span>
          </button>

          <button
            onClick={handleExportCode}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition text-gray-700 text-sm font-medium"
          >
            <Code size={18} />
            <span>{copied ? 'Code Copied!' : 'Export Code'}</span>
          </button>

          <button
            onClick={handleCopyCode}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition text-gray-700 text-sm font-medium"
          >
            {copied ? (
              <>
                <Check size={18} />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy size={18} />
                <span>Copy Code</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              navigator.share({
                title: 'VELRYA AI Project',
                text: 'Check out this project built with VELRYA AI',
                url: window.location.href,
              }).catch(() => {
                alert('Share link: ' + window.location.href);
              });
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition text-gray-700 text-sm font-medium"
          >
            <Share2 size={18} />
            <span>Share Link</span>
          </button>
        </div>
      </div>
    </div>
  );
}