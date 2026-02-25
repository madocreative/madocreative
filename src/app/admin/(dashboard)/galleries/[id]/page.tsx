'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

interface MediaItem { _id: string; url: string; filename?: string }

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

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
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

    if (status === 'loading') return (
        <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-2 border-[#ffc000] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
    if (!formData) return <div className="text-red-400 p-6">Failed to load gallery.</div>;

    return (
        <div className="max-w-5xl">
            {/* Media Picker Modal */}
            {showMediaPicker && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#1a1812] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b border-white/10">
                            <h3 className="font-bold text-white text-lg">
                                {mediaPickerTarget === 'featured' ? 'Choose Cover Image' : 'Add Images from Library'}
                            </h3>
                            <button onClick={() => setShowMediaPicker(false)} className="text-slate-400 hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="overflow-y-auto p-5 flex-1">
                            {mediaLoading
                                ? <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-[#ffc000] border-t-transparent rounded-full animate-spin"></div></div>
                                : mediaItems.length === 0
                                    ? <p className="text-slate-500 text-center py-12 text-sm">No media in library. Go to Media Library to upload images first.</p>
                                    : (
                                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                                            {mediaItems.map(item => {
                                                const inGallery = formData.images?.includes(item.url);
                                                return (
                                                    <button key={item._id} type="button" onClick={() => pickMedia(item.url)}
                                                        className={`relative aspect-square rounded-lg overflow-hidden group border-2 transition-all ${inGallery && mediaPickerTarget === 'gallery' ? 'border-[#ffc000]/60 opacity-60' : 'border-transparent hover:border-[#ffc000]'}`}>
                                                        <img src={item.url} alt="" className="w-full h-full object-cover" />
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
                                    className="w-full bg-[#ffc000] text-[#0a0a08] py-3 rounded-lg font-bold uppercase tracking-wider hover:brightness-110 text-sm">
                                    Done Adding Images
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="w-10 h-10 bg-[#1a1812] border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/5 text-white">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-white">{formData.title}</h1>
                        <p className="text-slate-500 text-sm">/{formData.slug} &middot; {formData.images?.length || 0} images</p>
                    </div>
                </div>
                <button onClick={handleDelete} className="text-red-400 hover:text-red-300 text-sm font-bold uppercase tracking-wider px-4 py-2 border border-red-900/50 rounded-lg hover:bg-red-900/20 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px]">delete</span> Delete
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Settings sidebar */}
                <form onSubmit={handleSave} className="lg:col-span-1 flex flex-col gap-5 bg-[#1a1812] border border-white/10 p-6 rounded-xl h-fit">
                    <h3 className="font-bold text-white border-b border-white/10 pb-4 flex items-center gap-2 text-sm">
                        <span className="material-symbols-outlined text-[#ffc000] text-[16px]">tune</span> Gallery Settings
                    </h3>

                    {[['Title', 'title', 'text', ''], ['Category', 'category', 'text', 'Editorial, Campaign...']].map(([label, key, type, ph]) => (
                        <div key={key} className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</label>
                            <input type={type} value={formData[key] || ''} onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                                className="bg-[#221e10] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#ffc000] outline-none text-sm"
                                placeholder={ph} />
                        </div>
                    ))}

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Layout</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['masonry', 'grid'].map(l => (
                                <button key={l} type="button" onClick={() => setFormData({ ...formData, layout: l })}
                                    className={`py-2.5 rounded-lg text-sm font-bold capitalize border transition-all ${formData.layout === l ? 'bg-[#ffc000] text-[#0a0a08] border-[#ffc000]' : 'bg-[#221e10] text-slate-400 border-white/10 hover:border-white/30'}`}>
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Cover Image</label>
                        <div className="aspect-video rounded-lg overflow-hidden bg-[#221e10] border border-dashed border-white/20 mb-1">
                            {formData.featuredImage && <img src={formData.featuredImage} alt="Cover" className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex gap-2">
                            <button type="button" onClick={() => openMediaPicker('featured')}
                                className="flex-1 py-2 text-xs font-bold border border-white/10 rounded-lg text-slate-400 hover:text-[#ffc000] hover:border-[#ffc000] flex items-center justify-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">photo_library</span> Library
                            </button>
                            <label className="flex-1 cursor-pointer py-2 text-xs font-bold border border-white/10 rounded-lg text-slate-400 hover:text-[#ffc000] hover:border-[#ffc000] flex items-center justify-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">upload</span> Upload
                                <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, true)} disabled={uploading} />
                            </label>
                        </div>
                    </div>

                    <button type="submit" disabled={status === 'saving'}
                        className="bg-[#ffc000] text-[#0a0a08] py-3 rounded-lg font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 disabled:opacity-50 text-sm flex items-center justify-center gap-2">
                        {status === 'saving' ? <><div className="w-4 h-4 border-2 border-[#0a0a08]/40 border-t-[#0a0a08] rounded-full animate-spin"></div> Saving...</> : <><span className="material-symbols-outlined text-[14px]">save</span> Save Changes</>}
                    </button>
                    {status === 'success' && <p className="text-green-400 text-xs text-center flex items-center justify-center gap-1"><span className="material-symbols-outlined text-[12px]">check_circle</span> Saved!</p>}
                </form>

                {/* Image grid */}
                <div className="lg:col-span-2 bg-[#1a1812] border border-white/10 p-6 rounded-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                        <h3 className="font-bold text-white text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#ffc000] text-[16px]">collections</span>
                            Images ({formData.images?.length || 0})
                        </h3>
                        <div className="flex gap-2">
                            <button type="button" onClick={() => openMediaPicker('gallery')}
                                className="bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-xs font-bold text-slate-300 hover:border-[#ffc000] hover:text-[#ffc000] flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[12px]">photo_library</span> From Library
                            </button>
                            <label className="cursor-pointer bg-[#ffc000]/10 text-[#ffc000] border border-[#ffc000]/30 px-3 py-2 rounded-lg text-xs font-bold hover:bg-[#ffc000]/20 flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[12px]">cloud_upload</span>
                                {uploading ? 'Uploading...' : 'Upload'}
                                <input type="file" accept="image/*" multiple className="hidden" onChange={e => handleFileUpload(e, false)} disabled={uploading} />
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {formData.images?.map((url: string, i: number) => (
                            <div key={i} className="relative rounded-xl overflow-hidden group border border-white/5 aspect-square">
                                <img src={url} alt="" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button type="button" onClick={() => setAsCover(url)} title="Set as cover"
                                        className="w-9 h-9 bg-[#ffc000]/90 hover:bg-[#ffc000] text-[#0a0a08] rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[14px]">star</span>
                                    </button>
                                    <button type="button" onClick={() => removeImage(i)}
                                        className="w-9 h-9 bg-red-500/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[14px]">delete</span>
                                    </button>
                                </div>
                                {url === formData.featuredImage && (
                                    <div className="absolute top-2 left-2 bg-[#ffc000] text-[#0a0a08] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Cover</div>
                                )}
                            </div>
                        ))}
                        {!formData.images?.length && (
                            <div className="col-span-full py-16 text-center text-slate-600 text-sm border-2 border-dashed border-white/10 rounded-xl">
                                <span className="material-symbols-outlined text-4xl block mb-2">add_photo_alternate</span>
                                Add images from Library or upload new ones
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
