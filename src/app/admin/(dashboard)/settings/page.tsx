'use client';

import { useState, useEffect } from 'react';

export default function SettingsPage() {
    const [form, setForm] = useState({
        siteName: 'Mado Creatives',
        tagline: '',
        email: '',
        phone: '',
        address: '',
        locationLabel: '',
        instagramUrl: '',
        twitterUrl: '',
        youtubeUrl: '',
        bookingCta: 'Book a Session',
        acceptingClients: true,
    });
    const [status, setStatus] = useState<'loading' | 'idle' | 'saving' | 'success' | 'error'>('loading');

    useEffect(() => {
        fetch('/api/admin/settings')
            .then(r => r.json())
            .then(d => {
                if (d.success && d.data) {
                    const { key: _k, _id, __v, updatedAt, ...rest } = d.data;
                    setForm(f => ({ ...f, ...rest }));
                }
                setStatus('idle');
            })
            .catch(() => setStatus('idle'));
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('saving');
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (res.ok) { setStatus('success'); setTimeout(() => setStatus('idle'), 3000); }
            else setStatus('error');
        } catch { setStatus('error'); }
    };

    if (status === 'loading') return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-[#ffc000] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const Field = ({ label, name, type = 'text', placeholder = '' }: { label: string; name: keyof typeof form; type?: string; placeholder?: string }) => (
        <div className="flex flex-col gap-2 relative group">
            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-[#ffc000] transition-colors ml-1">{label}</label>
            <input
                type={type}
                value={String(form[name])}
                onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                placeholder={placeholder}
                className="bg-[#1a1812] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:border-[#ffc000] focus:ring-1 focus:ring-[#ffc000]/50 outline-none transition-all shadow-inner text-sm w-full"
            />
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto pb-24 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">Site Settings</h1>
                    <p className="text-slate-400">Configure global site information, contact details, and social links.</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 flex flex-col gap-8">
                    {/* Identity */}
                    <section className="bg-[#111109] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col gap-8 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffc000]/5 blur-[80px] pointer-events-none" />
                        <h2 className="font-display font-bold text-white text-xl border-b border-white/5 pb-4 flex items-center gap-3 relative z-10">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                                <span className="material-symbols-outlined text-[#ffc000] text-[18px]">badge</span>
                            </div>
                            Studio Identity
                        </h2>

                        <div className="flex flex-col gap-6 relative z-10">
                            <Field label="Studio Name" name="siteName" placeholder="Mado Creatives" />

                            <div className="flex flex-col gap-2 relative group">
                                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-[#ffc000] transition-colors ml-1">Tagline (Footer Description)</label>
                                <textarea
                                    value={form.tagline}
                                    onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))}
                                    rows={3}
                                    className="bg-[#1a1812] border border-white/10 rounded-xl px-5 py-3.5 text-slate-300 focus:border-[#ffc000] focus:ring-1 focus:ring-[#ffc000]/50 outline-none resize-none transition-all shadow-inner text-sm leading-relaxed"
                                    placeholder="An independent creative studio..."
                                />
                            </div>

                            <Field label="Booking Button Label" name="bookingCta" placeholder="Book a Session" />
                        </div>
                    </section>

                    {/* Contact */}
                    <section className="bg-[#111109] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col gap-8 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] pointer-events-none" />
                        <h2 className="font-display font-bold text-white text-xl border-b border-white/5 pb-4 flex items-center gap-3 relative z-10">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                                <span className="material-symbols-outlined text-blue-400 text-[18px]">contacts</span>
                            </div>
                            Contact Details
                        </h2>

                        <div className="flex flex-col gap-6 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Field label="Email Address" name="email" type="email" placeholder="hello@madocreatives.com" />
                                <Field label="Phone Number" name="phone" placeholder="+33 (0) 1 23 45 67 89" />
                            </div>
                            <Field label="Studio Address" name="address" placeholder="12 Rue de l'Avenir, Paris" />
                            <Field label="Location Label (shown on booking page)" name="locationLabel" placeholder="Paris HQ • Worldwide Travel" />
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-8">
                    {/* Status Toggle */}
                    <section className="bg-[#111109] border border-white/5 rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden flex flex-col items-center justify-center text-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-[#1a1812] border border-white/5 flex items-center justify-center shadow-inner mb-2">
                            <span className={`material-symbols-outlined text-[32px] transition-colors duration-500 ${form.acceptingClients ? 'text-green-500' : 'text-slate-600'}`}>
                                {form.acceptingClients ? 'check_circle' : 'do_not_disturb_on'}
                            </span>
                        </div>
                        <div>
                            <p className="text-white font-bold mb-1">Availability Status</p>
                            <p className="text-slate-400 text-xs px-4">Toggle whether the studio is currently accepting new client bookings.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setForm(f => ({ ...f, acceptingClients: !f.acceptingClients }))}
                            className={`group relative overflow-hidden mt-4 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all w-full border ${form.acceptingClients ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500 hover:text-[#0a0a08]' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'}`}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {form.acceptingClients ? 'Accepting Clients' : 'Not Accepting Clients'}
                            </span>
                        </button>
                    </section>

                    {/* Social */}
                    <section className="bg-[#111109] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col gap-8 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[80px] pointer-events-none" />
                        <h2 className="font-display font-bold text-white text-xl border-b border-white/5 pb-4 flex items-center gap-3 relative z-10">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                                <span className="material-symbols-outlined text-purple-400 text-[18px]">share</span>
                            </div>
                            Social Links
                        </h2>

                        <div className="flex flex-col gap-6 relative z-10">
                            <Field label="Instagram URL" name="instagramUrl" placeholder="https://instagram.com/..." />
                            <Field label="Twitter / X URL" name="twitterUrl" placeholder="https://twitter.com/..." />
                            <Field label="YouTube URL" name="youtubeUrl" placeholder="https://youtube.com/..." />
                        </div>
                    </section>
                </div>

                {/* Save bar */}
                <div className="fixed bottom-0 left-0 right-0 md:left-72 bg-[#0a0a08]/80 backdrop-blur-xl border-t border-white/10 py-5 px-6 md:px-12 flex items-center justify-between z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center gap-3">
                        {status === 'success' && <p className="text-green-400 font-medium flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20"><span className="material-symbols-outlined text-sm">check_circle</span> Settings Saved Successfully</p>}
                        {status === 'error' && <p className="text-red-400 font-medium flex items-center gap-2 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20"><span className="material-symbols-outlined text-sm">error</span> Failed to save changes.</p>}
                        {status === 'idle' && <p className="text-slate-500 text-sm hidden sm:block">All changes are saved automatically upon submission.</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={status === 'saving'}
                        className="group relative bg-[#ffc000] text-[#0a0a08] px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest overflow-hidden transition-all disabled:opacity-50 flex items-center gap-3 shadow-[0_0_20px_rgba(255,192,0,0.2)] hover:shadow-[0_0_30px_rgba(255,192,0,0.4)] hover:-translate-y-0.5"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="relative z-10 flex items-center gap-3">
                            {status === 'saving'
                                ? <><div className="w-5 h-5 border-2 border-[#0a0a08]/40 border-t-[#0a0a08] rounded-full animate-spin"></div> Saving...</>
                                : <><span className="material-symbols-outlined text-[18px]">save</span> Publish Settings</>
                            }
                        </span>
                    </button>
                </div>
            </form>
        </div>
    );
}
