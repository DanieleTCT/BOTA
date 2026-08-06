import { useEffect, useState } from 'react';
import type { CookieConfig } from '@/types';
import { COOKIE_KEY } from '@/defaults';

export function CookieBanner({ config }: { config: CookieConfig }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!config.enabled) return;
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      setVisible(true);
    }
  }, [config.enabled]);

  if (!visible || !config.enabled) return null;

  const decide = (choice: 'accepted' | 'declined') => {
    localStorage.setItem(COOKIE_KEY, choice);
    setVisible(false);
  };

  return (
    <div className="animate-fade-in-up fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-2xl rounded-2xl border p-5 shadow-xl sm:left-auto sm:right-6 sm:max-w-md"
      style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}
    >
      <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
        {config.message}
      </p>
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => decide('accepted')}
          className="flex-1 rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          {config.acceptText}
        </button>
        <button
          onClick={() => decide('declined')}
          className="flex-1 rounded-full border-2 px-4 py-2 text-sm font-semibold transition hover:bg-slate-50"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}
        >
          {config.declineText}
        </button>
      </div>
    </div>
  );
}
