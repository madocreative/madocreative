import Link from 'next/link';
import PricingPackages from '@/components/PricingPackages';
import { getServicePackages } from '@/lib/servicePackages';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Pricing | Mado Creatives',
  description: 'Monthly production and digital marketing packages from Mado Creatives.',
};

export default async function PricingPage() {
  const packages = await getServicePackages();

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] pt-[104px] md:pt-[116px]">
      <section className="relative overflow-hidden bg-[#060504] border-b border-white/5">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#ffc000]/10 blur-[140px]" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-20 py-20 md:py-28">
          <p className="text-[#ffc000] font-bold uppercase tracking-[0.44em] text-[10px] mb-6 flex items-center gap-4">
            <span className="w-10 h-px bg-[#ffc000]" />
            Pricing
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white leading-[0.9] max-w-4xl">
            Monthly packages for consistent brand growth
          </h1>
          <p className="mt-8 max-w-2xl text-[#9a9078] text-base md:text-lg leading-relaxed">
            Choose the level of production and digital marketing support that fits your current growth stage. Every package is built around recurring content, clean post-production, and clear execution.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#ffc000] text-[#090805] px-8 py-4 rounded-full font-bold text-sm uppercase tracking-[0.18em] hover:bg-white transition-colors"
            >
              Ask for Guidance
              <span className="material-symbols-outlined text-[18px]">arrow_right_alt</span>
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 border border-white/20 text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-[0.18em] hover:border-[#ffc000] hover:text-[#ffc000] transition-colors"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>

      <PricingPackages packages={packages} compact />
    </div>
  );
}
