'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BlogList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/admin/blog')
            .then(res => res.json())
            .then(data => {
                if (data.success) setPosts(data.data);
                setLoading(false);
            });
    }, []);

    const handleCreate = async () => {
        const title = prompt('Enter the title of the new blog post:');
        if (!title) return;

        const res = await fetch('/api/admin/blog', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                excerpt: 'Write a short description here...',
                content: '<p>Start writing your blog post...</p>',
                featuredImage: 'https://placehold.co/1200x600/221e10/f2b90d?text=Post+Image'
            })
        });

        if (res.ok) {
            const { data } = await res.json();
            router.push(`/admin/blog/${data._id}`);
        }
    };

    if (loading) return <div className="text-white">Loading articles...</div>;

    return (
        <div className="max-w-6xl">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Blog Posts</h1>
                    <p className="text-slate-400">Write and publish articles for your audience.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="bg-[#f2b90d] text-[#0a0a08] px-6 py-3 rounded-lg font-bold uppercase tracking-wider hover:brightness-110 flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">add</span>
                    New Draft
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post: any) => (
                    <div key={post._id} className="bg-[#1a1812] border border-white/10 rounded-xl overflow-hidden group flex flex-col">
                        <div className="aspect-video relative overflow-hidden bg-black/50">
                            <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{post.title}</h3>
                            <p className="text-slate-500 text-sm mb-4 line-clamp-3 flex-1">{post.excerpt}</p>

                            <div className="flex justify-between items-center mb-4">
                                <span className={`text-xs px-2 py-1 rounded-full ${post.published ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                    {post.published ? 'Published' : 'Draft'}
                                </span>
                                <p className="text-slate-600 text-xs">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            <Link href={`/admin/blog/${post._id}`} className="block text-center bg-[#221e10] text-sm font-bold uppercase tracking-wider text-white border border-white/10 py-3 rounded-lg hover:border-[#f2b90d] hover:text-[#f2b90d] transition-colors">
                                Edit Post
                            </Link>
                        </div>
                    </div>
                ))}

                {posts.length === 0 && (
                    <div className="col-span-full text-center py-20 border border-dashed border-white/10 rounded-xl">
                        <span className="material-symbols-outlined text-4xl text-slate-600 mb-4">edit_note</span>
                        <p className="text-slate-400">No blog posts found. Start writing your first article!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
