'use client';

import { useState } from 'react';

interface MediaItem {
    _id: string;
    url: string;
    filename?: string;
    width?: number;
    height?: number;
    bytes?: number;
}

type MediaImageFieldProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    upload: (file: File, onProgress?: (percent: number) => void) => Promise<string>;
    uploadLabel?: string;
};

export default function MediaImageField({
    label,
    value,
    onChange,
    upload,
    uploadLabel = 'Upload Image',
}: MediaImageFieldProps) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [mediaLoading, setMediaLoading] = useState(false);
    const [importingCloudinary, setImportingCloudinary] = useState(false);
    const [importMessage, setImportMessage] = useState('');

    const loadMediaItems = async (force = false) => {
        if (mediaLoading || (!force && mediaItems.length > 0)) return;

        setMediaLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/media');
            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Failed to load media library.');
            }

            setMediaItems(data.data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load media library.');
        } finally {
            setMediaLoading(false);
        }
    };

    const openMediaPicker = async () => {
        setShowMediaPicker(true);
        await loadMediaItems();
    };

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError('');
        setImportMessage('');
        setUploading(true);
        setProgress(0);

        try {
            onChange(await upload(file, setProgress));
            setProgress(100);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
        } finally {
            setUploading(false);
            setTimeout(() => setProgress(null), 1200);
            e.target.value = '';
        }
    };

    const handleCloudinaryImport = async () => {
        setImportingCloudinary(true);
        setError('');
        setImportMessage('');

        try {
            const res = await fetch('/api/admin/media/import', { method: 'POST' });
            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Failed to import Cloudinary images.');
            }

            setImportMessage(`Cloudinary synced: ${data.imported} new, ${data.updated} refreshed.`);
            await loadMediaItems(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to import Cloudinary images.');
        } finally {
            setImportingCloudinary(false);
        }
    };

    return (
        <>
            {showMediaPicker && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
                    <div className="flex max-h-[80vh] w-full max-w-5xl flex-col rounded-2xl border border-white/10 bg-[#1a1812] shadow-2xl">
                        <div className="flex items-center justify-between gap-4 border-b border-white/10 p-5">
                            <div>
                                <h3 className="text-lg font-bold text-white">Choose from Media Library</h3>
                                <p className="text-sm text-slate-400">Select any imported Cloudinary image or recent upload.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => loadMediaItems(true)}
                                    disabled={mediaLoading}
                                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-300 transition-all hover:border-[#ffc000]/60 hover:text-[#ffc000] disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-[16px]">refresh</span>
                                    Refresh
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloudinaryImport}
                                    disabled={importingCloudinary}
                                    className="inline-flex items-center gap-2 rounded-xl border border-[#ffc000]/30 bg-[#ffc000]/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#ffc000] transition-all hover:bg-[#ffc000]/20 disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-[16px]">cloud_sync</span>
                                    {importingCloudinary ? 'Importing...' : 'Import Cloudinary'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowMediaPicker(false)}
                                    className="text-slate-400 transition-colors hover:text-white"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5">
                            {mediaLoading ? (
                                <div className="flex justify-center py-12">
                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#ffc000] border-t-transparent" />
                                </div>
                            ) : mediaItems.length === 0 ? (
                                <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/10 bg-[#111109] px-6 py-16 text-center">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffc000]/10 text-[#ffc000]">
                                        <span className="material-symbols-outlined text-[30px]">imagesmode</span>
                                    </div>
                                    <h4 className="mb-2 text-lg font-bold text-white">No media imported yet</h4>
                                    <p className="mb-6 max-w-md text-sm text-slate-500">
                                        Import your Cloudinary library here and the images will become selectable in this editor.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleCloudinaryImport}
                                        disabled={importingCloudinary}
                                        className="inline-flex items-center gap-2 rounded-xl bg-[#ffc000] px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#0a0a08] transition-all hover:brightness-110 disabled:opacity-50"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">cloud_sync</span>
                                        {importingCloudinary ? 'Importing...' : 'Import Cloudinary Images'}
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                    {mediaItems.map((item) => {
                                        const selected = value === item.url;

                                        return (
                                            <button
                                                key={item._id}
                                                type="button"
                                                onClick={() => {
                                                    onChange(item.url);
                                                    setShowMediaPicker(false);
                                                }}
                                                className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-[#0a0a08] transition-all ${
                                                    selected ? 'border-[#ffc000]' : 'border-transparent hover:border-[#ffc000]/60'
                                                }`}
                                            >
                                                <img src={item.url} alt={item.filename || ''} className="h-full w-full object-contain" />
                                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-3 pb-2 pt-6 text-left">
                                                    <p className="truncate text-[10px] font-bold uppercase tracking-widest text-white">
                                                        {item.filename || 'Cloudinary image'}
                                                    </p>
                                                </div>
                                                {selected && (
                                                    <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#ffc000] text-[#0a0a08]">
                                                        <span className="material-symbols-outlined text-[14px]">check</span>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {(importMessage || error) && (
                            <div className="border-t border-white/10 px-5 py-4">
                                {importMessage && <p className="text-sm text-green-400">{importMessage}</p>}
                                {error && <p className="text-sm text-red-400">{error}</p>}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-3 relative group">
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">{label}</label>
                {value && (
                    <div className="relative overflow-hidden rounded-xl border border-white/10 transition-colors group-hover:border-[#ffc000]/30">
                        <img src={value} alt="" className="h-48 w-full object-contain md:h-64" />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                )}
                <div className="flex flex-col gap-3 md:flex-row">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Paste image URL..."
                        className="flex-1 rounded-xl border border-white/10 bg-[#1a1812] px-5 py-3.5 text-sm text-white shadow-inner transition-all focus:border-[#ffc000] focus:outline-none focus:ring-1 focus:ring-[#ffc000]/50"
                    />

                    <button
                        type="button"
                        onClick={openMediaPicker}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-bold uppercase tracking-wider text-slate-300 transition-all hover:border-[#ffc000] hover:bg-[#ffc000] hover:text-[#0a0a08]"
                    >
                        <span className="material-symbols-outlined text-[18px]">photo_library</span>
                        Library
                    </button>

                    <label className="group/btn relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-slate-300 transition-all hover:border-[#ffc000] hover:text-[#0a0a08]">
                        <div className="absolute inset-0 translate-y-full bg-[#ffc000] transition-transform duration-300 group-hover/btn:translate-y-0" />
                        <span className="relative z-10 flex items-center gap-2">
                            {uploading ? (
                                <>
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    {progress !== null ? `Uploading ${progress}%` : 'Uploading'}
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                                    {uploadLabel}
                                </>
                            )}
                        </span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
                    </label>
                </div>
                {progress !== null && (
                    <div className="flex flex-col gap-2">
                        <div className="h-2 overflow-hidden rounded-full bg-white/5">
                            <div className="h-full bg-[#ffc000] transition-[width] duration-300" style={{ width: `${progress}%` }} />
                        </div>
                        <p className="text-xs text-slate-400">
                            {progress < 100 ? `Uploading image: ${progress}%` : 'Upload complete.'}
                        </p>
                    </div>
                )}
                {importMessage && <p className="text-xs text-green-400">{importMessage}</p>}
                {error && <p className="text-xs text-red-400">{error}</p>}
            </div>
        </>
    );
}
