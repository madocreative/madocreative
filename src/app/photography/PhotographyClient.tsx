'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import CreativeServiceHero from '@/components/CreativeServiceHero';
import {
  photographyPageDefaults,
  type PhotographyPageData,
} from '@/lib/photographyPageDefaults';

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };

export default function PhotographyClient({ data = photographyPageDefaults }: { data?: PhotographyPageData }) {
  const heroImages = data.heroImages.length > 0 ? data.heroImages : photographyPageDefaults.heroImages;
  const primaryHeroImage = heroImages[0] || '';

  return (
    <div className="flex flex-col bg-[var(--app-bg)]">
      <CreativeServiceHero heroImage={primaryHeroImage} heroLabel={data.heroLabel} title={data.title} />

      <section className="bg-[var(--section-bg)] py-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 flex flex-col md:flex-row gap-12 md:gap-20 items-start">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-white/70 max-w-2xl font-light leading-relaxed flex-1"
          >
            {data.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-2 gap-x-12 gap-y-6 shrink-0"
          >
            {data.stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-[var(--gold)] font-bold text-3xl font-display mb-1">{stat.value}</p>
                <p className="text-xs text-white/45 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="w-full">
        {data.services.map((service, index) => {
          const reverse = index % 2 !== 0;
          const tags = service.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0);

          return (
            <section
              key={service.title}
              className={`w-full ${index % 2 === 0 ? 'bg-[var(--app-bg)]' : 'bg-[var(--section-bg)]'}`}
            >
              <div
                className={`max-w-7xl mx-auto flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-stretch`}
              >
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.9 }}
                  className="w-full lg:w-1/2 aspect-[4/5] lg:aspect-auto overflow-hidden group min-h-[400px]"
                >
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={service.image}
                    alt={service.title}
                  />
                </motion.div>
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.9, delay: 0.2 }}
                  className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-16 lg:py-24"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-[var(--gold)] font-mono text-sm font-bold">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="h-px w-8 bg-[var(--gold)] opacity-30" />
                    <div className="flex gap-2 flex-wrap">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] uppercase tracking-widest text-white/45 border border-white/10 px-3 py-1"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <h2 className="text-3xl lg:text-5xl font-display font-extrabold text-white mb-6 leading-tight uppercase">
                    {service.title}
                  </h2>
                  <p className="text-lg text-white/68 mb-12 leading-relaxed font-light">{service.description}</p>
                  <Link
                    href="/booking"
                    className="group/link flex items-center gap-3 text-white font-bold uppercase tracking-widest text-xs w-max hover:text-[var(--gold)] transition-colors"
                  >
                    <span className="w-8 h-px bg-[var(--gold)] transition-all duration-300 group-hover/link:w-14" />
                    Book a Session
                    <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover/link:translate-x-1">
                      arrow_right_alt
                    </span>
                  </Link>
                </motion.div>
              </div>
            </section>
          );
        })}
      </div>

      {data.collections.length > 0 && (
        <section className="bg-[var(--section-bg)] py-24 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-16">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mb-16"
            >
              <p className="text-[var(--gold)] font-bold uppercase tracking-[0.4em] text-xs mb-3">
                {data.collectionsLabel}
              </p>
              <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white uppercase leading-none">
                {data.collectionsTitle}
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.collections.map((collection, index) => (
                <motion.div
                  key={collection.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link
                    href={collection.href}
                    className="block rounded-[1.5rem] border border-white/10 bg-[var(--app-card)] p-8 hover:border-[var(--gold)] transition-colors"
                  >
                    <p className="text-[var(--gold)] text-xs uppercase tracking-[0.3em] mb-4">Collection</p>
                    <h3 className="text-white font-display font-extrabold text-2xl uppercase mb-4">
                      {collection.title}
                    </h3>
                    <p className="text-white/60 leading-relaxed mb-6">{collection.description}</p>
                    <span className="inline-flex items-center gap-3 text-sm uppercase tracking-[0.22em] font-semibold text-white hover:text-[var(--gold)] transition-colors">
                      View Portfolio
                      <span className="material-symbols-outlined text-[18px]">arrow_right_alt</span>
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {data.process.length > 0 && (
        <section className="bg-[var(--app-bg)] py-24 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-16">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mb-16"
            >
              <p className="text-[var(--gold)] font-bold uppercase tracking-[0.4em] text-xs mb-3">
                {data.processLabel}
              </p>
              <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white uppercase leading-none">
                {data.processTitle}
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
              {data.process.map((item, index) => (
                <motion.div
                  key={item.step}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-[var(--app-card)] border border-white/5 p-8 group hover:border-[var(--gold)] transition-colors"
                >
                  <span className="text-[var(--gold)] font-mono text-4xl font-bold block mb-6 opacity-40 group-hover:opacity-100 transition-opacity">
                    {item.step}
                  </span>
                  <h3 className="text-white font-display font-extrabold text-xl uppercase mb-4">{item.title}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full bg-[var(--gold)] py-32"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-6xl font-display font-extrabold text-black mb-8 leading-tight uppercase">
            {data.ctaTitle}
          </h2>
          <p className="text-xl text-black/70 mb-12 max-w-2xl mx-auto font-medium">
            {data.ctaSubtitle}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href={data.ctaLink}
              className="inline-flex items-center gap-3 bg-black text-white px-10 py-4 font-bold text-lg uppercase tracking-wider hover:bg-[#171717] transition-colors"
            >
              {data.ctaButton}
            </Link>
            <Link
              href={data.ctaSecondaryLink}
              className="inline-flex items-center gap-3 border border-black/20 text-black px-10 py-4 font-bold text-lg uppercase tracking-wider hover:bg-black/5 transition-colors"
            >
              {data.ctaSecondaryButton}
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
