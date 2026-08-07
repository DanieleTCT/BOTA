import { useState } from 'react';
import type { SiteConfig, Product } from '@/types';
import { ProductModal } from './ProductModal';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

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
  Fish: '🐟',
  Beef: '🥩',
  Carrot: '🥕',
};

export function InteractiveMenu({ config }: { config: SiteConfig }) {
  const products = config.products;
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (!products || !config.sections.find(s => s.id === 'products')?.enabled) {
    return null;
  }

  const itemsPerPage = 3;
  const totalPages = Math.ceil(products.categories.length / itemsPerPage);
  const currentCategories = products.categories.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const filteredProducts = selectedCategory
    ? products.products.filter(p => p.categoryId === selectedCategory)
    : products.products;

  const selectedCat = products.categories.find(c => c.id === selectedCategory);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            <BookOpen className="h-4 w-4" />
            Menu Digitale
          </div>
          <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
            {products.heading}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            {products.subheading}
          </p>
        </div>

        {/* Menu Book Navigation */}
        <div className="mb-12">
          {/* Page Navigation */}
          <div className="mb-6 flex items-center justify-center gap-4">
            <button
              onClick={() => {
                setCurrentPage(p => Math.max(0, p - 1));
                setSelectedCategory(null);
              }}
              disabled={currentPage === 0}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Precedente
            </button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentPage(idx);
                    setSelectedCategory(null);
                  }}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    currentPage === idx ? 'bg-blue-600 w-8' : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => {
                setCurrentPage(p => Math.min(totalPages - 1, p + 1));
                setSelectedCategory(null);
              }}
              disabled={currentPage === totalPages - 1}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Successiva
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Category Buttons - Current Page */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`rounded-xl px-6 py-3 text-sm font-semibold transition ${
                selectedCategory === null
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              📋 Tutti i Piatti
            </button>
            {currentCategories.map((category) => {
              const icon = ICON_MAP[category.icon] || '📋';
              const count = products.products.filter(p => p.categoryId === category.id).length;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span className="text-lg">{icon}</span>
                  <span>{category.name}</span>
                  <span className="text-xs opacity-75">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Description */}
        {selectedCat && (
          <div className="mb-8 rounded-xl border border-blue-100 bg-blue-50 p-4 text-center">
            <p className="text-base text-slate-700">{selectedCat.description}</p>
          </div>
        )}

        {/* Products List - Enhanced Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product, idx) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl hover:-translate-y-1"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden bg-slate-100">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover transition group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-6xl text-slate-300">
                    🍽️
                  </div>
                )}
                {product.badge && (
                  <span className="absolute right-3 top-3 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                    {product.badge}
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className="absolute bottom-3 left-3 right-3 translate-y-4 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="text-xs font-semibold text-white">Clicca per dettagli →</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h3 className="font-bold text-lg text-slate-900 leading-tight">{product.name}</h3>
                  <span className="shrink-0 text-xl font-bold text-blue-600">{product.price}</span>
                </div>
                <p className="mb-4 line-clamp-2 text-sm text-slate-600 leading-relaxed">{product.description}</p>

                {/* Features preview */}
                {product.features && product.features.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {product.features.slice(0, 3).map((feature, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-95"
                >
                  {product.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No products message */}
        {filteredProducts.length === 0 && (
          <div className="py-16 text-center text-slate-500">
            <div className="mb-3 text-5xl">🍽️</div>
            <p className="text-lg">Nessun piatto in questa categoria.</p>
            <p className="mt-1 text-sm">Seleziona un'altra categoria o esplora tutte le nostre specialità.</p>
          </div>
        )}

        {/* Page indicator */}
        <div className="mt-12 text-center text-sm text-slate-500">
          Pagina {currentPage + 1} di {totalPages} — {products.categories.length} categorie totali
        </div>
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