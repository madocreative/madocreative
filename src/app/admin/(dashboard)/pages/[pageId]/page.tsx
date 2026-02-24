'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

export default function PageEditor({ params }: { params: Promise<{ pageId: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [formData, setFormData] = useState({
        page: resolvedParams.pageId,
        title: '',
        subtitle: '',
        heroImage: '',
        sections: {}
    });
    const [status, setStatus] = useState<'loading' | 'idle' | 'saving' | 'success' | 'error'>('loading');

    useEffect(() => {
        fetch(`/api/admin/content?page=${resolvedParams.pageId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setFormData(data.data);
                }
                setStatus('idle');
            })
            .catch(() => setStatus('error'));
    }, [resolvedParams.pageId]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('saving');
        try {
            const res = await fetch('/api/admin/content', {
                method: 'POST',
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

    if (status === 'loading') return <div className="text-white">Loading...</div>;

    return (
        <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-2">
                <button onClick={() => router.back()} className="w-10 h-10 bg-[#1a1812] border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/5 text-white transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-3xl font-display font-bold text-white capitalize">Edit {resolvedParams.pageId}</h1>
            </div>
            <p className="text-slate-400 mb-10 pl-14">Update the main content and imagery for this page.</p>

            <form onSubmit={handleSave} className="bg-[#1a1812] border border-white/10 p-8 rounded-xl flex flex-col gap-6">

                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Main Page Title (Hero)</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        className="bg-[#221e10] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ffc000] transition-colors"
                        placeholder="E.g., Capturing The Unseen"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Subtitle / Paragraph</label>
                    <textarea
                        value={formData.subtitle}
                        onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                        rows={4}
                        className="bg-[#221e10] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ffc000] transition-colors resize-none"
                        placeholder="E.g., We are Mado Creatives..."
                    />
                </div>

                <div className="mt-4 pt-6 border-t border-white/10 flex items-center justify-between">
                    <div>
                        {status === 'success' && <p className="text-green-400 font-medium">Changes saved successfully!</p>}
                        {status === 'error' && <p className="text-red-400 font-medium">Failed to save changes.</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={status === 'saving'}
                        className="bg-[#ffc000] text-[#0a0a08] px-8 py-3 rounded-lg font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {status === 'saving' ? 'Saving...' : (
                            <><span className="material-symbols-outlined text-sm">save</span> Publish Changes</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
