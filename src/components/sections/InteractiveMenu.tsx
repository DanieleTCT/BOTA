import { useState } from 'react';
import type { SiteConfig, Product } from '@/types';
import { ProductModal } from './ProductModal';
import { ChevronLeft, ChevronRight, BookOpen, Sun, Moon } from 'lucide-react';

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
  const [selectedMeal, setSelectedMeal] = useState<'lunch' | 'dinner'>('lunch');

  if (!products || !config.sections.find(s => s.id === 'products')?.enabled) {
    return null;
  }

  const itemsPerPage = 3;
  const totalPages = Math.ceil(products.categories.length / itemsPerPage);
  const currentCategories = products.categories.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Filter products by meal type
  const mealFilteredProducts = selectedMeal === 'lunch'
    ? products.products.filter(p => p.meal === 'lunch' || p.meal === 'both')
    : products.products.filter(p => p.meal === 'dinner' || p.meal === 'both');

  const filteredProducts = selectedCategory
    ? mealFilteredProducts.filter(p => p.categoryId === selectedCategory)
    : mealFilteredProducts;

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

        {/* Meal Toggle */}
        <div className="mb-10 flex items-center justify-center gap-4">
          <button
            onClick={() => {
              setSelectedMeal('lunch');
              setCurrentPage(0);
              setSelectedCategory(null);
            }}
            className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition ${
              selectedMeal === 'lunch'
                ? 'bg-amber-500 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Sun className="h-5 w-5" />
            Menu Pranzo
          </button>
          <button
            onClick={() => {
              setSelectedMeal('dinner');
              setCurrentPage(0);
              setSelectedCategory(null);
            }}
            className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition ${
              selectedMeal === 'dinner'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Moon className="h-5 w-5" />
            Menu Cena
          </button>
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

        {/* Products List - Compact List */}
        <div className="mx-auto max-w-4xl space-y-2">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex items-center gap-4 p-4">
                {/* Price Badge */}
                <div className="shrink-0 rounded-lg bg-blue-50 px-4 py-2 text-center">
                  <div className="text-lg font-bold text-blue-600">{product.price}</div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-base text-slate-900 truncate">{product.name}</h3>
                    {product.badge && (
                      <span className="shrink-0 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-1">{product.description}</p>
                </div>

                {/* Features */}
                {product.features && product.features.length > 0 && (
                  <div className="hidden md:flex flex-wrap gap-1.5">
                    {product.features.slice(0, 2).map((feature, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}

                {/* Arrow */}
                <div className="shrink-0 text-slate-400 group-hover:text-blue-600 transition">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
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