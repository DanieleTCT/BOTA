import { ArrowRight } from 'lucide-react';
import type { HeroConfig } from '@/types';

export function Hero({ config }: { config: HeroConfig }) {
  const bgStyle =
    config.bgType === 'gradient'
      ? { background: `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})` }
      : {
          backgroundImage: `url(${config.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };

  const overlay =
    config.bgType === 'image'
      ? `rgba(0,0,0,${config.overlayOpacity / 100})`
      : 'transparent';

  return (
    <section className="relative overflow-hidden" style={bgStyle}>
      {config.bgType === 'image' && (
        <div className="absolute inset-0" style={{ backgroundColor: overlay }} />
      )}
      <div className="relative mx-auto max-w-7xl px-4 py-24 text-center lg:px-8 lg:py-32">
        {config.badge && (
          <span className="animate-fade-in-up mb-6 inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
            {config.badge}
          </span>
        )}
        <h1 className="animate-fade-in-up text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
          {config.title}
        </h1>
        <p className="animate-fade-in-up mx-auto mt-6 max-w-2xl text-lg text-white/90 lg:text-xl">
          {config.subtitle}
        </p>
        <div className="animate-fade-in-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {config.primaryCtaText && (
            <a
              href={config.primaryCtaHref}
              className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold shadow-lg transition hover:scale-105"
              style={{ color: config.gradientFrom }}
            >
              {config.primaryCtaText}
              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
            </a>
          )}
          {config.secondaryCtaText && (
            <a
              href={config.secondaryCtaHref}
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/60 px-8 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
            >
              {config.secondaryCtaText}
            </a>
          )}
        </div>
      </div>
      {config.bgType === 'gradient' && (
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[var(--color-bg)]" />
      )}
    </section>
  );
}
