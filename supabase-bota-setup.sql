-- ============================================================
-- BOTA Pizzeria Ristorante — Supabase Setup
-- Da eseguire nel Supabase SQL Editor
-- ============================================================

-- ============================================================
-- 1. Registra il sito BOTA nella tabella sites
-- ============================================================
INSERT INTO sites (id, name, slug, domain, status, modules, metadata)
VALUES (
  'b1a2c3d4-e5f6-7890-abcd-ef1234567890',
  'Bota Pizzeria Ristorante',
  'bota',
  'botafano.it',
  'active',
  ARRAY['core', 'multi-site', 'themes', 'backup', 'menu', 'reviews', 'gallery'],
  '{"type": "restaurant", "template": "bota-pizzeria", "features": ["menu", "reviews", "faq", "contactForm", "whatsapp", "cookieBanner", "seoInjection", "mobileBar"]}'
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  domain = EXCLUDED.domain,
  modules = EXCLUDED.modules,
  metadata = EXCLUDED.metadata;

-- ============================================================
-- 2. Inizializza la configurazione del sito BOTA
-- ============================================================
INSERT INTO site_config (site_id, data)
VALUES (
  'b1a2c3d4-e5f6-7890-abcd-ef1234567890',
  '{
    "version": 1,
    "sections": [
      {"id": "announcement", "enabled": true},
      {"id": "header", "enabled": true},
      {"id": "hero", "enabled": true},
      {"id": "features", "enabled": true},
      {"id": "about", "enabled": true},
      {"id": "products", "enabled": true},
      {"id": "pricing", "enabled": false},
      {"id": "testimonials", "enabled": true},
      {"id": "faq", "enabled": true},
      {"id": "contact", "enabled": true},
      {"id": "footer", "enabled": true}
    ],
    "theme": {
      "mode": "light",
      "primary": "#b91c1c",
      "secondary": "#f59e0b",
      "background": "#fef7ed",
      "accent": "#dc2626",
      "text": "#1c1917",
      "mutedText": "#78716c",
      "card": "#ffffff",
      "border": "#f3e8d3",
      "fontPreset": "playfair",
      "baseFontSize": 16,
      "radius": "lg",
      "shadow": "md"
    },
    "header": {
      "logoText": "Bota",
      "links": [
        {"id": "l1", "label": "Chi Siamo", "href": "#about"},
        {"id": "l2", "label": "Il Menu", "href": "#products"},
        {"id": "l3", "label": "Le Nostre Pizze", "href": "#features"},
        {"id": "l4", "label": "FAQ", "href": "#faq"}
      ],
      "ctaText": "Prenota un Tavolo",
      "ctaHref": "#contact",
      "sticky": true
    },
    "hero": {
      "badge": "🍕 Pizzeria Ristorante — Fano",
      "title": "Bota: la vera pizza marchigiana",
      "subtitle": "Dal cuore di Fano, portiamo in tavola la passione per la pizza artigianale. Impasto a lunga lievitazione, ingredienti del territorio e forno a legna per un''esperienza autentica.",
      "primaryCtaText": "Prenota Ora",
      "primaryCtaHref": "#contact",
      "secondaryCtaText": "Esplora il Menu",
      "secondaryCtaHref": "#products",
      "bgType": "image",
      "gradientFrom": "#b91c1c",
      "gradientTo": "#f59e0b",
      "imageUrl": "https://images.pexels.com/photos/1146704/pexels-photo-1146704.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "overlayOpacity": 45
    },
    "seo": {
      "pageTitle": "Bota — Pizzeria Ristorante a Fano | Pizza Artigianale",
      "metaDescription": "Bota è la pizzeria ristorante di Fano. Pizza artigianale cotta nel forno a legna, cucina marchigiana, vini del territorio. Prenota ora nel centro storico di Fano.",
      "ogImageUrl": ""
    },
    "whatsapp": {
      "enabled": true,
      "phone": "393331234567",
      "message": "Ciao Bota! Vorrei prenotare un tavolo."
    }
  }'::jsonb
)
ON CONFLICT (site_id) DO UPDATE SET
  data = EXCLUDED.data,
  updated_at = now();

-- ============================================================
-- 3. Verifica finale
-- ============================================================
SELECT id, name, slug, domain, status
FROM sites
WHERE slug = 'bota'
ORDER BY name;

SELECT site_id, data->'theme'->>'primary' as primary_color, updated_at
FROM site_config
WHERE site_id = 'b1a2c3d4-e5f6-7890-abcd-ef1234567890';

-- ============================================================
-- FINE SETUP BOTA
-- ============================================================