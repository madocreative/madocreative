'use client';

import { motion } from 'framer-motion';

export default function PortfolioClient({ galleries }: { galleries: any[] }) {
    return (
        <div className="bg-[#0a0a08] min-h-screen pt-32 pb-24 text-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-20 text-center"
                >
                    <p className="text-[#ffc000] font-bold uppercase tracking-widest text-sm mb-6">Our Work</p>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-medium mb-6">Selected Archives</h1>
                    <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto">
                        A curated collection of our finest editorial, commercial, and high-fashion photography campaigns.
                    </p>
                </motion.div>

                {galleries.map((gallery, idx) => (
                    <motion.div
                        key={gallery._id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="mb-32"
                    >
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-white/10 pb-6 gap-4">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-display font-bold text-white group-hover:text-[#ffc000] transition-colors">
                                    {gallery.title}
                                </h2>
                                {gallery.category && (
                                    <p className="text-[#ffc000] font-bold uppercase tracking-widest text-xs mt-3">
                    // {gallery.category}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Gallery Images Layout (Masonry or Grid) */}
                        <div className={`grid gap-4 ${gallery.layout === 'masonry' ? 'grid-cols-2 md:grid-cols-3 md:columns-3' : 'grid-cols-2 md:grid-cols-4'}`}>

                            {/* Featured Image First */}
                            <div className={`${gallery.layout === 'masonry' ? 'col-span-full md:col-span-2 row-span-2' : 'col-span-full md:col-span-2 row-span-2'} relative group overflow-hidden bg-[#1a1812] rounded-xl border border-white/5`}>
                                <img src={gallery.featuredImage} alt={gallery.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" style={{ minHeight: '400px' }} />
                            </div>

                            {/* Remaining Images */}
                            {gallery.images?.map((img: string, i: number) => (
                                <div key={i} className="relative group overflow-hidden bg-[#1a1812] rounded-xl border border-white/5 aspect-square">
                                    <img src={img} alt={`${gallery.title} ${i}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}

                {galleries.length === 0 && (
                    <div className="py-24 text-center border border-white/10 rounded-2xl">
                        <p className="text-2xl text-slate-500 font-display">No galleries published yet.</p>
                    </div>
                )}

            </div>
        </div>
    );
}
