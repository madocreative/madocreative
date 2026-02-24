import Link from 'next/link';

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-[#0a0a08] text-white">
            {/* Sidebar */}
            <aside className="w-64 bg-[#1a1812] border-r border-white/10 flex flex-col hidden md:flex">
                <div className="p-6 border-b border-white/10 flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#ffc000] rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#0a0a08] text-sm">construction</span>
                    </div>
                    <span className="font-display font-bold text-lg tracking-wider">Mado Admin</span>
                </div>

                <nav className="flex-1 p-4 flex flex-col gap-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined">dashboard</span>
                        <span className="font-medium text-sm">Dashboard</span>
                    </Link>
                    <Link href="/admin/pages" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined">article</span>
                        <span className="font-medium text-sm">Pages</span>
                    </Link>
                    <Link href="/admin/galleries" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined">photo_library</span>
                        <span className="font-medium text-sm">Galleries</span>
                    </Link>
                    <Link href="/admin/shop" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined">storefront</span>
                        <span className="font-medium text-sm">Shop</span>
                    </Link>
                    <Link href="/admin/blog" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined">edit_note</span>
                        <span className="font-medium text-sm">Blog</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined">open_in_new</span>
                        <span className="font-medium text-sm">View Live Site</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden bg-[#1a1812] border-b border-white/10 p-4 flex justify-between items-center">
                    <span className="font-display font-bold text-lg tracking-wider">Mado Admin</span>
                    <button className="text-white"><span className="material-symbols-outlined">menu</span></button>
                </header>

                {/* Scrollable Page Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#0a0a08]/50">
                    {children}
                </div>
            </main>
        </div>
    );
}
