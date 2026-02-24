'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

export default function BlogEditor({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [formData, setFormData] = useState<any>(null);
    const [status, setStatus] = useState<'loading' | 'idle' | 'saving' | 'success' | 'error'>('loading');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetch(`/api/admin/blog/${resolvedParams.id}`)
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
            const res = await fetch(`/api/admin/blog/${resolvedParams.id}`, {
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
        if (!confirm('Are you sure you want to delete this post?')) return;
        const res = await fetch(`/api/admin/blog/${resolvedParams.id}`, { method: 'DELETE' });
        if (res.ok) router.push('/admin/blog');
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploading(true);

        const uploadData = new FormData();
        uploadData.append('file', e.target.files[0]);

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: uploadData
            });
            const data = await res.json();

            if (data.success) {
                setFormData((prev: any) => ({ ...prev, featuredImage: data.url }));
            }
        } catch (err) {
            console.error('Upload failed');
        }
        setUploading(false);
    };

    if (status === 'loading') return <div className="text-white">Loading...</div>;
    if (!formData) return <div className="text-red-400">Failed to load post data.</div>;

    return (
        <div className="max-w-5xl">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="w-10 h-10 bg-[#1a1812] border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/5 text-white transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-3xl font-display font-bold text-white">Edit Post</h1>
                </div>
                <button onClick={handleDelete} className="text-red-400 hover:text-red-300 font-bold text-sm tracking-wider uppercase px-4 py-2 border border-red-900/50 rounded-lg hover:bg-red-900/20 transition-all">
                    Delete Post
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Col: Main Editor */}
                <form onSubmit={handleSave} className="lg:col-span-3 flex flex-col gap-6 bg-[#1a1812] border border-white/10 p-6 rounded-xl h-fit">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Post Title</label>
                        <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="bg-[#221e10] border border-white/10 rounded-lg px-4 py-3 text-2xl font-bold text-white focus:border-[#f2b90d] outline-none" required />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Excerpt (Short Summary)</label>
                        <textarea value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} rows={2} className="bg-[#221e10] border border-white/10 rounded-lg px-4 py-3 text-slate-300 focus:border-[#f2b90d] outline-none resize-none" required />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Body Content (HTML allowed)</label>
                        <textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} rows={15} className="bg-[#221e10] border border-white/10 rounded-lg px-4 py-4 text-white font-mono text-sm leading-relaxed focus:border-[#f2b90d] outline-none resize-y" required />
                    </div>
                </form>

                {/* Right Col: Settings */}
                <div className="lg:col-span-1 flex flex-col gap-6 h-fit">
                    <div className="bg-[#1a1812] border border-white/10 p-6 rounded-xl">
                        <h3 className="font-bold text-white text-lg border-b border-white/10 pb-4 mb-4">Publishing</h3>
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-slate-300 font-medium">Status</span>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, published: !formData.published })}
                                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${formData.published ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}
                            >
                                {formData.published ? 'Published' : 'Draft'}
                            </button>
                        </div>
                        <button onClick={handleSave} disabled={status === 'saving'} className="w-full bg-[#f2b90d] text-[#0a0a08] py-3 rounded-lg font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all disabled:opacity-50">
                            {status === 'saving' ? 'Saving...' : 'Save Draft'}
                        </button>
                        {status === 'success' && <p className="text-green-400 text-sm pl-2 text-center mt-2">Saved!</p>}
                    </div>

                    <div className="bg-[#1a1812] border border-white/10 p-6 rounded-xl">
                        <h3 className="font-bold text-white text-lg border-b border-white/10 pb-4 mb-4">Featured Image</h3>
                        <div className="aspect-video relative overflow-hidden rounded-lg bg-[#221e10] border border-dashed border-white/20 mb-4">
                            <img src={formData.featuredImage} alt="Cover" className="w-full h-full object-cover opacity-80" />
                        </div>
                        <label className="cursor-pointer block bg-[#221e10] border border-white/10 text-center py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:border-[#f2b90d] transition-all">
                            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                            {uploading ? 'Uploading...' : 'Set Featured Image'}
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
