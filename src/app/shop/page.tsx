import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import ShopClient from './ShopClient';
import ShopHeroSlider from './ShopHeroSlider';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Shop | Mado Creatives',
    description: 'Premium electronics store — smartphones, laptops, cameras, and creator equipment. Available in Addis Ababa, Kigali, Nairobi & Dubai.',
};

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
            {/* Hero — full-width sliding carousel */}
            <ShopHeroSlider />

            <ShopClient products={products} categories={categories} />
        </div>
    );
}
