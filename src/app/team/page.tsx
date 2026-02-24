export default function TeamPage() {
    const teamMembers = [
        {
            name: 'Julian Marc',
            role: 'Founding Director',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfJxaWbLgRvvA7JGQoAKZz9SFIT3x_V2oeO4P42MwAajYDI6FbiFPV5yGhL8ldsNyaTR4S9hXZW3YK1DTt9nsLdH3a-bS24bOZx97F6wBeAbDPhBBdh5wTs5Zfo6N3DIq4y84afzdCGXJqlE0vsLULNT1xUmluqADuzN58ONkvLdjAhreMUlZo6Mcf0Lv42EEYMWvlkvoEJdDxnAviqQ9JxDQ0kUXol1q_XLFbWXH7fBRf6p1EdeZ8CClAG03eKUFT17aor0yQ4TA'
        },
        {
            name: 'Elena Vance',
            role: 'Lead Photographer',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNY_orBsp9oCg4ZFzIkZxa6FATrS7tAOj6HtGEKvZm324EQQ3gJpdB02pGDyb8X4EIM5CyeRnYsjllBguQfBaeVuyfoP32Q6caox4srMdzEadBltp3e06fMi3OXRcToOt7gyYcld7bfHXOPdMgRm6Bx340C3G5Az0GiJiSlE0MqjYRSSqBh-_ZLkDzrohrlFa4ABZFY_4EYC_NN9UrLnBnUKGN6PnN9hpQKhKWxTC8WPm13zOB6X8r6VOn6TDF3g4Kq-2Xxzb0J8o'
        },
        {
            name: 'Marcus Thorne',
            role: 'Fashion Stylist',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQS2UXAM-kHOpNJ8KLkf4n3qNBKvVil_dZ5Vo8UfojLGvDt01vxSQ4O52LpKhbCdwqsEZbdLUN6rlQFQ9I9RGYr2Xfk5Wl2BCbPXfS29p_4VZicmPv50ytaaqeL86ACNLJEiZNf05tZeSuiJaaVRe1KbVC0y0nfHNya__TJqGcdNm7SRXYw3nMvrOqOl61p6id_ENx1mAEGmnbT6_hhlZ7ynVIOgABC5RkYBBJMjVH0NjlzzJerkB8mLiVyg06_VsshC5CGlbMWPw'
        },
        {
            name: 'Sofia Chen',
            role: 'Art Director',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBz7E-uEhOaxjZvHIhDYHjT73EMfjJeUR-0A4HFuG7qeLoqh9uUSmZNTyZ-XpSGoEO3be_fW7dNrIQ3RTy3UnWj1u39sMpN7EpKe8fqwkm_daH0I_HBg8fA4exqqLf9evTaRAkItJyF0V6Ou_IVceEX6M_xN7LXQsDyDMu3aVdmgTTBPyJymF93Er0nl7bMZq1QdTs39FXLOKeaiD0e7h5LBZvZ_D3danFk7gs9uXuW0-9b7bfMVDU5kb1rTnRO8_mkuEU6sUO58mY'
        },
        {
            name: 'Leo Rossi',
            role: 'Cinematographer',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqQFiGc9resFw-aBaib-QDZS-nNq2y1rr3LE48vamIX-v4l641HrBsHO2zXOfMRy8pDNPavH1G23dWj577sE7FJmOnCpcPTQB6Y2LvUM6RWUUtEJ1QnOtSNLZ8Ala8zlUXgnUX2YgLWa5GmwK0C1C5S-RlLPUfEjWXcdBvCtTeWLxmvLl75pWo5OZ7ZPPQ3uYuqUgrry2JDigyQFn4A8rThmCt44kHmMZKO9NRhK3K9-dm-kmYKLEFQkPyCmdKmaYvwIUeO8V0gh4'
        },
        {
            name: 'Aria Vossen',
            role: 'Executive Producer',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPysTGgsRzqoiD6kqaWpUdlukWmbzetvTI6D3kYrIe-9NNjW6d0xwAnZw0i03Kshvf6aR8uml3a5rI0_vt-j8BWBfQ210QmZ6fkfw4tOdwcanPrsOK0vxUqjSiGfV95MNE7xCm2qEfbq4VOdriIVW6re5VUKxkcnlDdcVk2ipm8OsXzpsfgHRvqD0QAx-q-el4HAEXsUvK7FPnloShP25ag55Gg57Z--wZf5dlYh9X3l-Nb8-H8q8fEo6gwyto4qsTgwhFGkl8Hsw'
        }
    ];

    return (
        <div className="flex flex-col items-center pt-24">
            <div className="max-w-[1200px] w-full px-6 md:px-10 py-16 md:py-24">
                {/* Header Section */}
                <div className="flex flex-col gap-6 mb-20 max-w-3xl">
                    <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight tracking-tight text-white">
                        The Collective Vision
                    </h1>
                    <div className="h-1 w-24 bg-[#f2b90d] rounded-full"></div>
                    <p className="text-slate-400 text-lg md:text-xl font-normal leading-relaxed">
                        A curated group of visionaries dedicated to the art of high-fashion photography and visual storytelling.
                        At Mado Creatives, we blend raw emotion with sophisticated aesthetics to redefine modern elegance.
                    </p>
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-slate-800">
                            <img
                                className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                                alt={`Portrait of ${member.name}, ${member.role}`}
                                src={member.image}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#221e10]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                                <p className="text-[#f2b90d] font-display text-2xl font-bold">{member.name}</p>
                                <p className="text-slate-300 text-sm tracking-widest uppercase mt-1">{member.role}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="mt-32 text-center py-20 border-t border-slate-800">
                    <h3 className="text-white font-display text-4xl font-bold mb-4">Have a project in mind?</h3>
                    <p className="text-slate-400 text-lg mb-10">Let&apos;s create something extraordinary together.</p>
                    <a
                        href="/contact"
                        className="inline-block bg-[#f2b90d] text-[#0a0a08] px-12 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform active:scale-95"
                    >
                        Get in Touch
                    </a>
                </div>
            </div>
        </div>
    );
}
