import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-[#1a1812] pt-20 pb-10 border-t border-white/5 mt-auto">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 text-white">
                <div className="md:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="material-symbols-outlined text-3xl text-[#ffc000]">
                            filter_vintage
                        </span>
                        <h2 className="text-xl font-extrabold tracking-tighter uppercase">
                            Mado <span className="text-[#ffc000]">Creatives</span>
                        </h2>
                    </div>
                    <p className="text-slate-500 max-w-sm mb-8">
                        An independent creative studio based in Paris, serving luxury brands
                        worldwide with premium imagery and creative direction.
                    </p>
                    <div className="flex gap-4">
                        <a
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#ffc000] hover:text-[#0a0a08] transition-all"
                            href="#"
                        >
                            <span className="material-symbols-outlined text-lg">public</span>
                        </a>
                        <a
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#ffc000] hover:text-[#0a0a08] transition-all"
                            href="#"
                        >
                            <span className="material-symbols-outlined text-lg">camera</span>
                        </a>
                        <a
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#ffc000] hover:text-[#0a0a08] transition-all"
                            href="mailto:hello@madocreatives.com"
                        >
                            <span className="material-symbols-outlined text-lg">mail</span>
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-white">
                        Navigation
                    </h4>
                    <ul className="space-y-4">
                        <li>
                            <Link href="/" className="text-slate-500 hover:text-[#ffc000] transition-colors">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/portfolio" className="text-slate-500 hover:text-[#ffc000] transition-colors">
                                Portfolio
                            </Link>
                        </li>
                        <li>
                            <Link href="/services" className="text-slate-500 hover:text-[#ffc000] transition-colors">
                                Services
                            </Link>
                        </li>
                        <li>
                            <Link href="/team" className="text-slate-500 hover:text-[#ffc000] transition-colors">
                                Team
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" className="text-slate-500 hover:text-[#ffc000] transition-colors">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-white">
                        Contact
                    </h4>
                    <ul className="space-y-4">
                        <li className="text-slate-500">12 Rue de l&apos;Avenir, Paris</li>
                        <li className="text-slate-500">hello@madocreatives.com</li>
                        <li className="text-slate-500">+33 (0) 1 23 45 67 89</li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-white/5 text-center text-slate-600 text-xs font-bold uppercase tracking-[0.3em]">
                © {new Date().getFullYear()} Mado Creatives Studio. All Rights Reserved.
            </div>
        </footer>
    );
}
