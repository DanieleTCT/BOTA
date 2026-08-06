import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { SiteConfig, Product, ProductsConfig } from '@/types';
import type { AdminContext } from './AdminDashboard';
import { ImageUploadField } from './Controls';

const DEFAULT_PRODUCTS = {
  heading: 'Our Products',
  subheading: 'From single-origin beans to handcrafted drinks',
  layout: 'grid' as const,
  columns: 3 as const,
  products: [],
};

export function ProductsManager({ config, ctx }: { config: SiteConfig; ctx: AdminContext }) {
  const products: ProductsConfig = config.products || DEFAULT_PRODUCTS;
  
  const updateProducts = (updater: (p: ProductsConfig) => ProductsConfig) => {
    const newProducts = updater(products);
    ctx.update('products', newProducts);
  };

  const addProduct = () => {
    const newProduct: Product = {
      id: `pr${Date.now()}`,
      name: 'New Product',
      description: 'Product description',
      price: '$0',
      imageUrl: '',
      badge: '',
      features: ['Feature 1'],
      buttonText: 'Learn More',
      buttonHref: '#contact',
    };
    updateProducts(p => ({ ...p, products: [...p.products, newProduct] }));
  };

  const removeProduct = (id: string) => {
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

  const moveProduct = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= products.products.length) return;
    
    const newProducts = [...products.products];
    [newProducts[index], newProducts[newIndex]] = [newProducts[newIndex], newProducts[index]];
    
    updateProducts(p => ({ ...p, products: newProducts }));
  };

  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-slate-800">Products Manager</h2>
      <p className="mb-6 text-sm text-slate-500">Manage your product catalog. Add, edit, and organize your products.</p>

      {/* Products Settings */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-slate-800">Section Settings</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Heading</label>
            <input
              type="text"
              value={products.heading}
              onChange={(e) => updateProducts(p => ({ ...p, heading: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Subheading</label>
            <input
              type="text"
              value={products.subheading}
              onChange={(e) => updateProducts(p => ({ ...p, subheading: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Layout</label>
            <select
              value={products.layout}
              onChange={(e) => updateProducts(p => ({ ...p, layout: e.target.value as 'grid' | 'list' }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="grid">Grid</option>
              <option value="list">List</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Columns (Grid only)</label>
            <select
              value={products.columns}
              onChange={(e) => updateProducts(p => ({ ...p, columns: parseInt(e.target.value) as 2 | 3 | 4 }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="2">2 Columns</option>
              <option value="3">3 Columns</option>
              <option value="4">4 Columns</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Products ({products.products.length})</h3>
        <button
          onClick={addProduct}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      <div className="space-y-4">
        {products.products.map((product, idx) => (
          <div key={product.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveProduct(idx, 'up')}
                  disabled={idx === 0}
                  className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                >
                  <GripVertical className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-800">{product.name}</div>
                <div className="text-xs text-slate-500">{product.price}</div>
              </div>
              <button
                onClick={() => removeProduct(product.id)}
                className="rounded p-1.5 text-rose-400 transition hover:bg-rose-50 hover:text-rose-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">Product Name</label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => updateProduct(product.id, { name: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">Price</label>
                <input
                  type="text"
                  value={product.price}
                  onChange={(e) => updateProduct(product.id, { price: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-slate-700">Description</label>
                <textarea
                  value={product.description}
                  onChange={(e) => updateProduct(product.id, { description: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div className="sm:col-span-2">
                <ImageUploadField
                  label="Immagine Prodotto"
                  value={product.imageUrl}
                  onChange={(url) => updateProduct(product.id, { imageUrl: url })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">Badge (optional)</label>
                <input
                  type="text"
                  value={product.badge || ''}
                  onChange={(e) => updateProduct(product.id, { badge: e.target.value })}
                  placeholder="e.g., New, Sale, Popular"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">Button Text</label>
                <input
                  type="text"
                  value={product.buttonText}
                  onChange={(e) => updateProduct(product.id, { buttonText: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-slate-700">Features (one per line)</label>
                <textarea
                  value={product.features.join('\n')}
                  onChange={(e) => updateProduct(product.id, { features: e.target.value.split('\n').filter(f => f.trim()) })}
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
