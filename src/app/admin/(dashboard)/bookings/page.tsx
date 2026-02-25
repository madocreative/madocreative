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
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">Booking Requests</h1>
                    <p className="text-slate-400">Manage and respond to incoming session inquiries.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <div className="w-10 h-10 border-2 border-[#ffc000]/30 border-t-[#ffc000] rounded-full animate-spin"></div>
                </div>
            ) : bookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 px-6 border border-dashed border-white/10 rounded-3xl bg-[#111109]/50">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-[32px] text-slate-500">event_busy</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Bookings Yet</h3>
                    <p className="text-slate-500 text-center max-w-sm">When clients request a session from your website, they will appear here.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {bookings.map(b => (
                        <div key={b._id} className="group bg-[#111109] border border-white/5 rounded-2xl overflow-hidden hover:border-[#ffc000]/30 transition-all duration-300 shadow-sm hover:shadow-md">
                            <div
                                className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/[0.02] transition-colors relative"
                                onClick={() => setExpanded(expanded === b._id ? null : b._id)}
                            >
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ffc000] opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 flex-1">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-[#1a1812] border border-white/10 rounded-xl flex items-center justify-center text-[#ffc000] group-hover:bg-[#ffc000]/10 transition-colors shadow-inner">
                                            <span className="material-symbols-outlined text-[20px]">person</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-lg group-hover:text-[#ffc000] transition-colors">{b.name}</p>
                                            <p className="text-slate-400 text-sm">{b.email}</p>
                                        </div>
                                    </div>
                                    <div className="hidden md:flex items-center gap-4 lg:ml-auto">
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#ffc000] bg-[#ffc000]/10 border border-[#ffc000]/20 px-3 py-1.5 rounded-full">{b.package}</span>
                                        <div className="flex items-center gap-2 text-slate-400 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                                            <span className="material-symbols-outlined text-[14px]">event</span>
                                            <span className="text-sm font-medium">{b.date}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2 ml-4 md:ml-8 shrink-0">
                                    <span className="text-[11px] uppercase tracking-widest text-slate-500 font-bold">{new Date(b.createdAt).toLocaleDateString()}</span>
                                    <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-all duration-500 ${expanded === b._id ? 'bg-[#ffc000] text-[#0a0a08] border-[#ffc000] rotate-180' : 'bg-[#1a1812] text-slate-400 group-hover:text-white'}`}>
                                        <span className="material-symbols-outlined text-[18px]">expand_more</span>
                                    </div>
                                </div>
                            </div>

                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expanded === b._id ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="border-t border-white/5 p-6 md:p-8 bg-[#0a0a08]">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                        <div className="bg-[#1a1812] border border-white/5 p-4 rounded-xl shadow-inner">
                                            <div className="flex items-center gap-2 mb-2 text-slate-500">
                                                <span className="material-symbols-outlined text-[16px]">edit_calendar</span>
                                                <p className="text-[10px] uppercase font-bold tracking-widest">Date Requested</p>
                                            </div>
                                            <p className="text-white font-medium pl-6">{b.date}</p>
                                        </div>
                                        <div className="bg-[#1a1812] border border-white/5 p-4 rounded-xl shadow-inner">
                                            <div className="flex items-center gap-2 mb-2 text-slate-500">
                                                <span className="material-symbols-outlined text-[16px]">category</span>
                                                <p className="text-[10px] uppercase font-bold tracking-widest">Package</p>
                                            </div>
                                            <p className="text-[#ffc000] font-bold capitalize pl-6">{b.package}</p>
                                        </div>
                                        <div className="bg-[#1a1812] border border-white/5 p-4 rounded-xl shadow-inner">
                                            <div className="flex items-center gap-2 mb-2 text-slate-500">
                                                <span className="material-symbols-outlined text-[16px]">schedule</span>
                                                <p className="text-[10px] uppercase font-bold tracking-widest">Submitted</p>
                                            </div>
                                            <p className="text-white font-medium pl-6">{new Date(b.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="mb-8">
                                        <div className="flex items-center gap-2 mb-3 text-slate-500 border-b border-white/5 pb-2">
                                            <span className="material-symbols-outlined text-[18px]">description</span>
                                            <p className="text-[11px] uppercase font-bold tracking-[0.2em]">Project Details</p>
                                        </div>
                                        <p className="text-slate-300 text-sm leading-relaxed bg-[#111109] p-6 rounded-xl border border-white/5 shadow-inner min-h-[100px]">{b.projectDetails}</p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-white/5">
                                        <a href={`mailto:${b.email}`}
                                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#ffc000] text-[#0a0a08] px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-all shadow-md hover:-translate-y-0.5"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">mail</span> Send Reply
                                        </a>
                                        <button onClick={() => handleDelete(b._id)} disabled={deleting === b._id}
                                            className="w-full sm:w-auto flex items-center justify-center gap-2 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all disabled:opacity-50"
                                        >
                                            {deleting === b._id
                                                ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                : <span className="material-symbols-outlined text-[18px]">delete</span>
                                            }
                                            Delete Request
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
