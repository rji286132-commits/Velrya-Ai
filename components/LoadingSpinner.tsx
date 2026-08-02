'use client';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-gray-700 border-t-blue-500 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-6 rounded-full bg-blue-500/20 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}