type AdminPageCard = {
    id: string;
    title: string;
    icon: string;
    desc: string;
};

const pageSections: { title: string; description: string; pages: AdminPageCard[] }[] = [
    {
        title: 'Main Pages',
        description: 'Core public pages for the site-wide experience.',
        pages: [
            { id: 'home', title: 'Homepage', icon: 'home', desc: 'Hero, CTA, featured works' },
            { id: 'services', title: 'Services', icon: 'design_services', desc: 'Services list, stats, CTA' },
            { id: 'team', title: 'Team', icon: 'group', desc: 'Team members, header, philosophy quote' },
            { id: 'booking', title: 'Booking', icon: 'event', desc: 'Packages, session details' },
            { id: 'contact', title: 'Contact', icon: 'mail', desc: 'Intro text, inquiry types, response time' },
            { id: 'portfolio', title: 'Portfolio', icon: 'photo_library', desc: 'Hero title, label, gallery intro' },
        ],
    },
    {
        title: 'Service Pages',
        description: 'Dedicated landing pages for each main service line.',
        pages: [
            { id: 'photography', title: 'Photography', icon: 'photo_camera', desc: 'Hero gallery, collections, process, CTA' },
            { id: 'videography', title: 'Videography', icon: 'movie', desc: 'Hero collage, stats, services, CTA' },
            { id: 'digital-marketing', title: 'Digital Marketing', icon: 'campaign', desc: 'Hero collage, stats, process, CTA' },
        ],
    },
];

export default function AdminPagesList() {
    return (
        <div className="max-w-6xl mx-auto space-y-10">
            <div>
                <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">Manage Pages</h1>
                <p className="text-slate-400">Edit the public-facing pages, service landings, and key page sections from one place.</p>
            </div>

            {pageSections.map((section) => (
                <section key={section.title} className="space-y-4">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-display font-bold text-white">{section.title}</h2>
                        <p className="text-sm text-slate-500">{section.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {section.pages.map((page) => (
                            <a
                                key={page.id}
                                href={`/admin/pages/${page.id}`}
                                className="group relative bg-[#111109] border border-white/5 p-6 rounded-2xl hover:border-[#ffc000]/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(255,192,0,0.15)] overflow-hidden flex flex-col justify-between min-h-[168px]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-[#ffc000]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                <div className="relative z-10 flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-[#ffc000] group-hover:text-[#0a0a08] text-slate-400 transition-all duration-500 shadow-inner">
                                        <span className="material-symbols-outlined text-[24px]">{page.icon}</span>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-600 group-hover:text-[#ffc000] transition-colors duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1">arrow_forward</span>
                                </div>

                                <div className="relative z-10">
                                    <h3 className="font-bold text-white text-xl mb-1 group-hover:text-[#ffc000] transition-colors">{page.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">{page.desc}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
