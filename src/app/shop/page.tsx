import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
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
        slug: p.slug,
        price: p.price,
        description: p.description,
        category: p.category || 'Other',
        images: p.images || [],
        inStock: p.inStock ?? true,
    }));

    // Fetch Categories
    const rawCategories = await Category.find({}).sort({ order: 1, name: 1 }).lean();
    const categories = rawCategories.map((c: any) => ({
        _id: c._id.toString(),
        name: c.name,
        slug: c.slug,
        icon: c.icon || 'category',
        parent: c.parent ? c.parent.toString() : null,
    }));

    return (
        <div className="bg-[#0a0a08] min-h-screen text-white">
            {/* Hero — horizontal strip collage, mobile-first */}
            <section className="relative h-[44vh] md:h-[52vh] overflow-hidden">
                <div className="absolute inset-0 flex gap-px bg-[#0a0a08]">
                    {SHOP_HERO_IMGS.map((img, i) => (
                        <div
                            key={i}
                            className={`overflow-hidden ${i === 0 ? 'flex-[2]' : 'flex-1'}${i === 2 ? ' hidden sm:block' : ''}${i >= 3 ? ' hidden md:block' : ''}`}
                        >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a08]/90 via-[#0a0a08]/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a08] via-[#0a0a08]/20 to-transparent" />

                {/* Text — bottom-left, above gradient */}
                <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-8 lg:px-16 pb-8 md:pb-10">
                    <p className="text-[#ffc000] font-bold tracking-[0.4em] uppercase text-[10px] md:text-xs mb-2 flex items-center gap-3">
                        <span className="w-6 md:w-8 h-px bg-[#ffc000]" />
                        Electronics Store
                    </p>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white leading-none tracking-tight">
                        Shop
                    </h1>
                </div>
            </section>

            <ShopClient products={products} categories={categories} />
        </div>
    );
}
