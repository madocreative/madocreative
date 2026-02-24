import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    await dbConnect();
    const resolvedParams = await params;
    const post = await Post.findOne({ slug: resolvedParams.slug });
    if (!post) return { title: 'Not Found | Mado Creatives' };

    return {
        title: `${post.title} | Mado Journal`,
        description: post.excerpt,
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    await dbConnect();
    const resolvedParams = await params;
    const post = await Post.findOne({ slug: resolvedParams.slug });

    if (!post) {
        notFound();
    }

    return (
        <div className="bg-[#0a0a08] min-h-screen pt-32 pb-24 text-white">
            <div className="max-w-4xl mx-auto px-6 lg:px-12">
                <Link href="/blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#ffc000] transition-colors mb-10 text-sm font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Journal
                </Link>

                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-[#ffc000] mb-6">
                    <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-display font-bold mb-10 leading-tight">
                    {post.title}
                </h1>

                <div className="aspect-[21/9] w-full relative overflow-hidden bg-[#1a1812] rounded-2xl mb-16">
                    <img
                        src={post.featuredImage || 'https://placehold.co/1200x600/221e10/f2b90d?text=Article'}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Prose formatting for Blog HTML Content */}
                <div
                    className="prose prose-invert prose-lg max-w-none prose-p:text-slate-300 prose-headings:font-display prose-headings:text-white prose-a:text-[#ffc000] prose-a:no-underline hover:prose-a:underline"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </div>
        </div>
    );
}
