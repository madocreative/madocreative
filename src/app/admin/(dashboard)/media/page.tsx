'use client';

import { useState, useEffect, useRef } from 'react';

interface MediaItem {
    _id: string;
    url: string;
    filename?: string;
    width?: number;
    height?: number;
    bytes?: number;
    createdAt: string;
}

export default function MediaLibraryPage() {
    const [items, setItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [copied, setCopied] = useState<string | null>(null);
    const [selected, setSelected] = useState<string | null>(null);
    const [seeding, setSeeding] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const load = async () => {
        setLoading(true);
        const res = await fetch('/api/admin/media');
        const d = await res.json();
        if (d.success) setItems(d.data);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleUpload = async (files: FileList) => {
        setUploading(true);
        const total = files.length;
        let done = 0;
        for (const file of Array.from(files)) {
            const fd = new FormData();
            fd.append('file', file);
            await fetch('/api/admin/upload', { method: 'POST', body: fd });
            done++;
            setUploadProgress(Math.round((done / total) * 100));
        }
        setUploading(false);
        setUploadProgress(0);
        await load();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Remove from media library?')) return;
        await fetch('/api/admin/media', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        setItems(prev => prev.filter(i => i._id !== id));
        if (selected === id) setSelected(null);
    };

    const copyUrl = (url: string, id: string) => {
        navigator.clipboard.writeText(url);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleSeed = async () => {
        setSeeding(true);
        const res = await fetch('/api/admin/seed-galleries', { method: 'POST' });
        const d = await res.json();
        setSeeding(false);
        if (d.success) {
            alert(d.created.length > 0
                ? `Created galleries: ${d.created.join(', ')}\n\nImages registered in media library.`
                : 'Galleries already exist. Media library images registered.'
            );
            await load();
        }
    };

    const selectedItem = items.find(i => i._id === selected);
    const formatBytes = (b?: number) => b ? (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`) : '';

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">Media Library</h1>
                    <p className="text-slate-400">Manage all your uploaded images and assets in one place.</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <button onClick={handleSeed} disabled={seeding}
                        className="bg-[#111109] border border-white/10 text-slate-300 hover:text-white hover:border-[#ffc000]/50 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 group">
                        <span className="material-symbols-outlined text-[18px] group-hover:text-[#ffc000] transition-colors">auto_awesome</span>
                        {seeding ? 'Seeding...' : 'Seed Data'}
                    </button>
                    <label className="group relative bg-[#ffc000] text-[#0a0a08] px-6 py-3.5 rounded-xl font-bold uppercase tracking-widest overflow-hidden transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(255,192,0,0.2)] hover:shadow-[0_0_30px_rgba(255,192,0,0.4)] hover:-translate-y-0.5 cursor-pointer">
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="relative z-10 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
                            {uploading ? `Uploading ${uploadProgress}%` : 'Upload Images'}
                        </span>
                        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
                            onChange={e => e.target.files && handleUpload(e.target.files)} disabled={uploading} />
                    </label>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start relative">
                {/* Grid */}
                <div className="flex-1 min-w-0 w-full bg-[#111109] border border-white/5 p-6 md:p-8 rounded-2xl shadow-lg relative overflow-hidden h-fit">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffc000]/5 blur-[80px] pointer-events-none" />

                    {/* Drop zone hint */}
                    <div
                        className="border-2 border-dashed border-white/10 rounded-xl p-8 mb-8 text-center text-slate-500 text-sm cursor-pointer hover:border-[#ffc000]/30 hover:bg-white/[0.02] hover:text-[#ffc000] transition-all relative z-10 flex flex-col items-center gap-3 group"
                        onClick={() => fileRef.current?.click()}
                        onDragOver={e => { e.preventDefault(); }}
                        onDrop={e => {
                            e.preventDefault();
                            if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files);
                        }}
                    >
                        <div className="w-16 h-16 rounded-full bg-[#1a1812] border border-white/10 flex items-center justify-center group-hover:bg-[#ffc000]/10 transition-colors shadow-inner">
                            <span className="material-symbols-outlined text-[32px] group-hover:text-[#ffc000] transition-colors">cloud_upload</span>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-1">Drag & drop images here</p>
                            <p>or click to browse your files</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 z-10 relative">
                            <div className="w-12 h-12 border-2 border-[#ffc000]/30 border-t-[#ffc000] rounded-full animate-spin mb-4"></div>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Library...</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="py-24 px-6 text-center border border-dashed border-white/10 rounded-xl bg-[#1a1812] z-10 relative flex flex-col items-center">
                            <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-5xl text-slate-600 mb-0">collections</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Your Library is Empty</h3>
                            <p className="text-slate-500 max-w-sm mb-6">Upload some images to start building your gallery, or click "Seed Data" to generate placeholders.</p>
                        </div>
                    ) : (
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                                <h3 className="font-display font-bold text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#ffc000] text-[18px]">grid_view</span>
                                    All Media <span className="text-slate-500 font-normal text-sm ml-2">({items.length} total)</span>
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {items.map(item => (
                                    <div
                                        key={item._id}
                                        onClick={() => setSelected(selected === item._id ? null : item._id)}
                                        className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer group border-2 transition-all shadow-sm ${selected === item._id ? 'border-[#ffc000] scale-[0.98]' : 'border-transparent hover:border-[#ffc000]/50 bg-[#0a0a08]'}`}
                                    >
                                        <img src={item.url} alt={item.filename || ''} className="w-full h-full object-contain transition-opacity duration-300" />
                                        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 flex items-end justify-center pb-3 ${selected === item._id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                            <button
                                                type="button"
                                                onClick={e => { e.stopPropagation(); copyUrl(item.url, item._id); }}
                                                className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-lg ${copied === item._id ? 'bg-green-500 text-white' : 'bg-white/90 text-[#0a0a08] hover:bg-[#ffc000]'}`}
                                            >
                                                <span className="material-symbols-outlined text-[14px]">{copied === item._id ? 'check' : 'content_copy'}</span>
                                                {copied === item._id ? 'Copied' : 'Copy URL'}
                                            </button>
                                        </div>
                                        {selected === item._id && (
                                            <div className="absolute top-2 right-2 w-6 h-6 bg-[#ffc000] rounded-full flex items-center justify-center shadow-md">
                                                <span className="material-symbols-outlined text-[14px] text-[#0a0a08]">check</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar: selected image details */}
                <div className={`w-full lg:w-80 shrink-0 bg-[#111109] border border-white/5 rounded-2xl overflow-hidden sticky top-8 transition-all duration-500 shadow-lg ${selectedItem ? 'opacity-100 lg:translate-x-0' : 'opacity-0 lg:translate-x-12 hidden lg:block pointer-events-none'}`}>
                    {selectedItem ? (
                        <>
                            <div className="aspect-[4/3] bg-[#0a0a08] relative border-b border-white/10">
                                <img src={selectedItem.url} alt="" className="w-full h-full object-contain" />
                            </div>
                            <div className="p-6 flex flex-col gap-5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffc000]/10 blur-[50px] pointer-events-none" />

                                {selectedItem?.filename && (
                                    <div className="relative z-10">
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-[#ffc000] mb-1">Filename</p>
                                        <p className="text-white text-sm font-medium break-all">{selectedItem.filename}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4 relative z-10">
                                    {(selectedItem?.width && selectedItem?.height) && (
                                        <div className="bg-[#1a1812] p-3 rounded-xl border border-white/5 shadow-inner">
                                            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">Dimensions</p>
                                            <p className="text-white text-xs whitespace-nowrap">{selectedItem.width} × {selectedItem.height} px</p>
                                        </div>
                                    )}
                                    {selectedItem?.bytes && (
                                        <div className="bg-[#1a1812] p-3 rounded-xl border border-white/5 shadow-inner">
                                            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">Size</p>
                                            <p className="text-white text-xs">{formatBytes(selectedItem.bytes)}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="relative z-10">
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Direct URL</p>
                                    <div className="bg-[#1a1812] border border-white/10 rounded-xl p-3 flex items-center justify-between gap-3 shadow-inner">
                                        <p className="text-slate-400 text-[11px] truncate">{selectedItem?.url}</p>
                                        <button
                                            onClick={() => selectedItem && copyUrl(selectedItem.url, selectedItem._id)}
                                            className={`p-2 rounded-lg transition-colors flex shrink-0 ${copied === (selectedItem?._id) ? 'bg-green-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-[#ffc000] hover:text-[#0a0a08]'}`}
                                            title="Copy URL"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">{copied === (selectedItem?._id) ? 'check' : 'content_copy'}</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-5 border-t border-white/5 relative z-10">
                                    <button
                                        onClick={() => selectedItem && handleDelete(selectedItem._id)}
                                        className="w-full py-3.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">delete_forever</span> Delete Image
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center h-full min-h-[400px]">
                            <span className="material-symbols-outlined text-4xl mb-4 opacity-50">touch_app</span>
                            <p className="text-sm font-medium">Select an image to view details and options.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
