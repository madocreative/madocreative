'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ShopList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/admin/products')
            .then(res => res.json())
            .then(data => {
                if (data.success) setProducts(data.data);
                setLoading(false);
            });
    }, []);

    const handleCreate = async () => {
        const name = prompt('Enter the name of the new product:');
        if (!name) return;

        const res = await fetch('/api/admin/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                price: 0,
                description: 'New product description...',
                images: ['https://placehold.co/600x600/221e10/f2b90d?text=No+Image']
            })
        });

        if (res.ok) {
            const { data } = await res.json();
            router.push(`/admin/shop/${data._id}`);
        }
    };

    if (loading) return <div className="text-white">Loading products...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">Shop Inventory</h1>
                    <p className="text-slate-400">Manage products, pricing, and stock status.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="group relative bg-[#ffc000] text-[#0a0a08] px-6 py-3.5 rounded-xl font-bold uppercase tracking-widest overflow-hidden transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(255,192,0,0.2)] hover:shadow-[0_0_30px_rgba(255,192,0,0.4)] hover:-translate-y-0.5 shrink-0"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="relative z-10 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">add_circle</span>
                        New Product
                    </span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product: any) => (
                    <div key={product._id} className="group relative bg-[#111109] border border-white/5 rounded-2xl overflow-hidden hover:border-[#ffc000]/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(255,192,0,0.15)] flex flex-col">

                        {/* Image Container */}
                        <div className="aspect-[4/3] relative overflow-hidden bg-[#0a0a08]">
                            <img src={product.images?.[0] || 'https://placehold.co/600x600/111109/333333?text=No+Image'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            {/* Stock Badge Overlay */}
                            <div className="absolute top-3 right-3 z-10">
                                <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full border ${product.inStock ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#111109] via-transparent to-transparent opacity-80" />
                        </div>

                        {/* Content Area */}
                        <div className="p-6 flex flex-col flex-1 relative z-10">
                            <h3 className="font-bold text-xl text-white truncate mb-2 group-hover:text-[#ffc000] transition-colors">{product.name}</h3>
                            <p className="text-[#ffc000] font-mono text-lg mb-6 flex-1">${product.price}</p>

                            <Link href={`/admin/shop/${product._id}`} className="block text-center bg-white/5 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-300 border border-white/10 py-3.5 rounded-xl hover:bg-[#ffc000] hover:text-[#0a0a08] hover:border-[#ffc000] transition-all duration-300 w-full mt-auto">
                                Edit Product
                            </Link>
                        </div>
                    </div>
                ))}

                {products.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-24 px-6 border border-dashed border-white/10 rounded-3xl bg-[#111109]/50">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-[32px] text-slate-500">inventory_2</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Inventory Empty</h3>
                        <p className="text-slate-500 text-center max-w-sm mb-6">Your store current has no products. Start by adding a new product to showcase your offerings.</p>
                        <button
                            onClick={handleCreate}
                            className="text-[#ffc000] hover:text-white font-bold uppercase tracking-widest border border-[#ffc000]/30 hover:border-white/30 px-6 py-3 rounded-xl transition-all flex items-center gap-2 text-xs"
                        >
                            <span className="material-symbols-outlined text-[16px]">add</span> Add First Product
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
