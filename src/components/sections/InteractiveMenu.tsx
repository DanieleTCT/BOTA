import { useState } from 'react';
import type { SiteConfig, Product, DayOfWeek } from '@/types';
import { ProductModal } from './ProductModal';
import { Sun, Moon } from 'lucide-react';

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
  const [selectedMeal, setSelectedMeal] = useState<'lunch' | 'dinner'>('lunch');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (!products || !config.sections.find(s => s.id === 'products')?.enabled) {
    return null;
  }

  // Get lunch products (for weekly calendar)
  const lunchProducts = products.products.filter(p => p.meal === 'lunch' || p.meal === 'both');
  
  // Get dinner products (alla carta)
  const dinnerProducts = products.products.filter(p => p.meal === 'dinner' || p.meal === 'both');

  const daysOfWeek: { id: DayOfWeek; label: string; short: string }[] = [
    { id: 'monday', label: 'Lunedì', short: 'Lun' },
    { id: 'tuesday', label: 'Martedì', short: 'Mar' },
    { id: 'wednesday', label: 'Mercoledì', short: 'Mer' },
    { id: 'thursday', label: 'Giovedì', short: 'Gio' },
    { id: 'friday', label: 'Venerdì', short: 'Ven' },
    { id: 'saturday', label: 'Sabato', short: 'Sab' },
    { id: 'sunday', label: 'Domenica', short: 'Dom' },
  ];

  // Group lunch products by day and dish type
  const getLunchProductsForDay = (day: DayOfWeek) => {
    const dayProducts = lunchProducts.filter(p => !p.availableDays || p.availableDays.includes(day));
    const groups: Record<string, Product[]> = {};
    const dishTypesOrder = ['antipasto', 'primo', 'secondo', 'contorno', 'dolce', 'bevanda', 'pizza', 'altro'];
    
    dishTypesOrder.forEach(type => {
      groups[type] = [];
    });
    
    dayProducts.forEach(product => {
      if (groups[product.dishType]) {
        groups[product.dishType].push(product);
      }
    });
    
    return groups;
  };

  // Group dinner products by category
  const dinnerByCategory = products.categories.map(category => ({
    category,
    products: dinnerProducts.filter(p => p.categoryId === category.id)
  })).filter(group => group.products.length > 0);

  const dishTypesLabels: Record<string, string> = {
    antipasto: 'Antipasto',
    primo: 'Primo',
    secondo: 'Secondo',
    contorno: 'Contorno',
    dolce: 'Dolce',
    bevanda: 'Bevanda',
    pizza: 'Pizza',
    altro: 'Altro'
  };

  const isDinner = selectedMeal === 'dinner';

  return (
    <section
      id="products"
      className={`py-16 md:py-24 transition-colors duration-500 ${
        isDinner
          ? 'bg-gradient-to-b from-slate-900 to-slate-800'
          : 'bg-gradient-to-b from-slate-50 to-white'
      }`}
      style={
        isDinner
          ? {
              '--color-text': '#f1f5f9',
              '--color-muted': '#94a3b8',
              '--color-card': '#1e293b',
              '--color-border': '#334155',
              '--color-bg': '#0f172a',
            } as React.CSSProperties
          : undefined
      }
    >
      <div
        className="mx-auto max-w-7xl px-4 lg:px-8"
        style={
          isDinner
            ? {
                color: 'var(--color-text)',
              }
            : undefined
        }
      >
        {/* Header */}
        <div className="mb-12 text-center">
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
            style={
              isDinner
                ? { backgroundColor: '#1e293b', color: '#38bdf8' }
                : { backgroundColor: '#dbeafe', color: '#1d4ed8' }
            }
          >
            <span className="text-lg">🍽️</span>
            Menu Digitale
          </div>
          <h2
            className="mb-4 text-3xl font-bold md:text-4xl"
            style={{ color: isDinner ? '#f1f5f9' : '#0f172a' }}
          >
            {products.heading}
          </h2>
          <p
            className="mx-auto max-w-2xl text-lg"
            style={{ color: isDinner ? '#94a3b8' : '#475569' }}
          >
            {products.subheading}
          </p>
        </div>

        {/* Meal Toggle */}
        <div className="mb-10 flex items-center justify-center gap-4">
          <button
            onClick={() => setSelectedMeal('lunch')}
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
            onClick={() => setSelectedMeal('dinner')}
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

        {/* Lunch Section - Weekly Calendar */}
        {selectedMeal === 'lunch' && (
          <div className="mb-16">
            <div className="mb-8 text-center">
              <h3 className="text-2xl font-bold" style={{ color: isDinner ? '#f1f5f9' : '#1e293b' }}>Menu Pranzo - Settimana</h3>
              <p className="mt-2 text-sm" style={{ color: isDinner ? '#94a3b8' : '#64748b' }}>Ogni giorno il nostro chef seleziona i migliori piatti</p>
            </div>
            <div className="space-y-4">
              {daysOfWeek.map((day) => {
                const dayProducts = getLunchProductsForDay(day.id);
                const hasProducts = Object.values(dayProducts).some(dishes => dishes.length > 0);

                if (!hasProducts) return null;

                return (
                  <div
                    key={day.id}
                    className="rounded-xl border p-4"
                    style={
                      isDinner
                        ? { borderColor: '#334155', backgroundColor: '#1e293b' }
                        : { borderColor: '#e2e8f0', backgroundColor: '#ffffff' }
                    }
                  >
                    <div className="mb-3">
                      <div className="text-xs font-semibold" style={{ color: isDinner ? '#94a3b8' : '#64748b' }}>{day.short}</div>
                      <div className="text-sm font-bold" style={{ color: isDinner ? '#f1f5f9' : '#0f172a' }}>{day.label}</div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(dayProducts).map(([dishType, dishes]) => {
                        const dish = dishes[0]; // Show first dish of each type
                        if (!dish) return null;

                        return (
                          <div
                            key={dishType}
                            onClick={() => setSelectedProduct(dish)}
                            className="cursor-pointer rounded-lg border p-3 transition hover:shadow-sm min-w-[140px]"
                            style={
                              isDinner
                                ? { borderColor: '#475569', backgroundColor: '#0f172a', color: '#e2e8f0' }
                                : { borderColor: '#f1f5f9', backgroundColor: '#f8fafc', color: '#334155' }
                            }
                          >
                            <div className="font-semibold text-xs mb-1" style={{ color: isDinner ? '#94a3b8' : '#475569' }}>{dishTypesLabels[dishType] || dishType}</div>
                            <div className="text-sm" style={{ color: isDinner ? '#f1f5f9' : '#1e293b' }}>{dish.name}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dinner Section - À la carte menu */}
        {selectedMeal === 'dinner' && (
          <div className="mb-16">
            <div className="mb-8 text-center">
              <h3 className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>Menu Cena - Alla Carta</h3>
              <p className="mt-2 text-sm" style={{ color: '#94a3b8' }}>Tutti i nostri piatti della sera</p>
            </div>
            <div className="mx-auto max-w-4xl space-y-6">
              {dinnerByCategory.map(({ category, products: categoryProducts }) => (
                <div
                  key={category.id}
                  className="rounded-xl border p-6"
                  style={{ borderColor: '#334155', backgroundColor: '#1e293b' }}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-2xl" style={{ backgroundColor: '#0f172a' }}>
                      {ICON_MAP[category.icon] || '📋'}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold" style={{ color: '#f1f5f9' }}>{category.name}</h3>
                      <p className="text-sm" style={{ color: '#94a3b8' }}>{category.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {categoryProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className="group cursor-pointer overflow-hidden rounded-xl border transition p-4"
                        style={{
                          borderColor: '#334155',
                          backgroundColor: '#0f172a',
                          color: '#f1f5f9'
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="shrink-0 rounded-lg px-4 py-2 text-center" style={{ backgroundColor: '#1e293b' }}>
                            <div className="text-lg font-bold" style={{ color: '#38bdf8' }}>{product.price}</div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-base truncate" style={{ color: '#f1f5f9' }}>{product.name}</h3>
                              {product.badge && (
                                <span className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: '#1e293b', color: '#38bdf8' }}>
                                  {product.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-sm line-clamp-1" style={{ color: '#94a3b8' }}>{product.description}</p>
                          </div>
                          {product.features && product.features.length > 0 && (
                            <div className="hidden md:flex flex-wrap gap-1.5">
                              {product.features.slice(0, 2).map((feature, idx) => (
                                <span
                                  key={idx}
                                  className="rounded-full px-2 py-1 text-xs"
                                  style={{ backgroundColor: '#1e293b', color: '#cbd5e1' }}
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="shrink-0 transition" style={{ color: '#64748b' }}>
                            <svg className="h-5 w-5 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Modal */}
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            isDinner={isDinner}
          />
        )}
      </div>
    </section>
  );
}