'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface PageData {
    title: string;
    subtitle: string;
    inquiryTypes: string[];
    email: string;
    phone: string;
    address: string;
}

// Hero strip images
const CONTACT_HERO_IMGS = [
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971899/mado-creatives/elx1jzuiydmyntvisbwm.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971900/mado-creatives/mbjmpnxnjrmfre3ctxan.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971901/mado-creatives/nm1vvf8uukzdsq6ubiyq.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971892/mado-creatives/zupngrotm2mt5yqblvta.jpg',
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };

export default function ContactClient({ data }: { data: PageData }) {
    const [formData, setFormData] = useState({ name: '', email: '', inquiryType: data.inquiryTypes[0] || '', message: '' });
    const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) { setStatus('success'); setFormData({ name: '', email: '', inquiryType: data.inquiryTypes[0] || '', message: '' }); }
            else setStatus('error');
        } catch { setStatus('error'); }
    };

    return (
        <div className="flex flex-col bg-[#0a0a08] min-h-screen">
            {/* ── Hero — horizontal photo strip ──────────────────────── */}
            <section className="relative h-[38vh] overflow-hidden">
                <div className="absolute inset-0 flex gap-px">
                    {CONTACT_HERO_IMGS.map((img, i) => (
                        <div key={i} className={`overflow-hidden ${i === 0 ? 'flex-[2]' : 'flex-1'}`}>
                            <img src={img} alt="" className="w-full h-full object-contain" />
                        </div>
                    ))}
                </div>
                <div className="absolute inset-0 bg-[#0a0a08]/30 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-14 bg-[#0a0a08]" />
                <div className="absolute inset-0 flex flex-col items-start justify-end pb-20 px-6 lg:px-16 max-w-7xl mx-auto w-full">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
                        <p className="text-[#ffc000] font-bold uppercase tracking-[0.4em] text-xs mb-2">Reach Out</p>
                        <h1 className="text-4xl md:text-6xl font-display font-extrabold uppercase text-white leading-none">
                            {data.title}
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* ── Content ───────────────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-6 lg:px-16 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16 w-full">
                {/* Left — contact info */}
                <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.7 }}
                    className="flex flex-col"
                >
                    <p className="text-slate-400 text-lg mb-14 max-w-md font-light leading-relaxed">{data.subtitle}</p>

                    <div className="flex flex-col gap-0 border-t border-white/10">
                        {/* Email */}
                        <div className="flex items-center gap-6 py-8 border-b border-white/10">
                            <div className="w-12 h-12 bg-[#ffc000] flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[#0a0a08]">mail</span>
                            </div>
                            <div>
                                <p className="text-slate-600 font-bold uppercase tracking-widest text-xs mb-1">Email</p>
                                <a href={`mailto:${data.email}`} className="text-xl text-white hover:text-[#ffc000] transition-colors font-medium">{data.email}</a>
                            </div>
                        </div>
                        {/* Phone */}
                        <div className="flex items-center gap-6 py-8 border-b border-white/10">
                            <div className="w-12 h-12 bg-[#111109] border border-white/10 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[#ffc000]">phone_in_talk</span>
                            </div>
                            <div>
                                <p className="text-slate-600 font-bold uppercase tracking-widest text-xs mb-1">Phone</p>
                                <p className="text-xl text-white font-medium">{data.phone}</p>
                            </div>
                        </div>
                        {/* Studio */}
                        <div className="flex items-center gap-6 py-8">
                            <div className="w-12 h-12 bg-[#111109] border border-white/10 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[#ffc000]">location_on</span>
                            </div>
                            <div>
                                <p className="text-slate-600 font-bold uppercase tracking-widest text-xs mb-1">Studio</p>
                                <p className="text-xl text-white font-medium">{data.address}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right — Form */}
                <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}
                    className="bg-[#111109] border border-white/10 p-8 md:p-10"
                >
                    {status === 'success' ? (
                        <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                            <div className="w-16 h-16 bg-[#ffc000] flex items-center justify-center mb-5">
                                <span className="material-symbols-outlined text-[#0a0a08] text-3xl">check</span>
                            </div>
                            <h3 className="text-white font-display text-2xl font-bold mb-3 uppercase">Message Sent!</h3>
                            <p className="text-slate-400">We will be in touch within 24 hours.</p>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-2xl font-display font-extrabold text-white mb-8 uppercase">Send a Message</h3>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs uppercase tracking-widest text-slate-500 font-bold">Your Name</label>
                                        <input type="text" required value={formData.name} onChange={e => setFormData(f => ({...f, name: e.target.value}))}
                                            className="bg-[#0a0a08] border border-white/10 px-4 py-4 text-white focus:outline-none focus:border-[#ffc000] transition-colors text-sm"
                                            placeholder="Jane Doe" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs uppercase tracking-widest text-slate-500 font-bold">Email</label>
                                        <input type="email" required value={formData.email} onChange={e => setFormData(f => ({...f, email: e.target.value}))}
                                            className="bg-[#0a0a08] border border-white/10 px-4 py-4 text-white focus:outline-none focus:border-[#ffc000] transition-colors text-sm"
                                            placeholder="jane@example.com" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs uppercase tracking-widest text-slate-500 font-bold">Inquiry Type</label>
                                    <div className="flex flex-wrap gap-1">
                                        {data.inquiryTypes.map((t, i) => (
                                            <button key={i} type="button"
                                                onClick={() => setFormData(f => ({...f, inquiryType: t}))}
                                                className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all border ${formData.inquiryType === t ? 'bg-[#ffc000] text-[#0a0a08] border-[#ffc000]' : 'bg-transparent text-slate-400 border-white/15 hover:border-white/40 hover:text-white'}`}
                                            >{t}</button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs uppercase tracking-widest text-slate-500 font-bold">Message</label>
                                    <textarea required rows={5} value={formData.message} onChange={e => setFormData(f => ({...f, message: e.target.value}))}
                                        className="bg-[#0a0a08] border border-white/10 px-4 py-4 text-white focus:outline-none focus:border-[#ffc000] transition-colors text-sm resize-none"
                                        placeholder="Tell us about your project..."></textarea>
                                </div>

                                <button type="submit" disabled={status === 'loading'}
                                    className="mt-2 bg-[#ffc000] text-[#0a0a08] w-full py-4 font-bold text-base uppercase tracking-wider hover:bg-white transition-colors flex justify-center items-center gap-2 disabled:opacity-50">
                                    {status === 'loading'
                                        ? <><div className="w-5 h-5 border-2 border-[#0a0a08]/40 border-t-[#0a0a08] rounded-full animate-spin"></div> Sending...</>
                                        : 'Submit Inquiry'
                                    }
                                </button>
                                {status === 'error' && <p className="text-red-400 text-center text-sm">Something went wrong. Please try again.</p>}
                            </form>
                        </>
                    )}
                </motion.div>
            </section>
        </div>
    );
}
