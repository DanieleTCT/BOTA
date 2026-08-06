import { Clock } from 'lucide-react';
import type { OrariConfig } from '@/types';

export function Orari({ config }: { config: OrariConfig }) {
  return (
    <section id="orari" className="px-4 py-20 lg:px-8" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
            style={{ backgroundColor: 'var(--color-primary)' + '15' }}
          >
            <Clock className="h-7 w-7" style={{ color: 'var(--color-primary)' }} />
          </div>
          <h2 className="text-3xl font-extrabold sm:text-4xl" style={{ color: 'var(--color-text)' }}>
            {config.heading}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg" style={{ color: 'var(--color-muted)' }}>
            {config.subheading}
          </p>
        </div>

        <div
          className="overflow-hidden rounded-2xl"
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: 'var(--radius-main)',
            boxShadow: 'var(--shadow-main)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div className="grid grid-cols-1 divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0" style={{ borderColor: 'var(--color-border)' }}>
            {config.items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between px-6 py-4 ${
                  item.closed ? 'opacity-50' : ''
                }`}
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="font-semibold" style={{ color: 'var(--color-text)' }}>
                  {item.day}
                </div>
                <div className="text-right">
                  {item.closed ? (
                    <span className="text-sm font-medium" style={{ color: 'var(--color-muted)' }}>
                      Chiuso
                    </span>
                  ) : (
                    <div className="text-sm">
                      {item.lunch !== 'Chiuso' && (
                        <div style={{ color: 'var(--color-muted)' }}>
                          Pranzo: <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>{item.lunch}</span>
                        </div>
                      )}
                      {item.dinner !== 'Chiuso' && (
                        <div style={{ color: 'var(--color-muted)' }}>
                          Cena: <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>{item.dinner}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {config.note && (
          <p className="mt-6 text-center text-sm italic" style={{ color: 'var(--color-muted)' }}>
            {config.note}
          </p>
        )}
      </div>
    </section>
  );
}