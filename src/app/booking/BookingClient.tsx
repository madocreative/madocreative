'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Package { name: string; description: string; price: string }
interface PageData {
    title: string;
    subtitle: string;
    packages: Package[];
    sessionTime: string;
    submitLabel: string;
    locationLabel: string;
    acceptingClients: boolean;
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

const BOOKING_HERO_IMGS = [
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971898/mado-creatives/qiojrpgavumzxuqhc8tn.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971895/mado-creatives/has4odv4qpun3uxh2wza.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971882/mado-creatives/nlw9iu68433ngreltzwt.jpg',
];

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstWeekday(y: number, m: number) { return new Date(y, m, 1).getDay(); }

export default function BookingClient({ data }: { data: PageData }) {
    // ── Hero slider state ──────────────────────────────────────
    const heroSlideVariants = {
        enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: number) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0 }),
    };
    const [heroIdx, setHeroIdx] = useState(0);
    const [heroDir, setHeroDir] = useState(1);
    const [heroPaused, setHeroPaused] = useState(false);
    const goHero = useCallback((next: number) => {
        setHeroDir(next > heroIdx ? 1 : -1);
        setHeroIdx((next + BOOKING_HERO_IMGS.length) % BOOKING_HERO_IMGS.length);
    }, [heroIdx]);
    const goHeroNext = useCallback(() => goHero(heroIdx + 1), [goHero, heroIdx]);
    const goHeroPrev = useCallback(() => goHero(heroIdx - 1), [goHero, heroIdx]);
    useEffect(() => {
        if (heroPaused) return;
        const t = setTimeout(goHeroNext, 5000);
        return () => clearTimeout(t);
    }, [heroIdx, heroPaused, goHeroNext]);

    // ── Calendar state ──────────────────────────────────────
    const now   = new Date();
    const [year,  setYear]  = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth());
    const [selected, setSelected] = useState('');
    const [pkg, setPkg] = useState(data.packages[0]?.name?.toLowerCase() || '');
    const [formData, setFormData] = useState({ name: '', email: '', projectDetails: '' });
    const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');

    const daysInMonth  = useMemo(() => getDaysInMonth(year, month), [year, month]);
    const firstWeekday = useMemo(() => getFirstWeekday(year, month), [year, month]);

    const prevMonth = () => {
        if (month === 0) { setMonth(11); setYear(y => y - 1); }
        else setMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (month === 11) { setMonth(0); setYear(y => y + 1); }
        else setMonth(m => m + 1);
    };

    const isPast = (day: number) => {
        const d = new Date(year, month, day);
        const today = new Date(); today.setHours(0, 0, 0, 0);
        return d < today;
    };

    const selectDay = (day: number) => {
        if (isPast(day)) return;
        setSelected(`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selected) { alert('Please select a date'); return; }
        setStatus('loading');
        try {
            const res = await fetch('/api/booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, date: selected, package: pkg }),
            });
            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', projectDetails: '' });
                setSelected('');
            } else setStatus('error');
        } catch { setStatus('error'); }
    };

    if (status === 'success') return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#090805] pt-24 px-6 text-center text-[#f2efe7]">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, type: 'spring' }}>
                <div className="w-20 h-20 bg-[#ffc000] flex items-center justify-center mx-auto mb-8">
                    <span className="material-symbols-outlined text-[#090805] text-4xl">check</span>
                </div>
                <h2 className="text-4xl font-display font-bold text-white mb-4">Booking Received!</h2>
                <p className="text-[#9a9078] text-lg mb-10 max-w-md mx-auto">We've received your request and will be in touch within 24 hours.</p>
                <a href="/" className="bg-[#ffc000] text-[#090805] px-10 py-4 font-bold text-sm uppercase tracking-[0.2em] hover:bg-white transition-colors inline-block">
                    Back to Home
                </a>
            </motion.div>
        </div>
    );

    return (
        <div className="flex flex-col bg-[#090805] min-h-screen text-[#f2efe7]">

            {/* ══════════════════════════════════════════════════
                HERO — full-width image slider
            ══════════════════════════════════════════════════ */}
            <section
                className="relative h-[55vh] md:h-[62vh] overflow-hidden bg-[#090805]"
                onMouseEnter={() => setHeroPaused(true)}
                onMouseLeave={() => setHeroPaused(false)}
            >
                {/* Slides */}
                <AnimatePresence initial={false} custom={heroDir} mode="popLayout">
                    <motion.div
                        key={heroIdx}
                        custom={heroDir}
                        variants={heroSlideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.55, ease: [0.32, 0, 0.67, 0] }}
                        className="absolute inset-0"
                    >
                        {/* Blurred ambient background */}
                        <img
                            src={BOOKING_HERO_IMGS[heroIdx]}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-30"
                            aria-hidden="true"
                        />
                        {/* Full image — object-contain so nothing is cropped */}
                        <img
                            src={BOOKING_HERO_IMGS[heroIdx]}
                            alt=""
                            className="relative z-10 w-full h-full object-contain"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#090805]/90 via-[#090805]/60 to-[#090805]/10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090805] via-transparent to-[#090805]/30 pointer-events-none" />

                {/* Text overlay */}
                <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-8 lg:px-20 max-w-[600px] pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                    >
                        <p className="text-[#ffc000] font-bold uppercase tracking-[0.44em] text-[10px] mb-5 md:mb-6 flex items-center gap-4">
                            <span className="w-8 md:w-10 h-px bg-[#ffc000]" />
                            Schedule a Session
                        </p>
                        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[0.92] tracking-tight mb-4 md:mb-5">
                            {data.title}
                        </h1>
                        <p className="text-[#b0a890] text-sm md:text-base leading-relaxed max-w-sm mb-4 hidden sm:block">
                            {data.subtitle}
                        </p>
                        <div className="flex items-center gap-3">
                            <span className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${data.acceptingClients ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`} />
                            <span className="text-white font-bold text-xs md:text-sm uppercase tracking-[0.2em]">
                                {data.acceptingClients ? 'Accepting Clients' : 'Fully Booked'}
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* Prev / Next arrows */}
                <button
                    onClick={goHeroPrev}
                    className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 bg-black/40 hover:bg-[#ffc000] text-white hover:text-[#090805] border border-white/10 hover:border-[#ffc000] backdrop-blur-sm flex items-center justify-center transition-all duration-200 z-10 group"
                    aria-label="Previous"
                >
                    <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">chevron_left</span>
                </button>
                <button
                    onClick={goHeroNext}
                    className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 bg-black/40 hover:bg-[#ffc000] text-white hover:text-[#090805] border border-white/10 hover:border-[#ffc000] backdrop-blur-sm flex items-center justify-center transition-all duration-200 z-10 group"
                    aria-label="Next"
                >
                    <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">chevron_right</span>
                </button>

                {/* Dot indicators */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                    {BOOKING_HERO_IMGS.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => { setHeroDir(i > heroIdx ? 1 : -1); setHeroIdx(i); }}
                            className={`transition-all duration-300 rounded-full ${i === heroIdx
                                ? 'bg-[#ffc000] w-6 h-1.5'
                                : 'bg-white/30 hover:bg-white/60 w-1.5 h-1.5'
                            }`}
                            aria-label={`Slide ${i + 1}`}
                        />
                    ))}
                </div>

                {/* Auto-play progress bar */}
                {!heroPaused && (
                    <motion.div
                        key={`progress-${heroIdx}`}
                        className="absolute bottom-0 left-0 h-[3px] bg-[#ffc000] z-10"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 5, ease: 'linear' }}
                    />
                )}
            </section>

            {/* Subtitle bar */}
            <div className="bg-[#0d0c08] border-b border-white/5 px-8 lg:px-20 py-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center gap-3 md:gap-10">
                    <p className="text-[#9a9078] text-base leading-relaxed max-w-xl">{data.subtitle}</p>
                    <div className="flex items-center gap-2 text-[#6b6250] text-xs uppercase tracking-[0.28em] font-bold flex-shrink-0 md:ml-auto">
                        <span className="material-symbols-outlined text-[#ffc000] text-[14px]">location_on</span>
                        {data.locationLabel}
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════
                BOOKING FORM
            ══════════════════════════════════════════════════ */}
            <main className="max-w-7xl mx-auto w-full px-8 lg:px-20 py-16">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                    {/* Calendar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="lg:col-span-5 bg-[#0d0c08] border border-white/10 p-8 h-fit"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <span className="w-8 h-px bg-[#ffc000]" />
                            <h2 className="text-xs font-bold text-[#ffc000] uppercase tracking-[0.32em]">Select a Date</h2>
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <button type="button" onClick={prevMonth}
                                className="w-8 h-8 bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#9a9078] hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-sm">chevron_left</span>
                            </button>
                            <span className="font-bold text-white min-w-[160px] text-center text-sm uppercase tracking-widest">
                                {MONTHS[month]} {year}
                            </span>
                            <button type="button" onClick={nextMonth}
                                className="w-8 h-8 bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#9a9078] hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {DAYS.map(d => (
                                <div key={d} className="text-center text-[10px] font-bold text-[#5c5544] py-2 uppercase tracking-widest">{d}</div>
                            ))}
                            {Array.from({ length: firstWeekday }).map((_, i) => <div key={`e-${i}`} />)}
                            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                                const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                                const isSelected = selected === dateStr;
                                const past = isPast(day);
                                return (
                                    <button key={day} type="button" disabled={past} onClick={() => selectDay(day)}
                                        className={`aspect-square flex items-center justify-center text-sm font-medium transition-all
                                            ${past ? 'text-[#3a3530] cursor-not-allowed' : 'hover:text-[#ffc000] hover:bg-[#ffc000]/10'}
                                            ${isSelected ? 'bg-[#ffc000] text-[#090805] font-bold' : ''}
                                            ${!isSelected && !past ? 'text-[#c3bcab]' : ''}`}
                                    >{day}</button>
                                );
                            })}
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10">
                            <div className="flex items-center gap-2 text-sm text-[#7a7260]">
                                <span className="material-symbols-outlined text-[#ffc000] text-[16px]">schedule</span>
                                {data.sessionTime}
                            </div>
                        </div>

                        {selected && (
                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                className="mt-4 p-4 bg-[#ffc000] text-[#090805] text-center">
                                <p className="font-bold text-sm uppercase tracking-[0.18em]">
                                    {new Date(selected + 'T12:00:00').toLocaleDateString('en-US', {
                                        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
                                    })}
                                </p>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Right — packages + details */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="lg:col-span-7 flex flex-col gap-12"
                    >
                        {/* Packages */}
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <span className="w-8 h-px bg-[#ffc000]" />
                                <h3 className="text-xs font-bold uppercase tracking-[0.32em] text-[#ffc000]">
                                    01 — Select Package
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {data.packages.map((p, i) => {
                                    const val = p.name.toLowerCase();
                                    const active = pkg === val;
                                    return (
                                        <label key={i}
                                            className={`cursor-pointer p-6 border transition-all ${
                                                active
                                                    ? 'border-[#ffc000] bg-[#ffc000]/5'
                                                    : 'border-white/10 bg-[#0d0c08] hover:border-white/25'
                                            }`}>
                                            <input type="radio" value={val} checked={active} onChange={() => setPkg(val)} className="hidden" />
                                            <div className="flex justify-between items-start mb-4">
                                                <h4 className="font-display font-bold text-white text-xl uppercase">{p.name}</h4>
                                                <span className={`material-symbols-outlined text-[20px] ${active ? 'text-[#ffc000]' : 'text-[#5c5544]'}`}>
                                                    {active ? 'radio_button_checked' : 'radio_button_unchecked'}
                                                </span>
                                            </div>
                                            <p className="text-[#7a7260] text-sm mb-5 leading-relaxed">{p.description}</p>
                                            <p className="font-display font-bold text-[#ffc000] text-2xl">{p.price}</p>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Details */}
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <span className="w-8 h-px bg-[#ffc000]" />
                                <h3 className="text-xs font-bold uppercase tracking-[0.32em] text-[#ffc000]">
                                    02 — Your Details
                                </h3>
                            </div>

                            <div className="flex flex-col gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#5c5544]">Full Name</label>
                                        <input type="text" required value={formData.name}
                                            onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                                            className="bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-[#ffc000] transition-colors text-base"
                                            placeholder="Jane Doe" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#5c5544]">Email Address</label>
                                        <input type="email" required value={formData.email}
                                            onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                                            className="bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-[#ffc000] transition-colors text-base"
                                            placeholder="jane@brand.com" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#5c5544]">Project Details</label>
                                    <textarea required rows={5} value={formData.projectDetails}
                                        onChange={e => setFormData(f => ({ ...f, projectDetails: e.target.value }))}
                                        className="bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-[#ffc000] transition-colors text-base resize-none"
                                        placeholder="Describe your vision, location preferences, and any specific requirements..." />
                                </div>

                                <button type="submit"
                                    disabled={status === 'loading' || !data.acceptingClients}
                                    className="bg-[#ffc000] text-[#090805] py-5 font-bold text-sm uppercase tracking-[0.22em] hover:bg-white transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                                >
                                    {status === 'loading'
                                        ? <><div className="w-5 h-5 border-2 border-[#090805]/40 border-t-[#090805] rounded-full animate-spin" /> Processing...</>
                                        : <>{data.submitLabel} <span className="material-symbols-outlined">arrow_right_alt</span></>
                                    }
                                </button>
                                {status === 'error' && (
                                    <p className="text-red-400 text-center text-sm">Something went wrong. Please try again.</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </form>
            </main>
        </div>
    );
}
