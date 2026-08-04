'use client';
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('Velrya AI Error:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h- w-full flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#12121f]/80 backdrop-blur-xl border border-red-500/20 rounded- p-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">⚠️</span>
            </div>
            <h3 className="text-white font-bold">Oops! Something broke</h3>
            <p className="text-gray-400 text-sm mt-1">Velrya AI encountered an error. Please refresh the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-5 py-2.5 rounded-full bg-white text-black font-bold text-sm hover:bg-gray-200 transition shadow-[0_4px_16px_rgba(255,255,255,0.2)] active:scale-[0.98]"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
