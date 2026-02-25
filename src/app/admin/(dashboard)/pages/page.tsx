export default function AdminPagesList() {
    const pages = [
        { id: 'home',     title: 'Homepage', icon: 'home',           desc: 'Hero, CTA, featured works' },
        { id: 'services', title: 'Services',  icon: 'design_services', desc: 'Services list, stats, CTA' },
        { id: 'team',     title: 'Team',      icon: 'group',          desc: 'Team members, header, CTA' },
        { id: 'booking',  title: 'Booking',   icon: 'event',          desc: 'Packages, session details' },
        { id: 'contact',  title: 'Contact',   icon: 'mail',           desc: 'Intro text, inquiry types' },
    ];

    return (
        <div className="max-w-4xl">
            <h1 className="text-3xl font-display font-bold text-white mb-2">Edit Pages</h1>
            <p className="text-slate-400 mb-10">Select a page to edit its content, sections, images, and copy.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pages.map(p => (
                    <a
                        key={p.id}
                        href={`/admin/pages/${p.id}`}
                        className="bg-[#1a1812] border border-white/10 p-6 rounded-xl hover:border-[#ffc000] transition-all group flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-[#ffc000]/10 group-hover:text-[#ffc000] text-slate-400 transition-colors">
                                <span className="material-symbols-outlined">{p.icon}</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">{p.title}</h3>
                                <p className="text-slate-500 text-sm">{p.desc}</p>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-slate-500 group-hover:text-[#ffc000] transition-colors">edit</span>
                    </a>
                ))}
            </div>
        </div>
    );
}
