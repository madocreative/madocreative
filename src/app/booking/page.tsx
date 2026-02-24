'use client';

import { useState } from 'react';

export default function BookingPage() {
    const [formData, setFormData] = useState({
        date: '',
        package: 'campaign',
        name: '',
        email: '',
        projectDetails: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.date) {
            alert("Please select a date from the calendar");
            return;
        }

        setStatus('loading');
        try {
            const res = await fetch('/api/booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setStatus('success');
                setFormData({ date: '', package: 'campaign', name: '', email: '', projectDetails: '' });
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    // Simple static calendar component generation for demo purposes
    const renderCalendar = () => {
        const days = Array.from({ length: 31 }, (_, i) => i + 1);
        const today = new Date().getDate();
        return (
            <div className="grid grid-cols-7 gap-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-center text-xs font-bold text-slate-500 py-2">{day}</div>
                ))}
                {Array.from({ length: 3 }).map((_, i) => <div key={`empty-${i}`}></div>)} {/* Padding */}
                {days.map(day => {
                    const isSelected = formData.date === `2024-10-${day.toString().padStart(2, '0')}`;
                    const isPast = day < today;
                    return (
                        <button
                            key={day}
                            type="button"
                            disabled={isPast}
                            onClick={() => setFormData({ ...formData, date: `2024-10-${day.toString().padStart(2, '0')}` })}
                            className={`
                aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all
                ${isPast ? 'text-slate-600 opacity-50 cursor-not-allowed' : 'hover:border-[#f2b90d] hover:text-[#f2b90d] border border-transparent'}
                ${isSelected ? 'bg-[#f2b90d] text-[#0a0a08] font-bold border-[#f2b90d]' : 'text-slate-300'}
                ${!isSelected && !isPast ? 'bg-white/5' : ''}
              `}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="flex flex-col pt-24 min-h-screen">
            <main className="max-w-7xl mx-auto w-full px-6 py-12 lg:py-24">
                {/* Header content */}
                <div className="flex flex-col lg:flex-row justify-between items-start mb-16 gap-8">
                    <div className="max-w-2xl">
                        <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">Book a Session</h1>
                        <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed">
                            Reserve your exclusive photoshoot with our award-winning creative team. We curate every detail to ensure your vision is realized flawlessly.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 items-start lg:items-end">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-green-500"></span>
                            <span className="text-white font-medium">Accepting New Clients</span>
                        </div>
                        <p className="text-slate-500 text-sm">Paris HQ • Worldwide Travel</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                    {/* Left Column: Calendar */}
                    <div className="lg:col-span-5 bg-[#1a1812] rounded-xl p-8 border border-white/10 shadow-xl h-fit">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-display font-bold text-white">Select a Date</h2>
                            <div className="flex gap-4 items-center">
                                <button type="button" className="text-slate-400 hover:text-white"><span className="material-symbols-outlined">chevron_left</span></button>
                                <span className="font-bold text-white">October 2024</span>
                                <button type="button" className="text-slate-400 hover:text-white"><span className="material-symbols-outlined">chevron_right</span></button>
                            </div>
                        </div>

                        {renderCalendar()}

                        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#f2b90d]">schedule</span>
                                <span className="text-sm text-slate-300">All sessions start at 9:00 AM CET</span>
                            </div>
                        </div>

                        {formData.date && (
                            <div className="mt-4 p-4 bg-[#f2b90d]/10 border border-[#f2b90d]/30 rounded-lg text-center">
                                <p className="text-[#f2b90d] font-bold">Selected: {formData.date}</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Form Details */}
                    <div className="lg:col-span-7 flex flex-col gap-10">
                        {/* Package Selection */}
                        <div className="flex flex-col gap-6">
                            <h3 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">1</span>
                                Select Package
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label className={`cursor-pointer group relative p-6 rounded-xl border transition-all ${formData.package === 'editorial' ? 'border-[#f2b90d] bg-[#f2b90d]/5' : 'border-white/10 bg-[#1a1812] hover:border-white/30'}`}>
                                    <input type="radio" value="editorial" checked={formData.package === 'editorial'} onChange={(e) => setFormData({ ...formData, package: e.target.value })} className="hidden" />
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-bold text-white text-lg">Editorial</h4>
                                        <span className={`material-symbols-outlined ${formData.package === 'editorial' ? 'text-[#f2b90d]' : 'text-slate-600'}`}>{formData.package === 'editorial' ? 'radio_button_checked' : 'radio_button_unchecked'}</span>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-4">Perfect for magazine submissions and high-fashion spreads.</p>
                                    <p className="font-display font-bold text-[#f2b90d]">From $2,500</p>
                                </label>

                                <label className={`cursor-pointer group relative p-6 rounded-xl border transition-all ${formData.package === 'campaign' ? 'border-[#f2b90d] bg-[#f2b90d]/5' : 'border-white/10 bg-[#1a1812] hover:border-white/30'}`}>
                                    <input type="radio" value="campaign" checked={formData.package === 'campaign'} onChange={(e) => setFormData({ ...formData, package: e.target.value })} className="hidden" />
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-bold text-white text-lg">Campaign</h4>
                                        <span className={`material-symbols-outlined ${formData.package === 'campaign' ? 'text-[#f2b90d]' : 'text-slate-600'}`}>{formData.package === 'campaign' ? 'radio_button_checked' : 'radio_button_unchecked'}</span>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-4">Comprehensive commercial shoots for major brand releases.</p>
                                    <p className="font-display font-bold text-[#f2b90d]">From $8,000</p>
                                </label>
                            </div>
                        </div>

                        {/* Personal Details */}
                        <div className="flex flex-col gap-6">
                            <h3 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">2</span>
                                Your Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                                    <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="bg-[#1a1812] border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-[#f2b90d] transition-colors" placeholder="Jane Doe" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                                    <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="bg-[#1a1812] border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-[#f2b90d] transition-colors" placeholder="jane@brand.com" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Project Details</label>
                                <textarea required value={formData.projectDetails} onChange={e => setFormData({ ...formData, projectDetails: e.target.value })} rows={4} className="bg-[#1a1812] border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-[#f2b90d] transition-colors resize-none" placeholder="Briefly describe your vision, location preferences, and any specific requirements..."></textarea>
                            </div>

                            <div className="mt-6">
                                <button type="submit" disabled={status === 'loading'} className="w-full bg-[#f2b90d] text-[#0a0a08] py-4 rounded-lg font-bold text-lg uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all flex justify-center items-center gap-2">
                                    {status === 'loading' ? 'Processing...' : (
                                        <>
                                            Request Booking <span className="material-symbols-outlined">arrow_right_alt</span>
                                        </>
                                    )}
                                </button>
                                {status === 'success' && <p className="text-green-400 mt-4 text-center">Booking request received! We will be in touch shortly.</p>}
                                {status === 'error' && <p className="text-red-400 mt-4 text-center">There was an error submitting your request.</p>}
                            </div>
                        </div>

                    </div>
                </form>
            </main>
        </div>
    );
}
