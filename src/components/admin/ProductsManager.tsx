import { Plus, Trash2, GripVertical, BookOpen } from 'lucide-react';
import type { SiteConfig, Product, ProductsConfig, MenuCategory } from '@/types';
import type { AdminContext } from './AdminDashboard';

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

const DEFAULT_PRODUCTS: ProductsConfig = {
  heading: 'Il Nostro Menu',
  subheading: 'Pizze classiche, specialità della casa e prelibatezze del territorio',
  layout: 'grid',
  columns: 3,
  categories: [
    { id: 'cat1', name: 'Pizze Classiche', description: 'Le pizze tradizionali che hanno fatto la storia', icon: 'Pizza' },
    { id: 'cat2', name: 'Specialità della Casa', description: 'Le nostre creazioni esclusive', icon: 'Star' },
  ],
  products: [],
};

export function ProductsManager({ config, ctx }: { config: SiteConfig; ctx: AdminContext }) {
  const products: ProductsConfig = config.products || DEFAULT_PRODUCTS;

  const updateProducts = (updater: (p: ProductsConfig) => ProductsConfig) => {
    const newProducts = updater(products);
    ctx.update('products', newProducts);
  };

  const addCategory = () => {
    const newCat: MenuCategory = {
      id: `cat${Date.now()}`,
      name: 'Nuova Categoria',
      description: 'Descrizione della categoria',
      icon: 'Pizza',
    };
    updateProducts(p => ({ ...p, categories: [...p.categories, newCat] }));
  };

  const removeCategory = (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa categoria e tutti i suoi prodotti?')) return;
    updateProducts(p => ({
      ...p,
      categories: p.categories.filter(c => c.id !== id),
      products: p.products.filter(pr => pr.categoryId !== id)
    }));
  };

  const updateCategory = (id: string, updates: Partial<MenuCategory>) => {
    updateProducts(p => ({
      ...p,
      categories: p.categories.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
  };

  const addProduct = (categoryId?: string) => {
    const newProduct: Product = {
      id: `pr${Date.now()}`,
      name: 'Nuovo Prodotto',
      description: 'Descrizione del prodotto',
      price: '€0',
      imageUrl: '',
      badge: '',
      features: [],
      ingredients: '',
      allergens: '',
      buttonText: 'Ordina Ora',
      buttonHref: '#contact',
      categoryId: categoryId || products.categories[0]?.id || '',
      meal: 'both',
      dishType: 'altro',
    };
    updateProducts(p => ({ ...p, products: [...p.products, newProduct] }));
  };

  const removeProduct = (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo prodotto?')) return;
    updateProducts(p => ({
      ...p,
      products: p.products.filter((pr: Product) => pr.id !== id)
    }));
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    updateProducts(p => ({
      ...p,
      products: p.products.map((pr: Product) => pr.id === id ? { ...pr, ...updates } : pr)
    }));
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= products.categories.length) return;

    const newCategories = [...products.categories];
    [newCategories[index], newCategories[newIndex]] = [newCategories[newIndex], newCategories[index]];

    updateProducts(p => ({ ...p, categories: newCategories }));
  };

  const moveProduct = (productId: string, direction: 'up' | 'down') => {
    const currentIndex = products.products.findIndex(p => p.id === productId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= products.products.length) return;

    const newProducts = [...products.products];
    [newProducts[currentIndex], newProducts[newIndex]] = [newProducts[newIndex], newProducts[currentIndex]];

    updateProducts(p => ({ ...p, products: newProducts }));
  };

  return (
    <div>
      <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <BookOpen className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900">Menu Digitale Sfogliabile</h3>
            <p className="mt-1 text-xs text-blue-700">
              Gestisci categorie e prodotti. Il menu pubblico mostrerà le categorie in pagine sfogliabili con 3 categorie per pagina. Clicca su qualsiasi prodotto per vedere i dettagli completi.
            </p>
          </div>
        </div>
      </div>

      {/* Products Settings */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-slate-800">Impostazioni Menu</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Titolo Menu</label>
            <input
              type="text"
              value={products.heading}
              onChange={(e) => updateProducts(p => ({ ...p, heading: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="Es: Il Nostro Menu"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Sottotitolo</label>
            <input
              type="text"
              value={products.subheading}
              onChange={(e) => updateProducts(p => ({ ...p, subheading: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="Es: Le nostre specialità"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Layout</label>
            <select
              value={products.layout}
              onChange={(e) => updateProducts(p => ({ ...p, layout: e.target.value as 'grid' | 'list' }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="grid">Griglia</option>
              <option value="list">Lista</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Colonne (solo griglia)</label>
            <select
              value={products.columns}
              onChange={(e) => updateProducts(p => ({ ...p, columns: parseInt(e.target.value) as 2 | 3 | 4 }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="2">2 Colonne</option>
              <option value="3">3 Colonne</option>
              <option value="4">4 Colonne</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Categorie Menu</h3>
          <p className="text-xs text-slate-500 mt-0.5">3 categorie per pagina — totale: {products.categories.length} categorie e {products.products.length} prodotti</p>
        </div>
        <button
          onClick={addCategory}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Aggiungi Categoria
        </button>
      </div>

      <div className="mb-8 space-y-3">
        {products.categories.map((category, idx) => {
          const categoryProducts = products.products.filter(p => p.categoryId === category.id);

          return (
            <div key={category.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              {/* Category Header */}
              <div className="flex items-center gap-2 p-4 bg-slate-50">
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveCategory(idx, 'up')}
                    disabled={idx === 0}
                    className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                    title="Sposta su"
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-2xl">
                  {ICON_MAP[category.icon] || '📋'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-900 truncate">{category.name}</div>
                  <div className="text-xs text-slate-500">{categoryProducts.length} prodotti</div>
                </div>
                <button
                  onClick={() => removeCategory(category.id)}
                  className="rounded p-1.5 text-rose-400 transition hover:bg-rose-50 hover:text-rose-600"
                  title="Elimina categoria"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Category Form */}
              <div className="p-4 border-t border-slate-200">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">Nome Categoria</label>
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) => updateCategory(category.id, { name: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      placeholder="Es: Antipasti di Mare"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">Icona</label>
                    <select
                      value={category.icon}
                      onChange={(e) => updateCategory(category.id, { icon: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="Pizza">🍕 Pizza</option>
                      <option value="Star">⭐ Star</option>
                      <option value="Utensils">🍴 Utensils</option>
                      <option value="Soup">🍲 Soup</option>
                      <option value="Cake">🍰 Cake</option>
                      <option value="Wine">🍷 Wine</option>
                      <option value="Flame">🔥 Flame</option>
                      <option value="Leaf">🌿 Leaf</option>
                      <option value="Clock">⏰ Clock</option>
                      <option value="Users">👥 Users</option>
                      <option value="Heart">❤️ Heart</option>
                      <option value="Fish">🐟 Fish</option>
                      <option value="Beef">🥩 Beef</option>
                      <option value="Carrot">🥕 Carrot</option>
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="mb-1 block text-xs font-semibold text-slate-700">Descrizione</label>
                    <input
                      type="text"
                      value={category.description}
                      onChange={(e) => updateCategory(category.id, { description: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      placeholder="Es: Per iniziare la serata con il pesce fresco"
                    />
                  </div>
                </div>

                {/* Products in this category */}
                <div className="mt-4 space-y-2">
                  {categoryProducts.map((product, pIdx) => (
                    <div key={product.id} className="rounded-lg border border-slate-200 bg-white p-3">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => moveProduct(product.id, 'up')}
                            disabled={pIdx === 0}
                            className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                          >
                            <GripVertical className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-slate-800">{product.name}</div>
                          <div className="text-xs text-slate-500">{product.price}</div>
                        </div>
                        <button
                          onClick={() => removeProduct(product.id)}
                          className="rounded p-1 text-rose-400 transition hover:bg-rose-50 hover:text-rose-600"
                          title="Elimina prodotto"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-slate-700">Nome Prodotto</label>
                          <input
                            type="text"
                            value={product.name}
                            onChange={(e) => updateProduct(product.id, { name: e.target.value })}
                            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                            placeholder="Es: Margherita"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-slate-700">Prezzo</label>
                          <input
                            type="text"
                            value={product.price}
                            onChange={(e) => updateProduct(product.id, { price: e.target.value })}
                            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                            placeholder="Es: €8"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-slate-700">Pasto</label>
                          <select
                            value={product.meal}
                            onChange={(e) => updateProduct(product.id, { meal: e.target.value as 'lunch' | 'dinner' | 'both' })}
                            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                          >
                            <option value="lunch">Pranzo</option>
                            <option value="dinner">Cena</option>
                            <option value="both">Entrambi</option>
                          </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-slate-700">Tipo Piatto</label>
                          <select
                            value={product.dishType}
                            onChange={(e) => updateProduct(product.id, { dishType: e.target.value as 'antipasto' | 'primo' | 'contorno' | 'secondo' | 'dolce' | 'bevanda' | 'pizza' | 'altro' })}
                            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                          >
                            <option value="antipasto">Antipasto</option>
                            <option value="primo">Primo</option>
                            <option value="contorno">Contorno</option>
                            <option value="secondo">Secondo</option>
                            <option value="dolce">Dolce</option>
                            <option value="bevanda">Bevanda</option>
                            <option value="pizza">Pizza</option>
                            <option value="altro">Altro</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="mb-1 block text-xs font-semibold text-slate-700">Giorni Disponibili (solo per pranzo)</label>
                          <div className="flex flex-wrap gap-2">
                            {['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom'].map((day, idx) => {
                              const fullDay = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
                              const isSelected = product.availableDays?.includes(fullDay[idx]);
                              return (
                                <button
                                  key={day}
                                  type="button"
                                  onClick={() => {
                                    const currentDays = product.availableDays || [];
                                    const newDays = isSelected
                                      ? currentDays.filter(d => d !== fullDay[idx])
                                      : [...currentDays, fullDay[idx]];
                                    updateProduct(product.id, { availableDays: newDays });
                                  }}
                                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                                    isSelected
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  {day}
                                </button>
                              );
                            })}
                          </div>
                          <p className="mt-1 text-xs text-slate-500">Lascia vuoto per tutti i giorni o seleziona i giorni specifici</p>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-slate-700">Immagine URL</label>
                          <input
                            type="text"
                            value={product.imageUrl}
                            onChange={(e) => updateProduct(product.id, { imageUrl: e.target.value })}
                            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-slate-700">Badge</label>
                          <input
                            type="text"
                            value={product.badge || ''}
                            onChange={(e) => updateProduct(product.id, { badge: e.target.value })}
                            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                            placeholder="Es: Classica, Gourmet"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="mb-1 block text-xs font-semibold text-slate-700">Descrizione</label>
                          <input
                            type="text"
                            value={product.description}
                            onChange={(e) => updateProduct(product.id, { description: e.target.value })}
                            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                            placeholder="Descrizione breve del piatto"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="mb-1 block text-xs font-semibold text-slate-700">Ingredienti</label>
                          <textarea
                            value={product.ingredients}
                            onChange={(e) => updateProduct(product.id, { ingredients: e.target.value })}
                            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                            placeholder="Pomodoro, mozzarella, basilico..."
                            rows={2}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="mb-1 block text-xs font-semibold text-slate-700">Allergeni</label>
                          <input
                            type="text"
                            value={product.allergens}
                            onChange={(e) => updateProduct(product.id, { allergens: e.target.value })}
                            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                            placeholder="Es: Glutine, Latticini"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => addProduct(category.id)}
                    className="flex items-center gap-1.5 rounded-lg border-2 border-dashed border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-400 hover:text-blue-600"
                  >
                    <Plus className="h-4 w-4" />
                    Aggiungi Prodotto
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}