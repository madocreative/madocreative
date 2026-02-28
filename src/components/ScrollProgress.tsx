'use client';

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';

export default function ScrollProgress() {
  const { theme } = useTheme();
  const { scrollYProgress } = useScroll();

  const markerYRaw = useTransform(scrollYProgress, [0, 1], [10, 126]);
  const markerY = useSpring(markerYRaw, {
    stiffness: 180,
    damping: 30,
    mass: 0.2,
  });

  const isLight = theme === 'light';

  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden md:flex pointer-events-none">
      <div
        className={`relative h-[172px] w-[50px] rounded-[28px] border backdrop-blur-sm ${
          isLight ? 'bg-white/90 border-black/10' : 'bg-white/12 border-white/20'
        }`}
        aria-hidden="true"
      >
        <div className={`absolute left-1/2 top-5 -translate-x-1/2 h-1.5 w-1.5 rounded-full ${isLight ? 'bg-black/45' : 'bg-white/55'}`} />
        <div className={`absolute left-1/2 top-16 -translate-x-1/2 h-1.5 w-1.5 rounded-full ${isLight ? 'bg-black/45' : 'bg-white/55'}`} />
        <div className={`absolute left-1/2 top-[106px] -translate-x-1/2 h-1.5 w-1.5 rounded-full ${isLight ? 'bg-black/45' : 'bg-white/55'}`} />
        <div className={`absolute left-1/2 bottom-5 -translate-x-1/2 h-1.5 w-1.5 rounded-full ${isLight ? 'bg-black/45' : 'bg-white/55'}`} />

        <motion.div
          style={{ y: markerY }}
          className={`absolute left-1/2 -translate-x-1/2 h-8 w-8 rounded-full border-2 grid place-items-center ${
            isLight ? 'border-[#111] bg-white' : 'border-[#111] bg-white'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-[#111]" />
        </motion.div>
      </div>
    </div>
  );
}
