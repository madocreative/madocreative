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
        <div className="max-w-5xl">
            <h1 className="text-3xl font-display font-bold text-white mb-2">Contact Messages</h1>
            <p className="text-slate-400 mb-8">All inquiries submitted via the contact form.</p>

            {loading ? (
                <div className="flex items-center justify-center h-48">
                    <div className="w-8 h-8 border-2 border-[#ffc000] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : msgs.length === 0 ? (
                <div className="bg-[#1a1812] border border-white/10 rounded-xl py-20 text-center">
                    <span className="material-symbols-outlined text-4xl text-slate-600 mb-3 block">mail</span>
                    <p className="text-slate-500">No messages yet.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {msgs.map(m => (
                        <div key={m._id} className="bg-[#1a1812] border border-white/10 rounded-xl overflow-hidden">
                            <div
                                className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition-colors"
                                onClick={() => setExpanded(expanded === m._id ? null : m._id)}
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-slate-400">
                                        <span className="material-symbols-outlined text-sm">mail</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{m.name}</p>
                                        <p className="text-slate-400 text-sm">{m.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`hidden md:block text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full ${inquiryBadge[m.inquiryType] || 'bg-white/5 text-slate-400'}`}>
                                        {m.inquiryType}
                                    </span>
                                    <span className="text-xs text-slate-600">{new Date(m.createdAt).toLocaleDateString()}</span>
                                    <span className={`material-symbols-outlined text-slate-400 transition-transform ${expanded === m._id ? 'rotate-180' : ''}`}>expand_more</span>
                                </div>
                            </div>
                            {expanded === m._id && (
                                <div className="border-t border-white/10 p-5 bg-[#221e10]">
                                    <div className="mb-5">
                                        <p className="text-xs uppercase font-bold tracking-widest text-slate-500 mb-2">Message</p>
                                        <p className="text-slate-300 text-sm leading-relaxed bg-[#0a0a08] p-4 rounded-lg border border-white/5 whitespace-pre-wrap">{m.message}</p>
                                    </div>
                                    <p className="text-xs text-slate-600 mb-4">Received: {new Date(m.createdAt).toLocaleString()}</p>
                                    <div className="flex items-center gap-4">
                                        <a href={`mailto:${m.email}`}
                                            className="flex items-center gap-2 bg-[#ffc000] text-[#0a0a08] px-5 py-2 rounded-lg font-bold text-sm hover:brightness-110 transition-all">
                                            <span className="material-symbols-outlined text-sm">reply</span> Reply
                                        </a>
                                        <button onClick={() => handleDelete(m._id)} disabled={deleting === m._id}
                                            className="flex items-center gap-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 px-5 py-2 rounded-lg font-bold text-sm transition-all disabled:opacity-50">
                                            {deleting === m._id
                                                ? <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                                                : <span className="material-symbols-outlined text-sm">delete</span>
                                            }
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
