import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import ShopClient from './ShopClient';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Shop | Mado Creatives',
    description: 'Premium electronics store — smartphones, laptops, cameras, and creator equipment. Available in Addis Ababa, Kigali, Nairobi & Dubai.',
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
    const raw = await Product.find({}).sort({ createdAt: -1 }).lean();

    // Serialize for client component
    const products = raw.map((p: any) => ({
        _id: p._id.toString(),
        name: p.name,
        price: p.price,
        description: p.description,
        category: p.category || 'Other',
        images: p.images || [],
        inStock: p.inStock ?? true,
    }));

    return (
        <div className="bg-[#0a0a08] min-h-screen text-white">
            {/* Hero — horizontal strip collage, compact */}
            <section className="relative h-[38vh] overflow-hidden">
                <div className="absolute inset-0 flex gap-px">
                    {SHOP_HERO_IMGS.map((img, i) => (
                        <div key={i} className={`overflow-hidden ${i === 0 ? 'flex-[2]' : 'flex-1'}`}>
                            <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
                <div className="absolute inset-0 bg-[#0a0a08]/40" />
                <div className="absolute bottom-0 left-0 right-0 h-14 bg-[#0a0a08]" />
                <div className="absolute inset-0 flex flex-col items-start justify-end pb-20 px-6 lg:px-8 max-w-7xl mx-auto w-full">
                    <p className="text-[#ffc000] font-bold tracking-[0.4em] uppercase text-xs mb-2">
                        Electronics Store
                    </p>
                    <h1 className="text-4xl md:text-6xl font-display font-extrabold uppercase text-white leading-none">
                        Shop
                    </h1>
                </div>
            </section>

            <ShopClient products={products} />
        </div>
    );
}
