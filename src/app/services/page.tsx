export default function ServicesPage() {
    const services = [
        {
            title: "Commercial Photography",
            description: "We craft visually stunning, high-impact imagery that elevates brand perception and drives engagement. Our commercial work is designed to not just show a product, but to tell its story.",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFoJgN3bUu4iZt56FpOKs_YtO4wMvTz5Fclp5kH1ZpSg6QZ9A6_L2z9VpB3_M8QKsN6x2Z4M_Zq1H3_j3C_M_v_k2A0T2kZ3K7qf2s_v5P_H_q_v9n8Z4H0Y5L_E_D_C_b_a_x_A8-G4e5l1U2k8-9r6t_3Y1N_a_v_X_z9V_Y_w7R_3f_0-_V_h_u9k4j2z1C_8V8i-z5u3D8_g-4z2u3n_1I_L-_y_f2N_I_q1f_d9z_o2x_D-_v9_",
            tags: ["Campaigns", "Lookbooks", "E-commerce"],
            reverse: false
        },
        {
            title: "Editorial & Fashion",
            description: "Pushing creative boundaries to produce avant-garde editorials for leading fashion publications. We blend raw emotion with sophisticated styling to create unforgettable visual narratives.",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB99ZYI9xyfPFRwp4UTpLFhc2UpM9uKOya83bqumlUKm4YfTbZcYSoaw96tni8ERNTm6QCZOmRSwwP0SavuDYyFzR1c_X3S80sZrXS-UDpwkilC2sudU4S2VQPfhZp6ydlP78WIEZO-IXbwohczXap896fzXdFeoSGumiEZ3-hUeq25e75u_XiLuOVG-0y7190D_-YwNS54JwzC5ngMtD3j3ZCVSi77g1DaN_RjYRHA1btIpgxXhlvQPb3qXUl-5uVQQUAqrWr0fFM",
            tags: ["Magazine Spreads", "Cover Shoots", "Styling"],
            reverse: true
        },
        {
            title: "Brand Identity",
            description: "Visual identity goes beyond a logo. We develop comprehensive visual languages that communicate your brand's core values, ensuring consistency across all touchpoints.",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9R_M5u5c3oY4G9q2a6T4Qz8S_U9s8q3E7y2A1n7P7Z8R5w3L4z8x3T9q_O5N5x_R_e8E8q_i-G7y9G_q_A6u_L_x_t_j_O_I_w_a_A_R_M_s_a_M_s1j_a0v3h_k_O_w_O_M_o_g_C_w_d_c9L_b_n_r2y0R7u_j8r1m_c_s4E1v4J8z7f_U4l1M_Z_O_o_T0T1D_o_D_c_A6M6I-J9M7O-L3D3h_N1n_T_z4Z_i_V0O_Z9R_y_o_k_h9L9U9f_G_x_W2_,",
            tags: ["Art Direction", "Visual Guidelines", "Consulting"],
            reverse: false
        }
    ];

    return (
        <div className="flex flex-col items-center pt-24">
            {/* Hero Section */}
            <section className="w-full max-w-7xl mx-auto px-6 py-20 lg:py-32">
                <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">Our Services</h1>
                <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
                    <p className="text-xl text-slate-400 max-w-2xl font-light leading-relaxed flex-1">
                        We provide comprehensive creative solutions for absolute visionaries. Our approach is bespoke, ensuring every project is an authentic reflection of your brand&apos;s unique narrative.
                    </p>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-6 pt-4 md:pt-0">
                        <div>
                            <p className="text-[#f2b90d] font-bold text-3xl font-display mb-1">15+</p>
                            <p className="text-sm text-slate-500 uppercase tracking-wider">Years Experience</p>
                        </div>
                        <div>
                            <p className="text-[#f2b90d] font-bold text-3xl font-display mb-1">200+</p>
                            <p className="text-sm text-slate-500 uppercase tracking-wider">Global Clients</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Iteration */}
            <div className="w-full">
                {services.map((service, index) => (
                    <section
                        key={index}
                        className={`w-full py-24 ${index % 2 === 0 ? 'bg-[#1a1812]' : 'bg-[#221e10]'}`}
                    >
                        <div className={`max-w-7xl mx-auto px-6 flex flex-col ${service.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}>
                            <div className="w-full lg:w-1/2 relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden rounded-sm group">
                                <img
                                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                                    src={service.image}
                                    alt={service.title}
                                />
                                <div className="absolute inset-0 border border-white/5 m-4 pointer-events-none"></div>
                            </div>

                            <div className="w-full lg:w-1/2 flex flex-col justify-center">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-[#f2b90d] font-mono pr-4 border-r border-[#f2b90d]/30">0{index + 1}</span>
                                    <div className="flex gap-2">
                                        {service.tags.map((tag, i) => (
                                            <span key={i} className="text-xs uppercase tracking-widest text-slate-500 bg-white/5 px-3 py-1 rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-6 leading-tight">
                                    {service.title}
                                </h2>
                                <p className="text-lg text-slate-400 mb-10 leading-relaxed font-light">
                                    {service.description}
                                </p>

                                <a href="/portfolio" className="group flex items-center gap-4 text-white font-bold uppercase tracking-widest text-sm w-max hover:text-[#f2b90d] transition-colors">
                                    <span className="relative overflow-hidden">
                                        <span className="block transition-transform duration-300 group-hover:-translate-y-full">View Related Work</span>
                                        <span className="absolute top-0 left-0 block translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-[#f2b90d]">View Related Work</span>
                                    </span>
                                    <span className="material-symbols-outlined transform transition-transform duration-300 group-hover:translate-x-2">arrow_right_alt</span>
                                </a>
                            </div>
                        </div>
                    </section>
                ))}
            </div>

            {/* CTA Section */}
            <section className="w-full bg-[#f2b90d] py-32 mt-20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-6xl font-display font-bold text-[#0a0a08] mb-8 leading-tight">Ready to elevate your visual identity?</h2>
                    <p className="text-xl text-[#0a0a08]/80 mb-12 max-w-2xl mx-auto font-medium">
                        Contact us today to discuss your vision and how Mado Creatives can bring it to life.
                    </p>
                    <a href="/contact" className="inline-flex items-center justify-center bg-[#0a0a08] text-white px-10 py-4 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all">
                        Start a Project
                    </a>
                </div>
            </section>
        </div>
    );
}
