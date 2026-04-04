'use client';

import { useEffect } from 'react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Admin Error]', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-6">
      <div className="w-full max-w-lg bg-[#111109] border border-red-500/20 p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-5">
          <span className="material-symbols-outlined text-red-400 text-[28px]">cloud_off</span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-400 mb-0.5">Admin Error</p>
            <h2 className="text-lg font-display font-bold text-white leading-tight">
              Could not load this page
            </h2>
          </div>
        </div>

        <p className="text-sm text-slate-400 leading-relaxed mb-6">
          A database or server error prevented this admin page from loading.
          This is usually a temporary MongoDB connection issue on Vercel cold starts.
          Try refreshing — it normally resolves itself.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 bg-[#ffc000] text-[#0a0a08] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.2em] hover:brightness-110 transition-all"
          >
            <span className="material-symbols-outlined text-[14px]">refresh</span>
            Retry
          </button>
        </div>

        {error.digest && (
          <p className="mt-5 text-[10px] uppercase tracking-[0.2em] text-slate-600">
            Ref: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
