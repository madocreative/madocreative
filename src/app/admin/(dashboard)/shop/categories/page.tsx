'use client';

import { useState, useEffect } from 'react';

const ICON_OPTIONS = [
    'smartphone', 'laptop', 'photo_camera', 'headphones', 'tv', 'watch', 'router',
    'videocam', 'keyboard', 'mouse', 'memory', 'monitor', 'speaker', 'category',
    'inventory_2', 'devices', 'tablet', 'storage', 'power', 'cable',
];

interface Category {
    _id: string;
    name: string;
    slug: string;
    icon: string;
    parent: string | null;
    order: number;
}

export default function CategoriesAdmin() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({ name: '', icon: 'category', parent: '', order: 0 });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const loadCategories = () => {
        fetch('/api/admin/categories')
            .then(r => r.json())
            .then(d => { if (d.success) setCategories(d.data); setLoading(false); });
    };

    useEffect(() => { loadCategories(); }, []);

    const parentCats = categories.filter(c => !c.parent);
    const childCats = categories.filter(c => c.parent);

    const openCreate = () => {
        setEditingId(null);
        setForm({ name: '', icon: 'category', parent: '', order: 0 });
        setError('');
        setShowForm(true);
    };

    const openEdit = (cat: Category) => {
        setEditingId(cat._id);
        setForm({ name: cat.name, icon: cat.icon, parent: cat.parent || '', order: cat.order });
        setError('');
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        const payload = {
            name: form.name,
            icon: form.icon,
            parent: form.parent || null,
            order: form.order,
        };
        const url = editingId ? `/api/admin/categories/${editingId}` : '/api/admin/categories';
        const method = editingId ? 'PUT' : 'POST';
        const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await res.json();
        setSaving(false);
        if (!data.success) { setError(data.error || 'Failed to save'); return; }
        setShowForm(false);
        loadCategories();
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete "${name}"? This will also delete its subcategories.`)) return;
        await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
        loadCategories();
    };

    if (loading) return <div className="text-white">Loading categories...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">Shop Categories</h1>
                    <p className="text-slate-400">Manage product categories and subcategories.</p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-[#ffc000] text-[#0a0a08] px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm hover:brightness-110 transition-all shadow-[0_0_20px_rgba(255,192,0,0.2)]"
                >
                    <span className="material-symbols-outlined text-[18px]">add_circle</span>
                    New Category
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div className="bg-[#111109] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-5">{editingId ? 'Edit Category' : 'New Category'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 block mb-1">Name *</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    required
                                    className="w-full bg-[#1a1812] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ffc000] outline-none text-sm"
                                    placeholder="e.g. Smartphones"
                                />
                            </div>

                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 block mb-1">Parent Category (optional)</label>
                                <select
                                    value={form.parent}
                                    onChange={e => setForm({ ...form, parent: e.target.value })}
                                    className="w-full bg-[#1a1812] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ffc000] outline-none text-sm appearance-none"
                                >
                                    <option value="">— None (top-level) —</option>
                                    {parentCats.map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Icon</label>
                                <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto pr-1">
                                    {ICON_OPTIONS.map(icon => (
                                        <button
                                            key={icon}
                                            type="button"
                                            onClick={() => setForm({ ...form, icon })}
                                            title={icon}
                                            className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${form.icon === icon ? 'bg-[#ffc000]/20 border-[#ffc000] text-[#ffc000]' : 'border-white/5 text-slate-400 hover:border-white/20 hover:text-white'}`}
                                        >
                                            <span className="material-symbols-outlined text-[18px]">{icon}</span>
                                            <span className="text-[8px] truncate w-full text-center">{icon.replace(/_/g, ' ')}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 block mb-1">Display Order</label>
                                <input
                                    type="number"
                                    value={form.order}
                                    onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-[#1a1812] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ffc000] outline-none text-sm"
                                />
                            </div>

                            {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{error}</p>}

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 border border-white/10 text-slate-400 rounded-xl text-sm font-bold hover:bg-white/5 transition-all">Cancel</button>
                                <button type="submit" disabled={saving} className="flex-1 py-3 bg-[#ffc000] text-[#0a0a08] rounded-xl text-sm font-bold uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50">
                                    {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Categories List */}
            <div className="space-y-3">
                {parentCats.length === 0 && (
                    <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
                        <span className="material-symbols-outlined text-4xl text-slate-600 block mb-3">category</span>
                        <p className="text-slate-400">No categories yet. Create your first one!</p>
                    </div>
                )}

                {parentCats.map(cat => {
                    const children = childCats.filter(c => c.parent === cat._id);
                    return (
                        <div key={cat._id} className="bg-[#111109] border border-white/5 rounded-2xl overflow-hidden">
                            {/* Parent row */}
                            <div className="flex items-center gap-4 px-5 py-4">
                                <div className="w-10 h-10 rounded-xl bg-[#ffc000]/10 border border-[#ffc000]/20 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-[#ffc000] text-[20px]">{cat.icon}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-bold text-sm truncate">{cat.name}</p>
                                    <p className="text-slate-600 text-xs mt-0.5">/{cat.slug} · {children.length} subcategory{children.length !== 1 ? 'ies' : 'y'}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button onClick={() => openEdit(cat)} className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#ffc000] hover:border-[#ffc000]/30 transition-all">
                                        <span className="material-symbols-outlined text-[16px]">edit</span>
                                    </button>
                                    <button onClick={() => handleDelete(cat._id, cat.name)} className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all">
                                        <span className="material-symbols-outlined text-[16px]">delete</span>
                                    </button>
                                </div>
                            </div>

                            {/* Children */}
                            {children.length > 0 && (
                                <div className="border-t border-white/5 divide-y divide-white/5">
                                    {children.map(child => (
                                        <div key={child._id} className="flex items-center gap-4 px-5 py-3 pl-14 bg-white/[0.02]">
                                            <span className="material-symbols-outlined text-slate-500 text-[16px] shrink-0">{child.icon}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-slate-300 text-sm truncate">{child.name}</p>
                                                <p className="text-slate-600 text-xs">/{child.slug}</p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button onClick={() => openEdit(child)} className="w-8 h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-slate-500 hover:text-[#ffc000] hover:border-[#ffc000]/30 transition-all">
                                                    <span className="material-symbols-outlined text-[14px]">edit</span>
                                                </button>
                                                <button onClick={() => handleDelete(child._id, child.name)} className="w-8 h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:border-red-500/30 transition-all">
                                                    <span className="material-symbols-outlined text-[14px]">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add subcategory button */}
                            <div className="border-t border-white/5 px-5 py-2">
                                <button
                                    onClick={() => { setEditingId(null); setForm({ name: '', icon: 'category', parent: cat._id, order: 0 }); setError(''); setShowForm(true); }}
                                    className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#ffc000] transition-colors py-1"
                                >
                                    <span className="material-symbols-outlined text-[14px]">add</span>
                                    Add subcategory
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
