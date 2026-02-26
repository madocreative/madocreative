import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    await dbConnect();
    const { slug } = await params;
    const post = await Post.findOne({ slug });
    if (!post) return { title: 'Not Found | Mado Creatives' };
    return { title: `${post.title} | Mado Journal`, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    await dbConnect();
    const { slug } = await params;
    const post = await Post.findOne({ slug });
    if (!post) notFound();

    return (
        <div className="bg-[#0a0a08] min-h-screen pt-32 pb-32 text-white">
            <article className="max-w-3xl mx-auto px-6 lg:px-0">

                {/* Back */}
                <Link href="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#ffc000] transition-colors mb-12 text-xs font-bold uppercase tracking-widest">
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to Journal
                </Link>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#ffc000] mb-6">
                    <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-6xl font-display font-bold mb-10 leading-tight">
                    {post.title}
                </h1>

                {/* Excerpt */}
                <p className="text-xl text-slate-400 font-light leading-relaxed mb-12 border-l-4 border-[#ffc000] pl-6">
                    {post.excerpt}
                </p>

                {/* Featured Image */}
                <div className="aspect-[21/9] w-full relative overflow-hidden bg-[#111109] mb-16">
                    <img
                        src={post.featuredImage || 'https://placehold.co/1200x600/221e10/f2b90d?text=Article'}
                        alt={post.title}
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Content */}
                <div
                    className="prose prose-invert prose-lg max-w-none
                        prose-p:text-slate-300 prose-p:leading-relaxed
                        prose-headings:font-display prose-headings:text-white prose-headings:font-bold
                        prose-h2:text-3xl prose-h3:text-2xl
                        prose-a:text-[#ffc000] prose-a:no-underline hover:prose-a:underline
                        prose-blockquote:border-l-[#ffc000] prose-blockquote:text-slate-400
                        prose-strong:text-white prose-code:text-[#ffc000] prose-code:bg-white/5
                        prose-img:rounded-xl prose-img:border prose-img:border-white/10"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Footer */}
                <div className="mt-20 pt-12 border-t border-white/10 flex items-center justify-between">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#ffc000] transition-colors text-sm font-bold uppercase tracking-widest">
                        <span className="material-symbols-outlined text-[16px]">arrow_back</span> More Articles
                    </Link>
                    <Link href="/contact" className="bg-[#ffc000] text-[#0a0a08] px-6 py-3 font-bold text-sm uppercase tracking-wider hover:bg-white transition-colors">
                        Work With Us
                    </Link>
                </div>
            </article>
        </div>
    );
}
