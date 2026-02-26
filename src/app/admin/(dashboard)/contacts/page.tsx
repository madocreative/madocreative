'use client';

import { useState, useEffect } from 'react';

interface ContactMsg {
    _id: string;
    name: string;
    email: string;
    inquiryType: string;
    message: string;
    read: boolean;
    createdAt: string;
}

const INQUIRY_STYLE: Record<string, string> = {
    general:     'bg-blue-500/10 text-blue-400 border-blue-500/20',
    project:     'bg-[#ffc000]/10 text-[#ffc000] border-[#ffc000]/20',
    press:       'bg-purple-500/10 text-purple-400 border-purple-500/20',
    careers:     'bg-green-500/10 text-green-400 border-green-500/20',
    shop:        'bg-orange-500/10 text-orange-400 border-orange-500/20',
    'bulk-order':'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
};

export default function ContactsPage() {
    const [msgs,     setMsgs]     = useState<ContactMsg[]>([]);
    const [loading,  setLoading]  = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [copied,   setCopied]   = useState<string | null>(null);
    const [filter,   setFilter]   = useState<'all' | 'unread' | 'read'>('all');

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

    const handleRead = async (id: string, read: boolean) => {
        await fetch('/api/admin/contacts', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, read }),
        });
        setMsgs(ms => ms.map(m => m._id === id ? { ...m, read } : m));
    };

    const markReadOnExpand = (id: string) => {
        const isExpanding = expanded !== id;
        setExpanded(isExpanding ? id : null);
        if (isExpanding) {
            const msg = msgs.find(m => m._id === id);
            if (msg && !msg.read) handleRead(id, true);
        }
    };

    const copyEmail = (email: string, id: string) => {
        navigator.clipboard.writeText(email).then(() => {
            setCopied(id);
            setTimeout(() => setCopied(null), 2000);
        });
    };

    const unreadCount = msgs.filter(m => !m.read).length;
    const filtered = filter === 'all' ? msgs : filter === 'unread' ? msgs.filter(m => !m.read) : msgs.filter(m => m.read);

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-24">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-1 tracking-tight">Contact Messages</h1>
                    <p className="text-slate-400 text-sm">Inquiries submitted via the contact form on your website.</p>
                </div>
                <div className="flex items-center gap-3">
                    {unreadCount > 0 && (
                        <span className="text-xs font-bold uppercase tracking-widest text-[#ffc000] bg-[#ffc000]/10 border border-[#ffc000]/20 px-3 py-1.5">
                            {unreadCount} unread
                        </span>
                    )}
                    <button onClick={load}
                        className="flex items-center gap-2 bg-white/5 border border-white/10 text-slate-400 px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all">
                        <span className="material-symbols-outlined text-[14px]">refresh</span>Refresh
                    </button>
                </div>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-px bg-[#111109] border border-white/5 w-fit">
                {([
                    { key: 'all',    label: 'All',    count: msgs.length },
                    { key: 'unread', label: 'Unread', count: unreadCount },
                    { key: 'read',   label: 'Read',   count: msgs.length - unreadCount },
                ] as { key: typeof filter; label: string; count: number }[]).map(t => (
                    <button key={t.key} onClick={() => setFilter(t.key)}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 ${filter === t.key ? 'bg-[#ffc000] text-[#0a0a08]' : 'text-slate-500 hover:text-white'}`}>
                        {t.label}
                        <span className={`text-[9px] px-1.5 py-0.5 font-bold min-w-[1.25rem] text-center ${filter === t.key ? 'bg-[#0a0a08]/20 text-[#0a0a08]' : 'bg-white/5 text-slate-600'}`}>
                            {t.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Body */}
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <div className="w-10 h-10 border-2 border-[#ffc000]/30 border-t-[#ffc000] rounded-full animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 bg-[#111109]/50">
                    <span className="material-symbols-outlined text-[40px] text-slate-600 mb-3">mark_email_read</span>
                    <p className="text-slate-500 text-sm">
                        {filter === 'all' ? 'No messages yet.' : `No ${filter} messages.`}
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {filtered.map(m => {
                        const badgeClass = INQUIRY_STYLE[m.inquiryType] || 'bg-white/5 text-slate-400 border-white/10';
                        return (
                            <div key={m._id}
                                className={`bg-[#111109] border overflow-hidden transition-all duration-300 ${expanded === m._id ? 'border-[#ffc000]/20' : m.read ? 'border-white/5 hover:border-white/15' : 'border-[#ffc000]/10 hover:border-[#ffc000]/25'}`}>

                                {/* Row */}
                                <div className="flex items-center gap-4 p-4 cursor-pointer select-none relative"
                                    onClick={() => markReadOnExpand(m._id)}>

                                    {/* Unread stripe */}
                                    {!m.read && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#ffc000]" />}

                                    {/* Avatar */}
                                    <div className={`w-9 h-9 shrink-0 flex items-center justify-center border ${m.read ? 'bg-white/5 border-white/10 text-slate-500' : 'bg-[#ffc000]/10 border-[#ffc000]/20 text-[#ffc000]'}`}>
                                        <span className="material-symbols-outlined text-[16px]">{m.read ? 'drafts' : 'mail'}</span>
                                    </div>

                                    {/* Name + email */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className={`font-bold text-sm ${m.read ? 'text-slate-300' : 'text-white'}`}>{m.name}</p>
                                            {!m.read && <span className="text-[8px] uppercase font-bold tracking-widest px-1.5 py-0.5 bg-[#ffc000] text-[#0a0a08]">New</span>}
                                            <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 border ${badgeClass}`}>
                                                {m.inquiryType}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-xs truncate">{m.email}</p>
                                    </div>

                                    {/* Date + chevron */}
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="text-slate-700 text-xs hidden sm:block">{new Date(m.createdAt).toLocaleDateString()}</span>
                                        <span className={`material-symbols-outlined text-[16px] transition-transform duration-300 ${expanded === m._id ? 'rotate-180 text-[#ffc000]' : 'text-slate-600'}`}>
                                            expand_more
                                        </span>
                                    </div>
                                </div>

                                {/* Expanded */}
                                <div className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${expanded === m._id ? 'max-h-[600px]' : 'max-h-0'}`}>
                                    <div className="border-t border-white/5 p-5 bg-[#070706] space-y-4">

                                        {/* Message */}
                                        <div className="bg-[#111109] border border-white/5 p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-[9px] uppercase font-bold tracking-widest text-slate-600 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[11px]">chat</span>Message
                                                </p>
                                                <span className="text-slate-700 text-xs">{new Date(m.createdAt).toLocaleString()}</span>
                                            </div>
                                            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{m.message}</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">

                                            {/* Mark read/unread */}
                                            <button onClick={() => handleRead(m._id, !m.read)}
                                                className={`flex items-center gap-1.5 border px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${m.read ? 'border-white/10 text-slate-500 hover:text-white hover:border-white/30' : 'border-[#ffc000]/20 text-[#ffc000]/70 hover:bg-[#ffc000]/10'}`}>
                                                <span className="material-symbols-outlined text-[13px]">{m.read ? 'mark_email_unread' : 'mark_email_read'}</span>
                                                Mark as {m.read ? 'Unread' : 'Read'}
                                            </button>

                                            <span className="flex-1" />

                                            {/* Copy email */}
                                            <button onClick={() => copyEmail(m.email, m._id)}
                                                className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-slate-400 hover:text-white px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all">
                                                <span className="material-symbols-outlined text-[13px]">{copied === m._id ? 'check' : 'content_copy'}</span>
                                                {copied === m._id ? 'Copied!' : 'Copy Email'}
                                            </button>

                                            {/* Email reply */}
                                            <a href={`mailto:${m.email}?subject=Re: Your Inquiry — ${m.inquiryType}&body=Hi ${m.name},%0A%0AThank you for reaching out.%0A%0A`}
                                                className="flex items-center gap-1.5 bg-[#ffc000] text-[#0a0a08] px-4 py-2 text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all">
                                                <span className="material-symbols-outlined text-[13px]">reply</span>Reply via Email
                                            </a>

                                            {/* Delete */}
                                            <button onClick={() => handleDelete(m._id)} disabled={deleting === m._id}
                                                className="flex items-center gap-1.5 border border-red-500/20 text-red-500/60 hover:bg-red-500 hover:text-white hover:border-red-500 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50">
                                                {deleting === m._id ? <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" /> : <span className="material-symbols-outlined text-[13px]">delete</span>}
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
