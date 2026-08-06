import type { SiteConfig } from '@/types';

export function ProductsSection({ config }: { config: SiteConfig }) {
  const products = config.products;
  
  if (!products || !config.sections.find(s => s.id === 'products')?.enabled) {
    return null;
  }

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
            {products.heading}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            {products.subheading}
          </p>
        </div>

        <div className={`grid grid-cols-1 gap-6 sm:grid-cols-${products.columns}`}>
          {products.products.map((product) => (
            <div key={product.id} className="rounded-xl border border-slate-200 bg-white p-6">
              {product.imageUrl && (
                <img src={product.imageUrl} alt={product.name} className="mb-4 h-48 w-full rounded-lg object-cover" />
              )}
              <h3 className="mb-2 text-lg font-bold">{product.name}</h3>
              <p className="mb-4 text-sm text-slate-600">{product.description}</p>
              <div className="text-xl font-bold">{product.price}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}