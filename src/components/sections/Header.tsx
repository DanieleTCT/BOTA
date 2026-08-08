import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { HeaderConfig } from '@/types';

export function Header({ config }: { config: HeaderConfig }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!config.sticky) return;
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [config.sticky]);

  return (
    <header
      className={`z-30 w-full transition-all duration-300 ${
        config.sticky ? 'sticky top-0' : ''
      } ${
        scrolled
          ? 'bg-[var(--color-bg)]/90 shadow-sm backdrop-blur-md'
          : 'bg-[var(--color-bg)]'
      }`}
      style={{ borderBottom: scrolled ? `1px solid var(--color-border)` : 'none' }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <a href="#" className="flex items-center gap-2">
          {config.logoUrl ? (
            <img src={config.logoUrl} alt={config.logoText} className="h-10 w-auto object-contain" />
          ) : (
            <span className="text-xl font-extrabold tracking-tight" style={{ color: 'var(--color-primary)' }}>
              {config.logoText}
            </span>
          )}
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {config.links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="text-sm font-medium transition hover:opacity-70"
              style={{ color: 'var(--color-text)' }}
            >
              {link.label}
            </a>
          ))}
          {config.ctaText && (
            <a
              href={config.ctaHref}
              className="rounded-full px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              {config.ctaText}
            </a>
          )}
        </nav>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t md:hidden" style={{ borderColor: 'var(--color-border)' }}>
          <nav className="flex flex-col gap-1 px-4 py-4">
            {config.links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100"
                style={{ color: 'var(--color-text)' }}
              >
                {link.label}
              </a>
            ))}
            {config.ctaText && (
              <a
                href={config.ctaHref}
                onClick={() => setMobileOpen(false)}
                className="mt-2 rounded-full px-5 py-2 text-center text-sm font-semibold text-white"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {config.ctaText}
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
