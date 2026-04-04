'use client';

export default function WhatsAppButton({ number }: { number: string }) {
  if (!number) return null;

  const normalized = number.replace(/[^\d]/g, '');
  if (!normalized) return null;

  const href = `https://wa.me/${normalized}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-5 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-[0_4px_24px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_32px_rgba(37,211,102,0.6)] hover:-translate-y-1 transition-all duration-300"
      style={{ backgroundColor: '#25D366' }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="white"
        className="w-7 h-7"
        aria-hidden="true"
      >
        <path d="M16 .5C7.44.5.5 7.44.5 16c0 2.84.74 5.5 2.04 7.82L.5 31.5l7.87-2.06A15.44 15.44 0 0016 31.5C24.56 31.5 31.5 24.56 31.5 16S24.56.5 16 .5zm0 28.26a13.7 13.7 0 01-7-1.92l-.5-.3-5.17 1.36 1.38-5.04-.33-.52A13.74 13.74 0 1116 28.76zm7.54-10.28c-.41-.2-2.44-1.2-2.82-1.34-.38-.14-.65-.2-.92.2s-1.06 1.34-1.3 1.62c-.24.27-.47.3-.88.1a11.16 11.16 0 01-3.28-2.03 12.3 12.3 0 01-2.27-2.83c-.24-.41 0-.63.18-.84.17-.18.41-.47.62-.7.2-.24.27-.41.41-.68.14-.27.07-.5-.03-.7-.1-.2-.92-2.22-1.26-3.04-.33-.8-.67-.69-.92-.7h-.78c-.27 0-.7.1-1.07.5-.37.4-1.4 1.37-1.4 3.33s1.43 3.86 1.63 4.13c.2.27 2.82 4.3 6.83 6.03a23 23 0 002.28.84c.96.3 1.83.26 2.52.16.77-.12 2.44-1 2.79-1.96.34-.96.34-1.78.24-1.96-.1-.18-.37-.27-.78-.47z"/>
      </svg>
    </a>
  );
}
