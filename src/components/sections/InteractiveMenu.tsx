import { useState } from 'react';
import type { SiteConfig, Product } from '@/types';
import { ProductModal } from './ProductModal';

const ICON_MAP: Record<string, string> = {
  Pizza: '🍕',
  Star: '⭐',
  Utensils: '🍴',
  Soup: '🍲',
  Cake: '🍰',
  Wine: '🍷',
  Flame: '🔥',
  Leaf: '🌿',
  Clock: '⏰',
  Users: '👥',
  Heart: '❤️',
};

export function InteractiveMenu({ config }: { config: SiteConfig }) {
  const products = config.products;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (!products || !config.sections.find(s => s.id === 'products')?.enabled) {
    return null;
  }

  const filteredProducts = selectedCategory
    ? products.products.filter(p => p.categoryId === selectedCategory)
    : products.products;

  const selectedCat = products.categories.find(c => c.id === selectedCategory);

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
            {products.heading}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            {products.subheading}
          </p>
        </div>

        {/* Category Buttons */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
              selectedCategory === null
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tutti
          </button>
          {products.categories.map((category) => {
            const icon = ICON_MAP[category.icon] || '📋';
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{icon}</span>
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Category Description */}
        {selectedCat && (
          <div className="mb-8 text-center">
            <p className="text-base text-slate-600">{selectedCat.description}</p>
          </div>
        )}

        {/* Products Grid */}
        <div className={`grid grid-cols-1 gap-6 ${
          products.columns === 2 ? 'sm:grid-cols-2' :
          products.columns === 3 ? 'sm:grid-cols-3' :
          'sm:grid-cols-4'
        }`}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white p-6 transition hover:shadow-lg"
            >
              {product.imageUrl && (
                <img src={product.imageUrl} alt={product.name} className="mb-4 h-48 w-full rounded-lg object-cover" />
              )}
              <div className="mb-2 flex items-start justify-between">
                <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
                {product.badge && (
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {product.badge}
                  </span>
                )}
              </div>
              <p className="mb-4 text-sm text-slate-600">{product.description}</p>
              
              {/* Features */}
              {product.features && product.features.length > 0 && (
                <ul className="mb-4 space-y-1">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="text-blue-600">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-slate-900">{product.price}</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  {product.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No products message */}
        {filteredProducts.length === 0 && (
          <div className="py-12 text-center text-slate-500">
            Nessun prodotto in questa categoria.
          </div>
        )}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
