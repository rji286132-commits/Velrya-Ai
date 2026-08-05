'use client';

import { Download, Code, Share2, Upload, X } from 'lucide-react';

interface FileMenuProps {
  onClose: () => void;
  isOpen: boolean;
}

export default function FileMenu({ onClose, isOpen }: FileMenuProps) {
  if (!isOpen) return null;

  const handleDownloadHTML = () => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Built with VELRYA AI</title>
</head>
<body>
  <h1>Built with VELRYA AI</h1>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    a.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">File Options</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => alert('File upload coming soon!')}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition text-gray-700"
          >
            <Upload size={18} />
            <span>Upload File</span>
          </button>

          <button
            onClick={handleDownloadHTML}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition text-gray-700"
          >
            <Download size={18} />
            <span>Download HTML</span>
          </button>

          <button
            onClick={() => alert('ZIP download coming soon!')}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition text-gray-700"
          >
            <Download size={18} />
            <span>Download ZIP</span>
          </button>

          <button
            onClick={() => alert('Code export coming soon!')}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition text-gray-700"
          >
            <Code size={18} />
            <span>Export Code</span>
          </button>

          <button
            onClick={() => alert('Share link coming soon!')}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition text-gray-700"
          >
            <Share2 size={18} />
            <span>Share Link</span>
          </button>
        </div>
      </div>
    </div>
  );
}