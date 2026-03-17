'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import CreativeServiceHero from '@/components/CreativeServiceHero';
import type {
    CreativeServicePageData,
    CreativeServiceVideoGalleryLayout,
    CreativeServiceVideoItem,
} from '@/lib/creativeServicePage';
import { getPlayableCloudinaryVideoUrl } from '@/lib/cloudinaryVideo';
import { videographyPageDefaults } from '@/lib/videographyPageDefaults';

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };

function VideoGalleryCard({
    video,
    index,
    className = '',
}: {
    video: CreativeServiceVideoItem;
    index: number;
    className?: string;
}) {
    return (
        <motion.article
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: index * 0.06 }}
            className={`group bg-[#111109] border border-white/5 overflow-hidden ${className}`}
        >
            <div className="p-5 pb-0 md:p-6 md:pb-0">
                <div className="relative mx-auto w-full max-w-[20rem] rounded-[1.75rem] border border-white/10 bg-black/80 p-2 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
                    <div className="relative aspect-[9/16] overflow-hidden rounded-[1.2rem] bg-black">
                        <video
                            src={getPlayableCloudinaryVideoUrl(video.videoUrl)}
                            poster={video.posterImage || undefined}
                            controls
                            preload="metadata"
                            playsInline
                            className="block h-full w-full object-contain bg-black"
                        />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/45 to-transparent" />
                    </div>
                </div>
            </div>
            <div className="p-5 md:p-6">
                <div className="flex items-center gap-4 mb-4">
                    <span className="text-[#ffc000] font-mono text-sm font-bold">{String(index + 1).padStart(2, '0')}</span>
                    <div className="h-px w-10 bg-[#ffc000]/30" />
                    <span className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Video Gallery</span>
                </div>
                {video.title && (
                    <h3 className="text-xl md:text-2xl font-display font-extrabold uppercase text-white mb-3 group-hover:text-[#ffc000] transition-colors">
                        {video.title}
                    </h3>
                )}
                {video.description && (
                    <p className="text-slate-400 leading-relaxed">
                        {video.description}
                    </p>
                )}
            </div>
        </motion.article>
    );
}

export default function VideographyClient({ data = videographyPageDefaults }: { data?: CreativeServicePageData }) {
    const heroImages = data.heroImages.length > 0 ? data.heroImages : videographyPageDefaults.heroImages;
    const primaryHeroImage = heroImages[0] || '';
    const showcaseVideos: CreativeServiceVideoItem[] = data.showcaseVideos && data.showcaseVideos.length > 0
        ? data.showcaseVideos
        : (videographyPageDefaults.showcaseVideos ?? []);
    const videoGalleryVideos: CreativeServiceVideoItem[] = data.videoGalleryVideos && data.videoGalleryVideos.length > 0
        ? data.videoGalleryVideos
        : (videographyPageDefaults.videoGalleryVideos ?? []);
    const videoGalleryLayout: CreativeServiceVideoGalleryLayout = data.videoGalleryLayout
        || videographyPageDefaults.videoGalleryLayout
        || 'masonry';

    return (
        <div className="flex flex-col bg-[var(--app-bg)]">
            <CreativeServiceHero heroImage={primaryHeroImage} heroLabel={data.heroLabel} title={data.title} />

            <section className="bg-[#0a0a08] py-10 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-16 flex flex-col md:flex-row gap-12 md:gap-20 items-start">
                    <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-xl text-slate-400 max-w-2xl font-light leading-relaxed flex-1">
                        {data.subtitle}
                    </motion.p>
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
                        className="grid grid-cols-2 gap-x-12 gap-y-6 shrink-0">
                        {data.stats.map((stat) => (
                            <div key={stat.label}>
                                <p className="text-[#ffc000] font-bold text-3xl font-display mb-1">{stat.value}</p>
                                <p className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {showcaseVideos.length > 0 && (
                <section className="bg-[#111109] py-24 border-b border-white/5">
                    <div className="max-w-7xl mx-auto px-6 lg:px-16">
                        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-3xl mb-14">
                            <p className="text-[#ffc000] font-bold uppercase tracking-[0.4em] text-xs mb-3">{data.showcaseLabel || videographyPageDefaults.showcaseLabel}</p>
                            <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white uppercase leading-none mb-5">
                                {data.showcaseTitle || videographyPageDefaults.showcaseTitle}
                            </h2>
                            <p className="text-lg text-slate-400 leading-relaxed">
                                {data.showcaseSubtitle || videographyPageDefaults.showcaseSubtitle}
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center">
                            {showcaseVideos.map((video, index) => (
                                <motion.article
                                    key={`${video.videoUrl}-${index}`}
                                    variants={fadeUp}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true, margin: '-60px' }}
                                    transition={{ duration: 0.7, delay: index * 0.08 }}
                                    className="group w-full max-w-[24rem] bg-[#0a0a08] border border-white/5 overflow-hidden"
                                >
                                    <div className="p-5 pb-0 md:p-6 md:pb-0">
                                        <div className="relative mx-auto w-full max-w-[20rem] rounded-[1.75rem] border border-white/10 bg-black/80 p-2 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
                                            <div className="relative aspect-[9/16] overflow-hidden rounded-[1.2rem] bg-black">
                                                <video
                                                    src={getPlayableCloudinaryVideoUrl(video.videoUrl)}
                                                    poster={video.posterImage || undefined}
                                                    controls
                                                    preload="metadata"
                                                    playsInline
                                                    className="block h-full w-full object-contain bg-black"
                                                />
                                                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/45 to-transparent" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 md:p-7">
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="text-[#ffc000] font-mono text-sm font-bold">{String(index + 1).padStart(2, '0')}</span>
                                            <div className="h-px w-10 bg-[#ffc000]/30" />
                                            <span className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Featured Film</span>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-display font-extrabold uppercase text-white mb-3 group-hover:text-[#ffc000] transition-colors">
                                            {video.title}
                                        </h3>
                                        {video.description && (
                                            <p className="text-slate-400 leading-relaxed max-w-3xl">
                                                {video.description}
                                            </p>
                                        )}
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {videoGalleryVideos.length > 0 && (
                <section className="bg-[#0a0a08] py-24 border-b border-white/5">
                    <div className="max-w-7xl mx-auto px-6 lg:px-16">
                        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-3xl mb-14">
                            <p className="text-[#ffc000] font-bold uppercase tracking-[0.4em] text-xs mb-3">
                                {data.videoGalleryLabel || videographyPageDefaults.videoGalleryLabel}
                            </p>
                            <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white uppercase leading-none mb-5">
                                {data.videoGalleryTitle || videographyPageDefaults.videoGalleryTitle}
                            </h2>
                            <p className="text-lg text-slate-400 leading-relaxed">
                                {data.videoGallerySubtitle || videographyPageDefaults.videoGallerySubtitle}
                            </p>
                        </motion.div>

                        {videoGalleryLayout === 'strip' ? (
                            <div className="flex gap-6 overflow-x-auto pb-2 snap-x snap-mandatory">
                                {videoGalleryVideos.map((video, index) => (
                                    <VideoGalleryCard
                                        key={`${video.videoUrl}-${index}`}
                                        video={video}
                                        index={index}
                                        className="min-w-[18rem] sm:min-w-[22rem] flex-none snap-start"
                                    />
                                ))}
                            </div>
                        ) : videoGalleryLayout === 'masonry' ? (
                            <div className="masonry-grid [column-gap:1.5rem]">
                                {videoGalleryVideos.map((video, index) => (
                                    <VideoGalleryCard
                                        key={`${video.videoUrl}-${index}`}
                                        video={video}
                                        index={index}
                                        className="masonry-item mb-6 w-full max-w-[24rem] mx-auto"
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
                                {videoGalleryVideos.map((video, index) => (
                                    <VideoGalleryCard
                                        key={`${video.videoUrl}-${index}`}
                                        video={video}
                                        index={index}
                                        className="w-full max-w-[24rem]"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            <div className="w-full">
                {data.services.map((service, index) => {
                    const reverse = index % 2 !== 0;
                    const tags = service.tags.split(',').map((tag) => tag.trim()).filter(Boolean);

                    return (
                        <section key={`${service.title}-${index}`} className={`w-full ${index % 2 === 0 ? 'bg-[#0a0a08]' : 'bg-[#111109]'}`}>
                            <div className={`max-w-7xl mx-auto flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-stretch`}>
                                <motion.div variants={fadeUp} initial="hidden" whileInView="show"
                                    viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9 }}
                                    className="w-full lg:w-1/2 aspect-[4/5] lg:aspect-auto overflow-hidden group min-h-[400px]">
                                    <img className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                                        src={service.image} alt={service.title} />
                                </motion.div>
                                <motion.div variants={fadeUp} initial="hidden" whileInView="show"
                                    viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, delay: 0.2 }}
                                    className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-16 lg:py-24">
                                    <div className="flex items-center gap-4 mb-8">
                                        <span className="text-[#ffc000] font-mono text-sm font-bold">{String(index + 1).padStart(2, '0')}</span>
                                        <div className="h-px w-8 bg-[#ffc000]/30" />
                                        <div className="flex gap-2 flex-wrap">
                                            {tags.map((tag) => (
                                                <span key={tag} className="text-[10px] uppercase tracking-widest text-slate-500 border border-white/10 px-3 py-1">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <h2 className="text-3xl lg:text-5xl font-display font-extrabold text-white mb-6 leading-tight uppercase">{service.title}</h2>
                                    <p className="text-lg text-slate-400 mb-12 leading-relaxed font-light">{service.description}</p>
                                    <Link href={data.ctaLink} className="group/link flex items-center gap-3 text-white font-bold uppercase tracking-widest text-xs w-max hover:text-[#ffc000] transition-colors">
                                        <span className="w-8 h-px bg-[#ffc000] transition-all duration-300 group-hover/link:w-14" />
                                        {data.ctaButton}
                                        <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover/link:translate-x-1">arrow_right_alt</span>
                                    </Link>
                                </motion.div>
                            </div>
                        </section>
                    );
                })}
            </div>

            <motion.section variants={fadeUp} initial="hidden" whileInView="show"
                viewport={{ once: true }} transition={{ duration: 0.8 }}
                className="w-full bg-[#ffc000] py-32">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-6xl font-display font-extrabold text-[#0a0a08] mb-8 leading-tight uppercase">{data.ctaTitle}</h2>
                    <p className="text-xl text-[#0a0a08]/70 mb-12 max-w-2xl mx-auto font-medium">
                        {data.ctaSubtitle}
                    </p>
                    <Link href={data.ctaLink} className="inline-flex items-center gap-3 bg-[#0a0a08] text-white px-10 py-4 font-bold text-lg uppercase tracking-wider hover:bg-[#1a1812] transition-colors">
                        {data.ctaButton}
                    </Link>
                </div>
            </motion.section>
        </div>
    );
}
