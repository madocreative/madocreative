export default function PortfolioPage() {
    const images = [
        { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB99ZYI9xyfPFRwp4UTpLFhc2UpM9uKOya83bqumlUKm4YfTbZcYSoaw96tni8ERNTm6QCZOmRSwwP0SavuDYyFzR1c_X3S80sZrXS-UDpwkilC2sudU4S2VQPfhZp6ydlP78WIEZO-IXbwohczXap896fzXdFeoSGumiEZ3-hUeq25e75u_XiLuOVG-0y7190D_-YwNS54JwzC5ngMtD3j3ZCVSi77g1DaN_RjYRHA1btIpgxXhlvQPb3qXUl-5uVQQUAqrWr0fFM', alt: 'Fashion Model Looking Ahead' },
        { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1FqXXS1bKzH2uD7xJm7_wU7q9qV_rB9n5H0M5s_D9oXjM4H0P8s8yI8U5cR5lW6Y8kI0Q3cR9e7pZ0N5X_E_l_M_f_n9v7K4n_i_H0e6D9n_I0E_d_P8g4L6W9R3l9X5K_T2g_t6r9D9a1y4K0Q2F0H9F7G4x1n6L0O1J_b_a1R_n8M2G5b5M2e_f_V_a5I1_9d8o2T8S4M0W8E0i0b1E4V5z9d3B5R_e_q_y_q1Q2j1c2v5w1C9a0i8Z_m5L8e0p7G1C3f0M2L8', alt: 'Model against architectural background' },
        { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3OQY_eQ7tY-u1zJ17Wv4W1BvO1Q9aY7N8hW3hY0hL0Y2U1oO7y2N4nK0C0_5U_I3t2dF8rF0qE5S1tI1v_m8rJ9iC8F7E4fB1oD2eX1yO5xG1iP8pU0aI8zT3zR6bA2tM5bV1tK4pU4mF1qP3pG9hK6xP3dR3zE1aB6dY5gP2aM8dU4iN1aE2bQ3xE8cF7yA1cR2bP4sP6iR1zB9cE0hY9bP2jU6gE6qK3xO7eI3xN1qH4dD5bF0lZ1sT7aE1cF2yY5cU0bR1wT8yC', alt: 'Close-up portrait with dark mood' },
        { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFoJgN3bUu4iZt56FpOKs_YtO4wMvTz5Fclp5kH1ZpSg6QZ9A6_L2z9VpB3_M8QKsN6x2Z4M_Zq1H3_j3C_M_v_k2A0T2kZ3K7qf2s_v5P_H_q_v9n8Z4H0Y5L_E_D_C_b_a_x_A8-G4e5l1U2k8-9r6t_3Y1N_a_v_X_z9V_Y_w7R_3f_0-_V_h_u9k4j2z1C_8V8i-z5u3D8_g-4z2u3n_1I_L-_y_f2N_I_q1f_d9z_o2x_D-_v9_', alt: 'Cinematic fashion shot' },
        { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_5sYl9k0MkV0LdH1aJc5nJmT-n4A4xJvFhF5XoGq9A_D5X_U7H4k2A8y2i4GkS1O2wM_w4eA6Z5RkG3C6K_9W0PqU9rW0-mCw3QhLkV9ZlY-Q8pL3sF6zK0zM7oZtE4zX3XkV4aE9nZ7wH5sU8aG1iY2aE8dH3dG7wE5eD7cQ9gC3jB2vN5hL0kV2fE8mV9bN5vC9uF9jB3qG2bD8zO8eB9kQ0bG9bH6lP9dW2mR7qK9iX7yV6dC3vP0yT3aV4qH8uX7bH3xV8wN2bR7qD', alt: 'Expressive pose against concrete' },
    ];

    return (
        <div className="flex flex-col pt-24">
            {/* Project Hero Header */}
            <section className="px-6 md:px-20 py-16 lg:py-24">
                <h1 className="font-display text-5xl md:text-8xl text-white font-bold leading-tight mb-6">
                    Vogue Essentials
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16">
                    <div className="md:col-span-8">
                        <p className="text-xl md:text-2xl text-slate-400 font-light leading-relaxed max-w-3xl">
                            An exploration of minimalist silhouettes and stark contrasts. This editorial captures the essence of modern elegance, stripping away the superfluous to reveal the architectural beauty of contemporary fashion design in its purest form.
                        </p>
                    </div>
                    <div className="md:col-span-4 flex flex-col gap-6">
                        <div className="flex flex-col gap-1 border-b border-white/10 pb-4">
                            <span className="text-xs uppercase tracking-widest text-[#f2b90d] font-bold">Client</span>
                            <span className="text-white">Vogue Paris</span>
                        </div>
                        <div className="flex flex-col gap-1 border-b border-white/10 pb-4">
                            <span className="text-xs uppercase tracking-widest text-[#f2b90d] font-bold">Role</span>
                            <span className="text-white">Creative Direction / Photography</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs uppercase tracking-widest text-[#f2b90d] font-bold">Date</span>
                            <span className="text-white">October 2023</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Hero Big Image */}
            <section className="w-full h-[60vh] md:h-[80vh] overflow-hidden">
                <img
                    src={images[0].src}
                    alt="Main campaign shot"
                    className="w-full h-full object-cover grayscale opacity-80"
                />
            </section>

            {/* Masonry Image Gallery */}
            <section className="px-6 md:px-10 py-20 lg:py-32 bg-[#1a1812]">
                <h2 className="text-3xl font-display font-bold text-white mb-16 text-center">Campaign Gallery</h2>
                <div className="masonry-grid">
                    {images.map((img, idx) => (
                        <div key={idx} className="masonry-item group relative cursor-pointer overflow-hidden rounded-sm mb-4">
                            <img
                                src={img.src}
                                alt={img.alt}
                                className="w-full h-auto object-cover grayscale transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-4xl">zoom_in</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Next Project Navigation */}
            <section className="border-t border-white/10 bg-[#221e10]">
                <div className="flex">
                    <a href="#" className="w-1/2 p-8 md:p-16 border-r border-white/10 flex flex-col justify-center items-start group hover:bg-[#1a1812] transition-colors">
                        <span className="text-xs uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2 group-hover:text-[#f2b90d] transition-colors">
                            <span className="material-symbols-outlined text-sm">arrow_left_alt</span> Previous
                        </span>
                        <span className="font-display text-2xl md:text-4xl text-white font-bold group-hover:pl-2 transition-all">Midnight Paris</span>
                    </a>
                    <a href="#" className="w-1/2 p-8 md:p-16 flex flex-col justify-center items-end text-right group hover:bg-[#1a1812] transition-colors">
                        <span className="text-xs uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2 group-hover:text-[#f2b90d] transition-colors">
                            Next <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
                        </span>
                        <span className="font-display text-2xl md:text-4xl text-white font-bold group-hover:pr-2 transition-all">Urban Nomads</span>
                    </a>
                </div>
            </section>
        </div>
    );
}
