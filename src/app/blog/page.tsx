import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import Link from 'next/link';

export const metadata = {
    title: 'Journal | Mado Creatives',
    description: 'Thoughts, tutorials, and behind-the-scenes from the creative agency.',
};

export default async function BlogPage() {
    await dbConnect();
    // Fetch published posts only, sorted by newest
    const posts = await Post.find({ published: true }).sort({ createdAt: -1 });

    return (
        <div className="bg-[#0a0a08] min-h-screen pt-32 pb-24 text-white">
            <div className="max-w-4xl mx-auto px-6 lg:px-12">
                <h1 className="text-5xl md:text-6xl font-display font-medium mb-6">The Journal.</h1>
                <p className="text-xl md:text-2xl text-slate-400 mb-16">
                    Thoughts on design, photography, and behind the scenes of our latest campaigns.
                </p>

                <div className="flex flex-col gap-16">
                    {posts.map((post) => (
                        <article key={post._id.toString()} className="group">
                            <Link href={`/blog/${post.slug}`} className="block">
                                <div className="aspect-[21/9] md:aspect-[3/1] relative overflow-hidden bg-[#1a1812] rounded-2xl mb-8">
                                    <img
                                        src={post.featuredImage || 'https://placehold.co/1200x400/221e10/f2b90d?text=Article'}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-80 transition-all duration-700 ease-out"
                                    />
                                </div>

                                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-[#ffc000] mb-4">
                                    <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                </div>

                                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 group-hover:text-[#ffc000] transition-colors">
                                    {post.title}
                                </h2>

                                <p className="text-lg text-slate-400 leading-relaxed mb-6">
                                    {post.excerpt}
                                </p>

                                <span className="inline-flex items-center gap-2 text-white font-medium border-b border-transparent group-hover:border-[#ffc000] pb-1 transition-colors uppercase text-sm tracking-wider">
                                    Read Article <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </span>
                            </Link>
                        </article>
                    ))}

                    {posts.length === 0 && (
                        <div className="py-24 text-center border border-white/10 rounded-2xl">
                            <p className="text-2xl text-slate-500 font-display">No entries yet. Check back soon.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
