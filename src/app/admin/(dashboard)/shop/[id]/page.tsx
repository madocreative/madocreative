'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Editor } from '@tinymce/tinymce-react';

export default function ProductEditor({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [formData, setFormData] = useState<any>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [status, setStatus] = useState<'loading' | 'idle' | 'saving' | 'success' | 'error'>('loading');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        Promise.all([
            fetch(`/api/admin/products/${resolvedParams.id}`).then(r => r.json()),
            fetch('/api/admin/categories').then(r => r.json())
        ])
            .then(([productData, categoriesData]) => {
                if (productData.success) {
                    setFormData(productData.data);
                    if (categoriesData.success) {
                        setCategories(categoriesData.data);
                    }
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
            const res = await fetch(`/api/admin/products/${resolvedParams.id}`, {
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
        if (!confirm('Are you sure you want to delete this product?')) return;
        const res = await fetch(`/api/admin/products/${resolvedParams.id}`, { method: 'DELETE' });
        if (res.ok) router.push('/admin/shop');
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
                    setFormData((prev: any) => ({ ...prev, images: [...(prev.images || []), data.url] }));
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
    if (!formData) return <div className="text-red-400">Failed to load product data.</div>;

    return (
        <div className="max-w-6xl mx-auto pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-5">
                    <button onClick={() => router.back()} className="w-12 h-12 bg-[#111109] border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/5 hover:border-[#ffc000]/50 hover:text-[#ffc000] text-slate-400 transition-all shadow-md group">
                        <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="text-4xl font-display font-extrabold text-white tracking-tight">Edit <span className="text-[#ffc000]">Product</span></h1>
                        <p className="text-slate-400 text-sm mt-1">Changes are pushed live to the store instantly upon saving.</p>
                    </div>
                </div>
                <button onClick={handleDelete} className="group flex items-center gap-2 text-red-400 hover:text-white font-bold text-xs tracking-widest uppercase px-6 py-3.5 border border-red-900/50 rounded-xl hover:bg-red-500 hover:border-red-500 transition-all shadow-sm">
                    <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">delete</span>
                    Delete Product
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Col: Settings */}
                <form onSubmit={handleSave} className="lg:col-span-7 flex flex-col gap-8 bg-[#111109] border border-white/5 p-6 md:p-8 rounded-2xl shadow-lg relative overflow-hidden">
                    {/* Glow effect */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffc000]/5 blur-[80px] pointer-events-none" />

                    <h3 className="font-display font-bold text-white text-xl border-b border-white/5 pb-4 flex items-center gap-3 relative z-10">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                            <span className="material-symbols-outlined text-[#ffc000] text-[18px]">tune</span>
                        </div>
                        Product Configuration
                    </h3>

                    <div className="space-y-6 relative z-10">
                        <div className="flex flex-col gap-2 relative group">
                            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-[#ffc000] transition-colors ml-1">Product Name</label>
                            <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="bg-[#1a1812] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:border-[#ffc000] focus:ring-1 focus:ring-[#ffc000]/50 outline-none transition-all shadow-inner text-sm" required />
                        </div>

                        <div className="flex flex-col gap-2 relative group">
                            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-[#ffc000] transition-colors ml-1">Category</label>
                            <div className="relative">
                                <select value={formData.category || 'Other'} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-[#1a1812] border border-white/10 rounded-xl px-5 py-3.5 text-white appearance-none outline-none focus:border-[#ffc000] focus:ring-1 focus:ring-[#ffc000]/50 transition-all shadow-inner text-sm">
                                    <option value="Other">Other</option>
                                    {categories.map(c => (
                                        <option key={c._id} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2 relative group">
                                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-[#ffc000] transition-colors ml-1">Price ($)</label>
                                <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })} className="bg-[#1a1812] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:border-[#ffc000] focus:ring-1 focus:ring-[#ffc000]/50 outline-none transition-all shadow-inner text-sm font-mono" required />
                            </div>
                            <div className="flex flex-col gap-2 relative group">
                                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-[#ffc000] transition-colors ml-1">Stock Status</label>
                                <div className="relative">
                                    <select value={formData.inStock.toString()} onChange={e => setFormData({ ...formData, inStock: e.target.value === 'true' })} className="w-full bg-[#1a1812] border border-white/10 rounded-xl px-5 py-3.5 text-white appearance-none outline-none focus:border-[#ffc000] focus:ring-1 focus:ring-[#ffc000]/50 transition-all shadow-inner text-sm">
                                        <option value="true">In Stock</option>
                                        <option value="false">Out of Stock</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 relative group">
                            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-[#ffc000] transition-colors ml-1">Description</label>
                            <div className="rounded-xl overflow-hidden border border-white/10 focus-within:border-[#ffc000] focus-within:ring-1 focus-within:ring-[#ffc000]/50 transition-all shadow-inner">
                                <Editor
                                    apiKey="g88bn7s6hdxjafldilhhhftd9lgastp07jn8lj44lq83w3j1"
                                    value={formData.description}
                                    onEditorChange={(content) => setFormData({ ...formData, description: content })}
                                    init={{
                                        height: 300,
                                        menubar: false,
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                        ],
                                        toolbar: 'undo redo | blocks | ' +
                                            'bold italic forecolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'removeformat | help',
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; background-color: #1a1812; color: white; }',
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="fixed bottom-0 left-0 right-0 md:left-72 bg-[#0a0a08] border-t border-white/10 py-5 px-6 md:px-12 flex items-center justify-between z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center gap-3">
                            {status === 'success' && <p className="text-green-400 font-medium flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20"><span className="material-symbols-outlined text-sm">check_circle</span> Product Updated</p>}
                            {status === 'error' && <p className="text-red-400 font-medium flex items-center gap-2 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20"><span className="material-symbols-outlined text-sm">error</span> Failed to save.</p>}
                            {status === 'idle' && <p className="text-slate-500 text-sm hidden sm:block">Ready to update when you are.</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={status === 'saving'}
                            className="group relative bg-[#ffc000] text-[#0a0a08] px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest overflow-hidden transition-all disabled:opacity-50 flex items-center gap-3 shadow-[0_0_20px_rgba(255,192,0,0.2)] hover:shadow-[0_0_30px_rgba(255,192,0,0.4)] hover:-translate-y-0.5"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <span className="relative z-10 flex items-center gap-2">
                                {status === 'saving'
                                    ? <><div className="w-5 h-5 border-2 border-[#0a0a08]/40 border-t-[#0a0a08] rounded-full animate-spin"></div> Saving...</>
                                    : <><span className="material-symbols-outlined text-[18px]">save</span> Save Product</>
                                }
                            </span>
                        </button>
                    </div>
                </form>

                {/* Right Col: Images */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="bg-[#111109] border border-white/5 p-6 md:p-8 rounded-2xl shadow-lg relative overflow-hidden h-fit">
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#ffc000]/5 to-transparent pointer-events-none" />

                        <div className="flex items-center justify-between border-b border-white/5 pb-5 mb-6 relative z-10">
                            <h3 className="font-display font-bold text-white text-xl flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                                    <span className="material-symbols-outlined text-[#ffc000] text-[18px]">photo_library</span>
                                </div>
                                Gallery
                            </h3>
                            <label className="cursor-pointer bg-white/5 text-slate-300 border border-white/10 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#ffc000] hover:text-[#0a0a08] hover:border-[#ffc000] transition-all flex items-center gap-2 shadow-sm">
                                <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} disabled={uploading} />
                                {uploading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>}
                                {uploading ? 'Uploading...' : 'Add Photos'}
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-4 relative z-10">
                            {formData.images?.map((url: string, index: number) => (
                                <div key={index} className="aspect-square relative rounded-xl overflow-hidden group border border-white/10 shadow-sm bg-[#0a0a08]">
                                    <img src={url} alt={`Product view ${index + 1}`} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                                        <button type="button" onClick={() => removeImage(index)} className="self-end w-9 h-9 bg-red-500/90 hover:bg-red-500 text-white rounded-lg flex items-center justify-center transition-transform hover:scale-105 shadow-lg">
                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                        </button>
                                    </div>
                                    {index === 0 && (
                                        <div className="absolute top-2 left-2 bg-black/60 px-2.5 py-1 rounded-md border border-white/10">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#ffc000]">Primary</span>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {!formData.images?.length && !uploading && (
                                <div className="col-span-full py-16 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-xl bg-white/[0.02]">
                                    <span className="material-symbols-outlined text-4xl text-slate-600 mb-3">broken_image</span>
                                    <p className="text-slate-400 text-sm max-w-[200px] text-center">No images currently uploaded for this product.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
