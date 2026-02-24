export default function AdminPagesList() {
    const pages = [
        { id: 'home', title: 'Homepage', icon: 'home' },
        { id: 'services', title: 'Services', icon: 'design_services' },
        { id: 'contact', title: 'Contact', icon: 'mail' },
        { id: 'team', title: 'Team', icon: 'group' },
    ];

    return (
        <div className="max-w-4xl">
            <h1 className="text-3xl font-display font-bold text-white mb-2">Edit Pages</h1>
            <p className="text-slate-400 mb-10">Select a page below to modify its text, headings, and SEO data.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pages.map((p) => (
                    <a
                        key={p.id}
                        href={`/admin/pages/${p.id}`}
                        className="bg-[#1a1812] border border-white/10 p-6 rounded-xl hover:border-[#ffc000] transition-all group flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-[#ffc000]/10 group-hover:text-[#ffc000] transition-colors">
                                <span className="material-symbols-outlined">{p.icon}</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">{p.title}</h3>
                                <p className="text-slate-500 text-sm">/{p.id === 'home' ? '' : p.id}</p>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-slate-500 group-hover:text-[#ffc000]">edit</span>
                    </a>
                ))}
            </div>
        </div>
    );
}
