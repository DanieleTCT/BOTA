import { getIcon } from '@/lib/icons';
import type { FooterConfig } from '@/types';

export function Footer({ config }: { config: FooterConfig }) {
  return (
    <footer
      className="px-4 py-14 lg:px-8"
      style={{ backgroundColor: 'var(--color-card)', borderTop: '1px solid var(--color-border)' }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-xl font-extrabold" style={{ color: 'var(--color-primary)' }}>
              {config.logoText}
            </div>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>
              {config.description}
            </p>
            <div className="mt-4 flex gap-3">
              {config.socials.map((s) => {
                const Icon = getIcon(s.icon);
                return (
                  <a
                    key={s.id}
                    href={s.href}
                    className="flex h-9 w-9 items-center justify-center rounded-full transition hover:scale-110"
                    style={{ backgroundColor: 'var(--color-primary)' + '15' }}
                  >
                    <Icon className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
                  </a>
                );
              })}
            </div>
          </div>

          {config.columns.map((col) => (
            <div key={col.id}>
              <h4 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--color-text)' }}>
                {col.title}
              </h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      className="text-sm transition hover:opacity-70"
                      style={{ color: 'var(--color-muted)' }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row" style={{ borderColor: 'var(--color-border)' }}>
          <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
            {config.copyright}
          </p>
          {config.showLegalDisclaimer && config.legalText && (
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
              {config.legalText}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
