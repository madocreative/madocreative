'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function GalleryList() {
    const [galleries, setGalleries] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/admin/galleries')
            .then(res => res.json())
            .then(data => {
                if (data.success) setGalleries(data.data);
                setLoading(false);
            });
    }, []);

    const handleCreate = async () => {
        const title = prompt('Enter a title for the new gallery (e.g., Vogue Essentials):');
        if (!title) return;

        const res = await fetch('/api/admin/galleries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, featuredImage: 'https://placehold.co/600x400/221e10/f2b90d?text=No+Image' })
        });

        if (res.ok) {
            const { data } = await res.json();
            router.push(`/admin/galleries/${data._id}`);
        }
    };

    if (loading) return <div className="text-white">Loading galleries...</div>;

    return (
        <div className="max-w-6xl">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Portfolio Galleries</h1>
                    <p className="text-slate-400">Create, edit, and organize your image collections.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="bg-[#ffc000] text-[#0a0a08] px-6 py-3 rounded-lg font-bold uppercase tracking-wider hover:brightness-110 flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">add</span>
                    New Gallery
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleries.map((gallery: any) => (
                    <div key={gallery._id} className="bg-[#1a1812] border border-white/10 rounded-xl overflow-hidden group">
                        <div className="aspect-video relative overflow-hidden bg-black/50">
                            <img src={gallery.featuredImage} alt={gallery.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-white mb-1">{gallery.title}</h3>
                            <p className="text-slate-500 text-sm mb-4">/{gallery.slug} • {gallery.images?.length || 0} Images</p>

                            <Link href={`/admin/galleries/${gallery._id}`} className="block text-center bg-[#221e10] text-white border border-white/10 py-3 rounded-lg hover:border-[#ffc000] hover:text-[#ffc000] transition-colors">
                                Edit Gallery
                            </Link>
                        </div>
                    </div>
                ))}

                {galleries.length === 0 && (
                    <div className="col-span-full text-center py-20 border border-dashed border-white/10 rounded-xl">
                        <span className="material-symbols-outlined text-4xl text-slate-600 mb-4">photo_library</span>
                        <p className="text-slate-400">No galleries found. Create your first one above!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
