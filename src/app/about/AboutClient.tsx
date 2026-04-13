'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface AboutData {
  title: string;
  subtitle: string;
  storyTitle: string;
  storyParagraph1: string;
  storyParagraph2: string;
  stats: { value: string; label: string }[];
  values: { title: string; description: string }[];
  ctaTitle: string;
  ctaSubtitle: string;
  heroImage: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

export default function AboutClient({ data }: { data: AboutData }) {
  return (
    <div className="flex flex-col bg-[var(--app-bg)] text-[var(--app-text)]">

      {/* ── Hero ── */}
      <section className="relative h-[56vh] md:h-[68vh] overflow-hidden bg-[#090805] mx-3 md:mx-5 mt-[104px] md:mt-[116px] rounded-[1.55rem]">
        {data.heroImage && (
          <>
            <img
              src={data.heroImage}
              alt="About Mado Creatives"
              className="absolute inset-0 w-full h-full object-cover scale-105 blur-2xl opacity-25"
              aria-hidden="true"
            />
            <img
              src={data.heroImage}
              alt="About Mado Creatives"
              className="relative z-10 w-full h-full object-cover"
            />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none z-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none z-20" />

        <div className="absolute bottom-0 left-0 right-0 z-30 p-8 md:p-12 lg:p-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.38em] text-[#ffda68]/80 mb-3">
              About Us
            </p>
            <h1 className="font-display font-bold text-[2.4rem] md:text-[3.8rem] lg:text-[4.8rem] leading-[0.92] tracking-[0.01em] text-white max-w-3xl">
              {data.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base md:text-lg text-white/72 leading-relaxed">
              {data.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="mx-3 md:mx-5 mt-3 rounded-[1.25rem] bg-[var(--app-card)] border border-[color:var(--app-border)]">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[color:var(--app-border)]">
          {data.stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col items-center justify-center py-8 px-6 text-center"
            >
              <span className="font-display font-bold text-[2.2rem] md:text-[2.8rem] text-[#ffc000] leading-none">
                {stat.value}
              </span>
              <span className="mt-2 text-[11px] uppercase tracking-[0.22em] text-white/55 font-semibold">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Story ── */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-5 h-px w-14 bg-[#ffda68]/65 md:w-20" />
            <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-white/48 mb-4">Our Story</p>
            <h2 className="font-display font-bold text-[2rem] md:text-[2.6rem] leading-[0.95] tracking-[0.01em] text-[#EAEAEA]">
              {data.storyTitle}
            </h2>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="space-y-5 text-[15px] md:text-base leading-[1.85] text-white/68"
          >
            <p>{data.storyParagraph1}</p>
            <p>{data.storyParagraph2}</p>
          </motion.div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="border-t border-[color:var(--app-border)] bg-[var(--section-bg)]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-20 md:py-28">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-14"
          >
            <div className="mb-5 h-px w-14 bg-[#ffda68]/65 md:w-20" />
            <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-white/48 mb-4">What Drives Us</p>
            <h2 className="font-display font-bold text-[2rem] md:text-[2.6rem] leading-[0.95] tracking-[0.01em] text-[#EAEAEA]">
              Our Values
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[color:var(--app-border)]">
            {data.values.map((value, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="bg-[var(--section-bg)] p-8 md:p-10"
              >
                <div className="mb-4 w-8 h-px bg-[#ffc000]" />
                <h3 className="font-display font-bold text-lg text-[#EAEAEA] mb-3 tracking-tight">
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/58">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-10 py-20 md:py-28 text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <div className="mb-5 h-px w-14 bg-[#ffda68]/65 mx-auto md:w-20" />
          <h2 className="font-display font-bold text-[2rem] md:text-[2.8rem] leading-[0.95] tracking-[0.01em] text-[#EAEAEA] mb-5">
            {data.ctaTitle}
          </h2>
          <p className="text-white/60 text-base leading-relaxed mb-10">
            {data.ctaSubtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 h-12 px-8 bg-[var(--gold)] text-black text-sm font-semibold uppercase tracking-wider hover:bg-[var(--gold-hover)] transition-colors"
            >
              Get in Touch
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 h-12 px-8 border border-white/20 text-white/80 text-sm font-semibold uppercase tracking-wider hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
            >
              View Our Work
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
