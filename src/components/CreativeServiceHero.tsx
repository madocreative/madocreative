'use client';

import { motion } from 'framer-motion';

export default function CreativeServiceHero({
    heroImage,
    heroLabel,
    title,
}: {
    heroImage: string;
    heroLabel: string;
    title: string;
}) {
    return (
        <section className="relative h-[60vh] md:h-[72vh] overflow-hidden mx-3 md:mx-5 mt-[104px] md:mt-[116px] rounded-[1.55rem] bg-[var(--section-bg)]">
            {heroImage ? (
                <>
                    <img
                        src={heroImage}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-25"
                    />
                    <img
                        src={heroImage}
                        alt={title.replace(/\n/g, ' ')}
                        className="absolute inset-0 w-full h-full object-contain"
                    />
                </>
            ) : (
                <div className="absolute inset-0 bg-[var(--section-bg)]" />
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-[#05070a]/80 via-[#05070a]/45 to-[#05070a]/15 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-transparent to-[#05070a]/35 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#05070a] to-transparent pointer-events-none" />

            <div className="absolute inset-0 flex flex-col items-start justify-end pb-16 md:pb-24 px-6 lg:px-16 max-w-7xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.25 }}
                    className="max-w-3xl"
                >
                    <p className="text-[var(--gold)] font-bold uppercase tracking-[0.4em] text-xs mb-3">{heroLabel}</p>
                    <h1 className="text-5xl md:text-8xl font-display font-extrabold uppercase text-white leading-none whitespace-pre-line">
                        {title}
                    </h1>
                </motion.div>
            </div>
        </section>
    );
}
