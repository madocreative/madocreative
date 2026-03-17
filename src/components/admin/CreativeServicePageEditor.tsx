'use client';

import { useState, type ReactNode } from 'react';
import type {
    CreativeServiceCollection,
    CreativeServicePageData,
    CreativeServiceProcessStep,
    CreativeServiceServiceItem,
    CreativeServiceStat,
    CreativeServiceVideoGalleryLayout,
    CreativeServiceVideoItem,
} from '@/lib/creativeServicePage';
import { digitalMarketingPageDefaults } from '@/lib/digitalMarketingPageDefaults';
import { photographyPageDefaults } from '@/lib/photographyPageDefaults';
import { videographyPageDefaults } from '@/lib/videographyPageDefaults';
import { getPlayableCloudinaryVideoUrl } from '@/lib/cloudinaryVideo';

type CreativeServicePageId = 'photography' | 'videography' | 'digital-marketing';

const creativeServicePageConfigs: Record<CreativeServicePageId, {
    icon: string;
    serviceSectionTitle: string;
    defaults: CreativeServicePageData;
    showCollections: boolean;
    showProcess: boolean;
    showSecondaryCta: boolean;
    showVideoShowcase: boolean;
    showVideoGallery: boolean;
}> = {
    photography: {
        icon: 'photo_camera',
        serviceSectionTitle: 'Photography Services',
        defaults: photographyPageDefaults,
        showCollections: true,
        showProcess: true,
        showSecondaryCta: true,
        showVideoShowcase: false,
        showVideoGallery: false,
    },
    videography: {
        icon: 'movie',
        serviceSectionTitle: 'Video Services',
        defaults: videographyPageDefaults,
        showCollections: false,
        showProcess: false,
        showSecondaryCta: false,
        showVideoShowcase: true,
        showVideoGallery: true,
    },
    'digital-marketing': {
        icon: 'campaign',
        serviceSectionTitle: 'Marketing Services',
        defaults: digitalMarketingPageDefaults,
        showCollections: false,
        showProcess: true,
        showSecondaryCta: false,
        showVideoShowcase: false,
        showVideoGallery: false,
    },
};

const VIDEO_GALLERY_LAYOUTS: Array<{
    id: CreativeServiceVideoGalleryLayout;
    label: string;
    icon: string;
    desc: string;
    preview: ReactNode;
}> = [
    {
        id: 'grid',
        label: 'Grid',
        icon: 'apps',
        desc: 'Balanced rows for a clean commercial presentation.',
        preview: (
            <div className="grid grid-cols-3 grid-rows-2 gap-0.5 h-10">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-current rounded-sm" />
                ))}
            </div>
        ),
    },
    {
        id: 'masonry',
        label: 'Masonry',
        icon: 'view_quilt',
        desc: 'Editorial mixed heights that adapt to each video naturally.',
        preview: (
            <div className="grid grid-cols-3 gap-0.5 h-10">
                <div className="flex flex-col gap-0.5">
                    <div className="bg-current rounded-sm flex-[2]" />
                    <div className="bg-current rounded-sm flex-1" />
                </div>
                <div className="flex flex-col gap-0.5">
                    <div className="bg-current rounded-sm flex-1" />
                    <div className="bg-current rounded-sm flex-[2]" />
                </div>
                <div className="flex flex-col gap-0.5">
                    <div className="bg-current rounded-sm flex-[1.5]" />
                    <div className="bg-current rounded-sm flex-[1.5]" />
                </div>
            </div>
        ),
    },
    {
        id: 'strip',
        label: 'Film Strip',
        icon: 'view_carousel',
        desc: 'Horizontal scroll for reels, campaigns, and event highlights.',
        preview: (
            <div className="flex gap-0.5 h-10">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex-none w-6 bg-current rounded-sm" />
                ))}
                <div className="flex-1 bg-current/20 rounded-sm flex items-center justify-end pr-0.5">
                    <div className="w-1 h-3 bg-current/50 rounded-sm" />
                </div>
            </div>
        ),
    },
];

async function uploadAsset(
    file: File,
    onProgress?: (percent: number) => void,
): Promise<string> {
    return await new Promise<string>((resolve, reject) => {
        const fd = new FormData();
        fd.append('file', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/admin/upload');

        xhr.upload.onprogress = (event) => {
            if (!event.lengthComputable) return;
            onProgress?.(Math.round((event.loaded / event.total) * 100));
        };

        xhr.onerror = () => reject(new Error('Upload failed. Please try again.'));

        xhr.onload = () => {
            try {
                const data = JSON.parse(xhr.responseText || '{}');

                if (xhr.status >= 200 && xhr.status < 300 && data?.url) {
                    onProgress?.(100);
                    resolve(data.url as string);
                    return;
                }

                reject(new Error(data?.error || 'Upload failed. Please try again.'));
            } catch {
                reject(new Error('Upload failed. Please try again.'));
            }
        };

        xhr.send(fd);
    });
}

async function getSignedVideoUploadParams(): Promise<{
    apiKey: string;
    cloudName: string;
    folder: string;
    resourceType: 'video';
    signature: string;
    timestamp: number;
}> {
    const res = await fetch('/api/admin/upload/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceType: 'video' }),
    });

    const data = await res.json();

    if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Could not prepare video upload.');
    }

    return data as {
        apiKey: string;
        cloudName: string;
        folder: string;
        resourceType: 'video';
        signature: string;
        timestamp: number;
    };
}

async function uploadVideoDirect(
    file: File,
    onProgress?: (percent: number) => void,
): Promise<string> {
    const params = await getSignedVideoUploadParams();

    return await new Promise<string>((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', params.apiKey);
        formData.append('timestamp', String(params.timestamp));
        formData.append('signature', params.signature);
        formData.append('folder', params.folder);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${params.cloudName}/${params.resourceType}/upload`);

        xhr.upload.onprogress = (event) => {
            if (!event.lengthComputable) return;
            onProgress?.(Math.round((event.loaded / event.total) * 100));
        };

        xhr.onerror = () => reject(new Error('Video upload failed. Please try again.'));

        xhr.onload = () => {
            try {
                const result = JSON.parse(xhr.responseText || '{}');

                if (xhr.status >= 200 && xhr.status < 300 && result?.secure_url) {
                    onProgress?.(100);
                    resolve(result.secure_url as string);
                    return;
                }

                reject(new Error(result?.error?.message || 'Video upload failed. Please try again.'));
            } catch {
                reject(new Error('Video upload failed. Please try again.'));
            }
        };

        xhr.send(formData);
    });
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
    const [progress, setProgress] = useState<number | null>(null);
    const [error, setError] = useState('');

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setError('');
        setUploading(true);
        setProgress(0);
        try {
            onChange(await uploadAsset(file, setProgress));
            setProgress(100);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
        } finally {
            setUploading(false);
            setTimeout(() => setProgress(null), 1200);
            e.target.value = '';
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
                        {uploading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                {progress !== null ? `Uploading ${progress}%` : 'Uploading'}
                            </>
                        ) : <><span className="material-symbols-outlined text-[18px]">cloud_upload</span> Upload Image</>}
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
                </label>
            </div>
            {progress !== null && (
                <div className="flex flex-col gap-2">
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                            className="h-full bg-[#ffc000] transition-[width] duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-xs text-slate-400">
                        {progress < 100 ? `Uploading image: ${progress}%` : 'Upload complete.'}
                    </p>
                </div>
            )}
            {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
    );
}

function VideoField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState<number | null>(null);
    const [error, setError] = useState('');

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setError('');
        setUploading(true);
        setProgress(0);
        try {
            onChange(await uploadVideoDirect(file, setProgress));
            setProgress(100);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Video upload failed. Please try again.');
        } finally {
            setUploading(false);
            setTimeout(() => setProgress(null), 1200);
            e.target.value = '';
        }
    };

    return (
        <div className="flex flex-col gap-3 relative group">
            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">{label}</label>
            {value && (
                <div className="relative rounded-xl overflow-hidden border border-white/10 group-hover:border-[#ffc000]/30 transition-colors bg-[#0a0a08]">
                    <video src={getPlayableCloudinaryVideoUrl(value)} controls preload="metadata" playsInline className="w-full h-56 md:h-72 object-contain bg-black" />
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
                        {uploading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                {progress !== null ? `Uploading ${progress}%` : 'Uploading'}
                            </>
                        ) : <><span className="material-symbols-outlined text-[18px]">video_call</span> Upload Video</>}
                    </span>
                    <input type="file" accept="video/*" className="hidden" onChange={handleFile} disabled={uploading} />
                </label>
            </div>
            <p className="text-xs text-slate-500">
                MP4 and MOV work best here. Videos now upload directly to Cloudinary, which is much better for larger files.
            </p>
            {progress !== null && (
                <div className="flex flex-col gap-2">
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                            className="h-full bg-[#ffc000] transition-[width] duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-xs text-slate-400">
                        {progress < 100 ? `Uploading video: ${progress}%` : 'Upload complete.'}
                    </p>
                </div>
            )}
            {error && <p className="text-xs text-red-400">{error}</p>}
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
    const primaryHeroImage = heroImages.find((image) => typeof image === 'string' && image.trim().length > 0) || '';
    const stats: CreativeServiceStat[] = (get('stats', defaults.stats) as CreativeServiceStat[]);
    const services: CreativeServiceServiceItem[] = (get('services', defaults.services) as CreativeServiceServiceItem[]);
    const showcaseVideos: CreativeServiceVideoItem[] = (get('showcaseVideos', defaults.showcaseVideos ?? []) as CreativeServiceVideoItem[]);
    const videoGalleryVideos: CreativeServiceVideoItem[] = (get('videoGalleryVideos', defaults.videoGalleryVideos ?? []) as CreativeServiceVideoItem[]);
    const videoGalleryLayout = (get('videoGalleryLayout', defaults.videoGalleryLayout ?? 'masonry') as CreativeServiceVideoGalleryLayout);
    const collections: CreativeServiceCollection[] = (get('collections', defaults.collections) as CreativeServiceCollection[]);
    const process: CreativeServiceProcessStep[] = (get('process', defaults.process) as CreativeServiceProcessStep[]);

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

    const updateVideoGalleryVideo = (i: number, field: keyof CreativeServiceVideoItem, value: string) => {
        set('videoGalleryVideos', videoGalleryVideos.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
    };
    const addVideoGalleryVideo = () => set('videoGalleryVideos', [...videoGalleryVideos, { title: 'New Gallery Video', description: '', videoUrl: '', posterImage: '' }]);
    const removeVideoGalleryVideo = (i: number) => set('videoGalleryVideos', videoGalleryVideos.filter((_, idx) => idx !== i));

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
                <p className="text-xs text-slate-500 leading-relaxed">The live service page now uses one clean hero image. Upload the strongest cover visual here.</p>
            </Section>

            <Section title="Hero Image" icon="imagesmode">
                <ImageField
                    label="Hero Background Image"
                    value={primaryHeroImage}
                    onChange={v => set('heroImages', v.trim().length > 0 ? [v] : [])}
                />
                <p className="text-xs text-slate-500 leading-relaxed">Only one hero image is shown on the public page for a cleaner first impression.</p>
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

            {config.showVideoGallery && (
                <Section title="Video Gallery" icon="video_library">
                    <p className="text-sm leading-relaxed text-slate-400">
                        This gallery appears directly under the featured video showcase on the public videography page. Upload as many past-project videos as you want and switch the layout anytime.
                    </p>
                    <TextInput label="Section Label" value={String(get('videoGalleryLabel', defaults.videoGalleryLabel ?? ''))} onChange={v => set('videoGalleryLabel', v)} />
                    <TextInput label="Section Title" value={String(get('videoGalleryTitle', defaults.videoGalleryTitle ?? ''))} onChange={v => set('videoGalleryTitle', v)} />
                    <div className="flex flex-col gap-2 relative group">
                        <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-[#ffc000] transition-colors">Section Subtitle</label>
                        <textarea rows={3} value={String(get('videoGallerySubtitle', defaults.videoGallerySubtitle ?? ''))} onChange={e => set('videoGallerySubtitle', e.target.value)}
                            className="bg-[#1a1812] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-[#ffc000] focus:ring-1 focus:ring-[#ffc000]/50 transition-all text-sm resize-none shadow-inner" />
                    </div>

                    <div className="bg-[#1a1812] border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
                        <h3 className="font-display font-bold text-white text-base flex items-center gap-3">
                            <span className="material-symbols-outlined text-[#ffc000] text-[18px]">dashboard_customize</span>
                            Gallery Layout
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {VIDEO_GALLERY_LAYOUTS.map((layout) => {
                                const active = videoGalleryLayout === layout.id;
                                return (
                                    <button
                                        key={layout.id}
                                        type="button"
                                        onClick={() => set('videoGalleryLayout', layout.id)}
                                        className={`relative flex flex-col gap-3 p-3 rounded-xl border transition-all text-left group ${
                                            active
                                                ? 'bg-[#ffc000]/10 border-[#ffc000]/40 shadow-[0_0_20px_rgba(255,192,0,0.08)]'
                                                : 'bg-[#111109] border-white/8 hover:border-white/20'
                                        }`}
                                    >
                                        {active && (
                                            <div className="absolute top-2 right-2 w-4 h-4 bg-[#ffc000] rounded-full flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[10px] text-[#090805]">check</span>
                                            </div>
                                        )}
                                        <div className={`w-full ${active ? 'text-[#ffc000]' : 'text-white/20 group-hover:text-white/40'} transition-colors`}>
                                            {layout.preview}
                                        </div>
                                        <div>
                                            <p className={`text-xs font-bold uppercase tracking-widest ${active ? 'text-[#ffc000]' : 'text-slate-400'}`}>
                                                {layout.label}
                                            </p>
                                            <p className="text-[10px] text-slate-600 leading-tight mt-0.5">{layout.desc}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        {videoGalleryVideos.map((video, i) => (
                            <div key={i} className="bg-[#1a1812] p-6 rounded-2xl border border-white/5 flex flex-col gap-5 hover:border-[#ffc000]/30 transition-colors shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-[#111109] border border-white/5 flex items-center justify-center">
                                            <span className="text-[#ffc000] font-mono text-sm font-bold">{i + 1}</span>
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Gallery Video</span>
                                    </div>
                                    <button type="button" onClick={() => removeVideoGalleryVideo(i)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors">
                                        <span className="material-symbols-outlined text-[16px]">delete</span>
                                    </button>
                                </div>

                                <TextInput label="Video Title" value={video.title} onChange={v => updateVideoGalleryVideo(i, 'title', v)} />
                                <div className="flex flex-col gap-2 relative group">
                                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-[#ffc000] transition-colors">Description</label>
                                    <textarea rows={3} value={video.description} onChange={e => updateVideoGalleryVideo(i, 'description', e.target.value)}
                                        className="bg-[#111109] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-[#ffc000] focus:ring-1 focus:ring-[#ffc000]/50 transition-all text-sm resize-none shadow-inner" />
                                </div>
                                <VideoField label="Video File / URL" value={video.videoUrl} onChange={v => updateVideoGalleryVideo(i, 'videoUrl', v)} />
                                <ImageField label="Poster Image (optional)" value={video.posterImage} onChange={v => updateVideoGalleryVideo(i, 'posterImage', v)} />
                            </div>
                        ))}

                        <button type="button" onClick={addVideoGalleryVideo}
                            className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-slate-400 hover:text-[#ffc000] hover:border-[#ffc000]/50 hover:bg-[#ffc000]/5 transition-all flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider">
                            <span className="material-symbols-outlined text-[18px]">video_library</span> Add Gallery Video
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
