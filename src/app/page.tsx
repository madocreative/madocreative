import Link from 'next/link';

export default function Home() {
  const portfolioItems = [
    { title: 'Vogue Essentials', category: 'Editorial', span: 'col-span-12 md:col-span-8', aspect: 'aspect-[16/9]', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB99ZYI9xyfPFRwp4UTpLFhc2UpM9uKOya83bqumlUKm4YfTbZcYSoaw96tni8ERNTm6QCZOmRSwwP0SavuDYyFzR1c_X3S80sZrXS-UDpwkilC2sudU4S2VQPfhZp6ydlP78WIEZO-IXbwohczXap896fzXdFeoSGumiEZ3-hUeq25e75u_XiLuOVG-0y7190D_-YwNS54JwzC5ngMtD3j3ZCVSi77g1DaN_RjYRHA1btIpgxXhlvQPb3qXUl-5uVQQUAqrWr0fFM' },
    { title: 'Noir Collection', category: 'Lookbook', span: 'col-span-12 md:col-span-4', aspect: 'aspect-[3/4]', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1FqXXS1bKzH2uD7xJm7_wU7q9qV_rB9n5H0M5s_D9oXjM4H0P8s8yI8U5cR5lW6Y8kI0Q3cR9e7pZ0N5X_E_l_M_f_n9v7K4n_i_H0e6D9n_I0E_d_P8g4L6W9R3l9X5K_T2g_t6r9D9a1y4K0Q2F0H9F7G4x1n6L0O1J_b_a1R_n8M2G5b5M2e_f_V_a5I1_9d8o2T8S4M0W8E0i0b1E4V5z9d3B5R_e_q_y_q1Q2j1c2v5w1C9a0i8Z_m5L8e0p7G1C3f0M2L8' },
    { title: 'Urban Nomads', category: 'Campaign', span: 'col-span-12 md:col-span-4 mt-0 md:-mt-32', aspect: 'aspect-[3/4]', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3OQY_eQ7tY-u1zJ17Wv4W1BvO1Q9aY7N8hW3hY0hL0Y2U1oO7y2N4nK0C0_5U_I3t2dF8rF0qE5S1tI1v_m8rJ9iC8F7E4fB1oD2eX1yO5xG1iP8pU0aI8zT3zR6bA2tM5bV1tK4pU4mF1qP3pG9hK6xP3dR3zE1aB6dY5gP2aM8dU4iN1aE2bQ3xE8cF7yA1cR2bP4sP6iR1zB9cE0hY9bP2jU6gE6qK3xO7eI3xN1qH4dD5bF0lZ1sT7aE1cF2yY5cU0bR1wT8yC' },
    { title: 'Silent Whispers', category: 'Portrait', span: 'col-span-12 md:col-span-8', aspect: 'aspect-[16/9]', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFoJgN3bUu4iZt56FpOKs_YtO4wMvTz5Fclp5kH1ZpSg6QZ9A6_L2z9VpB3_M8QKsN6x2Z4M_Zq1H3_j3C_M_v_k2A0T2kZ3K7qf2s_v5P_H_q_v9n8Z4H0Y5L_E_D_C_b_a_x_A8-G4e5l1U2k8-9r6t_3Y1N_a_v_X_z9V_Y_w7R_3f_0-_V_h_u9k4j2z1C_8V8i-z5u3D8_g-4z2u3n_1I_L-_y_f2N_I_q1f_d9z_o2x_D-_v9_' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-[#0a0a08]">
        <div className="absolute inset-0 w-full h-full opacity-60">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_5sYl9k0MkV0LdH1aJc5nJmT-n4A4xJvFhF5XoGq9A_D5X_U7H4k2A8y2i4GkS1O2wM_w4eA6Z5RkG3C6K_9W0PqU9rW0-mCw3QhLkV9ZlY-Q8pL3sF6zK0zM7oZtE4zX3XkV4aE9nZ7wH5sU8aG1iY2aE8dH3dG7wE5eD7cQ9gC3jB2vN5hL0kV2fE8mV9bN5vC9uF9jB3qG2bD8zO8eB9kQ0bG9bH6lP9dW2mR7qK9iX7yV6dC3vP0yT3aV4qH8uX7bH3xV8wN2bR7qD"
            alt="Hero background"
            className="w-full h-full object-cover object-center grayscale mix-blend-overlay"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#221e10] via-[#221e10]/40 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center mt-20">
          <p className="text-[#f2b90d] font-bold tracking-[0.3em] uppercase text-sm mb-6 animate-fade-in-up">Visual Storytelling</p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter uppercase text-white mb-8 animate-fade-in-up delay-100">
            Capturing<br />The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f2b90d] to-[#d4a017]">Unseen</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-light max-w-2xl mx-auto mb-12 animate-fade-in-up delay-200">
            We are Mado Creatives, an independent studio crafting premium imagery for visionaries.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up delay-300">
            <Link href="/portfolio" className="bg-[#f2b90d] text-[#0a0a08] px-10 py-4 rounded-full font-bold text-lg uppercase tracking-wider hover:bg-white transition-colors w-full sm:w-auto">
              View Our Work
            </Link>
          </div>
        </div>
      </section>

      {/* About Overview */}
      <section className="py-32 bg-[#221e10] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <p className="text-[#f2b90d] font-bold uppercase tracking-widest text-sm mb-4">The Studio</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-8 leading-tight">
                Redefining elegance through the lens.
              </h2>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed font-light">
                Based in Paris, operating globally. We specialize in high-fashion, editorial, and commercial photography. Our approach is deeply collaborative, ensuring every frame tells a compelling story that resonates with your audience.
              </p>
              <div className="grid grid-cols-2 gap-10">
                <div>
                  <p className="text-4xl font-display font-bold text-white mb-2">15+</p>
                  <p className="text-slate-500 uppercase tracking-widest text-xs font-bold">Years Experience</p>
                </div>
                <div>
                  <p className="text-4xl font-display font-bold text-white mb-2">250</p>
                  <p className="text-slate-500 uppercase tracking-widest text-xs font-bold">Projects Delivered</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/5] lg:aspect-auto lg:h-[700px]">
              <div className="absolute inset-0 bg-[#f2b90d] rounded-sm translate-x-4 translate-y-4"></div>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9R_M5u5c3oY4G9q2a6T4Qz8S_U9s8q3E7y2A1n7P7Z8R5w3L4z8x3T9q_O5N5x_R_e8E8q_i-G7y9G_q_A6u_L_x_t_j_O_I_w_a_A_R_M_s_a_M_s1j_a0v3h_k_O_w_O_M_o_g_C_w_d_c9L_b_n_r2y0R7u_j8r1m_c_s4E1v4J8z7f_U4l1M_Z_O_o_T0T1D_o_D_c_A6M6I-J9M7O-L3D3h_N1n_T_z4Z_i_V0O_Z9R_y_o_k_h9L9U9f_G_x_W2_,"
                alt="Studio behind the scenes"
                className="relative w-full h-full object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Portfolio Preview */}
      <section className="py-32 bg-[#1a1812]">
        <div className="max-w-7xl mx-auto px-6 mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <p className="text-[#f2b90d] font-bold uppercase tracking-widest text-sm mb-4">Selected Works</p>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight">Featured Portfolio</h2>
          </div>
          <Link href="/portfolio" className="text-white border-b border-[#f2b90d] pb-1 uppercase tracking-widest text-sm font-bold hover:text-[#f2b90d] transition-colors">
            See All Projects
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            {portfolioItems.map((item, idx) => (
              <div key={idx} className={`${item.span} group relative cursor-pointer`}>
                <div className={`${item.aspect} overflow-hidden rounded-sm relative`}>
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover grayscale transition-transform duration-1000 group-hover:scale-105 group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-display font-bold text-2xl group-hover:text-[#f2b90d] transition-colors">{item.title}</h3>
                    <p className="text-slate-500 uppercase tracking-widest text-xs mt-2">{item.category}</p>
                  </div>
                  <span className="material-symbols-outlined text-[#f2b90d] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    arrow_right_alt
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
