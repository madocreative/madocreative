'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function LenisProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.4,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 0.9,
            touchMultiplier: 1.5,
        });

        let animFrame: number;

        function raf(time: number) {
            lenis.raf(time);
            animFrame = requestAnimationFrame(raf);
        }

        animFrame = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(animFrame);
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}
