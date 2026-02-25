'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export const metadata = {
    title: 'Videography | Mado Creatives',
    description: 'Cinematic storytelling, commercial films, wedding productions, and advanced color grading by Mado Creatives.',
};

const HERO_IMGS = [
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971898/mado-creatives/qiojrpgavumzxuqhc8tn.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971895/mado-creatives/has4odv4qpun3uxh2wza.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971882/mado-creatives/nlw9iu68433ngreltzwt.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971887/mado-creatives/enbiztasgcryipz6x8py.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971891/mado-creatives/kw9xzrjaw2mk62tv7z0o.jpg',
];

const services = [
    {
        number: '01',
        title: 'Cinematic Wedding Films',
        description: 'Timeless wedding films crafted with narrative depth and cinematic artistry. From intimate ceremonies to grand celebrations, we capture every emotion — the laughter, the vows, the tears — and transform them into a film you will cherish forever.',
        tags: ['Wedding', 'Ceremony', 'Storytelling'],
        image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971898/mado-creatives/qiojrpgavumzxuqhc8tn.jpg',
    },
    {
        number: '02',
        title: 'Commercial & Brand Films',
        description: 'Compelling brand stories and commercial productions designed to elevate your business. We create high-impact videos that communicate your message with clarity, style, and authority — built for digital, broadcast, and social platforms.',
        tags: ['Commercial', 'Brand', 'Digital'],
        image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971895/mado-creatives/has4odv4qpun3uxh2wza.jpg',
    },
    {
        number: '03',
        title: 'Social Media Content',
        description: 'Short-form cinematic content crafted specifically for Instagram Reels, TikTok, YouTube Shorts, and beyond. We produce scroll-stopping videos that build your audience, increase engagement, and turn followers into loyal clients.',
        tags: ['Reels', 'TikTok', 'Content'],
        image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971887/mado-creatives/enbiztasgcryipz6x8py.jpg',
    },
    {
        number: '04',
        title: 'Music Videos & Creative Films',
        description: 'Visually bold, concept-driven music videos and creative films for artists, labels, and creative brands. From pre-production concept to final color grade — we bring your creative vision to life with precision and flair.',
        tags: ['Music Video', 'Creative', 'Production'],
        image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971882/mado-creatives/nlw9iu68433ngreltzwt.jpg',
    },
    {
        number: '05',
        title: 'Corporate & Event Coverage',
        description: 'Discreet, professional video coverage for conferences, product launches, corporate events, galas, and private gatherings. Delivered with broadcast quality and editorial sophistication to represent your brand at its best.',
        tags: ['Corporate', 'Events', 'Coverage'],
        image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971891/mado-creatives/kw9xzrjaw2mk62tv7z0o.jpg',
    },
    {
        number: '06',
        title: 'Color Grading & Post-Production',
        description: 'Advanced color grading, sound design, motion graphics, and full post-production services. Whether we shot your project or you bring us existing footage, we deliver a polished, cinematic final product that stands apart.',
        tags: ['Color Grading', 'Post-Production', 'Motion Graphics'],
        image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971897/mado-creatives/i8xewrxxjabg40c1nhd8.jpg',
    },
];

const stats = [
    { value: '500+', label: 'Productions' },
    { value: '15+', label: 'Years Experience' },
    { value: '4K', label: 'Resolution Standard' },
    { value: '4', label: 'Countries' },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };

export default function VideographyPage() {
    return (
        <div className="flex flex-col bg-[#0a0a08]">
            {/* Hero */}
            <section className="relative h-[72vh] overflow-hidden">
                <div className="absolute inset-0 flex gap-px">
                    {HERO_IMGS.map((img, i) => (
                        <div key={i} className={`overflow-hidden ${i === 0 ? 'flex-[2]' : 'flex-1'}`}>
                            <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
                <div className="absolute inset-0 bg-[#0a0a08]/35 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#0a0a08]" />
                <div className="absolute inset-0 flex flex-col items-start justify-end pb-24 px-6 lg:px-16 max-w-7xl mx-auto w-full">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
                        <p className="text-[#ffc000] font-bold uppercase tracking-[0.4em] text-xs mb-3">Cinematic Production</p>
                        <h1 className="text-5xl md:text-8xl font-display font-extrabold uppercase text-white leading-none">
                            Videography
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Intro + Stats */}
            <section className="bg-[#0a0a08] py-10 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-16 flex flex-col md:flex-row gap-12 md:gap-20 items-start">
                    <motion.p
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-xl text-slate-400 max-w-2xl font-light leading-relaxed flex-1"
                    >
                        We don't just record moments — we craft cinematic stories. From concept to color grade, every frame is intentional, every cut purposeful, every film a lasting legacy.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
                        className="grid grid-cols-2 gap-x-12 gap-y-6 shrink-0"
                    >
                        {stats.map((s, i) => (
                            <div key={i}>
                                <p className="text-[#ffc000] font-bold text-3xl font-display mb-1">{s.value}</p>
                                <p className="text-xs text-slate-500 uppercase tracking-wider">{s.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Services — alternating */}
            <div className="w-full">
                {services.map((service, index) => {
                    const reverse = index % 2 !== 0;
                    return (
                        <section key={index} className={`w-full ${index % 2 === 0 ? 'bg-[#0a0a08]' : 'bg-[#111109]'}`}>
                            <div className={`max-w-7xl mx-auto flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-stretch`}>
                                <motion.div
                                    variants={fadeUp} initial="hidden" whileInView="show"
                                    viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9 }}
                                    className="w-full lg:w-1/2 aspect-[4/5] lg:aspect-auto overflow-hidden group min-h-[400px]"
                                >
                                    <img
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        src={service.image}
                                        alt={service.title}
                                    />
                                </motion.div>
                                <motion.div
                                    variants={fadeUp} initial="hidden" whileInView="show"
                                    viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, delay: 0.2 }}
                                    className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-16 lg:py-24"
                                >
                                    <div className="flex items-center gap-4 mb-8">
                                        <span className="text-[#ffc000] font-mono text-sm font-bold">{service.number}</span>
                                        <div className="h-px w-8 bg-[#ffc000]/30"></div>
                                        <div className="flex gap-2 flex-wrap">
                                            {service.tags.map((tag, i) => (
                                                <span key={i} className="text-[10px] uppercase tracking-widest text-slate-500 border border-white/10 px-3 py-1">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <h2 className="text-3xl lg:text-5xl font-display font-extrabold text-white mb-6 leading-tight uppercase">
                                        {service.title}
                                    </h2>
                                    <p className="text-lg text-slate-400 mb-12 leading-relaxed font-light">
                                        {service.description}
                                    </p>
                                    <Link href="/booking"
                                        className="group/link flex items-center gap-3 text-white font-bold uppercase tracking-widest text-xs w-max hover:text-[#ffc000] transition-colors">
                                        <span className="w-8 h-px bg-[#ffc000] transition-all duration-300 group-hover/link:w-14"></span>
                                        Book a Session
                                        <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover/link:translate-x-1">arrow_right_alt</span>
                                    </Link>
                                </motion.div>
                            </div>
                        </section>
                    );
                })}
            </div>

            {/* CTA */}
            <motion.section
                variants={fadeUp} initial="hidden" whileInView="show"
                viewport={{ once: true }} transition={{ duration: 0.8 }}
                className="w-full bg-[#ffc000] py-32"
            >
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-6xl font-display font-extrabold text-[#0a0a08] mb-8 leading-tight uppercase">
                        Let's Create Your Film
                    </h2>
                    <p className="text-xl text-[#0a0a08]/70 mb-12 max-w-2xl mx-auto font-medium">
                        Whether it's a wedding, a brand campaign, or a creative vision — we bring it to life with cinematic excellence.
                    </p>
                    <Link href="/booking"
                        className="inline-flex items-center gap-3 bg-[#0a0a08] text-white px-10 py-4 font-bold text-lg uppercase tracking-wider hover:bg-[#1a1812] transition-colors">
                        Start Your Project
                    </Link>
                </div>
            </motion.section>
        </div>
    );
}
