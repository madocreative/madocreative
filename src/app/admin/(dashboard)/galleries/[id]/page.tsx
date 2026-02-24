'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

export default function GalleryEditor({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [formData, setFormData] = useState<any>(null);
    const [status, setStatus] = useState<'loading' | 'idle' | 'saving' | 'success' | 'error'>('loading');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetch(`/api/admin/galleries/${resolvedParams.id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setFormData(data.data);
                    setStatus('idle');
                } else {
                    setStatus('error');
                }
            })
            .catch(() => setStatus('error'));
    }, [resolvedParams.id]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('saving');
        try {
            const res = await fetch(`/api/admin/galleries/${resolvedParams.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setStatus('success');
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this gallery? This cannot be undone.')) return;
        const res = await fetch(`/api/admin/galleries/${resolvedParams.id}`, { method: 'DELETE' });
        if (res.ok) router.push('/admin/galleries');
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isFeatured = false) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const files = Array.from(e.target.files);

        for (const file of files) {
            const uploadData = new FormData();
            uploadData.append('file', file);

            try {
                const res = await fetch('/api/admin/upload', {
                    method: 'POST',
                    body: uploadData
                });
                const data = await res.json();

                if (data.success) {
                    if (isFeatured) {
                        setFormData((prev: any) => ({ ...prev, featuredImage: data.url }));
                    } else {
                        setFormData((prev: any) => ({ ...prev, images: [...(prev.images || []), data.url] }));
                    }
                }
            } catch (err) {
                console.error('Upload failed');
            }
        }
        setUploading(false);
    };

    const removeImage = (indexToRemove: number) => {
        setFormData((prev: any) => ({
            ...prev,
            images: prev.images.filter((_: any, index: number) => index !== indexToRemove)
        }));
    };

    if (status === 'loading') return <div className="text-white">Loading...</div>;
    if (!formData) return <div className="text-red-400">Failed to load gallery data.</div>;

    return (
        <div className="max-w-5xl">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="w-10 h-10 bg-[#1a1812] border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/5 text-white transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-3xl font-display font-bold text-white">Edit Gallery: {formData.title}</h1>
                </div>
                <button onClick={handleDelete} className="text-red-400 hover:text-red-300 font-bold text-sm tracking-wider uppercase px-4 py-2 border border-red-900/50 rounded-lg hover:bg-red-900/20 transition-all">
                    Delete Gallery
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col: Settings */}
                <form onSubmit={handleSave} className="lg:col-span-1 flex flex-col gap-6 bg-[#1a1812] border border-white/10 p-6 rounded-xl h-fit">
                    <h3 className="font-bold text-white text-lg border-b border-white/10 pb-4">Gallery Settings</h3>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Title</label>
                        <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="bg-[#221e10] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#f2b90d] outline-none" required />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Category / Client</label>
                        <input type="text" value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} className="bg-[#221e10] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#f2b90d] outline-none" placeholder="E.g., Editorial" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Layout Style</label>
                        <select value={formData.layout || 'masonry'} onChange={e => setFormData({ ...formData, layout: e.target.value })} className="bg-[#221e10] border border-white/10 rounded-lg px-4 py-3 text-white appearance-none outline-none focus:border-[#f2b90d]">
                            <option value="masonry">Masonry (Uneven)</option>
                            <option value="grid">Grid (Uniform)</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Featured Image (Cover)</label>
                        <div className="aspect-video relative overflow-hidden rounded-lg bg-[#221e10] border border-dashed border-white/20 mb-2">
                            <img src={formData.featuredImage} alt="Cover" className="w-full h-full object-cover opacity-80" />
                        </div>
                        <label className="cursor-pointer bg-[#221e10] border border-white/10 text-center py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:border-[#f2b90d] transition-all">
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, true)} disabled={uploading} />
                            {uploading ? 'Uploading...' : 'Change Cover Image'}
                        </label>
                    </div>

                    <button type="submit" disabled={status === 'saving'} className="mt-4 bg-[#f2b90d] text-[#0a0a08] py-3 rounded-lg font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all disabled:opacity-50">
                        {status === 'saving' ? 'Saving...' : 'Save Changes'}
                    </button>
                    {status === 'success' && <p className="text-green-400 text-sm text-center">Settings saved!</p>}
                </form>

                {/* Right Col: Image Grid */}
                <div className="lg:col-span-2 bg-[#1a1812] border border-white/10 p-6 rounded-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                        <h3 className="font-bold text-white text-lg">Detailed Gallery Images ({formData.images?.length || 0})</h3>
                        <label className="cursor-pointer bg-[#f2b90d]/10 text-[#f2b90d] border border-[#f2b90d]/30 px-4 py-2 rounded-lg text-sm font-bold uppercase hover:bg-[#f2b90d]/20 transition-colors flex items-center gap-2">
                            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileUpload(e, false)} disabled={uploading} />
                            <span className="material-symbols-outlined text-sm">cloud_upload</span>
                            {uploading ? 'Uploading...' : 'Upload Images'}
                        </label>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {formData.images?.map((url: string, index: number) => (
                            <div key={index} className="aspect-square relative rounded-lg overflow-hidden group border border-white/10">
                                <img src={url} alt={`Gallery image ${index + 1}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button onClick={() => removeImage(index)} className="w-10 h-10 bg-red-500/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors shadow-lg">
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}

                        {!formData.images?.length && !uploading && (
                            <div className="col-span-full py-12 text-center text-slate-500">
                                No images added. Click "Upload Images" to start building your gallery.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
