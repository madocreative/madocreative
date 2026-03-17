'use client';

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  const markerYRaw = useTransform(scrollYProgress, [0, 1], [10, 126]);
  const markerY = useSpring(markerYRaw, {
    stiffness: 180,
    damping: 30,
    mass: 0.2,
  });

  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden md:flex pointer-events-none">
      <div
        className="relative h-[172px] w-[50px] rounded-[28px] border border-[color:var(--app-border)] bg-[var(--section-bg)]/78 backdrop-blur-sm"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-5 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-[var(--gold)]/35" />
        <div className="absolute left-1/2 top-16 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-[var(--gold)]/35" />
        <div className="absolute left-1/2 top-[106px] -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-[var(--gold)]/35" />
        <div className="absolute left-1/2 bottom-5 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-[var(--gold)]/35" />

        <motion.div
          style={{ y: markerY }}
          className="absolute left-1/2 -translate-x-1/2 h-8 w-8 rounded-full border-2 border-[var(--gold)] bg-[var(--app-card)] grid place-items-center"
        >
          <span className="h-2 w-2 rounded-full bg-[var(--gold)]" />
        </motion.div>
      </div>
    </div>
  );
}
