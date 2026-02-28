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
    responseTime?: string;
}

export default function ContactClient({ data }: { data: PageData }) {
    const [formData, setFormData] = useState({
        name: '', email: '', inquiryType: data.inquiryTypes[0] || '', message: '',
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', inquiryType: data.inquiryTypes[0] || '', message: '' });
            } else setStatus('error');
        } catch { setStatus('error'); }
    };

    return (
        <div className="flex flex-col bg-[var(--app-bg)] min-h-screen text-[var(--app-text)]">

            {/* ══════════════════════════════════════════════════
                HERO — ultra-minimal typographic, no images
            ══════════════════════════════════════════════════ */}
            <section className="bg-[#090805] pt-24 md:pt-36 pb-12 md:pb-16 border border-[var(--app-border)] overflow-hidden relative mx-3 md:mx-5 mt-[104px] md:mt-[116px] rounded-[1.55rem]">
                <span
                    className="absolute right-0 bottom-0 text-[80px] sm:text-[120px] md:text-[180px] lg:text-[240px] font-display font-bold leading-none select-none pointer-events-none opacity-[0.02] text-white"
                    aria-hidden
                >
                    HELLO
                </span>

                <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-20 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                    >
                        <p className="text-[#ffc000] font-bold uppercase tracking-[0.44em] text-[10px] mb-5 md:mb-6 flex items-center gap-4">
                            <span className="w-8 md:w-10 h-px bg-[#ffc000]" />
                            Reach Out
                        </p>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[6rem] font-display font-bold leading-[0.88] tracking-tight text-white max-w-3xl">
                            {data.title}
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="mt-6 md:mt-10 pt-6 md:pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8"
                    >
                        <p className="text-[#7a7260] text-sm md:text-base leading-relaxed max-w-xl">
                            {data.subtitle}
                        </p>
                        <a
                            href={`mailto:${data.email}`}
                            className="flex-shrink-0 inline-flex items-center gap-2 text-[#ffc000] text-xs font-bold uppercase tracking-[0.26em] border-b border-[#ffc000]/40 pb-0.5 hover:text-white hover:border-white/30 transition-colors self-start"
                        >
                            {data.email}
                            <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════
                CONTENT — split: contact info left, form right
            ══════════════════════════════════════════════════ */}
            <section className="flex-1 max-w-7xl mx-auto w-full px-8 lg:px-20 py-20 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-24">

                {/* LEFT — contact info as editorial typography */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col"
                >
                    <p className="text-[#9a9078] text-lg leading-relaxed mb-16 max-w-sm">
                        {data.subtitle}
                    </p>

                    {/* Contact items — large typographic rows */}
                    <div className="flex flex-col divide-y divide-white/8">
                        <div className="pb-8 mb-0">
                            <p className="text-[10px] uppercase tracking-[0.38em] text-[#5c5544] font-bold mb-3">Email</p>
                            <a
                                href={`mailto:${data.email}`}
                                className="text-2xl md:text-3xl font-display font-bold text-white hover:text-[#ffc000] transition-colors leading-none"
                            >
                                {data.email}
                            </a>
                        </div>
                        <div className="py-8">
                            <p className="text-[10px] uppercase tracking-[0.38em] text-[#5c5544] font-bold mb-3">Phone</p>
                            <p className="text-2xl md:text-3xl font-display font-bold text-white leading-none">{data.phone}</p>
                        </div>
                        <div className="pt-8">
                            <p className="text-[10px] uppercase tracking-[0.38em] text-[#5c5544] font-bold mb-3">Studio</p>
                            <p className="text-2xl md:text-3xl font-display font-bold text-white leading-tight">{data.address}</p>
                        </div>
                    </div>

                    {/* Response time note */}
                    <div className="mt-14 flex items-center gap-3">
                        <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                        <p className="text-[#6b6250] text-xs uppercase tracking-[0.28em] font-bold">
                            {data.responseTime || 'We respond within 24 hours'}
                        </p>
                    </div>
                </motion.div>

                {/* RIGHT — message form */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.12 }}
                >
                    {status === 'success' ? (
                        <div className="h-full flex flex-col items-center justify-center py-20 text-center border border-white/10 bg-[#0d0c08]">
                            <div className="w-16 h-16 bg-[#ffc000] flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-[#090805] text-3xl">check</span>
                            </div>
                            <h3 className="text-white font-display text-2xl font-bold mb-3">Message Sent!</h3>
                            <p className="text-[#7a7260]">We will be in touch within 24 hours.</p>
                        </div>
                    ) : (
                        <div className="bg-[#0d0c08] border border-white/10 p-8 md:p-12">
                            <div className="flex items-center gap-5 mb-10">
                                <span className="w-10 h-px bg-[#ffc000]" />
                                <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[#ffc000]">Send a Message</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] uppercase tracking-[0.32em] text-[#5c5544] font-bold">
                                            Your Name
                                        </label>
                                        <input
                                            type="text" required
                                            value={formData.name}
                                            onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                                            className="bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-[#ffc000] transition-colors text-base"
                                            placeholder="Jane Doe"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] uppercase tracking-[0.32em] text-[#5c5544] font-bold">
                                            Email
                                        </label>
                                        <input
                                            type="email" required
                                            value={formData.email}
                                            onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                                            className="bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-[#ffc000] transition-colors text-base"
                                            placeholder="jane@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <label className="text-[10px] uppercase tracking-[0.32em] text-[#5c5544] font-bold">
                                        Inquiry Type
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {data.inquiryTypes.map((t, i) => (
                                            <button
                                                key={i} type="button"
                                                onClick={() => setFormData(f => ({ ...f, inquiryType: t }))}
                                                className={`px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] transition-all border ${
                                                    formData.inquiryType === t
                                                        ? 'bg-[#ffc000] text-[#090805] border-[#ffc000]'
                                                        : 'text-[#7a7260] border-white/15 hover:border-white/40 hover:text-white'
                                                }`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] uppercase tracking-[0.32em] text-[#5c5544] font-bold">
                                        Message
                                    </label>
                                    <textarea
                                        required rows={5}
                                        value={formData.message}
                                        onChange={e => setFormData(f => ({ ...f, message: e.target.value }))}
                                        className="bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-[#ffc000] transition-colors text-base resize-none"
                                        placeholder="Tell us about your project..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="mt-4 bg-[#ffc000] text-[#090805] w-full py-4 font-bold text-sm uppercase tracking-[0.22em] hover:bg-white transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                                >
                                    {status === 'loading' ? (
                                        <><div className="w-5 h-5 border-2 border-[#090805]/40 border-t-[#090805] rounded-full animate-spin" /> Sending...</>
                                    ) : (
                                        <>Submit Inquiry <span className="material-symbols-outlined text-[18px]">arrow_right_alt</span></>
                                    )}
                                </button>
                                {status === 'error' && (
                                    <p className="text-red-400 text-center text-sm">Something went wrong. Please try again.</p>
                                )}
                            </form>
                        </div>
                    )}
                </motion.div>
            </section>
        </div>
    );
}
