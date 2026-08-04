'use client';

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-8 w-full">
      <div className="relative">
        {/* Outer 3D Ring */}
        <div className="h-12 w-12 md:h-14 md:w-14 rounded-full border- border-white/10 border-t-white animate-spin shadow-[0_0_20px_rgba(255,255,255,0.15)]"></div>
        {/* Inner Pulse */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-6 md:h-7 md:w-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 animate-pulse shadow-[0_0_20px_rgba(124,58,237,0.5)]"></div>
        </div>
      </div>
      <p className="text- md:text-xs text-gray-500 mt-3 tracking-widest animate-pulse">VELRYA AI</p>
    </div>
  );
}
