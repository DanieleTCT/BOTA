import { useEffect, useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import type { TestimonialsConfig } from '@/types';

export function Testimonials({ config }: { config: TestimonialsConfig }) {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % config.items.length);
  const prev = () => setCurrent((c) => (c - 1 + config.items.length) % config.items.length);

  useEffect(() => {
    if (config.layout !== 'carousel') return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [config.layout, config.items.length]);

  if (config.layout === 'grid') {
    return (
      <section className="px-4 py-20 lg:px-8" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl" style={{ color: 'var(--color-text)' }}>
              {config.heading}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-lg" style={{ color: 'var(--color-muted)' }}>
              {config.subheading}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {config.items.map((t) => (
              <TestimonialCard key={t.id} t={t} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const item = config.items[current];
  return (
    <section className="px-4 py-20 lg:px-8" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl" style={{ color: 'var(--color-text)' }}>
            {config.heading}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg" style={{ color: 'var(--color-muted)' }}>
            {config.subheading}
          </p>
        </div>
        {item && (
          <div className="relative">
            <TestimonialCard t={item} large />
            <div className="mt-8 flex items-center justify-center gap-4">
              <button onClick={prev} className="rounded-full p-2 transition hover:bg-slate-100" style={{ border: '1px solid var(--color-border)' }}>
                <ChevronLeft className="h-5 w-5" style={{ color: 'var(--color-text)' }} />
              </button>
              <div className="flex gap-2">
                {config.items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: i === current ? 24 : 8,
                      backgroundColor: i === current ? 'var(--color-primary)' : 'var(--color-border)',
                    }}
                  />
                ))}
              </div>
              <button onClick={next} className="rounded-full p-2 transition hover:bg-slate-100" style={{ border: '1px solid var(--color-border)' }}>
                <ChevronRight className="h-5 w-5" style={{ color: 'var(--color-text)' }} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function TestimonialCard({ t, large }: { t: TestimonialsConfig['items'][number]; large?: boolean }) {
  return (
    <div
      className="flex flex-col p-6"
      style={{
        backgroundColor: 'var(--color-card)',
        borderRadius: 'var(--radius-main)',
        boxShadow: 'var(--shadow-main)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div className="mb-3 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className="h-4 w-4"
            style={{ color: i < t.rating ? 'var(--color-accent)' : 'var(--color-border)' }}
            fill={i < t.rating ? 'var(--color-accent)' : 'var(--color-border)'}
          />
        ))}
      </div>
      <p className={`flex-1 leading-relaxed ${large ? 'text-lg' : 'text-sm'}`} style={{ color: 'var(--color-text)' }}>
        "{t.text}"
      </p>
      <div className="mt-4 flex items-center gap-3">
        {t.avatar ? (
          <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" loading="lazy" />
        ) : (
          <div className="h-10 w-10 rounded-full" style={{ backgroundColor: 'var(--color-primary)' + '30' }} />
        )}
        <div>
          <div className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
            {t.name}
          </div>
          <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
            {t.role}
          </div>
        </div>
      </div>
    </div>
  );
}
