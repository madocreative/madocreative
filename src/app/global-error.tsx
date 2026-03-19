'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#05070A] text-[#EAEAEA]">
        <div className="min-h-screen flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-2xl rounded-[1.75rem] border border-white/10 bg-[#0A0F18] p-8 md:p-12 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <p className="mb-4 flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.38em] text-[#FFDA68]">
              <span className="h-px w-12 bg-[#FFDA68]" />
              Studio Recovery Mode
            </p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold leading-[0.95] text-white">
              The site needs a quick refresh.
            </h1>
            <p className="mt-5 max-w-xl text-sm md:text-base leading-8 text-white/72">
              A server-side dependency is temporarily unavailable. Please retry in a moment while we reconnect everything cleanly.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => reset()}
                className="inline-flex items-center justify-center rounded-full bg-[#FFDA68] px-7 h-12 text-sm font-bold uppercase tracking-[0.2em] text-black transition-colors hover:bg-[#F2D28B]"
              >
                Try Again
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-white/12 px-7 h-12 text-sm font-bold uppercase tracking-[0.2em] text-white transition-colors hover:border-[#FFDA68]/50 hover:text-[#FFDA68]"
              >
                Return Home
              </Link>
            </div>
            {error.digest && (
              <p className="mt-6 text-xs uppercase tracking-[0.24em] text-white/28">
                Reference: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
