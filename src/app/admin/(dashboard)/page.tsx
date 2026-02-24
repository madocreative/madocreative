export default function AdminWelcomePage() {
    return (
        <div className="max-w-5xl">
            <h1 className="text-4xl font-display font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-slate-400 mb-10">Manage your website content, galleries, and products from this dashboard.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#1a1812] border border-white/10 p-6 rounded-xl">
                    <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined">article</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">4</h3>
                    <p className="text-slate-500 text-sm font-medium">Active Pages</p>
                </div>
                <div className="bg-[#1a1812] border border-white/10 p-6 rounded-xl">
                    <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined">photo_library</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">0</h3>
                    <p className="text-slate-500 text-sm font-medium">Galleries</p>
                </div>
                <div className="bg-[#1a1812] border border-white/10 p-6 rounded-xl">
                    <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined">storefront</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">0</h3>
                    <p className="text-slate-500 text-sm font-medium">Products</p>
                </div>
                <div className="bg-[#1a1812] border border-white/10 p-6 rounded-xl">
                    <div className="w-10 h-10 bg-orange-500/20 text-orange-400 rounded-lg flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined">edit_note</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">0</h3>
                    <p className="text-slate-500 text-sm font-medium">Blog Posts</p>
                </div>
            </div>

            <div className="mt-12 bg-[#1a1812] border border-white/10 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-white/10 bg-white/5">
                    <h3 className="text-lg font-bold text-white">Quick Actions</h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a href="/admin/pages" className="flex items-center justify-between p-4 rounded-lg bg-[#221e10] border border-white/5 hover:border-[#f2b90d] transition-colors group">
                        <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-[#f2b90d]">edit_document</span>
                            <span className="font-medium text-white">Edit Homepage Text</span>
                        </div>
                        <span className="material-symbols-outlined text-slate-600">arrow_forward</span>
                    </a>
                    <a href="/admin/galleries" className="flex items-center justify-between p-4 rounded-lg bg-[#221e10] border border-white/5 hover:border-[#f2b90d] transition-colors group">
                        <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-[#f2b90d]">add_photo_alternate</span>
                            <span className="font-medium text-white">Upload New Portfolio Images</span>
                        </div>
                        <span className="material-symbols-outlined text-slate-600">arrow_forward</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
