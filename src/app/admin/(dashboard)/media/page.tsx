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
        <div className="max-w-7xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-1">Media Library</h1>
                    <p className="text-slate-400 text-sm">{items.length} images stored &middot; Click to select &middot; Copy URL to use anywhere</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleSeed} disabled={seeding}
                        className="border border-white/20 text-slate-300 hover:text-white hover:border-white/40 px-4 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50">
                        <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                        {seeding ? 'Seeding...' : 'Seed from defaults'}
                    </button>
                    <label className="cursor-pointer bg-[#ffc000] text-[#0a0a08] px-5 py-2.5 rounded-lg font-bold uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-2 text-sm">
                        <span className="material-symbols-outlined text-[16px]">upload</span>
                        {uploading ? `Uploading ${uploadProgress}%` : 'Upload Images'}
                        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
                            onChange={e => e.target.files && handleUpload(e.target.files)} disabled={uploading} />
                    </label>
                </div>
            </div>

            <div className="flex gap-6 items-start">
                {/* Grid */}
                <div className="flex-1 min-w-0">
                    {/* Drop zone hint */}
                    <div
                        className="border-2 border-dashed border-white/10 rounded-xl p-4 mb-6 text-center text-slate-600 text-sm cursor-pointer hover:border-[#ffc000]/40 hover:text-slate-400 transition-all"
                        onClick={() => fileRef.current?.click()}
                        onDragOver={e => { e.preventDefault(); }}
                        onDrop={e => {
                            e.preventDefault();
                            if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files);
                        }}
                    >
                        <span className="material-symbols-outlined text-2xl block mb-1">cloud_upload</span>
                        Drag & drop images here or click to browse
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-48">
                            <div className="w-8 h-8 border-2 border-[#ffc000] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="py-20 text-center border border-white/10 rounded-xl">
                            <span className="material-symbols-outlined text-4xl text-slate-600 mb-3 block">image</span>
                            <p className="text-slate-500 mb-4">No images yet. Upload some or click "Seed from defaults".</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                            {items.map(item => (
                                <div
                                    key={item._id}
                                    onClick={() => setSelected(selected === item._id ? null : item._id)}
                                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer group border-2 transition-all ${selected === item._id ? 'border-[#ffc000]' : 'border-transparent hover:border-white/30'}`}
                                >
                                    <img src={item.url} alt={item.filename || ''} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                                        <button
                                            type="button"
                                            onClick={e => { e.stopPropagation(); copyUrl(item.url, item._id); }}
                                            className={`text-xs font-bold px-2 py-1 rounded flex items-center gap-1 transition-colors ${copied === item._id ? 'bg-green-500 text-white' : 'bg-white text-[#0a0a08] hover:bg-[#ffc000]'}`}
                                        >
                                            <span className="material-symbols-outlined text-[12px]">{copied === item._id ? 'check' : 'content_copy'}</span>
                                            {copied === item._id ? 'Copied!' : 'Copy'}
                                        </button>
                                    </div>
                                    {selected === item._id && (
                                        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#ffc000] rounded-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[10px] text-[#0a0a08]">check</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar: selected image details */}
                {selectedItem && (
                    <div className="w-64 shrink-0 bg-[#1a1812] border border-white/10 rounded-xl overflow-hidden sticky top-0">
                        <img src={selectedItem.url} alt="" className="w-full aspect-square object-cover" />
                        <div className="p-4 flex flex-col gap-3">
                            {selectedItem.filename && (
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Filename</p>
                                    <p className="text-white text-xs break-all">{selectedItem.filename}</p>
                                </div>
                            )}
                            {(selectedItem.width && selectedItem.height) && (
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Dimensions</p>
                                    <p className="text-white text-xs">{selectedItem.width} × {selectedItem.height}px</p>
                                </div>
                            )}
                            {selectedItem.bytes && (
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Size</p>
                                    <p className="text-white text-xs">{formatBytes(selectedItem.bytes)}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">URL</p>
                                <p className="text-slate-400 text-[10px] break-all leading-relaxed">{selectedItem.url}</p>
                            </div>

                            <button
                                onClick={() => copyUrl(selectedItem.url, selectedItem._id)}
                                className={`w-full py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${copied === selectedItem._id ? 'bg-green-500 text-white' : 'bg-[#ffc000] text-[#0a0a08] hover:brightness-110'}`}
                            >
                                <span className="material-symbols-outlined text-[14px]">{copied === selectedItem._id ? 'check' : 'content_copy'}</span>
                                {copied === selectedItem._id ? 'Copied!' : 'Copy URL'}
                            </button>

                            <button
                                onClick={() => handleDelete(selectedItem._id)}
                                className="w-full py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[14px]">delete</span> Remove
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
