'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

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

// A handful of known Cloudinary images used for the booking page hero strip
const BOOKING_HERO_IMGS = [
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971898/mado-creatives/qiojrpgavumzxuqhc8tn.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971895/mado-creatives/has4odv4qpun3uxh2wza.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971882/mado-creatives/nlw9iu68433ngreltzwt.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971887/mado-creatives/enbiztasgcryipz6x8py.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971891/mado-creatives/kw9xzrjaw2mk62tv7z0o.jpg',
];

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstWeekday(y: number, m: number) { return new Date(y, m, 1).getDay(); }

export default function BookingClient({ data }: { data: PageData }) {
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
        const today = new Date(); today.setHours(0,0,0,0);
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a08] pt-24 px-6 text-center">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, type: 'spring' }}>
                <div className="w-20 h-20 bg-[#ffc000] flex items-center justify-center mx-auto mb-8">
                    <span className="material-symbols-outlined text-[#0a0a08] text-4xl">check</span>
                </div>
                <h2 className="text-4xl font-display font-extrabold text-white mb-4 uppercase">Booking Received!</h2>
                <p className="text-slate-400 text-lg mb-10 max-w-md mx-auto">We've received your request and will be in touch within 24 hours.</p>
                <a href="/" className="bg-[#ffc000] text-[#0a0a08] px-10 py-4 font-bold text-lg uppercase tracking-wider hover:bg-white transition-colors">
                    Back to Home
                </a>
            </motion.div>
        </div>
    );

    return (
        <div className="flex flex-col bg-[#0a0a08] min-h-screen">
            {/* ── Hero — horizontal photo strip ──────────────────────── */}
            <section className="relative h-[38vh] overflow-hidden">
                <div className="absolute inset-0 flex gap-px">
                    {BOOKING_HERO_IMGS.map((img, i) => (
                        <div key={i} className={`overflow-hidden ${i === 0 ? 'flex-[2]' : 'flex-1'}`}>
                            <img src={img} alt="" className="w-full h-full object-contain" />
                        </div>
                    ))}
                </div>
                <div className="absolute inset-0 bg-[#0a0a08]/35 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-14 bg-[#0a0a08]" />
                <div className="absolute inset-0 flex flex-col items-start justify-end pb-20 px-6 lg:px-16 max-w-7xl mx-auto w-full">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
                        <p className="text-[#ffc000] font-bold uppercase tracking-[0.4em] text-xs mb-2">Schedule a Session</p>
                        <div className="flex items-end gap-5 flex-wrap">
                            <h1 className="text-4xl md:text-6xl font-display font-extrabold uppercase text-white leading-none">
                                {data.title}
                            </h1>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`w-2.5 h-2.5 rounded-full ${data.acceptingClients ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                <span className="text-white font-bold text-sm">{data.acceptingClients ? 'Accepting Clients' : 'Fully Booked'}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Subtitle bar ─────────────────────────────────────────── */}
            <div className="bg-[#0a0a08] border-b border-white/5 px-6 lg:px-16 py-8 max-w-7xl mx-auto w-full">
                <p className="text-slate-400 text-lg font-light leading-relaxed max-w-2xl">{data.subtitle}</p>
                <p className="text-slate-600 text-sm mt-2">{data.locationLabel}</p>
            </div>

            {/* ── Booking form ─────────────────────────────────────────── */}
            <main className="max-w-7xl mx-auto w-full px-6 lg:px-16 py-16">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    {/* Calendar */}
                    <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.7, delay:0.1 }}
                        className="lg:col-span-5 bg-[#111109] border border-white/10 p-8 h-fit"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-lg font-display font-bold text-white uppercase tracking-wider">Select a Date</h2>
                            <div className="flex gap-2 items-center">
                                <button type="button" onClick={prevMonth} className="w-8 h-8 bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                                </button>
                                <span className="font-bold text-white min-w-[140px] text-center text-sm">{MONTHS[month]} {year}</span>
                                <button type="button" onClick={nextMonth} className="w-8 h-8 bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {DAYS.map(d => (
                                <div key={d} className="text-center text-xs font-bold text-slate-600 py-2">{d}</div>
                            ))}
                            {Array.from({ length: firstWeekday }).map((_, i) => <div key={`e-${i}`}></div>)}
                            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                                const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                                const isSelected = selected === dateStr;
                                const past = isPast(day);
                                return (
                                    <button key={day} type="button" disabled={past} onClick={() => selectDay(day)}
                                        className={`aspect-square flex items-center justify-center text-sm font-medium transition-all
                                            ${past ? 'text-slate-700 cursor-not-allowed' : 'hover:text-[#ffc000] hover:bg-[#ffc000]/10'}
                                            ${isSelected ? 'bg-[#ffc000] text-[#0a0a08] font-bold' : ''}
                                            ${!isSelected && !past ? 'text-slate-300' : ''}`}
                                    >{day}</button>
                                );
                            })}
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10">
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <span className="material-symbols-outlined text-[#ffc000] text-[16px]">schedule</span>
                                {data.sessionTime}
                            </div>
                        </div>

                        {selected && (
                            <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                                className="mt-4 p-4 bg-[#ffc000] text-[#0a0a08] text-center">
                                <p className="font-bold text-sm">
                                    <span className="material-symbols-outlined text-[14px] align-middle mr-1">event</span>
                                    {new Date(selected + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Right */}
                    <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.7, delay:0.2 }}
                        className="lg:col-span-7 flex flex-col gap-10"
                    >
                        {/* Packages */}
                        <div className="flex flex-col gap-5">
                            <h3 className="text-xl font-display font-bold text-white uppercase tracking-wider flex items-center gap-3">
                                <span className="text-[#ffc000] font-mono text-sm">01</span> Select Package
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                                {data.packages.map((p, i) => {
                                    const val = p.name.toLowerCase();
                                    const active = pkg === val;
                                    return (
                                        <label key={i} className={`cursor-pointer p-6 border transition-all ${active ? 'border-[#ffc000] bg-[#ffc000]/5' : 'border-white/10 bg-[#111109] hover:border-white/30'}`}>
                                            <input type="radio" value={val} checked={active} onChange={() => setPkg(val)} className="hidden" />
                                            <div className="flex justify-between items-start mb-4">
                                                <h4 className="font-bold text-white text-lg uppercase">{p.name}</h4>
                                                <span className={`material-symbols-outlined ${active ? 'text-[#ffc000]' : 'text-slate-600'}`}>
                                                    {active ? 'radio_button_checked' : 'radio_button_unchecked'}
                                                </span>
                                            </div>
                                            <p className="text-slate-400 text-sm mb-4 leading-relaxed">{p.description}</p>
                                            <p className="font-display font-bold text-[#ffc000] text-xl">{p.price}</p>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex flex-col gap-5">
                            <h3 className="text-xl font-display font-bold text-white uppercase tracking-wider flex items-center gap-3">
                                <span className="text-[#ffc000] font-mono text-sm">02</span> Your Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Full Name</label>
                                    <input type="text" required value={formData.name} onChange={e => setFormData(f => ({...f, name: e.target.value}))}
                                        className="bg-[#111109] border border-white/10 px-4 py-4 text-white focus:outline-none focus:border-[#ffc000] transition-colors text-sm"
                                        placeholder="Jane Doe" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Email Address</label>
                                    <input type="email" required value={formData.email} onChange={e => setFormData(f => ({...f, email: e.target.value}))}
                                        className="bg-[#111109] border border-white/10 px-4 py-4 text-white focus:outline-none focus:border-[#ffc000] transition-colors text-sm"
                                        placeholder="jane@brand.com" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Project Details</label>
                                <textarea required rows={5} value={formData.projectDetails} onChange={e => setFormData(f => ({...f, projectDetails: e.target.value}))}
                                    className="bg-[#111109] border border-white/10 px-4 py-4 text-white focus:outline-none focus:border-[#ffc000] transition-colors text-sm resize-none"
                                    placeholder="Describe your vision, location preferences, and any specific requirements..." />
                            </div>

                            <button type="submit" disabled={status === 'loading' || !data.acceptingClients}
                                className="w-full bg-[#ffc000] text-[#0a0a08] py-5 font-bold text-base uppercase tracking-wider hover:bg-white transition-colors flex justify-center items-center gap-2 disabled:opacity-50">
                                {status === 'loading'
                                    ? <><div className="w-5 h-5 border-2 border-[#0a0a08]/40 border-t-[#0a0a08] rounded-full animate-spin"></div> Processing...</>
                                    : <>{data.submitLabel} <span className="material-symbols-outlined">arrow_right_alt</span></>
                                }
                            </button>
                            {status === 'error' && <p className="text-red-400 text-center text-sm">Something went wrong. Please try again.</p>}
                        </div>
                    </motion.div>
                </form>
            </main>
        </div>
    );
}
