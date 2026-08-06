import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import type { FaqConfig } from '@/types';

export function Faq({ config }: { config: FaqConfig }) {
  const [open, setOpen] = useState<string | null>(null);
  const categories = [...new Set(config.items.map((i) => i.category))];

  return (
    <section id="faq" className="px-4 py-20 lg:px-8" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl" style={{ color: 'var(--color-text)' }}>
            {config.heading}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg" style={{ color: 'var(--color-muted)' }}>
            {config.subheading}
          </p>
        </div>

        {categories.map((cat) => (
          <div key={cat} className="mb-8">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
              {cat}
            </h3>
            <div className="space-y-3">
              {config.items
                .filter((i) => i.category === cat)
                .map((item) => {
                  const isOpen = open === item.id;
                  return (
                    <div
                      key={item.id}
                      className="overflow-hidden"
                      style={{
                        backgroundColor: 'var(--color-card)',
                        borderRadius: 'var(--radius-main)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <button
                        onClick={() => setOpen(isOpen ? null : item.id)}
                        className="flex w-full items-center justify-between px-5 py-4 text-left"
                      >
                        <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                          {item.question}
                        </span>
                        {isOpen ? (
                          <Minus className="h-5 w-5 shrink-0" style={{ color: 'var(--color-primary)' }} />
                        ) : (
                          <Plus className="h-5 w-5 shrink-0" style={{ color: 'var(--color-primary)' }} />
                        )}
                      </button>
                      <div
                        className="grid transition-all duration-300"
                        style={{
                          gridTemplateRows: isOpen ? '1fr' : '0fr',
                        }}
                      >
                        <div className="overflow-hidden">
                          <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
