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
        <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</label>
            <input
                type={type}
                value={String(form[name])}
                onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                placeholder={placeholder}
                className="bg-[#221e10] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ffc000] transition-colors text-sm"
            />
        </div>
    );

    return (
        <div className="max-w-3xl">
            <h1 className="text-3xl font-display font-bold text-white mb-2">Site Settings</h1>
            <p className="text-slate-400 mb-10">Configure global site information, contact details, and social links.</p>

            <form onSubmit={handleSave} className="flex flex-col gap-8">

                {/* Identity */}
                <section className="bg-[#1a1812] border border-white/10 rounded-xl p-6 flex flex-col gap-5">
                    <h2 className="text-lg font-bold text-white border-b border-white/10 pb-4 mb-1 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#ffc000]">badge</span> Studio Identity
                    </h2>
                    <Field label="Studio Name" name="siteName" placeholder="Mado Creatives" />
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Tagline (Footer Description)</label>
                        <textarea
                            value={form.tagline}
                            onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))}
                            rows={3}
                            className="bg-[#221e10] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ffc000] transition-colors text-sm resize-none"
                            placeholder="An independent creative studio..."
                        />
                    </div>
                    <Field label="Booking Button Label" name="bookingCta" placeholder="Book a Session" />
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setForm(f => ({ ...f, acceptingClients: !f.acceptingClients }))}
                            className={`relative w-12 h-6 rounded-full transition-colors ${form.acceptingClients ? 'bg-[#ffc000]' : 'bg-white/20'}`}
                        >
                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow ${form.acceptingClients ? 'left-7' : 'left-1'}`}></span>
                        </button>
                        <label className="text-sm text-slate-300 font-medium">Currently accepting new clients</label>
                    </div>
                </section>

                {/* Contact */}
                <section className="bg-[#1a1812] border border-white/10 rounded-xl p-6 flex flex-col gap-5">
                    <h2 className="text-lg font-bold text-white border-b border-white/10 pb-4 mb-1 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#ffc000]">contacts</span> Contact Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Field label="Email Address" name="email" type="email" placeholder="hello@madocreatives.com" />
                        <Field label="Phone Number" name="phone" placeholder="+33 (0) 1 23 45 67 89" />
                    </div>
                    <Field label="Studio Address" name="address" placeholder="12 Rue de l'Avenir, Paris" />
                    <Field label="Location Label (shown on booking page)" name="locationLabel" placeholder="Paris HQ • Worldwide Travel" />
                </section>

                {/* Social */}
                <section className="bg-[#1a1812] border border-white/10 rounded-xl p-6 flex flex-col gap-5">
                    <h2 className="text-lg font-bold text-white border-b border-white/10 pb-4 mb-1 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#ffc000]">share</span> Social Media Links
                    </h2>
                    <Field label="Instagram URL" name="instagramUrl" placeholder="https://instagram.com/..." />
                    <Field label="Twitter / X URL" name="twitterUrl" placeholder="https://twitter.com/..." />
                    <Field label="YouTube URL" name="youtubeUrl" placeholder="https://youtube.com/..." />
                </section>

                {/* Save */}
                <div className="flex items-center justify-between pt-2">
                    <div>
                        {status === 'success' && <p className="text-green-400 font-medium flex items-center gap-2"><span className="material-symbols-outlined text-sm">check_circle</span> Settings saved!</p>}
                        {status === 'error' && <p className="text-red-400 font-medium flex items-center gap-2"><span className="material-symbols-outlined text-sm">error</span> Failed to save.</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={status === 'saving'}
                        className="bg-[#ffc000] text-[#0a0a08] px-8 py-3 rounded-lg font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {status === 'saving'
                            ? <><div className="w-4 h-4 border-2 border-[#0a0a08]/40 border-t-[#0a0a08] rounded-full animate-spin"></div> Saving...</>
                            : <><span className="material-symbols-outlined text-sm">save</span> Save Settings</>
                        }
                    </button>
                </div>
            </form>
        </div>
    );
}
