import { getIcon } from '@/lib/icons';
import type { FeaturesConfig } from '@/types';

export function Features({ config }: { config: FeaturesConfig }) {
  const cols = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-2 lg:grid-cols-4' };
  const Icon = getIcon;

  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-extrabold sm:text-4xl" style={{ color: 'var(--color-text)' }}>
          {config.heading}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-lg" style={{ color: 'var(--color-muted)' }}>
          {config.subheading}
        </p>
      </div>

      <div className={`grid grid-cols-1 gap-6 ${cols[config.columns]}`}>
        {config.cards.map((card) => {
          const I = Icon(card.icon);
          return (
            <div
              key={card.id}
              className="group rounded-2xl border p-6 transition hover:-translate-y-1"
              style={{
                backgroundColor: 'var(--color-card)',
                borderColor: 'var(--color-border)',
                borderRadius: 'var(--radius-main)',
                boxShadow: 'var(--shadow-main)',
              }}
            >
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition group-hover:scale-110"
                style={{ backgroundColor: 'var(--color-primary)' + '15' }}
              >
                <I className="h-6 w-6" style={{ color: 'var(--color-primary)' }} />
              </div>
              {card.badge && (
                <span
                  className="mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{
                    backgroundColor: 'var(--color-accent)' + '20',
                    color: 'var(--color-accent)',
                  }}
                >
                  {card.badge}
                </span>
              )}
              <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                {card.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
