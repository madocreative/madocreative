import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Link from 'next/link';

export const metadata = {
    title: 'Shop | Mado Creatives',
    description: 'Exclusive prints and digital assets from Mado Creatives.',
};

const SHOP_HERO_IMGS = [
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971882/mado-creatives/nlw9iu68433ngreltzwt.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971892/mado-creatives/zupngrotm2mt5yqblvta.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971897/mado-creatives/i8xewrxxjabg40c1nhd8.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971901/mado-creatives/nm1vvf8uukzdsq6ubiyq.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971902/mado-creatives/gwd4ikdny7f7ve03wxnl.jpg',
];

export default async function ShopPage() {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 });

    return (
        <div className="bg-[#0a0a08] min-h-screen text-white">
            {/* Hero — photography collage */}
            <section className="relative h-[55vh] overflow-hidden">
                <div className="absolute inset-0 flex gap-px">
                    {SHOP_HERO_IMGS.map((img, i) => (
                        <div key={i} className={`overflow-hidden ${i === 0 ? 'flex-[2]' : 'flex-1'}`}>
                            <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
                <div className="absolute inset-0 bg-[#0a0a08]/30" />
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#0a0a08]" />
                <div className="absolute inset-0 flex flex-col items-start justify-end pb-24 px-6 lg:px-12 max-w-7xl mx-auto w-full">
                    <p className="text-[#ffc000] font-bold tracking-[0.4em] uppercase text-xs mb-3">The Shop</p>
                    <h1 className="text-5xl md:text-8xl font-display font-extrabold uppercase text-white leading-none">Shop</h1>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
                {/* Subtitle */}
                <div className="mb-14 pt-10 border-b border-white/5 pb-10">
                    <p className="text-xl text-slate-400 font-light leading-relaxed max-w-2xl">
                        Exclusive prints and digital assets curated for our community.
                    </p>
                </div>

                {products.length === 0 ? (
                    <div className="py-24 text-center border border-white/10">
                        <span className="material-symbols-outlined text-5xl text-slate-600 mb-4 block">storefront</span>
                        <p className="text-2xl text-slate-500 font-display">New collection dropping soon.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                        {products.map(product => (
                            <div key={product._id.toString()} className="group cursor-pointer">
                                <div className="aspect-[4/5] relative overflow-hidden bg-[#111109]">
                                    <img
                                        src={product.images[0] || 'https://placehold.co/600x800/111109/ffc000?text=Product'}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                    {!product.inStock && (
                                        <div className="absolute inset-0 bg-[#0a0a08]/80 flex items-center justify-center">
                                            <span className="text-white font-bold uppercase tracking-widest text-sm border border-white/30 px-5 py-2">Sold Out</span>
                                        </div>
                                    )}
                                    {product.inStock && (
                                        <div className="absolute top-4 left-4 bg-[#ffc000] text-[#0a0a08] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5">
                                            In Stock
                                        </div>
                                    )}
                                </div>

                                {/* Solid label bar */}
                                <div className="bg-[#111109] px-5 py-4 border-t border-white/5">
                                    <div className="flex justify-between items-start gap-4 mb-3">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-bold font-display group-hover:text-[#ffc000] transition-colors truncate uppercase">{product.name}</h3>
                                        </div>
                                        <div className="text-lg font-bold text-[#ffc000] whitespace-nowrap shrink-0">${product.price.toFixed(2)}</div>
                                    </div>
                                    <button
                                        disabled={!product.inStock}
                                        className="w-full py-3 font-bold uppercase tracking-widest text-sm transition-all
                                            bg-white text-[#0a0a08] hover:bg-[#ffc000]
                                            disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* CTA */}
                {products.length > 0 && (
                    <div className="mt-20 py-14 border-t border-white/5 text-center">
                        <p className="text-slate-500 mb-6">Looking for something custom?</p>
                        <Link href="/contact" className="inline-flex items-center gap-2 text-white font-bold border-b border-[#ffc000] pb-1 hover:text-[#ffc000] transition-colors uppercase text-sm tracking-widest">
                            Commission a Print <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
