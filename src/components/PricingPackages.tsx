'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { ServicePackage } from '@/lib/servicePackages';

type PricingPackagesProps = {
  packages: ServicePackage[];
  compact?: boolean;
};

export default function PricingPackages({ packages, compact = false }: PricingPackagesProps) {
  if (packages.length === 0) return null;

  return (
    <section className={`relative ${compact ? 'py-20 md:py-24' : 'py-24 md:py-32'} bg-[#090805] border-b border-white/5 overflow-hidden`}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ffc000]/30 to-transparent" />
      <div className="absolute -top-28 right-0 w-[420px] h-[420px] bg-[#ffc000]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-20">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12 md:mb-16">
          <div>
            <p className="text-[#ffc000] font-bold uppercase tracking-[0.44em] text-[10px] mb-5 flex items-center gap-4">
              <span className="w-10 h-px bg-[#ffc000]" />
              Monthly Packages
            </p>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white leading-[0.95] max-w-3xl">
              Production and marketing plans
            </h2>
          </div>
          <p className="text-[#9a9078] text-sm md:text-base leading-relaxed max-w-md">
            Built for brands that need consistent content, post-production, and measurable online presence every month.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {packages.map((pkg, index) => {
            const featured = index === packages.length - 1;
            const icon = index === 0 ? 'smartphone' : index === 1 ? 'photo_camera' : 'monitoring';

            return (
              <motion.article
                key={`${pkg.name}-${index}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.65, delay: index * 0.08 }}
                className="relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#111109] shadow-[0_22px_70px_rgba(0,0,0,0.25)]"
              >
                {pkg.image ? (
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="block w-full h-auto"
                  />
                ) : (
                  <div className={`relative p-6 md:p-7 min-h-[360px] flex flex-col ${
                    featured
                      ? 'bg-[#ffc000] text-[#080704]'
                      : 'bg-[#111109] text-white'
                  }`}>
                    <div className={`absolute right-5 top-5 text-[96px] leading-none font-display font-bold pointer-events-none select-none ${
                      featured ? 'text-black/[0.07]' : 'text-[#ffc000]/[0.08]'
                    }`}>
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    <div className="relative z-10 flex flex-col h-full">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-7 ${
                        featured ? 'bg-black text-[#ffc000]' : 'bg-[#ffc000] text-[#090805]'
                      }`}>
                        <span className="material-symbols-outlined text-[28px]">{icon}</span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-display font-bold leading-tight mb-4">
                        {pkg.name}
                      </h3>
                      <p className={`text-sm leading-relaxed mb-8 ${featured ? 'text-black/70' : 'text-[#9a9078]'}`}>
                        {pkg.description}
                      </p>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-[#090805] border-t border-white/10">
                  <Link
                    href={`/contact?package=${encodeURIComponent(pkg.name)}`}
                    className="inline-flex w-full items-center justify-center gap-2 h-12 px-5 rounded-full text-xs font-bold uppercase tracking-[0.18em] transition-colors bg-[#ffc000] text-[#090805] hover:bg-white"
                  >
                    Request Package
                    <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
