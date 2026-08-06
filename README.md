# BOTA — Pizzeria Ristorante a Fano

Sito web per **Bota**, pizzeria ristorante nel centro storico di Fano (PU). Basato sul framework Site Creator multi-piattaforma con builder visivo integrato.

## ✨ Caratteristiche

- 🍕 **Template Pizzeria** - Contenuti preconfigurati per Bota
- 🎨 **Builder Visivo** - Modifica il sito in tempo reale con anteprima live
- 🌐 **Multi-Site** - Gestisci infiniti siti da un'unica dashboard
- 📱 **Responsive** - Design ottimizzato per tutti i dispositivi
- 🚀 **Performance** - Tempi di caricamento ottimizzati
- 🔒 **Sicurezza** - Row Level Security per isolamento dati
- 📊 **Form Integration** - Gestione lead e prenotazioni integrata
- 📤 **Import/Export** - Template JSON scaricabili e caricabili
- 🎯 **SEO Friendly** - Meta tags e Open Graph integrati

## 🍕 Bota — Il Ristorante

**Bota** è una pizzeria ristorante situata nel cuore di Fano, nelle Marche. Da oltre 25 anni portiamo avanti la tradizione della pizza artigianale marchigiana:

- Pizza cotta nel forno a legna a 450°C
- Impasto a lunga lievitazione (48 ore)
- Ingredienti del territorio a km zero
- Cantina con vini marchigiani (Verdicchio, Rosso Conero)
- Ristorante con ambiente familiare

### Info Ristorante

- **Indirizzo**: Via Arco d'Augusto, 12 — 61032 Fano (PU)
- **Telefono**: 0721 000000
- **Email**: info@botafano.it
- **Orari**: Mar–Dom 18:30–23:00 (Lunedì chiuso)
- **Pranzo**: Sab e Dom 12:30–14:30

## 🏗️ Architettura Multi-Site

### Database Schema
- **sites** - Gestione siti web
- **site_config** - Configurazioni per sito (JSON)
- **templates** - Template personalizzati
- **form_submissions** - Form contatti isolati
- **image_gallery** - Gallerie immagini per sito

### Isolamento Dati
Ogni sito ha dati completamente separati:
- Configurazioni tematiche
- Contenuti e sezioni
- Template JSON
- Invii form
- Immagini e media

## 🚀 Quick Start

### Prerequisiti
- Node.js 18+
- Supabase account
- Vite

### Installazione

```bash
# Installa dipendenze
npm install

# Configura variabili d'ambiente
cp .env.example .env
# Modifica .env con le tue credenziali Supabase

# Avvia development server
npm run dev
```

### Configurazione Supabase

1. Crea un nuovo progetto su [Supabase](https://supabase.com)
2. Vai in SQL Editor
3. Esegui lo script di migrazione:

```bash
# Copia e incolla il contenuto di:
supabase-multi-site-migration.sql
```

4. Configura le credenziali in `.env`:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SITE_ID=11111111-1111-1111-1111-111111111111
```

## 📖 Utilizzo

### Visualizzazione Sito

```
http://localhost:5173
```

### Pannello Admin

```
http://localhost:5173/?admin=1
```

### Importare un Template

1. Vai in `/admin` → sezione **Backup**
2. Clicca **Import** e seleziona `bota-pizzeria-template.json`
3. Il template pizzeria viene caricato per il sito corrente
4. Modifica e personalizza come needed

### Esportare un Template

1. Vai in `/admin` → sezione **Backup**
2. Clicca **Export**
3. Il file JSON viene scaricato
4. Condividi o riutilizza su altri siti

## 🎨 Template Disponibili

### Template Bota Pizzeria (`bota-pizzeria-template.json`)
Template completo per pizzeria ristorante con:
- Sezione annunci promozioni
- Header sticky con navigazione
- Hero con foto pizza forno a legna
- Features: forno a legna, km zero, 48h lievitazione
- Chi Siamo con storia dal 1995
- Menu pizze con 6 specialità
- Testimonials clienti
- FAQ prenotazioni e menu
- Contact form per prenotazioni
- Footer con contatti e mappa

### Template Generico (`generic-template.json`)
Un template universale adatto a qualsiasi business:
- Design pulito e moderno
- Colori blu professionali
- Contenuti in italiano
- Struttura ottimizzata per conversioni

## 🔧 Struttura Progetto

```
src/
├── components/
│   ├── admin/              # Componenti pannello admin
│   │   ├── AdminDashboard.tsx
│   │   ├── SectionManager.tsx
│   │   ├── ThemeEditor.tsx
│   │   ├── ContentEditors.tsx
│   │   ├── LeadsManager.tsx
│   │   ├── ToolsManager.tsx
│   │   └── BackupManager.tsx
│   └── sections/           # Sezioni del sito
├── hooks/
│   └── useConfig.ts        # Hook per gestione config
├── lib/
│   ├── config.ts           # Funzioni config Supabase
│   ├── siteDetection.ts    # Rilevamento sito corrente
│   ├── submissions.ts      # Gestione form
│   └── supabase.ts         # Client Supabase
└── types.ts                # TypeScript types

Database Migrations:
├── supabase-site-config.sql
├── supabase-form-submissions.sql
└── supabase-multi-site-migration.sql

Template Pizzeria:
├── bota-pizzeria-template.json
└── generic-template.json
```

## 🛠️ Stack Tecnologico

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Build**: Vite

## 📦 Deploy

### Vercel / Netlify
```bash
npm run build
# Deploy della cartella dist/
```

### Configurazione Produzione
1. Imposta variabili d'ambiente
2. Esegui migrazione SQL
3. Configura domini in Supabase
4. Collega i domini ai siti:

```sql
UPDATE sites SET domain = 'botafano.it' WHERE id = '11111111-1111-1111-1111-111111111111';
```

## 📝 API Reference

### Site Detection
```typescript
import { 
  getCurrentSiteId,    // ID sito corrente
  getSiteInfo,         // Info sito
  getAllSites,         // Lista tutti i siti
  setCurrentSiteId,    // Switch sito (admin)
} from '@/lib/siteDetection';
```

### Config Management
```typescript
import {
  loadConfig,              // Da localStorage
  loadConfigFromSupabase,  // Da Supabase (per sito)
  saveConfig,              // In localStorage
  saveConfigToSupabase,    // In Supabase (per sito)
  publishConfigToSupabase, // In entrambi
} from '@/lib/config';
```

### Form Submissions
```typescript
import {
  saveSubmission,              // Salva invio
  fetchSubmissions,            // Carica tutti (filtrati per sito)
  updateSubmissionStatus,      // Aggiorna status
  deleteSubmission,            // Elimina invio
} from '@/lib/submissions';
```

## 📄 Licenza

MIT License

## 👥 Team

Sviluppato con ❤️ da Daniele TCT

---

**Versione**: 1.0.0  
**Status**: ✅ Production Ready  
**Multi-Site**: ✅ Supportato