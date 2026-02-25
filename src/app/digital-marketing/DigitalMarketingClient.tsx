'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const HERO_IMGS = [
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971897/mado-creatives/i8xewrxxjabg40c1nhd8.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971899/mado-creatives/elx1jzuiydmyntvisbwm.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971900/mado-creatives/mbjmpnxnjrmfre3ctxan.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971901/mado-creatives/nm1vvf8uukzdsq6ubiyq.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971902/mado-creatives/gwd4ikdny7f7ve03wxnl.jpg',
];

const services = [
    {
        number: '01', title: 'Social Media Management',
        description: 'Full-service social media management for Instagram, TikTok, Facebook, LinkedIn, and YouTube. We create, schedule, and manage content that builds your brand presence, grows your audience organically, and drives meaningful engagement with your target market.',
        tags: ['Instagram', 'TikTok', 'Strategy'],
        image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971897/mado-creatives/i8xewrxxjabg40c1nhd8.jpg',
    },
    {
        number: '02', title: 'Content Creation & Campaigns',
        description: 'Strategic visual content crafted to stop the scroll. From campaign photography and video to graphic design and copywriting — we produce cohesive, platform-optimised content that communicates your brand story and converts audiences into customers.',
        tags: ['Campaigns', 'Content', 'Branding'],
        image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971899/mado-creatives/elx1jzuiydmyntvisbwm.jpg',
    },
    {
        number: '03', title: 'Paid Advertising (Meta & Google)',
        description: 'High-ROI paid advertising on Meta (Instagram & Facebook) and Google. We research your audience, design compelling creatives, write converting copy, launch targeted campaigns, and continuously optimise for maximum reach and conversion at the lowest cost.',
        tags: ['Meta Ads', 'Google Ads', 'ROI'],
        image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971900/mado-creatives/mbjmpnxnjrmfre3ctxan.jpg',
    },
    {
        number: '04', title: 'Brand Identity & Strategy',
        description: 'We build complete brand identities for startups, businesses, and personal brands — including logo design, brand guidelines, color systems, typography, and messaging strategy. Your brand will communicate authority, trust, and premium positioning from day one.',
        tags: ['Logo', 'Identity', 'Strategy'],
        image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971901/mado-creatives/nm1vvf8uukzdsq6ubiyq.jpg',
    },
    {
        number: '05', title: 'Influencer & Creator Partnerships',
        description: 'We connect your brand with the right creators and influencers — managing the full collaboration lifecycle from talent sourcing and brief creation to content review and performance reporting. Authentic partnerships that drive real brand awareness.',
        tags: ['Influencers', 'Creators', 'Partnerships'],
        image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971902/mado-creatives/gwd4ikdny7f7ve03wxnl.jpg',
    },
    {
        number: '06', title: 'Analytics & Growth Reporting',
        description: 'Data-driven growth with full monthly reporting. We track reach, impressions, engagement, follower growth, ad spend efficiency, and conversion metrics — then use those insights to continuously refine your digital strategy for compounding growth.',
        tags: ['Analytics', 'Reporting', 'Growth'],
        image: 'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971897/mado-creatives/luhwozrxtp1u5oehdyej.jpg',
    },
];

const stats = [
    { value: '3M+', label: 'Impressions Delivered' },
    { value: '50+', label: 'Brands Managed' },
    { value: '4×', label: 'Avg. ROI on Ads' },
    { value: '4', label: 'Countries Active' },
];

const process = [
    { step: '01', title: 'Discovery', desc: 'We audit your current presence, define your audience, and set measurable goals.' },
    { step: '02', title: 'Strategy', desc: 'A custom content and growth strategy built around your brand, budget, and objectives.' },
    { step: '03', title: 'Create & Launch', desc: 'We produce all content, launch campaigns, and manage everything end-to-end.' },
    { step: '04', title: 'Optimise & Report', desc: 'Monthly analytics reports with clear insights and ongoing strategy refinements.' },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };

export default function DigitalMarketingClient() {
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
                        <p className="text-[#ffc000] font-bold uppercase tracking-[0.4em] text-xs mb-3">Brand Growth</p>
                        <h1 className="text-5xl md:text-8xl font-display font-extrabold uppercase text-white leading-none">Digital<br />Marketing</h1>
                    </motion.div>
                </div>
            </section>

            {/* Intro + Stats */}
            <section className="bg-[#0a0a08] py-10 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-16 flex flex-col md:flex-row gap-12 md:gap-20 items-start">
                    <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-xl text-slate-400 max-w-2xl font-light leading-relaxed flex-1">
                        We transform brands into digital powerhouses. Through strategic content, targeted advertising, and authentic storytelling — we grow your audience, build authority, and convert followers into loyal customers.
                    </motion.p>
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
                        className="grid grid-cols-2 gap-x-12 gap-y-6 shrink-0">
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
                                <motion.div variants={fadeUp} initial="hidden" whileInView="show"
                                    viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9 }}
                                    className="w-full lg:w-1/2 aspect-[4/5] lg:aspect-auto overflow-hidden group min-h-[400px]">
                                    <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        src={service.image} alt={service.title} />
                                </motion.div>
                                <motion.div variants={fadeUp} initial="hidden" whileInView="show"
                                    viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, delay: 0.2 }}
                                    className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-16 lg:py-24">
                                    <div className="flex items-center gap-4 mb-8">
                                        <span className="text-[#ffc000] font-mono text-sm font-bold">{service.number}</span>
                                        <div className="h-px w-8 bg-[#ffc000]/30" />
                                        <div className="flex gap-2 flex-wrap">
                                            {service.tags.map((tag, i) => (
                                                <span key={i} className="text-[10px] uppercase tracking-widest text-slate-500 border border-white/10 px-3 py-1">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <h2 className="text-3xl lg:text-5xl font-display font-extrabold text-white mb-6 leading-tight uppercase">{service.title}</h2>
                                    <p className="text-lg text-slate-400 mb-12 leading-relaxed font-light">{service.description}</p>
                                    <Link href="/contact" className="group/link flex items-center gap-3 text-white font-bold uppercase tracking-widest text-xs w-max hover:text-[#ffc000] transition-colors">
                                        <span className="w-8 h-px bg-[#ffc000] transition-all duration-300 group-hover/link:w-14" />
                                        Get Started
                                        <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover/link:translate-x-1">arrow_right_alt</span>
                                    </Link>
                                </motion.div>
                            </div>
                        </section>
                    );
                })}
            </div>

            {/* Process */}
            <section className="bg-[#111109] py-24 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-16">
                    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.7 }} className="mb-16">
                        <p className="text-[#ffc000] font-bold uppercase tracking-[0.4em] text-xs mb-3">How It Works</p>
                        <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white uppercase leading-none">Our Process</h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
                        {process.map((p, i) => (
                            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show"
                                viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
                                className="bg-[#0a0a08] border border-white/5 p-8 group hover:border-[#ffc000]/30 transition-colors">
                                <span className="text-[#ffc000] font-mono text-4xl font-bold block mb-6 opacity-40 group-hover:opacity-100 transition-opacity">{p.step}</span>
                                <h3 className="text-white font-display font-extrabold text-xl uppercase mb-4">{p.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <motion.section variants={fadeUp} initial="hidden" whileInView="show"
                viewport={{ once: true }} transition={{ duration: 0.8 }}
                className="w-full bg-[#ffc000] py-32">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-6xl font-display font-extrabold text-[#0a0a08] mb-8 leading-tight uppercase">Ready to Grow Your Brand?</h2>
                    <p className="text-xl text-[#0a0a08]/70 mb-12 max-w-2xl mx-auto font-medium">
                        Let's build your digital presence from the ground up — with strategy, creativity, and results that matter.
                    </p>
                    <Link href="/contact" className="inline-flex items-center gap-3 bg-[#0a0a08] text-white px-10 py-4 font-bold text-lg uppercase tracking-wider hover:bg-[#1a1812] transition-colors">
                        Start a Project
                    </Link>
                </div>
            </motion.section>
        </div>
    );
}
