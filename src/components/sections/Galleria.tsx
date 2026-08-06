import { Camera } from 'lucide-react';
import type { GalleryConfig } from '@/types';

export function Galleria({ config }: { config: GalleryConfig }) {
  return (
    <section id="galleria" className="px-4 py-20 lg:px-8" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
            style={{ backgroundColor: 'var(--color-primary)' + '15' }}
          >
            <Camera className="h-7 w-7" style={{ color: 'var(--color-primary)' }} />
          </div>
          <h2 className="text-3xl font-extrabold sm:text-4xl" style={{ color: 'var(--color-text)' }}>
            {config.heading}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg" style={{ color: 'var(--color-muted)' }}>
            {config.subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {config.images.map((img) => (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-2xl"
              style={{
                borderRadius: 'var(--radius-main)',
                boxShadow: 'var(--shadow-main)',
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="h-64 w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 right-0 translate-y-4 p-4 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-sm font-semibold text-white">{img.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}