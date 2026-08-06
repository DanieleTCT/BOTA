import { useState, type FormEvent } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import type { ContactConfig } from '@/types';
import { saveSubmission } from '@/lib/submissions';
import { useToast } from '@/hooks/useToast';

export function ContactForm({ config }: { config: ContactConfig }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { notify } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await saveSubmission(values);
    setSubmitting(false);
    if (result.ok) {
      setSubmitted(true);
      notify('Form submitted successfully!', 'success');
      setValues({});
      setTimeout(() => setSubmitted(false), 5000);
    } else {
      notify('Failed to submit form. Please try again.', 'error');
    }
  };

  return (
    <section id="contact" className="px-4 py-20 lg:px-8" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl" style={{ color: 'var(--color-text)' }}>
            {config.heading}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-lg" style={{ color: 'var(--color-muted)' }}>
            {config.subheading}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-8"
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: 'var(--radius-main)',
            boxShadow: 'var(--shadow-main)',
            border: '1px solid var(--color-border)',
          }}
        >
          {config.fields.map((field) => (
            <div key={field.id}>
              <label className="mb-1.5 block text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                {field.label}
                {field.required && <span style={{ color: 'var(--color-primary)' }}> *</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  required={field.required}
                  placeholder={field.placeholder}
                  value={values[field.id] ?? ''}
                  onChange={(e) => setValues({ ...values, [field.id]: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 text-sm outline-none transition focus:ring-2"
                  style={{
                    borderRadius: 'var(--radius-main)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg)',
                    color: 'var(--color-text)',
                  }}
                />
              ) : field.type === 'select' ? (
                <select
                  required={field.required}
                  value={values[field.id] ?? ''}
                  onChange={(e) => setValues({ ...values, [field.id]: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm outline-none transition focus:ring-2"
                  style={{
                    borderRadius: 'var(--radius-main)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg)',
                    color: 'var(--color-text)',
                  }}
                >
                  <option value="">{field.placeholder}</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type === 'phone' ? 'tel' : field.type}
                  required={field.required}
                  placeholder={field.placeholder}
                  value={values[field.id] ?? ''}
                  onChange={(e) => setValues({ ...values, [field.id]: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm outline-none transition focus:ring-2"
                  style={{
                    borderRadius: 'var(--radius-main)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg)',
                    color: 'var(--color-text)',
                  }}
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting || submitted}
            className="flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {submitted ? (
              <>
                <CheckCircle2 className="h-5 w-5" />
                Sent!
              </>
            ) : submitting ? (
              'Sending...'
            ) : (
              <>
                <Send className="h-5 w-5" />
                {config.buttonText}
              </>
            )}
          </button>

          {submitted && (
            <p className="text-center text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
              {config.successMessage}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
