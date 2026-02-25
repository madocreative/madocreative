'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Editor } from '@tinymce/tinymce-react';

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
        <div className="max-w-6xl mx-auto pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-5">
                    <button onClick={() => router.back()} className="w-12 h-12 bg-[#111109] border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/5 hover:border-[#ffc000]/50 hover:text-[#ffc000] text-slate-400 transition-all shadow-md group">
                        <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="text-4xl font-display font-extrabold text-white tracking-tight">Edit <span className="text-[#ffc000]">Post</span></h1>
                        <p className="text-slate-400 text-sm mt-1">Changes are saved automatically when published.</p>
                    </div>
                </div>
                <button onClick={handleDelete} className="group flex items-center gap-2 text-red-400 hover:text-white font-bold text-xs tracking-widest uppercase px-6 py-3.5 border border-red-900/50 rounded-xl hover:bg-red-500 hover:border-red-500 transition-all shadow-sm">
                    <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">delete</span>
                    Delete Post
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Col: Main Editor */}
                <form onSubmit={handleSave} className="lg:col-span-8 flex flex-col gap-8 bg-[#111109] border border-white/5 p-6 md:p-8 rounded-2xl shadow-lg relative overflow-hidden">
                    {/* Glow effect */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffc000]/5 blur-[80px] pointer-events-none" />

                    <h3 className="font-display font-bold text-white text-xl border-b border-white/5 pb-4 flex items-center gap-3 relative z-10">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                            <span className="material-symbols-outlined text-[#ffc000] text-[18px]">draw</span>
                        </div>
                        Article Details
                    </h3>

                    <div className="space-y-6 relative z-10">
                        <div className="flex flex-col gap-2 relative group">
                            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-[#ffc000] transition-colors ml-1">Post Title</label>
                            <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="bg-[#1a1812] border border-white/10 rounded-xl px-5 py-3.5 text-2xl font-bold text-white focus:border-[#ffc000] focus:ring-1 focus:ring-[#ffc000]/50 outline-none transition-all shadow-inner" required />
                        </div>

                        <div className="flex flex-col gap-2 relative group">
                            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-[#ffc000] transition-colors ml-1">Excerpt (Short Summary)</label>
                            <textarea value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} rows={2} className="bg-[#1a1812] border border-white/10 rounded-xl px-5 py-3.5 text-slate-300 focus:border-[#ffc000] focus:ring-1 focus:ring-[#ffc000]/50 outline-none resize-none transition-all shadow-inner text-sm leading-relaxed" required />
                        </div>

                        <div className="flex flex-col gap-2 relative group">
                            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1 group-focus-within:text-[#ffc000] transition-colors">Body Content</label>
                            <div className="rounded-xl overflow-hidden border border-white/10 focus-within:border-[#ffc000] focus-within:ring-1 focus-within:ring-[#ffc000]/50 transition-all shadow-inner">
                                <Editor
                                    apiKey="g88bn7s6hdxjafldilhhhftd9lgastp07jn8lj44lq83w3j1"
                                    value={formData.content}
                                    onEditorChange={(content) => setFormData({ ...formData, content: content })}
                                    init={{
                                        height: 600,
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
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px; line-height:1.6; background-color: #1a1812; color: white; }',
                                        skin: 'oxide-dark',
                                        content_css: 'dark'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Fixed Save Bar */}
                    <div className="fixed bottom-0 left-0 right-0 md:left-72 bg-[#0a0a08]/80 backdrop-blur-xl border-t border-white/10 py-5 px-6 md:px-12 flex items-center justify-between z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center gap-3">
                            {status === 'success' && <p className="text-green-400 font-medium flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20"><span className="material-symbols-outlined text-sm">check_circle</span> Post Updated</p>}
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
                                    : <><span className="material-symbols-outlined text-[18px]">save</span> Save Changes</>
                                }
                            </span>
                        </button>
                    </div>
                </form>

                {/* Right Col: Settings */}
                <div className="lg:col-span-4 flex flex-col gap-6 h-fit">
                    <div className="bg-[#111109] border border-white/5 p-6 rounded-2xl shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffc000]/5 blur-[60px] pointer-events-none" />
                        <h3 className="font-display font-bold text-white text-lg border-b border-white/5 pb-4 mb-5 flex items-center gap-3 relative z-10">
                            <span className="material-symbols-outlined text-[#ffc000]">publish</span>
                            Publishing
                        </h3>
                        <div className="flex flex-col gap-4 relative z-10">
                            <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                                <span className="text-slate-300 font-bold uppercase tracking-widest text-xs">Status</span>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, published: !formData.published })}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 ${formData.published ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'}`}
                                >
                                    {formData.published ? <><span className="material-symbols-outlined text-[14px]">public</span> Published</> : <><span className="material-symbols-outlined text-[14px]">drafts</span> Draft</>}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#111109] border border-white/5 p-6 rounded-2xl shadow-lg relative overflow-hidden h-fit">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffc000]/5 blur-[60px] pointer-events-none" />
                        <h3 className="font-display font-bold text-white text-lg border-b border-white/5 pb-4 mb-5 flex items-center gap-3 relative z-10">
                            <span className="material-symbols-outlined text-[#ffc000]">image</span>
                            Cover Image
                        </h3>

                        <div className="relative z-10">
                            <div className="aspect-[16/9] relative overflow-hidden rounded-xl bg-[#0a0a08] border border-white/10 shadow-inner mb-4 group">
                                <img src={formData.featuredImage || 'https://placehold.co/1200x600/111109/333333?text=Cover+Image'} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                </div>
                            </div>

                            <label className="cursor-pointer block bg-white/5 hover:bg-[#ffc000] border border-white/10 hover:border-[#ffc000] text-center w-full py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] text-slate-300 hover:text-[#0a0a08] transition-all shadow-sm flex items-center justify-center gap-2 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[#ffc000] translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                                <span className="relative z-10 flex items-center gap-2">
                                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                                    {uploading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : <span className="material-symbols-outlined text-[16px]">upload</span>}
                                    {uploading ? 'Uploading...' : 'Replace Cover Image'}
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
