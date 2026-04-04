'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        siteName: 'Mado Creatives',
        logoUrl: '/logo.png',
        tagline: '',
        email: '',
        phone: '',
        address: '',
        locationLabel: '',
        instagramUrl: '',
        twitterUrl: '',
        youtubeUrl: '',
        facebookUrl: '',
        telegramUrl: '',
        whatsappUrl: '',
        whatsappNumber: '+250 793 004 501',
        bookingCta: 'Book a Session',
        acceptingClients: true,
    });
    const [status, setStatus] = useState<'loading' | 'idle' | 'saving' | 'success' | 'error'>('loading');
    const [logoUploadState, setLogoUploadState] = useState<'idle' | 'uploading' | 'error'>('idle');
    const [logoUploadMessage, setLogoUploadMessage] = useState('');
    const logoInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch('/api/admin/settings', { cache: 'no-store' })
            .then(r => r.json())
            .then(d => {
                if (d.success && d.data) {
                    const sanitized = { ...d.data };
                    delete sanitized.key;
                    delete sanitized._id;
                    delete sanitized.__v;
                    delete sanitized.updatedAt;
                    setForm(f => ({ ...f, ...sanitized }));
                }
                setStatus('idle');
            })
            .catch(() => setStatus('idle'));
    }, []);

    const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setLogoUploadState('uploading');
        setLogoUploadMessage('');

        try {
            const data = new FormData();
            data.append('file', file);

            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: data,
            });

            const payload = await res.json();
            if (!res.ok || !payload.success || !payload.url) {
                throw new Error(payload.error || 'Upload failed');
            }

            setForm((current) => ({ ...current, logoUrl: payload.url }));
            setLogoUploadState('idle');
            setLogoUploadMessage('Logo uploaded. Click Publish Settings to apply it site-wide.');
        } catch {
            setLogoUploadState('error');
            setLogoUploadMessage('Logo upload failed. Try again.');
        } finally {
            event.target.value = '';
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('saving');
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const payload = await res.json();

            if (!res.ok || !payload?.success || !payload?.data) {
                setStatus('error');
                return;
            }

            const sanitized = { ...payload.data };
            delete sanitized.key;
            delete sanitized._id;
            delete sanitized.__v;
            delete sanitized.updatedAt;

            setForm((current) => ({ ...current, ...sanitized }));
            window.dispatchEvent(new CustomEvent('site-settings-updated', { detail: payload.data }));
            router.refresh();
            setStatus('success');
            setTimeout(() => setStatus('idle'), 3000);
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

                            <div className="grid grid-cols-1 xl:grid-cols-[220px_1fr] gap-6 items-start">
                                <div className="flex flex-col gap-3">
                                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Logo Preview</label>
                                    <div className="bg-[#1a1812] border border-white/10 rounded-2xl min-h-[180px] flex items-center justify-center p-6 shadow-inner">
                                        {form.logoUrl ? (
                                            <img
                                                src={form.logoUrl}
                                                alt="Studio logo preview"
                                                className="max-h-24 w-auto object-contain"
                                            />
                                        ) : (
                                            <span className="text-slate-500 text-sm">No logo selected</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <Field label="Logo URL" name="logoUrl" type="url" placeholder="https://your-cdn/logo.png" />

                                    <div className="flex flex-wrap gap-3">
                                        <input
                                            ref={logoInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleLogoUpload}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => logoInputRef.current?.click()}
                                            disabled={logoUploadState === 'uploading'}
                                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1a1812] border border-white/10 text-white hover:border-[#ffc000]/40 hover:text-[#ffc000] transition-colors disabled:opacity-60"
                                        >
                                            {logoUploadState === 'uploading'
                                                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</>
                                                : <><span className="material-symbols-outlined text-[18px]">upload</span> Upload Logo</>
                                            }
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setForm((current) => ({ ...current, logoUrl: '/logo.png' }));
                                                setLogoUploadState('idle');
                                                setLogoUploadMessage('Using the default logo. Save settings to publish it.');
                                            }}
                                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 text-slate-300 hover:border-white/20 hover:text-white transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                                            Use Default
                                        </button>
                                    </div>

                                    <p className={`text-xs ${logoUploadState === 'error' ? 'text-red-400' : 'text-slate-400'}`}>
                                        {logoUploadMessage || 'Paste a logo URL or upload a new logo image here.'}
                                    </p>
                                </div>
                            </div>

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
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffc000]/5 blur-[80px] pointer-events-none" />
                        <h2 className="font-display font-bold text-white text-xl border-b border-white/5 pb-4 flex items-center gap-3 relative z-10">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                                <span className="material-symbols-outlined text-[#ffc000] text-[18px]">contacts</span>
                            </div>
                            Contact Details
                        </h2>

                        <div className="flex flex-col gap-6 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Field label="Email Address" name="email" type="email" placeholder="info@madocreatives.com" />
                                <Field label="Phone Number" name="phone" placeholder="+33 (0) 1 23 45 67 89" />
                            </div>
                            <Field label="WhatsApp Floating Button Number" name="whatsappNumber" placeholder="+250 793 004 501" />
                            <Field label="Studio Address" name="address" placeholder="12 Rue de l'Avenir, Paris" />
                            <Field label="Location Label (shown on booking page)" name="locationLabel" placeholder="Paris HQ • Worldwide Travel" />
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-8">
                    {/* Status Toggle */}
                    <section className="bg-[#111109] border border-white/5 rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden flex flex-col items-center justify-center text-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-[#1a1812] border border-white/5 flex items-center justify-center shadow-inner mb-2">
                            <span className={`material-symbols-outlined text-[32px] transition-colors duration-500 ${form.acceptingClients ? 'text-[#ffc000]' : 'text-slate-600'}`}>
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
                            className={`group relative overflow-hidden mt-4 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all w-full border ${form.acceptingClients ? 'bg-[#ffc000]/10 border-[#ffc000]/30 text-[#ffc000] hover:bg-[#ffc000] hover:text-[#0a0a08]' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'}`}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {form.acceptingClients ? 'Accepting Clients' : 'Not Accepting Clients'}
                            </span>
                        </button>
                    </section>

                    {/* Social */}
                    <section className="bg-[#111109] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col gap-8 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffc000]/5 blur-[80px] pointer-events-none" />
                        <h2 className="font-display font-bold text-white text-xl border-b border-white/5 pb-4 flex items-center gap-3 relative z-10">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                                <span className="material-symbols-outlined text-[#ffc000] text-[18px]">share</span>
                            </div>
                            Social Links
                        </h2>

                        <div className="flex flex-col gap-6 relative z-10">
                            <Field label="Instagram URL" name="instagramUrl" placeholder="https://instagram.com/..." />
                            <Field label="YouTube URL" name="youtubeUrl" placeholder="https://youtube.com/..." />
                            <Field label="Facebook URL" name="facebookUrl" placeholder="https://facebook.com/..." />
                            <Field label="Telegram URL / Channel" name="telegramUrl" placeholder="https://t.me/..." />
                            <Field label="WhatsApp Channel URL" name="whatsappUrl" placeholder="https://whatsapp.com/channel/..." />
                            <Field label="Twitter / X URL" name="twitterUrl" placeholder="https://twitter.com/..." />
                        </div>
                    </section>
                </div>

                {/* Save bar */}
                <div className="fixed bottom-0 left-0 right-0 md:left-72 bg-[#0a0a08] border-t border-white/10 py-5 px-6 md:px-12 flex items-center justify-between z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center gap-3">
                        {status === 'success' && <p className="text-[#ffc000] font-medium flex items-center gap-2 bg-[#ffc000]/10 px-4 py-2 rounded-lg border border-[#ffc000]/20"><span className="material-symbols-outlined text-sm">check_circle</span> Settings Saved Successfully</p>}
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
