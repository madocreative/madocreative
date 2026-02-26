'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { Editor } from '@tinymce/tinymce-react';

// ---------- types ----------
interface ServiceItem { title: string; description: string; image: string; tags: string }
interface TeamMember { name: string; role: string; image: string }
interface PackageItem { name: string; description: string; price: string }
interface StatItem { value: string; label: string }

// ---------- Upload helper ----------
async function uploadImage(file: File): Promise<string> {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const data = await res.json();
    return data.url as string;
}

// ============================================================
export default function PageEditor({ params }: { params: Promise<{ pageId: string }> }) {
    const { pageId } = use(params);
    const router = useRouter();

    const [data, setData] = useState<Record<string, unknown>>({});
    const [status, setStatus] = useState<'loading' | 'idle' | 'saving' | 'success' | 'error'>('loading');

    // helpers
    const get = (key: string, fallback: unknown = '') => (data[key] ?? fallback) as unknown;
    const set = (key: string, value: unknown) => setData(d => ({ ...d, [key]: value }));

    // ---------- load ----------
    useEffect(() => {
        fetch(`/api/admin/content?page=${pageId}`)
            .then(r => r.json())
            .then(d => {
                if (d.success && d.data) {
                    const { _id, __v, updatedAt, ...rest } = d.data;
                    // flatten sections into top-level for easier editing
                    const { sections, ...top } = rest as Record<string, unknown>;
                    setData({ ...top, ...(sections as Record<string, unknown> || {}) });
                }
                setStatus('idle');
            })
            .catch(() => setStatus('idle'));
    }, [pageId]);

    // ---------- save ----------
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('saving');
        try {
            // Rebuild: pull known top-level fields, everything else goes in sections
            const topLevelKeys = ['page', 'title', 'subtitle', 'heroImage'];
            const topLevel: Record<string, unknown> = { page: pageId };
            const sections: Record<string, unknown> = {};
            Object.entries(data).forEach(([k, v]) => {
                if (topLevelKeys.includes(k)) topLevel[k] = v;
                else sections[k] = v;
            });
            const payload = { ...topLevel, sections };
            const res = await fetch('/api/admin/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
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

    const pageLabels: Record<string, string> = {
        home: 'Home', services: 'Services', team: 'Team',
        booking: 'Booking', contact: 'Contact',
    };

    return (
        <div className="max-w-5xl mx-auto pb-24">
            <div className="flex items-center gap-5 mb-8">
                <button onClick={() => router.back()} className="w-12 h-12 bg-[#111109] border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/5 hover:border-[#ffc000]/50 hover:text-[#ffc000] text-slate-400 transition-all shadow-md group">
                    <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
                </button>
                <div>
                    <h1 className="text-4xl font-display font-extrabold text-white tracking-tight">Edit <span className="text-[#ffc000]">{pageLabels[pageId] || pageId}</span></h1>
                    <p className="text-slate-400 text-sm mt-1">Changes are pushed live to the public site instantly upon saving.</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-8">

                {/* ═══ HOME ═══ */}
                {pageId === 'home' && <HomeFields data={data} get={get} set={set} />}

                {/* ═══ SERVICES ═══ */}
                {pageId === 'services' && <ServicesFields data={data} get={get} set={set} />}

                {/* ═══ TEAM ═══ */}
                {pageId === 'team' && <TeamFields data={data} get={get} set={set} />}

                {/* ═══ BOOKING ═══ */}
                {pageId === 'booking' && <BookingFields data={data} get={get} set={set} />}

                {/* ═══ CONTACT ═══ */}
                {pageId === 'contact' && <ContactFields data={data} get={get} set={set} />}

                {/* Save bar */}
                <div className="fixed bottom-0 left-0 right-0 md:left-72 bg-[#0a0a08] border-t border-white/10 py-5 px-6 md:px-12 flex items-center justify-between z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center gap-3">
                        {status === 'success' && <p className="text-green-400 font-medium flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20"><span className="material-symbols-outlined text-sm">check_circle</span> Published Successfully</p>}
                        {status === 'error' && <p className="text-red-400 font-medium flex items-center gap-2 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20"><span className="material-symbols-outlined text-sm">error</span> Failed to save changes.</p>}
                        {status === 'idle' && <p className="text-slate-500 text-sm hidden sm:block">Ready to publish when you are.</p>}
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
                                : <><span className="material-symbols-outlined text-[18px]">publish</span> Publish Changes</>
                            }
                        </span>
                    </button>
                </div>
            </form>
        </div>
    );
}

// ────────────────────────────────────────────────────────────
// Shared atoms
// ────────────────────────────────────────────────────────────

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
    return (
        <div className="bg-[#111109] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col gap-6 shadow-lg relative overflow-hidden">
            {/* Subtle glow behind title */}
            <div className="absolute top-0 left-0 w-64 h-32 bg-[#ffc000]/5 blur-[60px] pointer-events-none" />

            <h2 className="text-xl font-display font-bold text-white border-b border-white/5 pb-5 flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5 shadow-inner">
                    <span className="material-symbols-outlined text-[#ffc000] text-[20px]">{icon}</span>
                </div>
                {title}
            </h2>
            <div className="relative z-10 space-y-6">
                {children}
            </div>
        </div>
    );
}

function TextInput({ label, value, onChange, placeholder = '' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
    return (
        <div className="flex flex-col gap-2 relative group">
            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-[#ffc000] transition-colors">{label}</label>
            <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                className="bg-[#1a1812] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-[#ffc000] focus:ring-1 focus:ring-[#ffc000]/50 transition-all text-sm shadow-inner" />
        </div>
    );
}

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    const [uploading, setUploading] = useState(false);
    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try { onChange(await uploadImage(file)); } finally { setUploading(false); }
    };
    return (
        <div className="flex flex-col gap-3 relative group">
            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">{label}</label>
            {value && (
                <div className="relative rounded-xl overflow-hidden border border-white/10 group-hover:border-[#ffc000]/30 transition-colors">
                    <img src={value} alt="" className="w-full h-48 md:h-64 object-contain" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                </div>
            )}
            <div className="flex flex-col md:flex-row gap-3">
                <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="Paste image URL..."
                    className="flex-1 bg-[#1a1812] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-[#ffc000] focus:ring-1 focus:ring-[#ffc000]/50 transition-all text-sm shadow-inner" />

                <label className="cursor-pointer group/btn relative bg-white/5 border border-white/10 hover:border-[#ffc000] px-6 py-3.5 rounded-xl text-slate-300 hover:text-[#0a0a08] transition-all text-sm font-bold uppercase tracking-wider whitespace-nowrap flex items-center justify-center gap-3 overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-[#ffc000] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                    <span className="relative z-10 flex items-center gap-2">
                        {uploading ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : <><span className="material-symbols-outlined text-[18px]">cloud_upload</span> Upload Image</>}
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
                </label>
            </div>
        </div>
    );
}

// ────────────────────────────────────────────────────────────
// HOME page fields
// ────────────────────────────────────────────────────────────
function HomeFields({ get, set }: { data: Record<string, unknown>; get: (k: string, fb?: unknown) => unknown; set: (k: string, v: unknown) => void }) {
    return (
        <>
            <Section title="Hero Section" icon="star">
                <TextInput label="Hero Title (HTML allowed)" value={String(get('title', ''))} onChange={v => set('title', v)} placeholder="Capturing<br />The Unseen" />
                <div className="flex flex-col gap-2 relative group">
                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-[#ffc000] transition-colors">Hero Subtitle</label>
                    <textarea rows={3} value={String(get('subtitle', ''))} onChange={e => set('subtitle', e.target.value)}
                        className="bg-[#1a1812] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-[#ffc000] focus:ring-1 focus:ring-[#ffc000]/50 transition-all text-sm resize-none shadow-inner"
                        placeholder="We are Mado Creatives..." />
                </div>
                <ImageField label="Hero Background Image" value={String(get('heroImage', ''))} onChange={v => set('heroImage', v)} />
                <TextInput label="CTA Button Text" value={String(get('ctaText', 'View Our Work'))} onChange={v => set('ctaText', v)} />
                <TextInput label="CTA Button Link" value={String(get('ctaLink', '/portfolio'))} onChange={v => set('ctaLink', v)} />
            </Section>
            <Section title="Featured Works Section" icon="photo_library">
                <TextInput label="Section Label" value={String(get('worksLabel', 'Selected Works'))} onChange={v => set('worksLabel', v)} />
                <TextInput label="Section Title" value={String(get('worksTitle', 'Featured Portfolio'))} onChange={v => set('worksTitle', v)} />
            </Section>
        </>
    );
}

// ────────────────────────────────────────────────────────────
// SERVICES page fields
// ────────────────────────────────────────────────────────────
function ServicesFields({ get, set }: { data: Record<string, unknown>; get: (k: string, fb?: unknown) => unknown; set: (k: string, v: unknown) => void }) {
    const defaultServices: ServiceItem[] = [
        { title: 'Creative Production', description: 'High-end visual storytelling.', image: '', tags: 'Photography, Cinematography, Content' },
        { title: 'Brand Strategy & Design', description: 'Building strong brand identities.', image: '', tags: 'Identity, Direction, Campaigns' },
        { title: 'Premium Electronics', description: 'Trusted quality for creators.', image: '', tags: 'Laptops, Cameras, Smartphones' },
    ];
    const defaultStats: StatItem[] = [
        { value: '15+', label: 'Years Experience' },
        { value: '4', label: 'Locations' },
    ];
    const services: ServiceItem[] = (get('services', defaultServices) as ServiceItem[]);
    const stats: StatItem[] = (get('stats', defaultStats) as StatItem[]);

    const updateService = (i: number, field: keyof ServiceItem, val: string) => {
        const updated = services.map((s, idx) => idx === i ? { ...s, [field]: val } : s);
        set('services', updated);
    };
    const addService = () => set('services', [...services, { title: 'New Service', description: '', image: '', tags: '' }]);
    const removeService = (i: number) => set('services', services.filter((_, idx) => idx !== i));

    const updateStat = (i: number, field: keyof StatItem, val: string) => {
        const updated = stats.map((s, idx) => idx === i ? { ...s, [field]: val } : s);
        set('stats', updated);
    };

    return (
        <>
            <Section title="Page Header" icon="title">
                <TextInput label="Page Title" value={String(get('title', 'Our Services'))} onChange={v => set('title', v)} />
                <div className="flex flex-col gap-2 relative group">
                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-[#ffc000] transition-colors">Subtitle / Description</label>
                    <textarea rows={3} value={String(get('subtitle', ''))} onChange={e => set('subtitle', e.target.value)}
                        className="bg-[#1a1812] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-[#ffc000] focus:ring-1 focus:ring-[#ffc000]/50 transition-all text-sm resize-none shadow-inner" />
                </div>
            </Section>

            <Section title="Stats" icon="bar_chart">
                <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-[#221e10] p-4 rounded-lg flex flex-col gap-3 border border-white/5">
                            <TextInput label="Value" value={stat.value} onChange={v => updateStat(i, 'value', v)} placeholder="15+" />
                            <TextInput label="Label" value={stat.label} onChange={v => updateStat(i, 'label', v)} placeholder="Years Experience" />
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Services List" icon="list">
                <div className="flex flex-col gap-8">
                    {services.map((svc, i) => (
                        <div key={i} className="bg-[#1a1812] p-6 rounded-2xl border border-white/5 flex flex-col gap-5 relative group/card hover:border-[#ffc000]/30 transition-colors shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#111109] border border-white/5 flex items-center justify-center">
                                        <span className="text-[#ffc000] font-mono text-sm font-bold">{i + 1}</span>
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Service Items</span>
                                </div>
                                <button type="button" onClick={() => removeService(i)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors">
                                    <span className="material-symbols-outlined text-[16px]">delete</span>
                                </button>
                            </div>
                            <TextInput label="Title" value={svc.title} onChange={v => updateService(i, 'title', v)} />
                            <div className="flex flex-col gap-2 relative group">
                                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-[#ffc000] transition-colors">Description</label>
                                <textarea rows={3} value={svc.description} onChange={e => updateService(i, 'description', e.target.value)}
                                    className="bg-[#111109] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-[#ffc000] focus:ring-1 focus:ring-[#ffc000]/50 transition-all text-sm resize-none shadow-inner" />
                            </div>
                            <TextInput label="Tags (comma separated)" value={svc.tags} onChange={v => updateService(i, 'tags', v)} placeholder="Photography, Video, Content" />
                            <ImageField label="Service Image" value={svc.image} onChange={v => updateService(i, 'image', v)} />
                        </div>
                    ))}
                    <button type="button" onClick={addService}
                        className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-slate-400 hover:text-[#ffc000] hover:border-[#ffc000]/50 hover:bg-[#ffc000]/5 transition-all flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[18px]">add_circle</span> Add Service
                    </button>
                </div>
            </Section>

            <Section title="CTA Section" icon="campaign">
                <TextInput label="CTA Headline" value={String(get('ctaTitle', 'Ready to elevate your visual identity?'))} onChange={v => set('ctaTitle', v)} />
                <TextInput label="CTA Subtitle" value={String(get('ctaSubtitle', 'Contact us today to discuss your vision.'))} onChange={v => set('ctaSubtitle', v)} />
                <TextInput label="CTA Button Text" value={String(get('ctaButton', 'Start a Project'))} onChange={v => set('ctaButton', v)} />
            </Section>
        </>
    );
}

// ────────────────────────────────────────────────────────────
// TEAM page fields
// ────────────────────────────────────────────────────────────
function TeamFields({ get, set }: { data: Record<string, unknown>; get: (k: string, fb?: unknown) => unknown; set: (k: string, v: unknown) => void }) {
    const defaultMembers: TeamMember[] = [
        { name: 'Yonathan Ayele', role: 'Founder & Creative Director', image: '' },
    ];
    const members: TeamMember[] = (get('teamMembers', defaultMembers) as TeamMember[]);

    const updateMember = (i: number, field: keyof TeamMember, val: string) => {
        set('teamMembers', members.map((m, idx) => idx === i ? { ...m, [field]: val } : m));
    };
    const addMember = () => set('teamMembers', [...members, { name: 'New Member', role: 'Role', image: '' }]);
    const removeMember = (i: number) => set('teamMembers', members.filter((_, idx) => idx !== i));

    return (
        <>
            <Section title="Page Header" icon="group">
                <TextInput label="Page Title" value={String(get('title', 'The Collective Vision'))} onChange={v => set('title', v)} />
                <div className="flex flex-col gap-2 relative group">
                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-[#ffc000] transition-colors">Page Subtitle</label>
                    <textarea rows={3} value={String(get('subtitle', ''))} onChange={e => set('subtitle', e.target.value)}
                        className="bg-[#1a1812] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-[#ffc000] focus:ring-1 focus:ring-[#ffc000]/50 transition-all text-sm resize-none shadow-inner" />
                </div>
            </Section>

            <Section title="Team Members" icon="people">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {members.map((m, i) => (
                        <div key={i} className="bg-[#1a1812] p-6 rounded-2xl border border-white/5 flex flex-col gap-5 hover:border-[#ffc000]/30 transition-colors shadow-sm">
                            <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#111109] border border-white/5 flex items-center justify-center">
                                        <span className="text-[#ffc000] font-mono text-sm font-bold">{i + 1}</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Member Profile</span>
                                </div>
                                <button type="button" onClick={() => removeMember(i)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors">
                                    <span className="material-symbols-outlined text-[16px]">delete</span>
                                </button>
                            </div>
                            <TextInput label="Name" value={m.name} onChange={v => updateMember(i, 'name', v)} />
                            <TextInput label="Role / Title" value={m.role} onChange={v => updateMember(i, 'role', v)} />
                            <ImageField label="Portrait Photo" value={m.image} onChange={v => updateMember(i, 'image', v)} />
                        </div>
                    ))}
                </div>
                <button type="button" onClick={addMember}
                    className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-slate-400 hover:text-[#ffc000] hover:border-[#ffc000]/50 hover:bg-[#ffc000]/5 transition-all flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider mt-2">
                    <span className="material-symbols-outlined text-[18px]">person_add</span> Add Team Member
                </button>
            </Section>

            <Section title="CTA Section" icon="handshake">
                <TextInput label="CTA Headline" value={String(get('ctaTitle', 'Have a project in mind?'))} onChange={v => set('ctaTitle', v)} />
                <TextInput label="CTA Subtitle" value={String(get('ctaSubtitle', "Let's create something extraordinary together."))} onChange={v => set('ctaSubtitle', v)} />
                <TextInput label="CTA Button Text" value={String(get('ctaButton', 'Get in Touch'))} onChange={v => set('ctaButton', v)} />
            </Section>
        </>
    );
}

// ────────────────────────────────────────────────────────────
// BOOKING page fields
// ────────────────────────────────────────────────────────────
function BookingFields({ get, set }: { data: Record<string, unknown>; get: (k: string, fb?: unknown) => unknown; set: (k: string, v: unknown) => void }) {
    const defaultPackages: PackageItem[] = [
        { name: 'Editorial', description: 'Perfect for magazine submissions and high-fashion spreads.', price: 'From $2,500' },
        { name: 'Campaign', description: 'Comprehensive commercial shoots for major brand releases.', price: 'From $8,000' },
    ];
    const packages: PackageItem[] = (get('packages', defaultPackages) as PackageItem[]);

    const updatePkg = (i: number, field: keyof PackageItem, val: string) => {
        set('packages', packages.map((p, idx) => idx === i ? { ...p, [field]: val } : p));
    };
    const addPkg = () => set('packages', [...packages, { name: 'New Package', description: '', price: 'From $0' }]);
    const removePkg = (i: number) => set('packages', packages.filter((_, idx) => idx !== i));

    return (
        <>
            <Section title="Page Header" icon="event">
                <TextInput label="Page Title" value={String(get('title', 'Book a Session'))} onChange={v => set('title', v)} />
                <div className="flex flex-col gap-2 relative group">
                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-[#ffc000] transition-colors">Page Subtitle</label>
                    <textarea rows={3} value={String(get('subtitle', ''))} onChange={e => set('subtitle', e.target.value)}
                        className="bg-[#1a1812] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-[#ffc000] focus:ring-1 focus:ring-[#ffc000]/50 transition-all text-sm resize-none shadow-inner" />
                </div>
            </Section>

            <Section title="Packages" icon="sell">
                <div className="flex flex-col gap-6">
                    {packages.map((pkg, i) => (
                        <div key={i} className="bg-[#1a1812] p-6 rounded-2xl border border-white/5 flex flex-col gap-4 hover:border-[#ffc000]/30 transition-colors shadow-sm">
                            <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#111109] border border-white/5 flex items-center justify-center">
                                        <span className="text-[#ffc000] font-mono text-sm font-bold">{i + 1}</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pricing Package</span>
                                </div>
                                <button type="button" onClick={() => removePkg(i)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors">
                                    <span className="material-symbols-outlined text-[16px]">delete</span>
                                </button>
                            </div>
                            <TextInput label="Package Name" value={pkg.name} onChange={v => updatePkg(i, 'name', v)} />
                            <div className="flex flex-col gap-2 relative group">
                                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-[#ffc000] transition-colors">Description</label>
                                <textarea rows={2} value={pkg.description} onChange={e => updatePkg(i, 'description', e.target.value)}
                                    className="bg-[#111109] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-[#ffc000] focus:ring-1 focus:ring-[#ffc000]/50 transition-all text-sm resize-none shadow-inner" />
                            </div>
                            <TextInput label="Price Label" value={pkg.price} onChange={v => updatePkg(i, 'price', v)} placeholder="From $2,500" />
                        </div>
                    ))}
                    <button type="button" onClick={addPkg}
                        className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-slate-400 hover:text-[#ffc000] hover:border-[#ffc000]/50 hover:bg-[#ffc000]/5 transition-all flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[18px]">add_circle</span> Add Package
                    </button>
                </div>
            </Section>

            <Section title="Session Details" icon="schedule">
                <TextInput label="Session Start Time" value={String(get('sessionTime', 'All sessions start at 9:00 AM CET'))} onChange={v => set('sessionTime', v)} />
                <TextInput label="Submit Button Text" value={String(get('submitLabel', 'Request Booking'))} onChange={v => set('submitLabel', v)} />
            </Section>
        </>
    );
}

// ────────────────────────────────────────────────────────────
// CONTACT page fields
// ────────────────────────────────────────────────────────────
function ContactFields({ get, set }: { data: Record<string, unknown>; get: (k: string, fb?: unknown) => unknown; set: (k: string, v: unknown) => void }) {
    const defaultInquiries = ['General Inquiry', 'New Project', 'Press & Media', 'Careers'];
    const inquiries: string[] = (get('inquiryTypes', defaultInquiries) as string[]);

    const updateInquiry = (i: number, val: string) => set('inquiryTypes', inquiries.map((t, idx) => idx === i ? val : t));
    const addInquiry = () => set('inquiryTypes', [...inquiries, 'New Type']);
    const removeInquiry = (i: number) => set('inquiryTypes', inquiries.filter((_, idx) => idx !== i));

    return (
        <>
            <Section title="Page Header" icon="contact_page">
                <TextInput label="Page Title" value={String(get('title', "Let's Connect"))} onChange={v => set('title', v)} />
                <div className="flex flex-col gap-2 relative group">
                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-[#ffc000] transition-colors">Intro Paragraph</label>
                    <textarea rows={3} value={String(get('subtitle', ''))} onChange={e => set('subtitle', e.target.value)}
                        className="bg-[#1a1812] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-[#ffc000] focus:ring-1 focus:ring-[#ffc000]/50 transition-all text-sm resize-none shadow-inner" />
                </div>
            </Section>

            <Section title="Contact Info" icon="contacts">
                <p className="text-slate-500 text-sm">These values pull from <strong className="text-slate-400">Settings → Contact Details</strong>. Edit them there.</p>
            </Section>

            <Section title="Inquiry Types (Dropdown Options)" icon="list">
                <div className="flex flex-col gap-4">
                    {inquiries.map((t, i) => (
                        <div key={i} className="flex gap-3 items-center bg-[#1a1812] p-2 rounded-xl border border-white/5 focus-within:border-[#ffc000]/30 transition-colors">
                            <input type="text" value={t} onChange={e => updateInquiry(i, e.target.value)}
                                className="flex-1 bg-transparent px-3 py-2 text-white focus:outline-none text-sm" />
                            <button type="button" onClick={() => removeInquiry(i)} className="w-10 h-10 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors flex-shrink-0 mr-1">
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addInquiry}
                        className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-slate-400 hover:text-[#ffc000] hover:border-[#ffc000]/50 hover:bg-[#ffc000]/5 transition-all flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider mt-2">
                        <span className="material-symbols-outlined text-[18px]">add_circle</span> Add Inquiry Type
                    </button>
                </div>
            </Section>
        </>
    );
}
