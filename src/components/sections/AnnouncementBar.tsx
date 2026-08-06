import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { AnnouncementConfig } from '@/types';

export function AnnouncementBar({ config }: { config: AnnouncementConfig }) {
  const [dismissed, setDismissed] = useState(false);
  const key = `ann-dismissed-${config.text.slice(0, 20)}`;

  useEffect(() => {
    setDismissed(sessionStorage.getItem(key) === '1');
  }, [key]);

  if (dismissed) return null;

  return (
    <div
      className="relative z-40 px-4 py-2.5 text-center text-sm font-medium"
      style={{ backgroundColor: config.bg, color: config.fg }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
        <span>{config.text}</span>
        {config.linkText && (
          <a
            href={config.linkHref}
            className="underline underline-offset-2 hover:opacity-80"
            style={{ color: config.fg }}
          >
            {config.linkText}
          </a>
        )}
        <button
          onClick={() => {
            sessionStorage.setItem(key, '1');
            setDismissed(true);
          }}
          className="absolute right-4 rounded-full p-1 hover:bg-white/20"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
