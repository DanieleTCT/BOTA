import type { Product } from '@/types';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  isDinner?: boolean;
}

export function ProductModal({ product, onClose, isDinner = false }: ProductModalProps) {
  const textPrimary = isDinner ? '#f1f5f9' : '#0f172a';
  const textSecondary = isDinner ? '#94a3b8' : '#475569';
  const bgCard = isDinner ? '#1e293b' : '#ffffff';
  const bgInput = isDinner ? '#0f172a' : '#f8fafc';
  const borderColor = isDinner ? '#334155' : '#e2e8f0';
  const accentColor = isDinner ? '#38bdf8' : '#2563eb';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ backgroundColor: bgCard, color: textPrimary }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full p-2 transition"
          style={{ backgroundColor: isDinner ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255,255,255,0.9)', color: textPrimary }}
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
          <h2 className="text-3xl font-bold" style={{ color: textPrimary }}>{product.name}</h2>
          <span className="text-2xl font-bold" style={{ color: accentColor }}>{product.price}</span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="mb-2 text-lg font-semibold" style={{ color: textPrimary }}>Descrizione</h3>
            <p className="text-base leading-relaxed" style={{ color: textSecondary }}>{product.description}</p>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold" style={{ color: textPrimary }}>Caratteristiche</h3>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm" style={{ color: textSecondary }}>
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: isDinner ? '#1e293b' : '#dbeafe', color: accentColor }}>
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
            <div className="mb-6 rounded-xl border p-4" style={{ borderColor, backgroundColor: bgInput }}>
              <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold" style={{ color: textPrimary }}>
                <span>🥗</span>
                Ingredienti
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: textSecondary }}>{product.ingredients}</p>
            </div>
          )}

          {/* Allergens */}
          {product.allergens && (
            <div className="mb-6 rounded-xl border p-4" style={{ borderColor: '#b45309', backgroundColor: isDinner ? '#451a03' : '#fef3c7' }}>
              <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold" style={{ color: isDinner ? '#fbbf24' : '#92400e' }}>
                <span>⚠️</span>
                Allergeni
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: isDinner ? '#fcd34d' : '#b45309' }}>{product.allergens}</p>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={() => {
              onClose();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full rounded-lg px-6 py-3 text-base font-semibold text-white transition"
            style={{ backgroundColor: accentColor }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            {product.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}