'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

interface MediaItem { _id: string; url: string; filename?: string }

const LAYOUTS = [
    {
        id: 'masonry',
        label: 'Masonry',
        icon: 'view_quilt',
        desc: 'Natural heights, editorial columns — classic photography feel',
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
        id: 'grid',
        label: 'Grid',
        icon: 'apps',
        desc: 'Equal square crops — clean, minimal, commercial',
        preview: (
            <div className="grid grid-cols-3 grid-rows-2 gap-0.5 h-10">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-current rounded-sm" />
                ))}
            </div>
        ),
    },
    {
        id: 'slideshow',
        label: 'Slideshow',
        icon: 'slideshow',
        desc: 'Full-width cinematic slides with thumbnail strip',
        preview: (
            <div className="flex flex-col gap-0.5 h-10">
                <div className="bg-current rounded-sm flex-[3] flex items-center justify-between px-1">
                    <div className="w-1.5 h-3 bg-current/30 rounded-sm" />
                    <div className="w-1.5 h-3 bg-current/30 rounded-sm" />
                </div>
                <div className="flex gap-0.5 flex-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className={`flex-1 rounded-sm ${i === 0 ? 'bg-current' : 'bg-current/40'}`} />
                    ))}
                </div>
            </div>
        ),
    },
    {
        id: 'editorial',
        label: 'Editorial',
        icon: 'newspaper',
        desc: 'Magazine spread — large hero + smaller supporting images',
        preview: (
            <div className="grid grid-cols-3 grid-rows-2 gap-0.5 h-10">
                <div className="col-span-2 row-span-2 bg-current rounded-sm" />
                <div className="bg-current rounded-sm" />
                <div className="bg-current/60 rounded-sm" />
            </div>
        ),
    },
    {
        id: 'strip',
        label: 'Film Strip',
        icon: 'view_column',
        desc: 'Horizontal scroll — cinematic, great for fashion series',
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
    {
        id: 'spotlight',
        label: 'Spotlight',
        icon: 'center_focus_strong',
        desc: 'One dramatic hero image + supporting strip beneath',
        preview: (
            <div className="flex flex-col gap-0.5 h-10">
                <div className="bg-current rounded-sm flex-[3]" />
                <div className="flex gap-0.5 flex-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex-1 bg-current/60 rounded-sm" />
                    ))}
                </div>
            </div>
        ),
    },
];

export default function GalleryEditor({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [formData, setFormData] = useState<any>(null);
    const [status, setStatus] = useState<'loading' | 'idle' | 'saving' | 'success' | 'error'>('loading');
    const [uploading, setUploading] = useState(false);
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [mediaPickerTarget, setMediaPickerTarget] = useState<'featured' | 'gallery'>('gallery');
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [mediaLoading, setMediaLoading] = useState(false);

    useEffect(() => {
        fetch(`/api/admin/galleries/${id}`)
            .then(r => r.json())
            .then(d => { if (d.success) { setFormData(d.data); setStatus('idle'); } else setStatus('error'); })
            .catch(() => setStatus('error'));
    }, [id]);

    const openMediaPicker = async (target: 'featured' | 'gallery') => {
        setMediaPickerTarget(target);
        setShowMediaPicker(true);
        if (mediaItems.length === 0) {
            setMediaLoading(true);
            const res = await fetch('/api/admin/media');
            const d = await res.json();
            if (d.success) setMediaItems(d.data);
            setMediaLoading(false);
        }
    };

    const pickMedia = (url: string) => {
        if (mediaPickerTarget === 'featured') {
            setFormData((p: any) => ({ ...p, featuredImage: url }));
            setShowMediaPicker(false);
        } else {
            if (!formData.images?.includes(url)) {
                setFormData((p: any) => ({ ...p, images: [...(p.images || []), url] }));
            }
        }
    };

    const handleSave = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setStatus('saving');
        const res = await fetch(`/api/admin/galleries/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        if (res.ok) { setStatus('success'); setTimeout(() => setStatus('idle'), 3000); }
        else setStatus('error');
    };

    const handleDelete = async () => {
        if (!confirm('Delete this gallery permanently?')) return;
        const res = await fetch(`/api/admin/galleries/${id}`, { method: 'DELETE' });
        if (res.ok) router.push('/admin/galleries');
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isFeatured = false) => {
        if (!e.target.files?.length) return;
        setUploading(true);
        for (const file of Array.from(e.target.files)) {
            const fd = new FormData();
            fd.append('file', file);
            const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
            const d = await res.json();
            if (d.success) {
                if (isFeatured) setFormData((p: any) => ({ ...p, featuredImage: d.url }));
                else setFormData((p: any) => ({ ...p, images: [...(p.images || []), d.url] }));
                setMediaItems(prev => [{ _id: Date.now().toString(), url: d.url }, ...prev]);
            }
        }
        setUploading(false);
    };

    const removeImage = (i: number) =>
        setFormData((p: any) => ({ ...p, images: p.images.filter((_: any, idx: number) => idx !== i) }));

    const setAsCover = (url: string) => setFormData((p: any) => ({ ...p, featuredImage: url }));

    const moveImage = (from: number, to: number) => {
        if (to < 0 || to >= formData.images.length) return;
        const imgs = [...formData.images];
        const [moved] = imgs.splice(from, 1);
        imgs.splice(to, 0, moved);
        setFormData((p: any) => ({ ...p, images: imgs }));
    };

    if (status === 'loading') return (
        <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-2 border-[#ffc000] border-t-transparent rounded-full animate-spin" />
        </div>
    );
    if (!formData) return <div className="text-red-400 p-6">Failed to load gallery.</div>;

    const currentLayout = LAYOUTS.find(l => l.id === (formData.layout || 'masonry')) || LAYOUTS[0];

    return (
        <div className="max-w-6xl mx-auto pb-24">

            {/* ── Media Picker Modal ─────────────────────────────── */}
            {showMediaPicker && (
                <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
                    <div className="bg-[#1a1812] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl">
                        <div className="flex items-center justify-between p-5 border-b border-white/10">
                            <h3 className="font-bold text-white text-lg">
                                {mediaPickerTarget === 'featured' ? 'Choose Cover Image' : 'Add Images from Library'}
                            </h3>
                            <button onClick={() => setShowMediaPicker(false)} className="text-slate-400 hover:text-white transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="overflow-y-auto p-5 flex-1">
                            {mediaLoading
                                ? <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-[#ffc000] border-t-transparent rounded-full animate-spin" /></div>
                                : mediaItems.length === 0
                                    ? <p className="text-slate-500 text-center py-12 text-sm">No media in library. Go to Media Library to upload images first.</p>
                                    : (
                                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                                            {mediaItems.map(item => {
                                                const inGallery = formData.images?.includes(item.url);
                                                return (
                                                    <button key={item._id} type="button" onClick={() => pickMedia(item.url)}
                                                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${inGallery && mediaPickerTarget === 'gallery' ? 'border-[#ffc000]/60 opacity-60' : 'border-transparent hover:border-[#ffc000]'}`}>
                                                        <img src={item.url} alt="" className="w-full h-full object-contain" />
                                                        {inGallery && mediaPickerTarget === 'gallery' && (
                                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                                <span className="material-symbols-outlined text-[#ffc000]">check_circle</span>
                                                            </div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )
                            }
                        </div>
                        {mediaPickerTarget === 'gallery' && (
                            <div className="p-4 border-t border-white/10">
                                <button onClick={() => setShowMediaPicker(false)}
                                    className="w-full bg-[#ffc000] text-[#0a0a08] py-3 rounded-xl font-bold uppercase tracking-wider hover:brightness-110 text-sm transition-all">
                                    Done Adding Images
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Header ────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 mt-4">
                <div className="flex items-center gap-5">
                    <button onClick={() => router.back()} className="w-12 h-12 bg-[#111109] border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/5 hover:border-[#ffc000]/50 hover:text-[#ffc000] text-slate-400 transition-all shadow-md group">
                        <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="text-4xl font-display font-extrabold text-white tracking-tight">{formData.title}</h1>
                        <div className="flex items-center gap-3 mt-1">
                            <p className="text-slate-400 text-sm">/{formData.slug} · {formData.images?.length || 0} images</p>
                            <span className="px-2 py-0.5 bg-[#ffc000]/10 text-[#ffc000] text-[10px] font-bold uppercase tracking-widest border border-[#ffc000]/20">
                                {currentLayout.label}
                            </span>
                        </div>
                    </div>
                </div>
                <button onClick={handleDelete} className="group flex items-center gap-2 text-red-400 hover:text-white font-bold text-xs tracking-widest uppercase px-6 py-3.5 border border-red-900/50 rounded-xl hover:bg-red-500 hover:border-red-500 transition-all shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                    Delete Gallery
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* ── Settings sidebar ──────────────────────────── */}
                <div className="lg:col-span-4 flex flex-col gap-6 order-last lg:order-first">

                    {/* Basic info */}
                    <div className="bg-[#111109] border border-white/5 p-6 md:p-7 rounded-2xl shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-[#ffc000]/5 blur-[80px] pointer-events-none" />
                        <h3 className="font-display font-bold text-white text-base border-b border-white/5 pb-4 flex items-center gap-3 relative z-10 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                                <span className="material-symbols-outlined text-[#ffc000] text-[16px]">info</span>
                            </div>
                            Gallery Info
                        </h3>
                        <div className="relative z-10 flex flex-col gap-4">
                            {[['Title', 'title', 'text', ''], ['Category', 'category', 'text', 'Editorial, Campaign, Wedding...']].map(([label, key, type, ph]) => (
                                <div key={key} className="flex flex-col gap-2 group">
                                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-[#ffc000] transition-colors">{label}</label>
                                    <input type={type} value={formData[key] || ''} onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                                        className="bg-[#1a1812] border border-white/10 rounded-xl px-5 py-3 text-white focus:border-[#ffc000] focus:ring-1 focus:ring-[#ffc000]/50 outline-none transition-all shadow-inner text-sm"
                                        placeholder={ph} />
                                </div>
                            ))}
                            <div className="flex flex-col gap-2 group">
                                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-[#ffc000] transition-colors">Description</label>
                                <textarea
                                    rows={3}
                                    value={formData.description || ''}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="bg-[#1a1812] border border-white/10 rounded-xl px-5 py-3 text-white focus:border-[#ffc000] focus:ring-1 focus:ring-[#ffc000]/50 outline-none transition-all shadow-inner text-sm resize-none"
                                    placeholder="A short caption shown beneath the gallery title..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Layout picker */}
                    <div className="bg-[#111109] border border-white/5 p-6 md:p-7 rounded-2xl shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffc000]/5 blur-[80px] pointer-events-none" />
                        <h3 className="font-display font-bold text-white text-base border-b border-white/5 pb-4 flex items-center gap-3 relative z-10 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                                <span className="material-symbols-outlined text-[#ffc000] text-[16px]">dashboard_customize</span>
                            </div>
                            Display Layout
                        </h3>
                        <div className="relative z-10 grid grid-cols-2 gap-3">
                            {LAYOUTS.map(layout => {
                                const active = (formData.layout || 'masonry') === layout.id;
                                return (
                                    <button
                                        key={layout.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, layout: layout.id })}
                                        className={`relative flex flex-col gap-3 p-3 rounded-xl border transition-all text-left group ${
                                            active
                                                ? 'bg-[#ffc000]/10 border-[#ffc000]/40 shadow-[0_0_20px_rgba(255,192,0,0.08)]'
                                                : 'bg-[#1a1812] border-white/8 hover:border-white/20'
                                        }`}
                                    >
                                        {active && (
                                            <div className="absolute top-2 right-2 w-4 h-4 bg-[#ffc000] rounded-full flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[10px] text-[#090805]">check</span>
                                            </div>
                                        )}
                                        {/* Mini preview */}
                                        <div className={`w-full ${active ? 'text-[#ffc000]' : 'text-white/20 group-hover:text-white/40'} transition-colors`}>
                                            {layout.preview}
                                        </div>
                                        <div>
                                            <p className={`text-xs font-bold uppercase tracking-widest ${active ? 'text-[#ffc000]' : 'text-slate-400'}`}>
                                                {layout.label}
                                            </p>
                                            <p className="text-[10px] text-slate-600 leading-tight mt-0.5 line-clamp-2">{layout.desc}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Cover image */}
                    <div className="bg-[#111109] border border-white/5 p-6 md:p-7 rounded-2xl shadow-lg relative overflow-hidden">
                        <h3 className="font-display font-bold text-white text-base border-b border-white/5 pb-4 flex items-center gap-3 relative z-10 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                                <span className="material-symbols-outlined text-[#ffc000] text-[16px]">image</span>
                            </div>
                            Cover Image
                        </h3>
                        <div className="relative z-10 flex flex-col gap-3">
                            <div className="aspect-video rounded-xl overflow-hidden bg-[#0a0a08] border border-white/10 shadow-inner group relative">
                                {formData.featuredImage
                                    ? <img src={formData.featuredImage} alt="Cover" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" />
                                    : <div className="absolute inset-0 flex items-center justify-center text-slate-600"><span className="material-symbols-outlined text-4xl">broken_image</span></div>
                                }
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => openMediaPicker('featured')}
                                    className="flex-1 py-3 text-[11px] uppercase tracking-widest font-bold border border-white/10 bg-white/5 rounded-xl text-slate-300 hover:text-[#0a0a08] hover:bg-[#ffc000] hover:border-[#ffc000] transition-all flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-[16px]">photo_library</span> Library
                                </button>
                                <label className="flex-1 cursor-pointer py-3 text-[11px] uppercase tracking-widest font-bold border border-white/10 bg-white/5 rounded-xl text-slate-300 hover:text-[#0a0a08] hover:bg-[#ffc000] hover:border-[#ffc000] transition-all flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-[16px]">upload</span> Upload
                                    <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, true)} disabled={uploading} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Image grid ────────────────────────────────── */}
                <div className="lg:col-span-8 bg-[#111109] border border-white/5 p-6 md:p-8 rounded-2xl shadow-lg relative overflow-hidden h-fit">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffc000]/5 blur-[80px] pointer-events-none" />

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 pb-5 mb-6 relative z-10 gap-4">
                        <h3 className="font-display font-bold text-white text-xl flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                                <span className="material-symbols-outlined text-[#ffc000] text-[18px]">collections</span>
                            </div>
                            Gallery Images
                            <span className="text-slate-500 font-normal text-sm">({formData.images?.length || 0})</span>
                        </h3>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button type="button" onClick={() => openMediaPicker('gallery')}
                                className="flex-1 sm:flex-none bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest text-slate-300 hover:border-[#ffc000] hover:text-[#ffc000] transition-colors flex items-center justify-center gap-2 shadow-sm">
                                <span className="material-symbols-outlined text-[16px]">photo_library</span> Library
                            </button>
                            <label className="flex-1 sm:flex-none cursor-pointer bg-[#ffc000]/10 text-[#ffc000] border border-[#ffc000]/30 px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-[#ffc000]/20 transition-colors flex items-center justify-center gap-2 shadow-sm">
                                <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                                {uploading ? 'Uploading...' : 'Upload New'}
                                <input type="file" accept="image/*" multiple className="hidden" onChange={e => handleFileUpload(e, false)} disabled={uploading} />
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 relative z-10">
                        {formData.images?.map((url: string, i: number) => (
                            <div key={i} className="aspect-square relative rounded-xl overflow-hidden group border border-white/10 shadow-sm bg-[#0a0a08]">
                                <img src={url} alt="" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />

                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-3 gap-2">
                                    <div className="flex items-center gap-2">
                                        <button type="button" onClick={() => moveImage(i, i - 1)} title="Move left"
                                            className="w-8 h-8 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all text-xs">
                                            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                                        </button>
                                        <button type="button" onClick={() => setAsCover(url)} title="Set as cover"
                                            className="w-9 h-9 bg-[#ffc000]/90 hover:bg-[#ffc000] text-[#0a0a08] rounded-full flex items-center justify-center shadow-lg transition-all">
                                            <span className="material-symbols-outlined text-[16px]">star</span>
                                        </button>
                                        <button type="button" onClick={() => removeImage(i)} title="Remove"
                                            className="w-9 h-9 bg-red-500/90 hover:bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg transition-all">
                                            <span className="material-symbols-outlined text-[16px]">delete</span>
                                        </button>
                                        <button type="button" onClick={() => moveImage(i, i + 1)} title="Move right"
                                            className="w-8 h-8 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all text-xs">
                                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Badges */}
                                {url === formData.featuredImage && (
                                    <div className="absolute top-2 left-2 bg-[#ffc000] px-2 py-0.5">
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#090805]">Cover</span>
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 bg-black/60 w-6 h-6 flex items-center justify-center">
                                    <span className="text-[9px] font-bold text-white/60 tabular-nums">{i + 1}</span>
                                </div>
                            </div>
                        ))}

                        {!formData.images?.length && (
                            <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-xl bg-white/[0.02]">
                                <div className="w-16 h-16 rounded-2xl bg-[#ffc000]/10 flex items-center justify-center mb-4 border border-[#ffc000]/20">
                                    <span className="material-symbols-outlined text-[32px] text-[#ffc000]">add_photo_alternate</span>
                                </div>
                                <h3 className="text-white font-bold text-lg mb-2">Build Your Gallery</h3>
                                <p className="text-slate-500 text-sm max-w-sm text-center px-4">Upload photos or pick from your media library to curate this collection.</p>
                            </div>
                        )}
                    </div>

                    {formData.images?.length > 0 && (
                        <p className="text-slate-600 text-xs mt-4 text-center relative z-10">
                            Hover any image to reorder or remove · Star sets as cover
                        </p>
                    )}
                </div>
            </div>

            {/* ── Fixed Save Bar ─────────────────────────────────── */}
            <div className="fixed bottom-0 left-0 right-0 md:left-72 bg-[#0a0a08] border-t border-white/10 py-4 px-6 md:px-12 flex items-center justify-between z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-3">
                    {status === 'success' && <p className="text-green-400 font-medium flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20 text-sm"><span className="material-symbols-outlined text-sm">check_circle</span> Gallery Updated</p>}
                    {status === 'error' && <p className="text-red-400 font-medium flex items-center gap-2 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20 text-sm"><span className="material-symbols-outlined text-sm">error</span> Failed to save.</p>}
                    {status === 'idle' && <p className="text-slate-500 text-sm hidden sm:block">Layout: <span className="text-[#ffc000] font-bold">{currentLayout.label}</span> · {formData.images?.length || 0} images</p>}
                </div>
                <button
                    onClick={handleSave}
                    disabled={status === 'saving'}
                    className="group relative bg-[#ffc000] text-[#0a0a08] px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest overflow-hidden transition-all disabled:opacity-50 flex items-center gap-3 shadow-[0_0_20px_rgba(255,192,0,0.2)] hover:shadow-[0_0_30px_rgba(255,192,0,0.4)] hover:-translate-y-0.5"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="relative z-10 flex items-center gap-2">
                        {status === 'saving'
                            ? <><div className="w-5 h-5 border-2 border-[#0a0a08]/40 border-t-[#0a0a08] rounded-full animate-spin" /> Saving...</>
                            : <><span className="material-symbols-outlined text-[18px]">save</span> Save Changes</>
                        }
                    </span>
                </button>
            </div>
        </div>
    );
}
