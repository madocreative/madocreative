import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Journal | Mado Creatives',
    description: 'Thoughts, tutorials, and behind-the-scenes from the creative studio.',
};

const BLOG_HERO_IMGS = [
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971897/mado-creatives/luhwozrxtp1u5oehdyej.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971885/mado-creatives/kgwmhi695gjdyey0qauv.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971887/mado-creatives/enbiztasgcryipz6x8py.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971889/mado-creatives/lgrj87iype8vbp5qiuzn.jpg',
    'https://res.cloudinary.com/dwvpeeepl/image/upload/v1771971891/mado-creatives/kw9xzrjaw2mk62tv7z0o.jpg',
];

export default async function BlogPage() {
    await dbConnect();
    const posts = await Post.find({ published: true }).sort({ createdAt: -1 });

    return (
        <div className="bg-[#0a0a08] min-h-screen text-white">
            {/* Hero — photography collage */}
            <section className="relative h-[38vh] overflow-hidden">
                <div className="absolute inset-0 flex gap-px">
                    {BLOG_HERO_IMGS.map((img, i) => (
                        <div key={i} className={`overflow-hidden ${i === 0 ? 'flex-[2]' : 'flex-1'}`}>
                            <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
                <div className="absolute inset-0 bg-[#0a0a08]/30" />
                <div className="absolute bottom-0 left-0 right-0 h-14 bg-[#0a0a08]" />
                <div className="absolute inset-0 flex flex-col items-start justify-end pb-20 px-6 lg:px-12 max-w-5xl mx-auto w-full">
                    <p className="text-[#ffc000] font-bold tracking-[0.4em] uppercase text-xs mb-2">The Journal</p>
                    <h1 className="text-4xl md:text-6xl font-display font-extrabold uppercase text-white leading-none">Journal</h1>
                </div>
            </section>

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
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
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
