'use client';

import { useState } from 'react';
import type {
    CreativeServiceCollection,
    CreativeServicePageData,
    CreativeServiceProcessStep,
    CreativeServiceServiceItem,
    CreativeServiceStat,
    CreativeServiceVideoItem,
} from '@/lib/creativeServicePage';
import { digitalMarketingPageDefaults } from '@/lib/digitalMarketingPageDefaults';
import { photographyPageDefaults } from '@/lib/photographyPageDefaults';
import { videographyPageDefaults } from '@/lib/videographyPageDefaults';

type CreativeServicePageId = 'photography' | 'videography' | 'digital-marketing';

const creativeServicePageConfigs: Record<CreativeServicePageId, {
    icon: string;
    serviceSectionTitle: string;
    defaults: CreativeServicePageData;
    showCollections: boolean;
    showProcess: boolean;
    showSecondaryCta: boolean;
    showVideoShowcase: boolean;
}> = {
    photography: {
        icon: 'photo_camera',
        serviceSectionTitle: 'Photography Services',
        defaults: photographyPageDefaults,
        showCollections: true,
        showProcess: true,
        showSecondaryCta: true,
        showVideoShowcase: false,
    },
    videography: {
        icon: 'movie',
        serviceSectionTitle: 'Video Services',
        defaults: videographyPageDefaults,
        showCollections: false,
        showProcess: false,
        showSecondaryCta: false,
        showVideoShowcase: true,
    },
    'digital-marketing': {
        icon: 'campaign',
        serviceSectionTitle: 'Marketing Services',
        defaults: digitalMarketingPageDefaults,
        showCollections: false,
        showProcess: true,
        showSecondaryCta: false,
        showVideoShowcase: false,
    },
};

async function uploadAsset(file: File): Promise<string> {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const data = await res.json();
    return data.url as string;
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
    return (
        <div className="bg-[#111109] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col gap-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-32 bg-[#ffc000]/5 blur-[60px] pointer-events-none" />
            <h2 className="text-xl font-display font-bold text-white border-b border-white/5 pb-5 flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5 shadow-inner">
                    <span className="material-symbols-outlined text-[#ffc000] text-[20px]">{icon}</span>
                </div>
                {title}
            </h2>
            <div className="relative z-10 space-y-6">{children}</div>
        </div>
    );
}

function TextInput({ label, value, onChange, placeholder = '' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
    return (
        <div className="flex flex-col gap-2 relative group">
            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-[#ffc000] transition-colors">{label}</label>
            <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="bg-[#1a1812] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-[#ffc000] focus:ring-1 focus:ring-[#ffc000]/50 transition-all text-sm shadow-inner"
            />
        </div>
    );
}

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    const [uploading, setUploading] = useState(false);

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            onChange(await uploadAsset(file));
        } finally {
            setUploading(false);
        }
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
                <input
                    type="text"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder="Paste image URL..."
                    className="flex-1 bg-[#1a1812] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-[#ffc000] focus:ring-1 focus:ring-[#ffc000]/50 transition-all text-sm shadow-inner"
                />

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

function VideoField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    const [uploading, setUploading] = useState(false);

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            onChange(await uploadAsset(file));
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col gap-3 relative group">
            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">{label}</label>
            {value && (
                <div className="relative rounded-xl overflow-hidden border border-white/10 group-hover:border-[#ffc000]/30 transition-colors bg-[#0a0a08]">
                    <video src={value} controls preload="metadata" playsInline className="w-full h-56 md:h-72 object-contain bg-black" />
                </div>
            )}
            <div className="flex flex-col md:flex-row gap-3">
                <input
                    type="text"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder="Paste video URL..."
                    className="flex-1 bg-[#1a1812] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-[#ffc000] focus:ring-1 focus:ring-[#ffc000]/50 transition-all text-sm shadow-inner"
                />

                <label className="cursor-pointer group/btn relative bg-white/5 border border-white/10 hover:border-[#ffc000] px-6 py-3.5 rounded-xl text-slate-300 hover:text-[#0a0a08] transition-all text-sm font-bold uppercase tracking-wider whitespace-nowrap flex items-center justify-center gap-3 overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-[#ffc000] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                    <span className="relative z-10 flex items-center gap-2">
                        {uploading ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : <><span className="material-symbols-outlined text-[18px]">video_call</span> Upload Video</>}
                    </span>
                    <input type="file" accept="video/*" className="hidden" onChange={handleFile} disabled={uploading} />
                </label>
            </div>
            <p className="text-xs text-slate-500">MP4 and MOV work best here. Uploaded videos can be used directly on the public videography page.</p>
        </div>
    );
}

export default function CreativeServicePageEditor({
    pageId,
    get,
    set,
}: {
    pageId: CreativeServicePageId;
    get: (k: string, fb?: unknown) => unknown;
    set: (k: string, v: unknown) => void;
}) {
    const config = creativeServicePageConfigs[pageId];
    const defaults = config.defaults;
    const heroImages: string[] = (get('heroImages', defaults.heroImages) as string[]);
    const stats: CreativeServiceStat[] = (get('stats', defaults.stats) as CreativeServiceStat[]);
    const services: CreativeServiceServiceItem[] = (get('services', defaults.services) as CreativeServiceServiceItem[]);
    const showcaseVideos: CreativeServiceVideoItem[] = (get('showcaseVideos', defaults.showcaseVideos ?? []) as CreativeServiceVideoItem[]);
    const collections: CreativeServiceCollection[] = (get('collections', defaults.collections) as CreativeServiceCollection[]);
    const process: CreativeServiceProcessStep[] = (get('process', defaults.process) as CreativeServiceProcessStep[]);

    const updateHeroImage = (i: number, value: string) => set('heroImages', heroImages.map((item, idx) => idx === i ? value : item));
    const addHeroImage = () => set('heroImages', [...heroImages, '']);
    const removeHeroImage = (i: number) => set('heroImages', heroImages.filter((_, idx) => idx !== i));

    const updateStat = (i: number, field: keyof CreativeServiceStat, value: string) => {
        set('stats', stats.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
    };
    const addStat = () => set('stats', [...stats, { value: '', label: '' }]);
    const removeStat = (i: number) => set('stats', stats.filter((_, idx) => idx !== i));

    const updateService = (i: number, field: keyof CreativeServiceServiceItem, value: string) => {
        set('services', services.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
    };
    const addService = () => set('services', [...services, { title: 'New Service', description: '', tags: '', image: '' }]);
    const removeService = (i: number) => set('services', services.filter((_, idx) => idx !== i));

    const updateShowcaseVideo = (i: number, field: keyof CreativeServiceVideoItem, value: string) => {
        set('showcaseVideos', showcaseVideos.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
    };
    const addShowcaseVideo = () => set('showcaseVideos', [...showcaseVideos, { title: 'New Video', description: '', videoUrl: '', posterImage: '' }]);
    const removeShowcaseVideo = (i: number) => set('showcaseVideos', showcaseVideos.filter((_, idx) => idx !== i));

    const updateCollection = (i: number, field: keyof CreativeServiceCollection, value: string) => {
        set('collections', collections.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
    };
    const addCollection = () => set('collections', [...collections, { title: 'New Collection', href: '/portfolio', description: '' }]);
    const removeCollection = (i: number) => set('collections', collections.filter((_, idx) => idx !== i));

    const updateProcess = (i: number, field: keyof CreativeServiceProcessStep, value: string) => {
        set('process', process.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
    };
    const addProcess = () => set('process', [...process, { step: String(process.length + 1).padStart(2, '0'), title: 'New Step', desc: '' }]);
    const removeProcess = (i: number) => set('process', process.filter((_, idx) => idx !== i));

    return (
        <>
            <Section title="Page Header" icon={config.icon}>
                <TextInput label="Page Title" value={String(get('title', defaults.title))} onChange={v => set('title', v)} />
                <TextInput label="Hero Label" value={String(get('heroLabel', defaults.heroLabel))} onChange={v => set('heroLabel', v)} />
                <div className="flex flex-col gap-2 relative group">
                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-[#ffc000] transition-colors">Subtitle</label>
                    <textarea rows={4} value={String(get('subtitle', defaults.subtitle))} onChange={e => set('subtitle', e.target.value)}
                        className="bg-[#1a1812] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-[#ffc000] focus:ring-1 focus:ring-[#ffc000]/50 transition-all text-sm resize-none shadow-inner" />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">Hero images display in collage order. The first image appears larger, so put the strongest visual first.</p>
            </Section>

            <Section title="Hero Gallery" icon="imagesmode">
                <div className="flex flex-col gap-5">
                    {heroImages.map((image, i) => (
                        <div key={i} className="bg-[#1a1812] p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Hero Image {i + 1}</span>
                                <button type="button" onClick={() => removeHeroImage(i)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors">
                                    <span className="material-symbols-outlined text-[16px]">delete</span>
                                </button>
                            </div>
                            <ImageField label={`Image ${i + 1}`} value={image} onChange={v => updateHeroImage(i, v)} />
                        </div>
                    ))}
                    <button type="button" onClick={addHeroImage}
                        className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-slate-400 hover:text-[#ffc000] hover:border-[#ffc000]/50 hover:bg-[#ffc000]/5 transition-all flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span> Add Hero Image
                    </button>
                </div>
            </Section>

            <Section title="Stats" icon="bar_chart">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-[#221e10] p-4 rounded-lg flex flex-col gap-3 border border-white/5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Stat {i + 1}</span>
                                <button type="button" onClick={() => removeStat(i)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors">
                                    <span className="material-symbols-outlined text-[16px]">delete</span>
                                </button>
                            </div>
                            <TextInput label="Value" value={stat.value} onChange={v => updateStat(i, 'value', v)} />
                            <TextInput label="Label" value={stat.label} onChange={v => updateStat(i, 'label', v)} />
                        </div>
                    ))}
                </div>
                <button type="button" onClick={addStat}
                    className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-slate-400 hover:text-[#ffc000] hover:border-[#ffc000]/50 hover:bg-[#ffc000]/5 transition-all flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[18px]">add_circle</span> Add Stat
                </button>
            </Section>

            <Section title={config.serviceSectionTitle} icon={config.icon}>
                <div className="flex flex-col gap-8">
                    {services.map((service, i) => (
                        <div key={i} className="bg-[#1a1812] p-6 rounded-2xl border border-white/5 flex flex-col gap-5 relative hover:border-[#ffc000]/30 transition-colors shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#111109] border border-white/5 flex items-center justify-center">
                                        <span className="text-[#ffc000] font-mono text-sm font-bold">{i + 1}</span>
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Service Block</span>
                                </div>
                                <button type="button" onClick={() => removeService(i)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors">
                                    <span className="material-symbols-outlined text-[16px]">delete</span>
                                </button>
                            </div>
                            <TextInput label="Title" value={service.title} onChange={v => updateService(i, 'title', v)} />
                            <div className="flex flex-col gap-2 relative group">
                                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-[#ffc000] transition-colors">Description</label>
                                <textarea rows={3} value={service.description} onChange={e => updateService(i, 'description', e.target.value)}
                                    className="bg-[#111109] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-[#ffc000] focus:ring-1 focus:ring-[#ffc000]/50 transition-all text-sm resize-none shadow-inner" />
                            </div>
                            <TextInput label="Tags (comma separated)" value={service.tags} onChange={v => updateService(i, 'tags', v)} />
                            <ImageField label="Service Image" value={service.image} onChange={v => updateService(i, 'image', v)} />
                        </div>
                    ))}
                    <button type="button" onClick={addService}
                        className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-slate-400 hover:text-[#ffc000] hover:border-[#ffc000]/50 hover:bg-[#ffc000]/5 transition-all flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[18px]">add_circle</span> Add Service
                    </button>
                </div>
            </Section>

            {config.showVideoShowcase && (
                <Section title="Featured Videos" icon="smart_display">
                    <TextInput label="Section Label" value={String(get('showcaseLabel', defaults.showcaseLabel ?? ''))} onChange={v => set('showcaseLabel', v)} />
                    <TextInput label="Section Title" value={String(get('showcaseTitle', defaults.showcaseTitle ?? ''))} onChange={v => set('showcaseTitle', v)} />
                    <div className="flex flex-col gap-2 relative group">
                        <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-[#ffc000] transition-colors">Section Subtitle</label>
                        <textarea rows={3} value={String(get('showcaseSubtitle', defaults.showcaseSubtitle ?? ''))} onChange={e => set('showcaseSubtitle', e.target.value)}
                            className="bg-[#1a1812] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-[#ffc000] focus:ring-1 focus:ring-[#ffc000]/50 transition-all text-sm resize-none shadow-inner" />
                    </div>

                    <div className="flex flex-col gap-6">
                        {showcaseVideos.map((video, i) => (
                            <div key={i} className="bg-[#1a1812] p-6 rounded-2xl border border-white/5 flex flex-col gap-5 hover:border-[#ffc000]/30 transition-colors shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-[#111109] border border-white/5 flex items-center justify-center">
                                            <span className="text-[#ffc000] font-mono text-sm font-bold">{i + 1}</span>
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Showcase Video</span>
                                    </div>
                                    <button type="button" onClick={() => removeShowcaseVideo(i)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors">
                                        <span className="material-symbols-outlined text-[16px]">delete</span>
                                    </button>
                                </div>

                                <TextInput label="Video Title" value={video.title} onChange={v => updateShowcaseVideo(i, 'title', v)} />
                                <div className="flex flex-col gap-2 relative group">
                                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-[#ffc000] transition-colors">Description</label>
                                    <textarea rows={3} value={video.description} onChange={e => updateShowcaseVideo(i, 'description', e.target.value)}
                                        className="bg-[#111109] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-[#ffc000] focus:ring-1 focus:ring-[#ffc000]/50 transition-all text-sm resize-none shadow-inner" />
                                </div>
                                <VideoField label="Video File / URL" value={video.videoUrl} onChange={v => updateShowcaseVideo(i, 'videoUrl', v)} />
                                <ImageField label="Poster Image (optional)" value={video.posterImage} onChange={v => updateShowcaseVideo(i, 'posterImage', v)} />
                            </div>
                        ))}

                        <button type="button" onClick={addShowcaseVideo}
                            className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-slate-400 hover:text-[#ffc000] hover:border-[#ffc000]/50 hover:bg-[#ffc000]/5 transition-all flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider">
                            <span className="material-symbols-outlined text-[18px]">video_library</span> Add Showcase Video
                        </button>
                    </div>
                </Section>
            )}

            {config.showCollections && (
                <Section title="Featured Collections" icon="collections">
                    <TextInput label="Section Label" value={String(get('collectionsLabel', defaults.collectionsLabel))} onChange={v => set('collectionsLabel', v)} />
                    <TextInput label="Section Title" value={String(get('collectionsTitle', defaults.collectionsTitle))} onChange={v => set('collectionsTitle', v)} />
                    <div className="flex flex-col gap-6">
                        {collections.map((collection, i) => (
                            <div key={i} className="bg-[#1a1812] p-6 rounded-2xl border border-white/5 flex flex-col gap-4 hover:border-[#ffc000]/30 transition-colors shadow-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Collection Card {i + 1}</span>
                                    <button type="button" onClick={() => removeCollection(i)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors">
                                        <span className="material-symbols-outlined text-[16px]">delete</span>
                                    </button>
                                </div>
                                <TextInput label="Title" value={collection.title} onChange={v => updateCollection(i, 'title', v)} />
                                <TextInput label="Link" value={collection.href} onChange={v => updateCollection(i, 'href', v)} placeholder="/portfolio?category=Weddings#portfolio-collections" />
                                <div className="flex flex-col gap-2 relative group">
                                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-[#ffc000] transition-colors">Description</label>
                                    <textarea rows={2} value={collection.description} onChange={e => updateCollection(i, 'description', e.target.value)}
                                        className="bg-[#111109] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-[#ffc000] focus:ring-1 focus:ring-[#ffc000]/50 transition-all text-sm resize-none shadow-inner" />
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={addCollection}
                            className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-slate-400 hover:text-[#ffc000] hover:border-[#ffc000]/50 hover:bg-[#ffc000]/5 transition-all flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider">
                            <span className="material-symbols-outlined text-[18px]">add_circle</span> Add Collection
                        </button>
                    </div>
                </Section>
            )}

            {config.showProcess && (
                <Section title="Process" icon="timeline">
                    <TextInput label="Section Label" value={String(get('processLabel', defaults.processLabel))} onChange={v => set('processLabel', v)} />
                    <TextInput label="Section Title" value={String(get('processTitle', defaults.processTitle))} onChange={v => set('processTitle', v)} />
                    <div className="flex flex-col gap-6">
                        {process.map((item, i) => (
                            <div key={i} className="bg-[#1a1812] p-6 rounded-2xl border border-white/5 flex flex-col gap-4 hover:border-[#ffc000]/30 transition-colors shadow-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Process Step {i + 1}</span>
                                    <button type="button" onClick={() => removeProcess(i)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors">
                                        <span className="material-symbols-outlined text-[16px]">delete</span>
                                    </button>
                                </div>
                                <TextInput label="Step Number" value={item.step} onChange={v => updateProcess(i, 'step', v)} />
                                <TextInput label="Title" value={item.title} onChange={v => updateProcess(i, 'title', v)} />
                                <div className="flex flex-col gap-2 relative group">
                                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-[#ffc000] transition-colors">Description</label>
                                    <textarea rows={3} value={item.desc} onChange={e => updateProcess(i, 'desc', e.target.value)}
                                        className="bg-[#111109] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-[#ffc000] focus:ring-1 focus:ring-[#ffc000]/50 transition-all text-sm resize-none shadow-inner" />
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={addProcess}
                            className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-slate-400 hover:text-[#ffc000] hover:border-[#ffc000]/50 hover:bg-[#ffc000]/5 transition-all flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider">
                            <span className="material-symbols-outlined text-[18px]">add_circle</span> Add Process Step
                        </button>
                    </div>
                </Section>
            )}

            <Section title="CTA Section" icon="campaign">
                <TextInput label="CTA Headline" value={String(get('ctaTitle', defaults.ctaTitle))} onChange={v => set('ctaTitle', v)} />
                <TextInput label="CTA Subtitle" value={String(get('ctaSubtitle', defaults.ctaSubtitle))} onChange={v => set('ctaSubtitle', v)} />
                <TextInput label="Primary Button Text" value={String(get('ctaButton', defaults.ctaButton))} onChange={v => set('ctaButton', v)} />
                <TextInput label="Primary Button Link" value={String(get('ctaLink', defaults.ctaLink))} onChange={v => set('ctaLink', v)} />
                {config.showSecondaryCta && (
                    <>
                        <TextInput label="Secondary Button Text" value={String(get('ctaSecondaryButton', defaults.ctaSecondaryButton))} onChange={v => set('ctaSecondaryButton', v)} />
                        <TextInput label="Secondary Button Link" value={String(get('ctaSecondaryLink', defaults.ctaSecondaryLink))} onChange={v => set('ctaSecondaryLink', v)} />
                    </>
                )}
            </Section>
        </>
    );
}
