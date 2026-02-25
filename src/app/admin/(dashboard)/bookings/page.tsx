'use client';

import { useState, useEffect } from 'react';

interface Booking {
    _id: string;
    name: string;
    email: string;
    date: string;
    package: string;
    projectDetails: string;
    createdAt: string;
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<string | null>(null);

    const load = () => {
        setLoading(true);
        fetch('/api/admin/bookings')
            .then(r => r.json())
            .then(d => { if (d.success) setBookings(d.data); })
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this booking?')) return;
        setDeleting(id);
        await fetch('/api/admin/bookings', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        setDeleting(null);
        load();
    };

    return (
        <div className="max-w-5xl">
            <h1 className="text-3xl font-display font-bold text-white mb-2">Booking Requests</h1>
            <p className="text-slate-400 mb-8">All session booking submissions from the public site.</p>

            {loading ? (
                <div className="flex items-center justify-center h-48">
                    <div className="w-8 h-8 border-2 border-[#ffc000] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : bookings.length === 0 ? (
                <div className="bg-[#1a1812] border border-white/10 rounded-xl py-20 text-center">
                    <span className="material-symbols-outlined text-4xl text-slate-600 mb-3 block">event_busy</span>
                    <p className="text-slate-500">No booking requests yet.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {bookings.map(b => (
                        <div key={b._id} className="bg-[#1a1812] border border-white/10 rounded-xl overflow-hidden">
                            <div
                                className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition-colors"
                                onClick={() => setExpanded(expanded === b._id ? null : b._id)}
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-10 h-10 bg-[#ffc000]/20 rounded-full flex items-center justify-center text-[#ffc000]">
                                        <span className="material-symbols-outlined text-sm">person</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{b.name}</p>
                                        <p className="text-slate-400 text-sm">{b.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="hidden md:flex items-center gap-3">
                                        <span className="text-xs uppercase font-bold tracking-widest text-slate-500 bg-white/5 px-3 py-1 rounded-full">{b.package}</span>
                                        <span className="text-slate-500 text-sm">{b.date}</span>
                                    </div>
                                    <span className="text-xs text-slate-600">{new Date(b.createdAt).toLocaleDateString()}</span>
                                    <span className={`material-symbols-outlined text-slate-400 transition-transform ${expanded === b._id ? 'rotate-180' : ''}`}>expand_more</span>
                                </div>
                            </div>
                            {expanded === b._id && (
                                <div className="border-t border-white/10 p-5 bg-[#221e10]">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <p className="text-xs uppercase font-bold tracking-widest text-slate-500 mb-1">Date Requested</p>
                                            <p className="text-white">{b.date}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase font-bold tracking-widest text-slate-500 mb-1">Package</p>
                                            <p className="text-[#ffc000] font-bold capitalize">{b.package}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase font-bold tracking-widest text-slate-500 mb-1">Submitted</p>
                                            <p className="text-white">{new Date(b.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="mb-5">
                                        <p className="text-xs uppercase font-bold tracking-widest text-slate-500 mb-2">Project Details</p>
                                        <p className="text-slate-300 text-sm leading-relaxed bg-[#0a0a08] p-4 rounded-lg border border-white/5">{b.projectDetails}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <a href={`mailto:${b.email}`}
                                            className="flex items-center gap-2 bg-[#ffc000] text-[#0a0a08] px-5 py-2 rounded-lg font-bold text-sm hover:brightness-110 transition-all">
                                            <span className="material-symbols-outlined text-sm">mail</span> Reply
                                        </a>
                                        <button onClick={() => handleDelete(b._id)} disabled={deleting === b._id}
                                            className="flex items-center gap-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 px-5 py-2 rounded-lg font-bold text-sm transition-all disabled:opacity-50">
                                            {deleting === b._id
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
