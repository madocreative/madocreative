'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function RouteFeedback() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = useMemo(() => `${pathname}?${searchParams.toString()}`, [pathname, searchParams]);

  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || anchor.target === '_blank' || anchor.hasAttribute('download')) {
        return;
      }

      const nextUrl = new URL(anchor.href, window.location.href);
      const currentUrl = new URL(window.location.href);

      if (nextUrl.origin !== currentUrl.origin) return;
      if (
        nextUrl.pathname === currentUrl.pathname &&
        nextUrl.search === currentUrl.search &&
        nextUrl.hash === currentUrl.hash
      ) {
        return;
      }

      startedRef.current = true;
      setIsNavigating(true);
      setProgress(14);
    };

    window.addEventListener('click', handleClick, true);
    return () => window.removeEventListener('click', handleClick, true);
  }, []);

  useEffect(() => {
    if (!isNavigating) return;

    const timers = [
      window.setTimeout(() => setProgress((value) => Math.max(value, 36)), 120),
      window.setTimeout(() => setProgress((value) => Math.max(value, 58)), 360),
      window.setTimeout(() => setProgress((value) => Math.max(value, 76)), 760),
      window.setTimeout(() => setProgress((value) => Math.max(value, 88)), 1400),
      window.setTimeout(() => {
        startedRef.current = false;
        setIsNavigating(false);
        setProgress(0);
      }, 7000),
    ];

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [isNavigating]);

  useEffect(() => {
    if (!startedRef.current) return;

    const finishTimer = window.setTimeout(() => setProgress(100), 0);
    const timer = window.setTimeout(() => {
      startedRef.current = false;
      setIsNavigating(false);
      setProgress(0);
    }, 220);

    return () => {
      window.clearTimeout(finishTimer);
      window.clearTimeout(timer);
    };
  }, [routeKey]);

  return (
    <>
      <div
        className={`fixed inset-x-0 top-0 z-[120] h-[2px] transition-opacity duration-200 ${
          isNavigating || progress > 0 ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      >
        <div
          className="h-full bg-[var(--gold)] shadow-[0_0_18px_rgba(212,175,106,0.55)] transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div
        className={`fixed right-3 top-[78px] sm:right-5 sm:top-[90px] z-[120] rounded-full border border-[color:var(--app-border)] bg-[var(--section-bg)]/96 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--gold)] shadow-[0_16px_30px_rgba(0,0,0,0.22)] backdrop-blur-md transition-all duration-200 ${
          isNavigating ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none'
        }`}
        aria-live="polite"
      >
        Loading page
      </div>
    </>
  );
}
