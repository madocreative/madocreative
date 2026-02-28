import type { Metadata } from 'next';
import { Be_Vietnam_Pro, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HideOnAdmin from '@/components/HideOnAdmin';
import LenisProvider from '@/components/LenisProvider';

/* Be Vietnam Pro — clean modern sans, same as Legacy Studio */
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

/* Cormorant Garamond — elegant serif for headings/display */
const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mado Creatives | Luxury Visual Storytelling',
  description: 'An independent creative studio based in Paris, serving luxury brands worldwide with premium imagery and creative direction.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" />
      </head>
      <body
        className={`${beVietnamPro.variable} ${cormorantGaramond.variable} antialiased bg-[#0a0a08] text-[#f0ede6] min-h-screen flex flex-col font-sans`}
      >
        <LenisProvider>
          {/* White page border frame — Legacy Studio style */}
          <HideOnAdmin>
            <div className="fixed inset-0 border-[12px] md:border-[18px] border-white z-[9999] pointer-events-none" aria-hidden="true" />
          </HideOnAdmin>
          <HideOnAdmin>
            <Header />
          </HideOnAdmin>
          <main className="flex-1">
            {children}
          </main>
          <HideOnAdmin>
            <Footer />
          </HideOnAdmin>
        </LenisProvider>
      </body>
    </html>
  );
}
