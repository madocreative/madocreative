export const DEFAULT_WHATSAPP_NUMBER = '+1 (870) 417-1007';

export function normalizeWhatsAppNumber(value: string | undefined | null): string {
  return String(value || '').replace(/[^\d]/g, '');
}

export function buildWhatsAppChatUrl(
  number?: string | null,
  message?: string,
  fallbackUrl?: string | null,
): string {
  const normalized = normalizeWhatsAppNumber(number);

  if (normalized) {
    const baseUrl = `https://wa.me/${normalized}`;
    return message && message.trim().length > 0
      ? `${baseUrl}?text=${encodeURIComponent(message)}`
      : baseUrl;
  }

  const fallback = String(fallbackUrl || '').trim();
  return fallback || '#';
}
