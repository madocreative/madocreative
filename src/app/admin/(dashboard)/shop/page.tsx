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
        <div className="max-w-6xl">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Shop Inventory</h1>
                    <p className="text-slate-400">Manage products, pricing, and stock status.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="bg-[#f2b90d] text-[#0a0a08] px-6 py-3 rounded-lg font-bold uppercase tracking-wider hover:brightness-110 flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">add</span>
                    New Product
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product: any) => (
                    <div key={product._id} className="bg-[#1a1812] border border-white/10 rounded-xl overflow-hidden group">
                        <div className="aspect-square relative overflow-hidden bg-black/50">
                            <img src={product.images?.[0] || 'https://placehold.co/600x600/221e10/f2b90d?text=No+Image'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-white truncate mb-1">{product.name}</h3>
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-[#f2b90d] font-bold">${product.price}</p>
                                <span className={`text-xs px-2 py-1 rounded-full ${product.inStock ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>

                            <Link href={`/admin/shop/${product._id}`} className="block text-center bg-[#221e10] text-sm font-bold uppercase tracking-wider text-white border border-white/10 py-2 rounded-lg hover:border-[#f2b90d] hover:text-[#f2b90d] transition-colors">
                                Edit Product
                            </Link>
                        </div>
                    </div>
                ))}

                {products.length === 0 && (
                    <div className="col-span-full text-center py-20 border border-dashed border-white/10 rounded-xl">
                        <span className="material-symbols-outlined text-4xl text-slate-600 mb-4">storefront</span>
                        <p className="text-slate-400">No products found. Add your first item above!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
