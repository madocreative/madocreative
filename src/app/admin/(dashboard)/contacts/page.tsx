'use client';

import { useState, useEffect } from 'react';

interface ContactMsg {
    _id: string;
    name: string;
    email: string;
    inquiryType: string;
    message: string;
    createdAt: string;
}

const inquiryBadge: Record<string, string> = {
    general: 'bg-blue-500/20 text-blue-400',
    project: 'bg-[#ffc000]/20 text-[#ffc000]',
    press: 'bg-purple-500/20 text-purple-400',
    careers: 'bg-green-500/20 text-green-400',
};

export default function ContactsPage() {
    const [msgs, setMsgs] = useState<ContactMsg[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<string | null>(null);

    const load = () => {
        setLoading(true);
        fetch('/api/admin/contacts')
            .then(r => r.json())
            .then(d => { if (d.success) setMsgs(d.data); })
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this message?')) return;
        setDeleting(id);
        await fetch('/api/admin/contacts', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        setDeleting(null);
        load();
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">Contact Messages</h1>
                    <p className="text-slate-400">All inquiries submitted via the contact form on your website.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <div className="w-10 h-10 border-2 border-[#ffc000]/30 border-t-[#ffc000] rounded-full animate-spin"></div>
                </div>
            ) : msgs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 px-6 border border-dashed border-white/10 rounded-3xl bg-[#111109]/50">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-[32px] text-slate-500">mark_email_read</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Inbox Empty</h3>
                    <p className="text-slate-500 text-center max-w-sm">When clients send a message through your contact page, it will appear here.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {msgs.map(m => (
                        <div key={m._id} className="group bg-[#111109] border border-white/5 rounded-2xl overflow-hidden hover:border-[#ffc000]/30 transition-all duration-300 shadow-sm hover:shadow-md">
                            <div
                                className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/[0.02] transition-colors relative"
                                onClick={() => setExpanded(expanded === m._id ? null : m._id)}
                            >
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ffc000] opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 flex-1">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-[#1a1812] border border-white/10 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-[#ffc000]/10 group-hover:text-[#ffc000] transition-colors shadow-inner">
                                            <span className="material-symbols-outlined text-[20px]">mail</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-lg group-hover:text-[#ffc000] transition-colors">{m.name}</p>
                                            <p className="text-slate-400 text-sm">{m.email}</p>
                                        </div>
                                    </div>
                                    <div className="hidden md:flex items-center gap-4 lg:ml-auto">
                                        <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full border ${inquiryBadge[m.inquiryType] || 'border-white/10 bg-white/5 text-slate-400'}`}>
                                            {m.inquiryType}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2 ml-4 md:ml-8 shrink-0">
                                    <span className="text-[11px] uppercase tracking-widest text-slate-500 font-bold">{new Date(m.createdAt).toLocaleDateString()}</span>
                                    <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-all duration-500 ${expanded === m._id ? 'bg-[#ffc000] text-[#0a0a08] border-[#ffc000] rotate-180' : 'bg-[#1a1812] text-slate-400 group-hover:text-white'}`}>
                                        <span className="material-symbols-outlined text-[18px]">expand_more</span>
                                    </div>
                                </div>
                            </div>

                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expanded === m._id ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="border-t border-white/5 p-6 md:p-8 bg-[#0a0a08]">
                                    <div className="mb-8">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-4">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <span className="material-symbols-outlined text-[18px]">chat</span>
                                                <p className="text-[11px] uppercase font-bold tracking-[0.2em]">Message Content</p>
                                            </div>
                                            <p className="text-[11px] uppercase tracking-widest text-slate-500 font-bold">Received: {new Date(m.createdAt).toLocaleString()}</p>
                                        </div>
                                        <p className="text-slate-300 text-sm leading-relaxed bg-[#111109] p-6 rounded-xl border border-white/5 shadow-inner min-h-[100px] whitespace-pre-wrap">{m.message}</p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-white/5">
                                        <a href={`mailto:${m.email}`}
                                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#ffc000] text-[#0a0a08] px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-all shadow-md hover:-translate-y-0.5"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">reply</span> Send Reply
                                        </a>
                                        <button onClick={() => handleDelete(m._id)} disabled={deleting === m._id}
                                            className="w-full sm:w-auto flex items-center justify-center gap-2 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all disabled:opacity-50"
                                        >
                                            {deleting === m._id
                                                ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                : <span className="material-symbols-outlined text-[18px]">delete</span>
                                            }
                                            Delete Message
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
