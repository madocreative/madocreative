export default function AdminPagesList() {
    const pages = [
        { id: 'home', title: 'Homepage', icon: 'home', desc: 'Hero, CTA, featured works' },
        { id: 'services', title: 'Services', icon: 'design_services', desc: 'Services list, stats, CTA' },
        { id: 'team', title: 'Team', icon: 'group', desc: 'Team members, header, philosophy quote' },
        { id: 'booking', title: 'Booking', icon: 'event', desc: 'Packages, session details' },
        { id: 'contact', title: 'Contact', icon: 'mail', desc: 'Intro text, inquiry types, response time' },
        { id: 'portfolio', title: 'Portfolio', icon: 'photo_library', desc: 'Hero title, label, gallery intro' },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">Manage Pages</h1>
                <p className="text-slate-400">Select a page to edit its hero content, sections, and integrated media.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {pages.map(p => (
                    <a
                        key={p.id}
                        href={`/admin/pages/${p.id}`}
                        className="group relative bg-[#111109] border border-white/5 p-6 rounded-2xl hover:border-[#ffc000]/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(255,192,0,0.15)] overflow-hidden flex flex-col justify-between min-h-[160px]"
                    >
                        {/* Hover Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#ffc000]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <div className="relative z-10 flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-[#ffc000] group-hover:text-[#0a0a08] text-slate-400 transition-all duration-500 shadow-inner">
                                <span className="material-symbols-outlined text-[24px]">{p.icon}</span>
                            </div>
                            <span className="material-symbols-outlined text-slate-600 group-hover:text-[#ffc000] transition-colors duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1">arrow_forward</span>
                        </div>

                        <div className="relative z-10">
                            <h3 className="font-bold text-white text-xl mb-1 group-hover:text-[#ffc000] transition-colors">{p.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
