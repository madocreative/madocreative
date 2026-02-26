import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }) {
    await dbConnect();
    const product = await Product.findOne({ slug: params.slug }).lean() as any;
    if (!product) return { title: 'Product Not Found' };
    return {
        title: `${product.name} | Mado Creatives Shop`,
        description: product.description?.replace(/<[^>]+>/g, '').slice(0, 160) || '',
        openGraph: {
            images: product.images?.[0] ? [product.images[0]] : [],
        },
    };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
    await dbConnect();
    const raw = await Product.findOne({ slug: params.slug }).lean() as any;
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
        slug: { $ne: params.slug },
    }).limit(4).lean() as any[];

    const related = relatedRaw.map((p: any) => ({
        _id: p._id.toString(),
        name: p.name,
        slug: p.slug,
        price: p.price,
        category: p.category || 'Other',
        images: p.images || [],
        inStock: p.inStock ?? true,
    }));

    return <ProductDetailClient product={product} related={related} />;
}
