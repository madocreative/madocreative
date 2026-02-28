import type { Metadata } from 'next';
import { Be_Vietnam_Pro, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HideOnAdmin from '@/components/HideOnAdmin';
import LenisProvider from '@/components/LenisProvider';
import ScrollProgress from '@/components/ScrollProgress';
import { ThemeProvider } from '@/components/ThemeProvider';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mado Creatives | Luxury Visual Storytelling',
  description:
    'An independent creative studio based in Paris, serving luxury brands worldwide with premium imagery and creative direction.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                const key = 'mado-theme';
                const saved = localStorage.getItem(key);
                const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
                const theme = saved === 'light' || saved === 'dark' ? saved : (prefersLight ? 'light' : 'dark');
                document.documentElement.dataset.theme = theme;
                document.documentElement.classList.toggle('dark', theme === 'dark');
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${beVietnamPro.variable} ${cormorantGaramond.variable} antialiased min-h-screen flex flex-col font-sans bg-[var(--app-bg)] text-[var(--app-text)]`}
      >
        <ThemeProvider>
          <LenisProvider>
            <HideOnAdmin>
              <div
                className="fixed inset-0 border-[12px] md:border-[18px] border-[var(--frame-border)] z-[9999] pointer-events-none"
                aria-hidden="true"
              />
            </HideOnAdmin>
            <HideOnAdmin>
              <Header />
            </HideOnAdmin>
            <HideOnAdmin>
              <ScrollProgress />
            </HideOnAdmin>
            <main className="flex-1">{children}</main>
            <HideOnAdmin>
              <Footer />
            </HideOnAdmin>
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
