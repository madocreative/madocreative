import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import Link from 'next/link';
import BlogHeroSlider from './BlogHeroSlider';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Journal | Mado Creatives',
    description: 'Thoughts, tutorials, and behind-the-scenes from the creative studio.',
};

export default async function BlogPage() {
    await dbConnect();
    const posts = await Post.find({ published: true }).sort({ createdAt: -1 });

    return (
        <div className="bg-[#0a0a08] min-h-screen text-white">

            {/* Hero — full-screen image slider (portfolio style) */}
            <BlogHeroSlider />

            <div className="max-w-5xl mx-auto px-6 lg:px-12 pb-16">
                {/* Subtitle */}
                <div className="mb-10 pt-8 border-b border-white/5 pb-8">
                    <p className="text-xl text-slate-400 font-light leading-relaxed max-w-2xl">
                        Thoughts on design, photography, and behind the scenes of our latest campaigns.
                    </p>
                </div>

                {posts.length === 0 ? (
                    <div className="py-24 text-center border border-white/10">
                        <span className="material-symbols-outlined text-5xl text-slate-600 mb-4 block">edit_note</span>
                        <p className="text-2xl text-slate-500 font-display">No entries yet. Check back soon.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-0">
                        {posts.map((post, idx) => (
                            <article key={post._id.toString()} className={`group py-8 ${idx !== 0 ? 'border-t border-white/5' : ''}`}>
                                <Link href={`/blog/${post.slug}`} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
                                    <div className="md:col-span-5 aspect-[16/10] relative overflow-hidden bg-[#111109]">
                                        <img
                                            src={post.featuredImage || 'https://placehold.co/800x500/111109/ffc000?text=Article'}
                                            alt={post.title}
                                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
                                        />
                                    </div>
                                    <div className="md:col-span-7 flex flex-col justify-center py-4">
                                        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#ffc000] mb-4">
                                            <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 leading-tight group-hover:text-[#ffc000] transition-colors duration-300">
                                            {post.title}
                                        </h2>
                                        <p className="text-base text-slate-400 leading-relaxed mb-6 line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                        <span className="inline-flex items-center gap-2 text-white font-bold border-b border-[#ffc000]/0 group-hover:border-[#ffc000] pb-0.5 transition-all uppercase text-xs tracking-widest w-fit">
                                            Read Article <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </span>
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
