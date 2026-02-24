import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Image from 'next/image';

export const metadata = {
    title: 'Shop | Mado Creatives',
    description: 'Purchase original prints and digital assets from Mado Creatives.',
};

export default async function ShopPage() {
    await dbConnect();
    // Fetch active products
    const products = await Product.find({}).sort({ createdAt: -1 });

    return (
        <div className="bg-[#0a0a08] min-h-screen pt-32 pb-24 text-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <h1 className="text-5xl md:text-6xl font-display font-medium mb-6">The Shop.</h1>
                <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mb-16">
                    Exclusive prints and digital assets curated for our community.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {products.map((product) => (
                        <div key={product._id.toString()} className="group cursor-pointer">
                            <div className="aspect-[4/5] relative overflow-hidden bg-[#1a1812] rounded-xl mb-6">
                                <img
                                    src={product.images[0] || 'https://placehold.co/600x800/221e10/f2b90d?text=Product'}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                                {!product.inStock && (
                                    <div className="absolute top-4 left-4 bg-red-500/90 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                                        Sold Out
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <h3 className="text-2xl font-bold font-display group-hover:text-[#f2b90d] transition-colors">{product.name}</h3>
                                    <p className="text-slate-400 mt-2 line-clamp-2">{product.description}</p>
                                </div>
                                <div className="text-xl font-medium whitespace-nowrap">${product.price.toFixed(2)}</div>
                            </div>

                            <button
                                disabled={!product.inStock}
                                className="w-full mt-6 py-4 bg-white text-[#0a0a08] font-bold uppercase tracking-widest text-sm hover:bg-[#f2b90d] transition-colors disabled:opacity-50 disabled:hover:bg-white rounded-lg"
                            >
                                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                        </div>
                    ))}

                    {products.length === 0 && (
                        <div className="col-span-full py-24 text-center border border-white/10 rounded-2xl">
                            <p className="text-2xl text-slate-500 font-display">New collection dropping soon.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
