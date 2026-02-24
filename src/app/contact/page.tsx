'use client';

import { useState } from 'react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        inquiryType: 'general',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', inquiryType: 'general', message: '' });
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div className="flex flex-col min-h-screen pt-24">
            {/* Map Header Section */}
            <section className="relative w-full h-[450px] overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-cover bg-center grayscale opacity-60" style={{ backgroundImage: "url('https://maps.googleapis.com/maps/api/staticmap?center=Paris,France&zoom=13&size=1920x600&maptype=roadmap&style=feature:all|element:labels.text.fill|color:0x808080&style=feature:landscape|element:all|color:0x202020&style=feature:poi|element:all|color:0x303030&style=feature:road|element:all|color:0x404040&style=feature:transit|element:all|color:0x303030&style=feature:water|element:all|color:0x101010')" }}></div>
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#221e10] to-transparent"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="w-16 h-16 bg-[#f2b90d] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(242,185,13,0.3)] mb-4">
                        <span className="material-symbols-outlined text-[#0a0a08] text-3xl">location_on</span>
                    </div>
                    <div className="bg-[#1a1812]/90 backdrop-blur-md px-6 py-4 rounded-lg border border-white/10 text-center shadow-xl">
                        <h3 className="text-white font-display font-bold text-xl mb-1">Mado Studios</h3>
                        <p className="text-slate-400 text-sm">12 Rue de l&apos;Avenir, Paris</p>
                    </div>
                </div>
            </section>

            {/* Contact Content */}
            <section className="max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-20">
                {/* Left Col - Details */}
                <div className="flex flex-col">
                    <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">Let&apos;s Connect</h1>
                    <p className="text-slate-400 text-lg mb-16 max-w-md font-light">
                        Whether you&apos;re looking to launch a new campaign or redefine your brand&apos;s visual identity, we&apos;re here to bring your vision to life.
                    </p>

                    <div className="flex flex-col gap-10">
                        <div className="flex items-start gap-6">
                            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[#f2b90d]">mail</span>
                            </div>
                            <div>
                                <h4 className="text-white font-bold tracking-widest uppercase text-sm mb-2">Email Us</h4>
                                <a href="mailto:hello@madocreatives.com" className="text-xl text-slate-300 hover:text-[#f2b90d] transition-colors">hello@madocreatives.com</a>
                            </div>
                        </div>

                        <div className="flex items-start gap-6">
                            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[#f2b90d]">phone_in_talk</span>
                            </div>
                            <div>
                                <h4 className="text-white font-bold tracking-widest uppercase text-sm mb-2">Call Us</h4>
                                <p className="text-xl text-slate-300">+33 (0) 1 23 45 67 89</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col - Form */}
                <div className="bg-[#1a1812] p-8 md:p-12 rounded-xl border border-white/5 shadow-2xl">
                    <h3 className="text-2xl font-display font-bold text-white mb-8">Send a Message</h3>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs uppercase tracking-widest text-slate-500 font-bold ml-1">Your Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="bg-[#221e10] border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-[#f2b90d] transition-colors"
                                    placeholder="Jane Doe"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs uppercase tracking-widest text-slate-500 font-bold ml-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="bg-[#221e10] border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-[#f2b90d] transition-colors"
                                    placeholder="jane@example.com"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs uppercase tracking-widest text-slate-500 font-bold ml-1">Inquiry Type</label>
                                <select
                                    className="bg-[#221e10] border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-[#f2b90d] transition-colors appearance-none"
                                    value={formData.inquiryType}
                                    onChange={e => setFormData({ ...formData, inquiryType: e.target.value })}
                                >
                                    <option value="general">General Inquiry</option>
                                    <option value="project">New Project</option>
                                    <option value="press">Press & Media</option>
                                    <option value="careers">Careers</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs uppercase tracking-widest text-slate-500 font-bold ml-1">Message</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    className="bg-[#221e10] border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-[#f2b90d] transition-colors resize-none"
                                    placeholder="Tell us about your project..."
                                ></textarea>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="mt-6 bg-[#f2b90d] text-[#0a0a08] w-full py-4 rounded-lg font-bold text-lg uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex justify-center"
                        >
                            {status === 'loading' ? 'Sending...' : 'Submit Inquiry'}
                        </button>

                        {status === 'success' && (
                            <p className="text-green-400 text-center mt-4">Thank you! Your message has been sent successfully.</p>
                        )}
                        {status === 'error' && (
                            <p className="text-red-400 text-center mt-4">There was an error sending your message. Please try again.</p>
                        )}
                    </form>
                </div>
            </section>
        </div>
    );
}
