'use client';

import { useState, useEffect } from 'react';

type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

interface Booking {
    _id: string;
    name: string;
    email: string;
    date: string;
    package: string;
    projectDetails: string;
    status: BookingStatus;
    notes: string;
    createdAt: string;
}

const STATUS_CONFIG: Record<BookingStatus, { label: string; icon: string; text: string; bg: string; border: string }> = {
    pending:   { label: 'Pending',   icon: 'schedule',     text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    confirmed: { label: 'Confirmed', icon: 'check_circle', text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
    cancelled: { label: 'Cancelled', icon: 'cancel',       text: 'text-red-400',   bg: 'bg-red-500/10',   border: 'border-red-500/30'   },
};

const TABS: { key: 'all' | BookingStatus; label: string }[] = [
    { key: 'all',       label: 'All'       },
    { key: 'pending',   label: 'Pending'   },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'cancelled', label: 'Cancelled' },
];

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading,  setLoading]  = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [updating, setUpdating] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [tab,      setTab]      = useState<'all' | BookingStatus>('all');
    const [copied,   setCopied]   = useState<string | null>(null);
    const [noteEdit, setNoteEdit] = useState<{ id: string; text: string } | null>(null);

    const load = () => {
        setLoading(true);
        fetch('/api/admin/bookings')
            .then(r => r.json())
            .then(d => { if (d.success) setBookings(d.data); })
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this booking? This cannot be undone.')) return;
        setDeleting(id);
        await fetch('/api/admin/bookings', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        setDeleting(null);
        load();
    };

    const handleStatus = async (id: string, status: BookingStatus) => {
        setUpdating(id);
        const res = await fetch('/api/admin/bookings', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status }),
        });
        const data = await res.json();
        if (data.success) setBookings(bs => bs.map(b => b._id === id ? { ...b, status } : b));
        setUpdating(null);
    };

    const handleSaveNote = async (id: string, notes: string) => {
        await fetch('/api/admin/bookings', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, notes }),
        });
        setBookings(bs => bs.map(b => b._id === id ? { ...b, notes } : b));
        setNoteEdit(null);
    };

    const copyEmail = (email: string, id: string) => {
        navigator.clipboard.writeText(email).then(() => {
            setCopied(id);
            setTimeout(() => setCopied(null), 2000);
        });
    };

    const getStatus = (b: Booking): BookingStatus => (b.status || 'pending') as BookingStatus;

    const filtered = tab === 'all' ? bookings : bookings.filter(b => getStatus(b) === tab);
    const counts = {
        all:       bookings.length,
        pending:   bookings.filter(b => getStatus(b) === 'pending').length,
        confirmed: bookings.filter(b => getStatus(b) === 'confirmed').length,
        cancelled: bookings.filter(b => getStatus(b) === 'cancelled').length,
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-24">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-1 tracking-tight">Booking Requests</h1>
                    <p className="text-slate-400 text-sm">Track, confirm, and respond to session inquiries.</p>
                </div>
                <div className="flex items-center gap-3">
                    {counts.pending > 0 && (
                        <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5">
                            {counts.pending} pending
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
                {TABS.map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 ${tab === t.key ? 'bg-[#ffc000] text-[#0a0a08]' : 'text-slate-500 hover:text-white'}`}>
                        {t.label}
                        <span className={`text-[9px] px-1.5 py-0.5 font-bold min-w-[1.25rem] text-center ${tab === t.key ? 'bg-[#0a0a08]/20 text-[#0a0a08]' : 'bg-white/5 text-slate-600'}`}>
                            {counts[t.key]}
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
                    <span className="material-symbols-outlined text-[40px] text-slate-600 mb-3">event_busy</span>
                    <p className="text-slate-500 text-sm">
                        {tab === 'all' ? 'No bookings yet. Requests will appear here.' : `No ${tab} bookings.`}
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {filtered.map(b => {
                        const s  = getStatus(b);
                        const sc = STATUS_CONFIG[s];
                        return (
                            <div key={b._id}
                                className={`bg-[#111109] border overflow-hidden transition-all duration-300 ${expanded === b._id ? 'border-[#ffc000]/20' : 'border-white/5 hover:border-white/15'}`}>

                                {/* Row */}
                                <div className="flex items-center gap-4 p-4 cursor-pointer select-none relative"
                                    onClick={() => setExpanded(expanded === b._id ? null : b._id)}>
                                    <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${s === 'confirmed' ? 'bg-green-500' : s === 'cancelled' ? 'bg-red-500' : 'bg-amber-400'}`} />
                                    <div className={`w-9 h-9 shrink-0 flex items-center justify-center border ${sc.bg} ${sc.text} ${sc.border}`}>
                                        <span className="material-symbols-outlined text-[16px]">{sc.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-bold text-white text-sm">{b.name}</p>
                                            <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 border ${sc.bg} ${sc.text} ${sc.border}`}>
                                                {sc.label}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-xs truncate">{b.email}</p>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-5 text-xs text-slate-500 shrink-0">
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[12px]">event</span>
                                            <span className="font-bold text-slate-400">{b.date}</span>
                                        </div>
                                        <span className="capitalize text-slate-600">{b.package}</span>
                                        <span className="text-slate-700 hidden lg:block">{new Date(b.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <span className={`material-symbols-outlined text-[16px] shrink-0 transition-transform duration-300 ${expanded === b._id ? 'rotate-180 text-[#ffc000]' : 'text-slate-600'}`}>
                                        expand_more
                                    </span>
                                </div>

                                {/* Expanded panel */}
                                <div className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${expanded === b._id ? 'max-h-[900px]' : 'max-h-0'}`}>
                                    <div className="border-t border-white/5 p-5 bg-[#070706] space-y-4">

                                        {/* Info grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                            {[
                                                { icon: 'person',   label: 'Client',    val: b.name },
                                                { icon: 'event',    label: 'Date',      val: b.date },
                                                { icon: 'category', label: 'Package',   val: b.package },
                                                { icon: 'schedule', label: 'Submitted', val: new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
                                            ].map(d => (
                                                <div key={d.label} className="bg-[#111109] border border-white/5 px-3 py-2.5">
                                                    <div className="flex items-center gap-1 text-slate-600 mb-1">
                                                        <span className="material-symbols-outlined text-[11px]">{d.icon}</span>
                                                        <p className="text-[9px] uppercase font-bold tracking-widest">{d.label}</p>
                                                    </div>
                                                    <p className="text-white text-xs font-bold capitalize">{d.val}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Project details */}
                                        <div className="bg-[#111109] border border-white/5 p-4">
                                            <p className="text-[9px] uppercase font-bold tracking-widest text-slate-600 mb-2 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[11px]">description</span>Project Details
                                            </p>
                                            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{b.projectDetails}</p>
                                        </div>

                                        {/* Notes */}
                                        <div className="bg-[#111109] border border-[#ffc000]/10 p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-[9px] uppercase font-bold tracking-widest text-[#ffc000]/50 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[11px]">sticky_note_2</span>Internal Notes
                                                </p>
                                                {noteEdit?.id !== b._id && (
                                                    <button onClick={() => setNoteEdit({ id: b._id, text: b.notes || '' })}
                                                        className="text-[10px] text-slate-600 hover:text-[#ffc000] uppercase tracking-widest font-bold flex items-center gap-1 transition-colors">
                                                        <span className="material-symbols-outlined text-[11px]">edit</span>Edit
                                                    </button>
                                                )}
                                            </div>
                                            {noteEdit?.id === b._id ? (
                                                <div className="flex flex-col gap-2">
                                                    <textarea value={noteEdit.text}
                                                        onChange={e => setNoteEdit({ ...noteEdit, text: e.target.value })}
                                                        rows={3}
                                                        className="w-full bg-[#0a0a08] border border-[#ffc000]/20 text-slate-300 text-sm p-3 resize-none focus:border-[#ffc000]/50 focus:outline-none"
                                                        placeholder="Add internal notes about this booking..." />
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleSaveNote(b._id, noteEdit.text)}
                                                            className="px-4 py-1.5 bg-[#ffc000] text-[#0a0a08] text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all">Save</button>
                                                        <button onClick={() => setNoteEdit(null)}
                                                            className="px-4 py-1.5 bg-white/5 text-slate-400 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-slate-500 text-sm leading-relaxed italic">{b.notes || 'No notes added yet.'}</p>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                                            {s !== 'confirmed' && (
                                                <button onClick={() => handleStatus(b._id, 'confirmed')} disabled={updating === b._id}
                                                    className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500 hover:text-white px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50">
                                                    {updating === b._id ? <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" /> : <span className="material-symbols-outlined text-[13px]">check_circle</span>}
                                                    Confirm
                                                </button>
                                            )}
                                            {s !== 'pending' && (
                                                <button onClick={() => handleStatus(b._id, 'pending')} disabled={updating === b._id}
                                                    className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-white px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50">
                                                    <span className="material-symbols-outlined text-[13px]">schedule</span>Mark Pending
                                                </button>
                                            )}
                                            {s !== 'cancelled' && (
                                                <button onClick={() => handleStatus(b._id, 'cancelled')} disabled={updating === b._id}
                                                    className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50">
                                                    <span className="material-symbols-outlined text-[13px]">cancel</span>Cancel
                                                </button>
                                            )}
                                            <span className="flex-1" />
                                            <button onClick={() => copyEmail(b.email, b._id)}
                                                className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-slate-400 hover:text-white px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all">
                                                <span className="material-symbols-outlined text-[13px]">{copied === b._id ? 'check' : 'content_copy'}</span>
                                                {copied === b._id ? 'Copied!' : 'Copy Email'}
                                            </button>
                                            <a href={`mailto:${b.email}?subject=Re: Your Booking — ${b.package}&body=Hi ${b.name},%0A%0AThank you for your booking request for ${b.date}.%0A%0A`}
                                                className="flex items-center gap-1.5 bg-[#ffc000] text-[#0a0a08] px-4 py-2 text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all">
                                                <span className="material-symbols-outlined text-[13px]">mail</span>Reply via Email
                                            </a>
                                            <button onClick={() => handleDelete(b._id)} disabled={deleting === b._id}
                                                className="flex items-center gap-1.5 border border-red-500/20 text-red-500/60 hover:bg-red-500 hover:text-white hover:border-red-500 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50">
                                                {deleting === b._id ? <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" /> : <span className="material-symbols-outlined text-[13px]">delete</span>}
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
