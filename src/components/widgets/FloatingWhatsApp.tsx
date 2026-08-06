import { MessageCircle } from 'lucide-react';
import type { WhatsAppConfig } from '@/types';

export function FloatingWhatsApp({ config }: { config: WhatsAppConfig }) {
  if (!config.enabled) return null;
  const href = `https://wa.me/${config.phone}?text=${encodeURIComponent(config.message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition hover:scale-110"
      style={{ backgroundColor: '#25D366' }}
      aria-label="Contact via WhatsApp"
    >
      <MessageCircle className="h-7 w-7 text-white" />
    </a>
  );
}
