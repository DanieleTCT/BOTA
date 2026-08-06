# Struttura del JSON Template

Questo file documenta la struttura del file JSON template e cosa è configurabile tramite template vs cosa è hardcoded nel sito.

## Panoramica

Il sito è progettato per essere completamente modulare tramite il JSON template. Ogni aspetto del sito dovrebbe essere configurabile tramite il file JSON.

---

## COME È ORGANIZZATO IL JSON

### 1. **Sezioni (sections)**
Array che definisce quali sezioni sono presenti nella pagina e il loro ordine.

```json
{
  "id": "hero",
  "enabled": true
}
```

**Configurabile:**
- Elenco completo delle sezioni disponibili
- Ordine di visualizzazione
- Stato enabled/disabled per ogni sezione

**Sezioni disponibili:**
- `announcement` - Barra di annuncio
- `header` - Header con navigazione
- `hero` - Sezione hero principale
- `features` - Griglia di feature cards
- `about` - Sezione about con immagine e stats
- `products` - Catalogo prodotti
- `pricing` - Tabelle di pricing
- `testimonials` - Testimonianze
- `faq` - Domande frequenti
- `contact` - Form di contatto
- `footer` - Footer con link e social

---

### 2. **Theme (theme)**
Configurazione globale del tema del sito.

```json
{
  "mode": "light",
  "primary": "#2563eb",
  "secondary": "#64748b",
  "background": "#ffffff",
  "accent": "#3b82f6",
  "text": "#1e293b",
  "mutedText": "#64748b",
  "card": "#f8fafc",
  "border": "#e2e8f0",
  "fontPreset": "inter",
  "baseFontSize": 16,
  "radius": "md",
  "shadow": "sm"
}
```

**Configurabile:**
- Modalità chiaro/scuro
- Colori primari, secondari, sfondo, accento
- Colori testo e testo secondario
- Colore card e bordi
- Preset font (inter, poppins, roboto, playfair, mono)
- Dimensione base font
- Stile bordi (none, sm, md, lg, xl)
- Stile ombre (none, sm, md, lg, xl)

---

### 3. **Announcement (announcement)**
Barra di annuncio in alto nella pagina.

```json
{
  "text": "Testo dell'annuncio",
  "linkText": "Testo link",
  "linkHref": "#contact",
  "bg": "#2563eb",
  "fg": "#ffffff"
}
```

**Configurabile:**
- Testo dell'annuncio
- Testo del link
- Href del link
- Colore background
- Colore testo

---

### 4. **Header (header)**
Header del sito con logo e navigazione.

```json
{
  "logoText": "Nome Brand",
  "links": [...],
  "ctaText": "Inizia Ora",
  "ctaHref": "#contact",
  "sticky": true
}
```

**Configurabile:**
- Testo del logo
- Array di link di navigazione (id, label, href)
- Testo bottone CTA
- Href bottone CTA
- Sticky header (true/false)

---

### 5. **Hero (hero)**
Sezione hero principale.

```json
{
  "badge": "Badge",
  "title": "Titolo principale",
  "subtitle": "Sottotitolo",
  "primaryCtaText": "CTA Primaria",
  "primaryCtaHref": "#contact",
  "secondaryCtaText": "CTA Secondaria",
  "secondaryCtaHref": "#features",
  "bgType": "gradient",
  "gradientFrom": "#2563eb",
  "gradientTo": "#7c3aed",
  "imageUrl": "",
  "overlayOpacity": 30
}
```

**Configurabile:**
- Badge
- Titolo e sottotitolo
- Testo e href CTA primaria e secondaria
- Tipo background (gradient o image)
- Colori gradient (se bgType = gradient)
- URL immagine background (se bgType = image)
- Opacità overlay (0-100)

---

### 6. **Features (features)**
Sezione feature cards.

```json
{
  "heading": "Titolo",
  "subheading": "Sottotitolo",
  "columns": 3,
  "cards": [...]
}
```

**Configurabile:**
- Heading e subheading
- Numero di colonne (2, 3, 4)
- Array di cards:
  - id
  - icon (nome icona Lucide)
  - title
  - description
  - badge

---

### 7. **About (about)**
Sezione about con immagine e statistiche.

```json
{
  "heading": "Chi siamo",
  "body": "Testo...",
  "imageUrl": "url",
  "imageAlt": "Testo alternativo",
  "stats": [...]
}
```

**Configurabile:**
- Heading
- Body text
- URL immagine
- Alt text immagine
- Array di statistiche (id, value, label)

---

### 8. **Products (products)**
**NUOVA SEZIONE - Catalogo prodotti**

```json
{
  "heading": "I nostri prodotti",
  "subheading": "Soluzioni...",
  "layout": "grid",
  "columns": 3,
  "products": [...]
}
```

**Configurabile:**
- Heading e subheading
- Layout (grid o list)
- Numero di colonne (2, 3, 4)
- Array di prodotti:
  - id
  - name
  - description
  - price
  - imageUrl
  - badge (opzionale)
  - features (array di stringhe)
  - buttonText
  - buttonHref

---

### 9. **Pricing (pricing)**
Tabelle di pricing.

```json
{
  "heading": "Piani e prezzi",
  "subheading": "Sottotitolo",
  "plans": [...]
}
```

**Configurabile:**
- Heading e subheading
- Array di piani:
  - id
  - name
  - monthlyPrice
  - yearlyPrice
  - description
  - features (array)
  - buttonText
  - buttonHref
  - popular (boolean)

---

### 10. **Testimonials (testimonials)**
Sezione testimonianze.

```json
{
  "heading": "Cosa dicono...",
  "subheading": "Storie...",
  "layout": "grid",
  "items": [...]
}
```

**Configurabile:**
- Heading e subheading
- Layout (grid o carousel)
- Array di testimonianze:
  - id
  - name
  - role
  - avatar (URL)
  - rating (1-5)
  - text

---

### 11. **FAQ (faq)**
Domande frequenti.

```json
{
  "heading": "Domande frequenti",
  "subheading": "Trova risposte...",
  "items": [...]
}
```

**Configurabile:**
- Heading e subheading
- Array di items:
  - id
  - category
  - question
  - answer

---

### 12. **Contact (contact)**
Form di contatto.

```json
{
  "heading": "Parliamo...",
  "subheading": "Sottotitolo",
  "buttonText": "Invia",
  "successMessage": "Grazie...",
  "fields": [...]
}
```

**Configurabile:**
- Heading e subheading
- Testo bottone
- Messaggio di successo
- Array di campi del form:
  - id
  - type (text, email, phone, textarea, select)
  - label
  - placeholder
  - required (boolean)
  - options (array per select)

---

### 13. **Footer (footer)**
Footer del sito.

```json
{
  "logoText": "Brand",
  "description": "Descrizione...",
  "columns": [...],
  "socials": [...],
  "copyright": "© 2024...",
  "showLegalDisclaimer": false,
  "legalText": ""
}
```

**Configurabile:**
- Logo text
- Descrizione
- Colonne di link (array di oggetti con title e links)
- Social links (id, icon, href)
- Copyright text
- Mostra disclaimer legale (boolean)
- Testo legale

---

### 14. **WhatsApp (whatsapp)**
Configurazione widget WhatsApp.

```json
{
  "enabled": false,
  "phone": "",
  "message": "Ciao!"
}
```

**Configurabile:**
- Abilitato/disabilitato
- Numero di telefono
- Messaggio predefinito

---

### 15. **Cookie Banner (cookie)**
Configurazione banner cookie.

```json
{
  "enabled": true,
  "message": "Utilizziamo cookie...",
  "acceptText": "Accetta",
  "declineText": "Rifiuta"
}
```

**Configurabile:**
- Abilitato/disabilitato
- Messaggio
- Testo bottone accetta
- Testo bottone rifiuta

---

### 16. **SEO (seo)**
Configurazione SEO.

```json
{
  "pageTitle": "Titolo pagina",
  "metaDescription": "Descrizione...",
  "ogImageUrl": ""
}
```

**Configurabile:**
- Titolo pagina
- Meta description
- URL immagine Open Graph

---

### 17. **Code Injection (code)**
Iniezione codice personalizzato.

```json
{
  "googleAnalyticsId": "",
  "customHeadScripts": "",
  "customBodyScripts": ""
}
```

**Configurabile:**
- ID Google Analytics
- Script custom in head
- Script custom in body

---

## VALORI HARDCODED NEI COMPONENTI

Oltre a quanto elencato sopra, ci sono valori hardcoded direttamente nei componenti React:

### Stili e classi Tailwind hardcoded:
- **Hero.tsx**: 
  - `py-24 lg:py-32` (padding verticale)
  - `text-4xl sm:text-5xl lg:text-6xl` (dimensioni titolo)
  - `px-8 py-3.5` (padding bottoni)
  - `h-12 w-12` (dimensione spinner)
  
- **Features.tsx**:
  - `py-20` (padding sezione)
  - `h-12 w-12` (dimensione icona card)
  - `h-6 w-6` (dimensione icona interna)
  - `p-6` (padding card)
  - `gap-6` (spazio tra card)

- **ProductsSection.tsx**:
  - `py-16 md:py-24` (padding sezione)
  - `mb-12` (margin bottom heading)
  - `gap-6` (spazio tra prodotti)
  - `h-48` (altezza immagine prodotto)
  - `p-6` (padding card prodotto)

- **About.tsx**:
  - `py-20` (padding sezione)
  - `h-96` (altezza immagine)
  - `w-24 h-24` (dimensione stat)

### Comportamenti hardcoded:
- **Animazioni**: `animate-fade-in-up` applicato a tutti gli elementi
- **Icone**: Set limitato di icone Lucide (Coffee, Flame, Leaf, Award, Heart, Wifi)
- **Breakpoints**: sm:, md:, lg: definiti nei componenti
- **Hover effects**: `hover:-translate-y-1`, `hover:scale-110`, ecc.
- **Border radius**: `rounded-2xl`, `rounded-full`, `rounded-xl`

### Layout hardcoded:
- **Max-width**: `max-w-7xl` su tutte le sezioni
- **Padding**: `px-4 lg:px-8` standard
- **Griglie**: `grid-cols-1` base con override per colonne

---

## COSA È HARDCODED NEL CODICE

### ❌ NON CONFIGURABILE TRAMITE JSON:

1. **Struttura del sito**
   - Componenti React utilizzati
   - Logica di rendering delle sezioni
   - Ordine di caricamento risorse

2. **Stili CSS/Tailwind**
   - Classi Tailwind utilizzate nei componenti (vedi sezione "VALORI HARDCODED NEI COMPONENTI")
   - Struttura CSS
   - Breakpoints responsive

3. **Comportamenti JavaScript**
   - Logica dei componenti React
   - Gestione stati
   - Event listeners
   - Animazioni CSS

4. **Funzionalità backend**
   - Connessione Supabase
   - API endpoints
   - Logica di autenticazione (se presente)

5. **Asset statici**
   - Font (se non gestiti da theme.fontPreset)
   - Immagini di default
   - Icone (lucide-react)
   - Set di icone disponibili limitato

6. **Layout responsive**
   - Breakpoints (sm, md, lg)
   - Max-width container
   - Griglie di base

---

## OBIETTIVO: SITO COMPLETAMENTE MODULARE

Per rendere il sito completamente modulare, il JSON template dovrebbe controllare:

### ✅ Già implementato:
- Tutte le sezioni e il loro ordine
- Tutti i testi e i contenuti
- Tutti i colori e lo stile
- Tutte le configurazioni delle sezioni
- SEO e meta tag
- Script personalizzati

### 🔄 Da completare:
1. **Configurazione componenti avanzata**
   - Permettere di scegliere quali componenti usare per ogni sezione
   - Es: "usa HeroImage invece di HeroVideo"

2. **Layout personalizzati**
   - Definire layout complessi con griglie custom
   - Posizionamento elementi

3. **Animazioni**
   - Configurare animazioni per ogni sezione
   - Timing e easing

4. **Custom CSS**
   - Permettere CSS custom per ogni sezione
   - Override di stili specifici

5. **Multi-lingua**
   - Struttura per gestire multiple lingue
   - Fallback language

6. **Accessibilità**
   - Configurazione ARIA labels
   - Skip links
   - Contrast ratios

---

## ESEMPIO DI UTILIZZO

```json
{
  "version": 1,
  "sites": [
    { "id": "site-1", "name": "Sito A" },
    { "id": "site-2", "name": "Sito B" }
  ],
  "sections": [...],
  "theme": {...},
  // ... resto configurazione
}
```

Ogni sito può avere:
- Sezioni diverse
- Tema diverso
- Contenuti completamente differenti

Tutto gestito dallo stesso codice, solo config diversa.

---

## PROSSIMI PASSI

1. Migrare tutti i valori hardcoded nel JSON
2. Creare un sistema di template multipli
3. Aggiungere editor visuale per modificare il JSON
4. Implementare versioning dei template
5. Aggiungere preview live delle modifiche