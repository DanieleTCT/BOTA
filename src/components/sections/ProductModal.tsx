import type { Product } from '@/types';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Product Image */}
        {product.imageUrl && (
          <div className="relative h-64 w-full overflow-hidden rounded-t-2xl">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            {product.badge && (
              <span className="absolute right-4 top-4 rounded-full bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white">
                {product.badge}
              </span>
            )}
          </div>
        )}

        {/* Product Details */}
        <div className="p-6 md:p-8">
          {/* Title and Price */}
          <div className="mb-6 flex items-start justify-between">
            <h2 className="text-3xl font-bold text-slate-900">{product.name}</h2>
            <span className="text-2xl font-bold text-blue-600">{product.price}</span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="mb-2 text-lg font-semibold text-slate-900">Descrizione</h3>
            <p className="text-base leading-relaxed text-slate-600">{product.description}</p>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold text-slate-900">Caratteristiche</h3>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Ingredients */}
          {product.ingredients && (
            <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-slate-900">
                <span>🥗</span>
                Ingredienti
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">{product.ingredients}</p>
            </div>
          )}

          {/* Allergens */}
          {product.allergens && (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-amber-900">
                <span>⚠️</span>
                Allergeni
              </h3>
              <p className="text-sm leading-relaxed text-amber-800">{product.allergens}</p>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={() => {
              onClose();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-blue-700"
          >
            {product.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}