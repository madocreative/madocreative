'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HomeClient({ content, galleries }: { content: any, galleries: any[] }) {
    const defaultTitle = "Capturing<br />The <span class='text-transparent bg-clip-text bg-gradient-to-r from-[#ffc000] to-[#e6ac00]'>Unseen</span>";
    const defaultSubtitle = "We are Mado Creatives, an independent studio crafting premium imagery for visionaries.";
    const defaultHero = "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?q=80&w=2000&auto=format&fit=crop";

    const title = content?.title || defaultTitle;
    const subtitle = content?.subtitle || defaultSubtitle;
    const heroImage = content?.heroImage || defaultHero;

    return (
        <div className="flex flex-col bg-[#0a0a08]">
            {/* Hero Section */}
            <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.6 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 w-full h-full"
                >
                    <img
                        src={heroImage}
                        alt="Hero background"
                        className="w-full h-full object-cover object-center grayscale mix-blend-overlay"
                    />
                </motion.div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a08] via-[#0a0a08]/40 to-transparent"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center mt-20">
                    <motion.p
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-[#ffc000] font-bold tracking-[0.3em] uppercase text-sm mb-6"
                    >
                        Visual Storytelling
                    </motion.p>

                    <motion.h1
                        initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7, duration: 0.8 }}
                        className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter uppercase text-white mb-8"
                        dangerouslySetInnerHTML={{ __html: title }}
                    />

                    <motion.p
                        initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }}
                        className="text-xl md:text-2xl text-slate-300 font-light max-w-2xl mx-auto mb-12"
                    >
                        {subtitle}
                    </motion.p>

                    <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.1, duration: 0.8 }}>
                        <Link href="/portfolio" className="bg-[#ffc000] text-[#0a0a08] px-10 py-4 rounded-full font-bold text-lg uppercase tracking-wider hover:bg-white transition-colors">
                            View Our Work
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Featured Works */}
            <section className="py-32 bg-[#0a0a08]">
                <div className="max-w-7xl mx-auto px-6 mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                        <p className="text-[#ffc000] font-bold uppercase tracking-widest text-sm mb-4">Selected Works</p>
                        <h2 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight">Featured Portfolio</h2>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                        <Link href="/portfolio" className="text-white border-b border-[#ffc000] pb-1 uppercase tracking-widest text-sm font-bold hover:text-[#ffc000] transition-colors">
                            See All Projects
                        </Link>
                    </motion.div>
                </div>

                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
                    {galleries.slice(0, 4).map((gallery, idx) => (
                        <motion.div
                            key={gallery._id}
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className="group cursor-pointer"
                        >
                            <div className="aspect-[4/5] overflow-hidden rounded-xl relative mb-6 border border-white/5">
                                <img
                                    src={gallery.featuredImage}
                                    alt={gallery.title}
                                    className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0"
                                />
                            </div>
                            <div>
                                <h3 className="text-white font-display font-bold text-3xl group-hover:text-[#ffc000] transition-colors">{gallery.title}</h3>
                                <p className="text-slate-500 uppercase tracking-widest text-xs mt-2 font-bold">{gallery.category || 'Portfolio'}</p>
                            </div>
                        </motion.div>
                    ))}

                    {galleries.length === 0 && (
                        <div className="col-span-full py-20 text-center text-slate-500 border border-white/10 rounded-xl">
                            No galleries created yet.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
