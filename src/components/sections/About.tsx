import { useEffect, useRef, useState } from 'react';
import type { AboutConfig } from '@/types';

export function About({ config }: { config: AboutConfig }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.3 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" ref={ref} className="px-4 py-20 lg:px-8" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div className={visible ? 'animate-fade-in-up' : 'opacity-0'}>
          <h2 className="text-3xl font-extrabold sm:text-4xl" style={{ color: 'var(--color-text)' }}>
            {config.heading}
          </h2>
          <p className="mt-4 text-lg leading-relaxed" style={{ color: 'var(--color-muted)' }}>
            {config.body}
          </p>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {config.stats.map((stat) => (
              <div key={stat.id}>
                <div className="text-3xl font-extrabold" style={{ color: 'var(--color-primary)' }}>
                  {stat.value}
                </div>
                <div className="mt-1 text-sm font-medium" style={{ color: 'var(--color-muted)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={visible ? 'animate-fade-in' : 'opacity-0'}>
          {config.imageUrl ? (
            <div
              className="overflow-hidden"
              style={{ borderRadius: 'var(--radius-main)', boxShadow: 'var(--shadow-main)' }}
            >
              <img
                src={config.imageUrl}
                alt={config.imageAlt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          ) : (
            <div
              className="flex aspect-video items-center justify-center text-slate-400"
              style={{
                borderRadius: 'var(--radius-main)',
                backgroundColor: 'var(--color-card)',
                border: `2px dashed var(--color-border)`,
              }}
            >
              Image placeholder
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
