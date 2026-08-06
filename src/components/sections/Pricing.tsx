import { useState } from 'react';
import { Check } from 'lucide-react';
import type { PricingConfig } from '@/types';

export function Pricing({ config }: { config: PricingConfig }) {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="px-4 py-20 lg:px-8" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl" style={{ color: 'var(--color-text)' }}>
            {config.heading}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg" style={{ color: 'var(--color-muted)' }}>
            {config.subheading}
          </p>
          <div className="mt-6 inline-flex items-center gap-3 rounded-full p-1" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <button
              onClick={() => setYearly(false)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${!yearly ? 'text-white' : ''}`}
              style={!yearly ? { backgroundColor: 'var(--color-primary)' } : { color: 'var(--color-muted)' }}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${yearly ? 'text-white' : ''}`}
              style={yearly ? { backgroundColor: 'var(--color-primary)' } : { color: 'var(--color-muted)' }}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {config.plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col p-8 transition hover:-translate-y-1 ${
                plan.popular ? 'ring-2' : 'border'
              }`}
              style={{
                backgroundColor: 'var(--color-card)',
                borderColor: 'var(--color-border)',
                borderRadius: 'var(--radius-main)',
                boxShadow: 'var(--shadow-main)',
                ...(plan.popular ? { ['--tw-ring-color' as string]: 'var(--color-primary)' } : {}),
              }}
            >
              {plan.popular && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold text-white"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  POPULAR
                </span>
              )}
              <h3 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                {plan.name}
              </h3>
              <p className="mt-1 text-sm" style={{ color: 'var(--color-muted)' }}>
                {plan.description}
              </p>
              <div className="mt-4">
                <span className="text-4xl font-extrabold" style={{ color: 'var(--color-text)' }}>
                  {yearly ? plan.yearlyPrice : plan.monthlyPrice}
                </span>
                <span className="text-sm" style={{ color: 'var(--color-muted)' }}>
                  {yearly ? '/year' : '/month'}
                </span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--color-text)' }}>
                    <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--color-primary)' }} />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={plan.buttonHref}
                className={`mt-8 rounded-full px-6 py-3 text-center text-sm font-semibold transition ${
                  plan.popular ? 'text-white hover:opacity-90' : 'border-2 hover:bg-slate-50'
                }`}
                style={
                  plan.popular
                    ? { backgroundColor: 'var(--color-primary)' }
                    : { borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }
                }
              >
                {plan.buttonText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
