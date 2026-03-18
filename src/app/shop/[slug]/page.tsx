import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';
import { getPublicSiteSettings } from '@/lib/siteSettings';

export const dynamic = 'force-dynamic';

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    await dbConnect();
    const { slug } = await params;
    const product = await Product.findOne({ slug }).lean() as RawProduct | null;
    if (!product) return { title: 'Product Not Found' };
    return {
        title: `${product.name} | Mado Creatives Shop`,
        description: product.description?.replace(/<[^>]+>/g, '').slice(0, 160) || '',
        openGraph: {
            images: product.images?.[0] ? [product.images[0]] : [],
        },
    };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    await dbConnect();
    const { slug } = await params;
    const [raw, settings] = await Promise.all([
        Product.findOne({ slug }).lean() as Promise<RawProduct | null>,
        getPublicSiteSettings(),
    ]);
    if (!raw) notFound();

    const product = {
        _id: raw._id.toString(),
        name: raw.name,
        slug: raw.slug,
        price: raw.price,
        description: raw.description,
        category: raw.category || 'Other',
        images: raw.images || [],
        inStock: raw.inStock ?? true,
    };

    // Fetch related products (same category, exclude current)
    const relatedRaw = await Product.find({
        category: product.category,
        slug: { $ne: slug },
    }).limit(4).lean() as RawProduct[];

    const related = relatedRaw.map((p) => ({
        _id: p._id.toString(),
        name: p.name,
        slug: p.slug,
        price: p.price,
        description: p.description || '',
        category: p.category || 'Other',
        images: p.images || [],
        inStock: p.inStock ?? true,
    }));

    return (
        <ProductDetailClient
            product={product}
            related={related}
            whatsappNumber={settings.whatsappNumber}
            whatsappUrl={settings.whatsappUrl}
        />
    );
}
