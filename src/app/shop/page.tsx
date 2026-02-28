import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import ShopClient from './ShopClient';
import ShopHeroSlider from './ShopHeroSlider';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Shop | Mado Creatives',
    description: 'Premium electronics store - smartphones, laptops, cameras, and creator equipment. Available in Addis Ababa, Kigali, Nairobi & Dubai.',
};

type RawProduct = {
    _id: { toString: () => string };
    name: string;
    slug: string;
    price: number;
    description: string;
    category?: string;
    images?: string[];
    inStock?: boolean;
};

type RawCategory = {
    _id: { toString: () => string };
    name: string;
    slug: string;
    icon?: string;
    parent?: { toString: () => string } | null;
};

export default async function ShopPage() {
    await dbConnect();
    const raw = await Product.find({}).sort({ createdAt: -1 }).lean() as RawProduct[];

    const products = raw.map((p) => ({
        _id: p._id.toString(),
        name: p.name,
        slug: p.slug,
        price: p.price,
        description: p.description,
        category: p.category || 'Other',
        images: p.images || [],
        inStock: p.inStock ?? true,
    }));

    const rawCategories = await Category.find({}).sort({ order: 1, name: 1 }).lean() as RawCategory[];
    const categories = rawCategories.map((c) => ({
        _id: c._id.toString(),
        name: c.name,
        slug: c.slug,
        icon: c.icon || 'category',
        parent: c.parent ? c.parent.toString() : null,
    }));

    return (
        <div className="bg-[var(--app-bg)] min-h-screen text-[var(--app-text)]">
            <ShopHeroSlider />
            <ShopClient products={products} categories={categories} />
        </div>
    );
}
