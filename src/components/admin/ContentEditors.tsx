import type { AdminContext } from './AdminDashboard';
import type { SiteConfig, NavLink, FeatureCard, StatItem, PricingPlan, Testimonial, FaqItem, FormFieldDef, FooterColumn, OrariItem, GalleryImage } from '@/types';
import {
  AdminPanel, TextField, TextArea, ColorField, Toggle, SelectField,
  NumberField, IconPicker, ListEditor, ImageUploadField,
} from './Controls';
import { ChevronDown } from 'lucide-react';
import { useState, type ReactNode } from 'react';

export function ContentEditors({ config, ctx }: { config: SiteConfig; ctx: AdminContext }) {
  const [open, setOpen] = useState<string>('hero');
  const toggle = (id: string) => setOpen(open === id ? '' : id);

  const sections = [
    { id: 'announcement', label: 'Announcement Bar' },
    { id: 'header', label: 'Header & Navigation' },
    { id: 'hero', label: 'Hero Section' },
    { id: 'features', label: 'Feature Grid' },
    { id: 'about', label: 'About / Media' },
    { id: 'pricing', label: 'Pricing Tables' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'faq', label: 'FAQ Accordion' },
    { id: 'orari', label: 'Orari di Apertura' },
    { id: 'galleria', label: 'Galleria' },
    { id: 'contact', label: 'Contact Form' },
    { id: 'footer', label: 'Footer' },
  ];

  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-slate-800">Content Editors</h2>
      <p className="mb-6 text-sm text-slate-500">Edit the text, images, icons, and settings for every section.</p>

      <div className="space-y-2">
        {sections.map((s) => (
          <div key={s.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <button
              onClick={() => toggle(s.id)}
              className="flex w-full items-center justify-between px-4 py-3.5 text-left"
            >
              <span className="text-sm font-bold text-slate-800">{s.label}</span>
              <ChevronDown className={`h-5 w-5 text-slate-400 transition ${open === s.id ? 'rotate-180' : ''}`} />
            </button>
            {open === s.id && (
              <div className="border-t border-slate-100 p-4">
                {s.id === 'announcement' && <AnnouncementEditor config={config} ctx={ctx} />}
                {s.id === 'header' && <HeaderEditor config={config} ctx={ctx} />}
                {s.id === 'hero' && <HeroEditor config={config} ctx={ctx} />}
                {s.id === 'features' && <FeaturesEditor config={config} ctx={ctx} />}
                {s.id === 'about' && <AboutEditor config={config} ctx={ctx} />}
                {s.id === 'pricing' && <PricingEditor config={config} ctx={ctx} />}
                {s.id === 'testimonials' && <TestimonialsEditor config={config} ctx={ctx} />}
                {s.id === 'faq' && <FaqEditor config={config} ctx={ctx} />}
                {s.id === 'orari' && <OrariEditor config={config} ctx={ctx} />}
                {s.id === 'galleria' && <GalleriaEditor config={config} ctx={ctx} />}
                {s.id === 'contact' && <ContactEditor config={config} ctx={ctx} />}
                {s.id === 'footer' && <FooterEditor config={config} ctx={ctx} />}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Section({ children }: { children: ReactNode }) {
  return <div className="space-y-4">{children}</div>;
}

/* ─── Announcement ─── */
function AnnouncementEditor({ config, ctx }: { config: SiteConfig; ctx: AdminContext }) {
  const c = config.announcement;
  const set = (k: keyof typeof c, v: typeof c[keyof typeof c]) =>
    ctx.update('announcement', { ...c, [k]: v });
  return (
    <Section>
      <TextField label="Banner Text" value={c.text} onChange={(v) => set('text', v)} />
      <TextField label="Link Text" value={c.linkText} onChange={(v) => set('linkText', v)} />
      <TextField label="Link URL" value={c.linkHref} onChange={(v) => set('linkHref', v)} />
      <ColorField label="Background Color" value={c.bg} onChange={(v) => set('bg', v)} />
      <ColorField label="Text Color" value={c.fg} onChange={(v) => set('fg', v)} />
    </Section>
  );
}

/* ─── Header ─── */
function HeaderEditor({ config, ctx }: { config: SiteConfig; ctx: AdminContext }) {
  const c = config.header;
  const set = (k: keyof typeof c, v: typeof c[keyof typeof c]) =>
    ctx.update('header', { ...c, [k]: v });
  return (
    <Section>
      <TextField label="Logo Text" value={c.logoText} onChange={(v) => set('logoText', v)} />
      <ImageUploadField label="Logo Image URL" value={c.logoUrl} onChange={(v) => set('logoUrl', v)} />
      <TextField label="CTA Button Text" value={c.ctaText} onChange={(v) => set('ctaText', v)} />
      <TextField label="CTA Button URL" value={c.ctaHref} onChange={(v) => set('ctaHref', v)} />
      <Toggle label="Sticky Header" checked={c.sticky} onChange={(v) => set('sticky', v)} />
      <AdminPanel title="Navigation Links">
        <ListEditor<NavLink>
          items={c.links}
          addLabel="Add Link"
          onAdd={() => set('links', [...c.links, { id: crypto.randomUUID(), label: 'New Link', href: '#' }])}
          onRemove={(i) => set('links', c.links.filter((_, j) => j !== i))}
          onMove={(i, dir) => {
            const arr = [...c.links];
            const swap = dir === 'up' ? i - 1 : i + 1;
            [arr[i], arr[swap]] = [arr[swap], arr[i]];
            set('links', arr);
          }}
          renderItem={(item) => (
            <div className="grid grid-cols-2 gap-2">
              <TextField label="Label" value={item.label} onChange={(v) => {
                const arr = [...c.links];
                const idx = arr.findIndex((l) => l.id === item.id);
                arr[idx] = { ...item, label: v };
                set('links', arr);
              }} />
              <TextField label="URL" value={item.href} onChange={(v) => {
                const arr = [...c.links];
                const idx = arr.findIndex((l) => l.id === item.id);
                arr[idx] = { ...item, href: v };
                set('links', arr);
              }} />
            </div>
          )}
        />
      </AdminPanel>
    </Section>
  );
}

/* ─── Hero ─── */
function HeroEditor({ config, ctx }: { config: SiteConfig; ctx: AdminContext }) {
  const c = config.hero;
  const set = (k: keyof typeof c, v: typeof c[keyof typeof c]) =>
    ctx.update('hero', { ...c, [k]: v });
  return (
    <Section>
      <TextField label="Badge Text" value={c.badge} onChange={(v) => set('badge', v)} />
      <TextField label="Title" value={c.title} onChange={(v) => set('title', v)} />
      <TextArea label="Subtitle" value={c.subtitle} onChange={(v) => set('subtitle', v)} />
      <div className="grid grid-cols-2 gap-3">
        <TextField label="Primary CTA Text" value={c.primaryCtaText} onChange={(v) => set('primaryCtaText', v)} />
        <TextField label="Primary CTA URL" value={c.primaryCtaHref} onChange={(v) => set('primaryCtaHref', v)} />
        <TextField label="Secondary CTA Text" value={c.secondaryCtaText} onChange={(v) => set('secondaryCtaText', v)} />
        <TextField label="Secondary CTA URL" value={c.secondaryCtaHref} onChange={(v) => set('secondaryCtaHref', v)} />
      </div>
      <SelectField
        label="Background Type"
        value={c.bgType}
        onChange={(v) => set('bgType', v as 'gradient' | 'image')}
        options={[{ value: 'gradient', label: 'Gradient' }, { value: 'image', label: 'Image' }]}
      />
      {c.bgType === 'gradient' ? (
        <div className="grid grid-cols-2 gap-3">
          <ColorField label="Gradient From" value={c.gradientFrom} onChange={(v) => set('gradientFrom', v)} />
          <ColorField label="Gradient To" value={c.gradientTo} onChange={(v) => set('gradientTo', v)} />
        </div>
      ) : (
        <>
          <ImageUploadField label="Immagine di Sfondo" value={c.imageUrl} onChange={(v) => set('imageUrl', v)} />
          <NumberField label="Overlay Opacity (%)" value={c.overlayOpacity} onChange={(v) => set('overlayOpacity', v)} min={0} max={100} />
        </>
      )}
    </Section>
  );
}

/* ─── Features ─── */
function FeaturesEditor({ config, ctx }: { config: SiteConfig; ctx: AdminContext }) {
  const c = config.features;
  const set = (k: keyof typeof c, v: typeof c[keyof typeof c]) =>
    ctx.update('features', { ...c, [k]: v });
  return (
    <Section>
      <TextField label="Heading" value={c.heading} onChange={(v) => set('heading', v)} />
      <TextField label="Subheading" value={c.subheading} onChange={(v) => set('subheading', v)} />
      <SelectField
        label="Columns"
        value={String(c.columns)}
        onChange={(v) => set('columns', Number(v) as 2 | 3 | 4)}
        options={[{ value: '2', label: '2 Columns' }, { value: '3', label: '3 Columns' }, { value: '4', label: '4 Columns' }]}
      />
      <AdminPanel title="Feature Cards">
        <ListEditor<FeatureCard>
          items={c.cards}
          addLabel="Add Card"
          onAdd={() => set('cards', [...c.cards, { id: crypto.randomUUID(), icon: 'Sparkles', title: 'New Feature', description: 'Description here', badge: '' }])}
          onRemove={(i) => set('cards', c.cards.filter((_, j) => j !== i))}
          onMove={(i, dir) => {
            const arr = [...c.cards];
            const swap = dir === 'up' ? i - 1 : i + 1;
            [arr[i], arr[swap]] = [arr[swap], arr[i]];
            set('cards', arr);
          }}
          renderItem={(card) => (
            <div className="space-y-2">
              <IconPicker label="Icon" value={card.icon} onChange={(v) => {
                const arr = [...c.cards];
                const idx = arr.findIndex((x) => x.id === card.id);
                arr[idx] = { ...card, icon: v };
                set('cards', arr);
              }} />
              <TextField label="Title" value={card.title} onChange={(v) => {
                const arr = [...c.cards];
                const idx = arr.findIndex((x) => x.id === card.id);
                arr[idx] = { ...card, title: v };
                set('cards', arr);
              }} />
              <TextField label="Badge" value={card.badge} onChange={(v) => {
                const arr = [...c.cards];
                const idx = arr.findIndex((x) => x.id === card.id);
                arr[idx] = { ...card, badge: v };
                set('cards', arr);
              }} />
              <TextArea label="Description" value={card.description} onChange={(v) => {
                const arr = [...c.cards];
                const idx = arr.findIndex((x) => x.id === card.id);
                arr[idx] = { ...card, description: v };
                set('cards', arr);
              }} />
            </div>
          )}
        />
      </AdminPanel>
    </Section>
  );
}

/* ─── About ─── */
function AboutEditor({ config, ctx }: { config: SiteConfig; ctx: AdminContext }) {
  const c = config.about;
  const set = (k: keyof typeof c, v: typeof c[keyof typeof c]) =>
    ctx.update('about', { ...c, [k]: v });
  return (
    <Section>
      <TextField label="Heading" value={c.heading} onChange={(v) => set('heading', v)} />
      <TextArea label="Body Text" value={c.body} onChange={(v) => set('body', v)} rows={5} />
      <ImageUploadField label="Immagine" value={c.imageUrl} onChange={(v) => set('imageUrl', v)} />
      <TextField label="Image Alt Text" value={c.imageAlt} onChange={(v) => set('imageAlt', v)} />
      <AdminPanel title="Statistics">
        <ListEditor<StatItem>
          items={c.stats}
          addLabel="Add Stat"
          onAdd={() => set('stats', [...c.stats, { id: crypto.randomUUID(), value: '0', label: 'New Stat' }])}
          onRemove={(i) => set('stats', c.stats.filter((_, j) => j !== i))}
          onMove={(i, dir) => {
            const arr = [...c.stats];
            const swap = dir === 'up' ? i - 1 : i + 1;
            [arr[i], arr[swap]] = [arr[swap], arr[i]];
            set('stats', arr);
          }}
          renderItem={(stat) => (
            <div className="grid grid-cols-2 gap-2">
              <TextField label="Value" value={stat.value} onChange={(v) => {
                const arr = [...c.stats];
                const idx = arr.findIndex((x) => x.id === stat.id);
                arr[idx] = { ...stat, value: v };
                set('stats', arr);
              }} />
              <TextField label="Label" value={stat.label} onChange={(v) => {
                const arr = [...c.stats];
                const idx = arr.findIndex((x) => x.id === stat.id);
                arr[idx] = { ...stat, label: v };
                set('stats', arr);
              }} />
            </div>
          )}
        />
      </AdminPanel>
    </Section>
  );
}

/* ─── Pricing ─── */
function PricingEditor({ config, ctx }: { config: SiteConfig; ctx: AdminContext }) {
  const c = config.pricing;
  const set = (k: keyof typeof c, v: typeof c[keyof typeof c]) =>
    ctx.update('pricing', { ...c, [k]: v });
  return (
    <Section>
      <TextField label="Heading" value={c.heading} onChange={(v) => set('heading', v)} />
      <TextField label="Subheading" value={c.subheading} onChange={(v) => set('subheading', v)} />
      <AdminPanel title="Pricing Plans">
        <ListEditor<PricingPlan>
          items={c.plans}
          addLabel="Add Plan"
          onAdd={() => set('plans', [...c.plans, { id: crypto.randomUUID(), name: 'New Plan', monthlyPrice: '$0', yearlyPrice: '$0', description: '', features: [], buttonText: 'Get Started', buttonHref: '#contact', popular: false }])}
          onRemove={(i) => set('plans', c.plans.filter((_, j) => j !== i))}
          onMove={(i, dir) => {
            const arr = [...c.plans];
            const swap = dir === 'up' ? i - 1 : i + 1;
            [arr[i], arr[swap]] = [arr[swap], arr[i]];
            set('plans', arr);
          }}
          renderItem={(plan) => (
            <div className="space-y-2">
              <TextField label="Plan Name" value={plan.name} onChange={(v) => updatePlan(c, set, plan.id, { name: v })} />
              <div className="grid grid-cols-2 gap-2">
                <TextField label="Monthly Price" value={plan.monthlyPrice} onChange={(v) => updatePlan(c, set, plan.id, { monthlyPrice: v })} />
                <TextField label="Yearly Price" value={plan.yearlyPrice} onChange={(v) => updatePlan(c, set, plan.id, { yearlyPrice: v })} />
              </div>
              <TextField label="Description" value={plan.description} onChange={(v) => updatePlan(c, set, plan.id, { description: v })} />
              <TextArea label="Features (one per line)" value={plan.features.join('\n')} onChange={(v) => updatePlan(c, set, plan.id, { features: v.split('\n').filter(Boolean) })} />
              <div className="grid grid-cols-2 gap-2">
                <TextField label="Button Text" value={plan.buttonText} onChange={(v) => updatePlan(c, set, plan.id, { buttonText: v })} />
                <TextField label="Button URL" value={plan.buttonHref} onChange={(v) => updatePlan(c, set, plan.id, { buttonHref: v })} />
              </div>
              <Toggle label="Mark as Popular" checked={plan.popular} onChange={(v) => updatePlan(c, set, plan.id, { popular: v })} />
            </div>
          )}
        />
      </AdminPanel>
    </Section>
  );
}

function updatePlan(c: SiteConfig['pricing'], set: (k: keyof SiteConfig['pricing'], v: SiteConfig['pricing'][keyof SiteConfig['pricing']]) => void, id: string, patch: Partial<PricingPlan>) {
  const arr = c.plans.map((p) => (p.id === id ? { ...p, ...patch } : p));
  set('plans', arr);
}

/* ─── Testimonials ─── */
function TestimonialsEditor({ config, ctx }: { config: SiteConfig; ctx: AdminContext }) {
  const c = config.testimonials;
  const set = (k: keyof typeof c, v: typeof c[keyof typeof c]) =>
    ctx.update('testimonials', { ...c, [k]: v });
  return (
    <Section>
      <TextField label="Heading" value={c.heading} onChange={(v) => set('heading', v)} />
      <TextField label="Subheading" value={c.subheading} onChange={(v) => set('subheading', v)} />
      <SelectField
        label="Layout"
        value={c.layout}
        onChange={(v) => set('layout', v as 'grid' | 'carousel')}
        options={[{ value: 'grid', label: 'Grid Layout' }, { value: 'carousel', label: 'Carousel Layout' }]}
      />
      <AdminPanel title="Testimonials">
        <ListEditor<Testimonial>
          items={c.items}
          addLabel="Add Testimonial"
          onAdd={() => set('items', [...c.items, { id: crypto.randomUUID(), name: 'New Person', role: 'Title, Company', avatar: '', rating: 5, text: 'Review text...' }])}
          onRemove={(i) => set('items', c.items.filter((_, j) => j !== i))}
          onMove={(i, dir) => {
            const arr = [...c.items];
            const swap = dir === 'up' ? i - 1 : i + 1;
            [arr[i], arr[swap]] = [arr[swap], arr[i]];
            set('items', arr);
          }}
          renderItem={(t) => (
            <div className="space-y-2">
              <TextField label="Name" value={t.name} onChange={(v) => updateTestimonial(c, set, t.id, { name: v })} />
              <TextField label="Role" value={t.role} onChange={(v) => updateTestimonial(c, set, t.id, { role: v })} />
              <TextField label="Avatar URL" value={t.avatar} onChange={(v) => updateTestimonial(c, set, t.id, { avatar: v })} />
              <SelectField label="Rating" value={String(t.rating)} onChange={(v) => updateTestimonial(c, set, t.id, { rating: Number(v) })} options={[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: `${n} Star${n > 1 ? 's' : ''}` }))} />
              <TextArea label="Review Text" value={t.text} onChange={(v) => updateTestimonial(c, set, t.id, { text: v })} />
            </div>
          )}
        />
      </AdminPanel>
    </Section>
  );
}

function updateTestimonial(c: SiteConfig['testimonials'], set: (k: keyof SiteConfig['testimonials'], v: SiteConfig['testimonials'][keyof SiteConfig['testimonials']]) => void, id: string, patch: Partial<Testimonial>) {
  const arr = c.items.map((t) => (t.id === id ? { ...t, ...patch } : t));
  set('items', arr);
}

/* ─── FAQ ─── */
function FaqEditor({ config, ctx }: { config: SiteConfig; ctx: AdminContext }) {
  const c = config.faq;
  const set = (k: keyof typeof c, v: typeof c[keyof typeof c]) =>
    ctx.update('faq', { ...c, [k]: v });
  return (
    <Section>
      <TextField label="Heading" value={c.heading} onChange={(v) => set('heading', v)} />
      <TextField label="Subheading" value={c.subheading} onChange={(v) => set('subheading', v)} />
      <AdminPanel title="FAQ Items">
        <ListEditor<FaqItem>
          items={c.items}
          addLabel="Add Question"
          onAdd={() => set('items', [...c.items, { id: crypto.randomUUID(), category: 'General', question: 'New question?', answer: 'Answer here.' }])}
          onRemove={(i) => set('items', c.items.filter((_, j) => j !== i))}
          onMove={(i, dir) => {
            const arr = [...c.items];
            const swap = dir === 'up' ? i - 1 : i + 1;
            [arr[i], arr[swap]] = [arr[swap], arr[i]];
            set('items', arr);
          }}
          renderItem={(item) => (
            <div className="space-y-2">
              <TextField label="Category" value={item.category} onChange={(v) => {
                const arr = c.items.map((x) => x.id === item.id ? { ...x, category: v } : x);
                set('items', arr);
              }} />
              <TextField label="Question" value={item.question} onChange={(v) => {
                const arr = c.items.map((x) => x.id === item.id ? { ...x, question: v } : x);
                set('items', arr);
              }} />
              <TextArea label="Answer" value={item.answer} onChange={(v) => {
                const arr = c.items.map((x) => x.id === item.id ? { ...x, answer: v } : x);
                set('items', arr);
              }} />
            </div>
          )}
        />
      </AdminPanel>
    </Section>
  );
}

/* ─── Orari ─── */
function OrariEditor({ config, ctx }: { config: SiteConfig; ctx: AdminContext }) {
  const c = config.orari;
  const set = (k: keyof typeof c, v: typeof c[keyof typeof c]) =>
    ctx.update('orari', { ...c, [k]: v });
  return (
    <Section>
      <TextField label="Heading" value={c.heading} onChange={(v) => set('heading', v)} />
      <TextField label="Subheading" value={c.subheading} onChange={(v) => set('subheading', v)} />
      <TextArea label="Note" value={c.note} onChange={(v) => set('note', v)} />
      <AdminPanel title="Orari Giornalieri">
        <ListEditor<OrariItem>
          items={c.items}
          addLabel="Add Day"
          onAdd={() => set('items', [...c.items, { id: crypto.randomUUID(), day: 'New Day', lunch: 'Chiuso', dinner: 'Chiuso', closed: false }])}
          onRemove={(i) => set('items', c.items.filter((_, j) => j !== i))}
          onMove={(i, dir) => {
            const arr = [...c.items];
            const swap = dir === 'up' ? i - 1 : i + 1;
            [arr[i], arr[swap]] = [arr[swap], arr[i]];
            set('items', arr);
          }}
          renderItem={(item) => (
            <div className="space-y-2">
              <TextField label="Day" value={item.day} onChange={(v) => {
                const arr = c.items.map((x) => x.id === item.id ? { ...x, day: v } : x);
                set('items', arr);
              }} />
              <div className="grid grid-cols-2 gap-2">
                <TextField label="Pranzo" value={item.lunch} onChange={(v) => {
                  const arr = c.items.map((x) => x.id === item.id ? { ...x, lunch: v } : x);
                  set('items', arr);
                }} />
                <TextField label="Cena" value={item.dinner} onChange={(v) => {
                  const arr = c.items.map((x) => x.id === item.id ? { ...x, dinner: v } : x);
                  set('items', arr);
                }} />
              </div>
              <Toggle label="Chiuso" checked={item.closed} onChange={(v) => {
                const arr = c.items.map((x) => x.id === item.id ? { ...x, closed: v } : x);
                set('items', arr);
              }} />
            </div>
          )}
        />
      </AdminPanel>
    </Section>
  );
}

/* ─── Galleria ─── */
function GalleriaEditor({ config, ctx }: { config: SiteConfig; ctx: AdminContext }) {
  const c = config.galleria;
  const set = (k: keyof typeof c, v: typeof c[keyof typeof c]) =>
    ctx.update('galleria', { ...c, [k]: v });
  return (
    <Section>
      <TextField label="Heading" value={c.heading} onChange={(v) => set('heading', v)} />
      <TextField label="Subheading" value={c.subheading} onChange={(v) => set('subheading', v)} />
      <AdminPanel title="Immagini Galleria">
        <ListEditor<GalleryImage>
          items={c.images}
          addLabel="Add Image"
          onAdd={() => set('images', [...c.images, { id: crypto.randomUUID(), src: '', alt: 'New image', caption: '' }])}
          onRemove={(i) => set('images', c.images.filter((_, j) => j !== i))}
          onMove={(i, dir) => {
            const arr = [...c.images];
            const swap = dir === 'up' ? i - 1 : i + 1;
            [arr[i], arr[swap]] = [arr[swap], arr[i]];
            set('images', arr);
          }}
          renderItem={(img) => (
            <div className="space-y-2">
              <ImageUploadField label="Immagine" value={img.src} onChange={(v) => {
                const arr = c.images.map((x) => x.id === img.id ? { ...x, src: v } : x);
                set('images', arr);
              }} />
              <TextField label="Alt Text" value={img.alt} onChange={(v) => {
                const arr = c.images.map((x) => x.id === img.id ? { ...x, alt: v } : x);
                set('images', arr);
              }} />
              <TextField label="Caption" value={img.caption} onChange={(v) => {
                const arr = c.images.map((x) => x.id === img.id ? { ...x, caption: v } : x);
                set('images', arr);
              }} />
            </div>
          )}
        />
      </AdminPanel>
    </Section>
  );
}

/* ─── Contact Form ─── */
function ContactEditor({ config, ctx }: { config: SiteConfig; ctx: AdminContext }) {
  const c = config.contact;
  const set = (k: keyof typeof c, v: typeof c[keyof typeof c]) =>
    ctx.update('contact', { ...c, [k]: v });
  return (
    <Section>
      <TextField label="Heading" value={c.heading} onChange={(v) => set('heading', v)} />
      <TextField label="Subheading" value={c.subheading} onChange={(v) => set('subheading', v)} />
      <TextField label="Button Text" value={c.buttonText} onChange={(v) => set('buttonText', v)} />
      <TextField label="Success Message" value={c.successMessage} onChange={(v) => set('successMessage', v)} />
      <AdminPanel title="Form Fields">
        <ListEditor<FormFieldDef>
          items={c.fields}
          addLabel="Add Field"
          onAdd={() => set('fields', [...c.fields, { id: crypto.randomUUID(), type: 'text', label: 'New Field', placeholder: '', required: false, options: [] }])}
          onRemove={(i) => set('fields', c.fields.filter((_, j) => j !== i))}
          onMove={(i, dir) => {
            const arr = [...c.fields];
            const swap = dir === 'up' ? i - 1 : i + 1;
            [arr[i], arr[swap]] = [arr[swap], arr[i]];
            set('fields', arr);
          }}
          renderItem={(field) => (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <TextField label="Label" value={field.label} onChange={(v) => updateField(c, set, field.id, { label: v })} />
                <SelectField
                  label="Field Type"
                  value={field.type}
                  onChange={(v) => updateField(c, set, field.id, { type: v as FormFieldDef['type'] })}
                  options={[
                    { value: 'text', label: 'Text' },
                    { value: 'email', label: 'Email' },
                    { value: 'phone', label: 'Phone' },
                    { value: 'textarea', label: 'Textarea' },
                    { value: 'select', label: 'Select Dropdown' },
                  ]}
                />
              </div>
              <TextField label="Placeholder" value={field.placeholder} onChange={(v) => updateField(c, set, field.id, { placeholder: v })} />
              {field.type === 'select' && (
                <TextArea label="Options (one per line)" value={field.options.join('\n')} onChange={(v) => updateField(c, set, field.id, { options: v.split('\n').filter(Boolean) })} />
              )}
              <Toggle label="Required" checked={field.required} onChange={(v) => updateField(c, set, field.id, { required: v })} />
            </div>
          )}
        />
      </AdminPanel>
    </Section>
  );
}

function updateField(c: SiteConfig['contact'], set: (k: keyof SiteConfig['contact'], v: SiteConfig['contact'][keyof SiteConfig['contact']]) => void, id: string, patch: Partial<FormFieldDef>) {
  const arr = c.fields.map((f) => (f.id === id ? { ...f, ...patch } : f));
  set('fields', arr);
}

/* ─── Footer ─── */
function FooterEditor({ config, ctx }: { config: SiteConfig; ctx: AdminContext }) {
  const c = config.footer;
  const set = (k: keyof typeof c, v: typeof c[keyof typeof c]) =>
    ctx.update('footer', { ...c, [k]: v });
  return (
    <Section>
      <TextField label="Logo Text" value={c.logoText} onChange={(v) => set('logoText', v)} />
      <TextArea label="Description" value={c.description} onChange={(v) => set('description', v)} />
      <TextField label="Copyright Text" value={c.copyright} onChange={(v) => set('copyright', v)} />
      <Toggle label="Show Legal Disclaimer" checked={c.showLegalDisclaimer} onChange={(v) => set('showLegalDisclaimer', v)} />
      {c.showLegalDisclaimer && (
        <TextField label="Legal Text" value={c.legalText} onChange={(v) => set('legalText', v)} />
      )}
      <AdminPanel title="Footer Columns">
        <ListEditor<FooterColumn>
          items={c.columns}
          addLabel="Add Column"
          onAdd={() => set('columns', [...c.columns, { id: crypto.randomUUID(), title: 'New Column', links: [] }])}
          onRemove={(i) => set('columns', c.columns.filter((_, j) => j !== i))}
          onMove={(i, dir) => {
            const arr = [...c.columns];
            const swap = dir === 'up' ? i - 1 : i + 1;
            [arr[i], arr[swap]] = [arr[swap], arr[i]];
            set('columns', arr);
          }}
          renderItem={(col) => (
            <div className="space-y-2">
              <TextField label="Column Title" value={col.title} onChange={(v) => {
                const arr = c.columns.map((x) => x.id === col.id ? { ...x, title: v } : x);
                set('columns', arr);
              }} />
              <ListEditor<NavLink>
                items={col.links}
                addLabel="Add Link"
                onAdd={() => {
                  const arr = c.columns.map((x) => x.id === col.id ? { ...x, links: [...x.links, { id: crypto.randomUUID(), label: 'New Link', href: '#' }] } : x);
                  set('columns', arr);
                }}
                onRemove={(j) => {
                  const arr = c.columns.map((x) => x.id === col.id ? { ...x, links: x.links.filter((_, k) => k !== j) } : x);
                  set('columns', arr);
                }}
                onMove={(j, dir) => {
                  const links = [...col.links];
                  const swap = dir === 'up' ? j - 1 : j + 1;
                  [links[j], links[swap]] = [links[swap], links[j]];
                  const arr = c.columns.map((x) => x.id === col.id ? { ...x, links } : x);
                  set('columns', arr);
                }}
                renderItem={(link) => (
                  <div className="grid grid-cols-2 gap-2">
                    <TextField label="Label" value={link.label} onChange={(v) => {
                      const arr = c.columns.map((x) => x.id === col.id ? { ...x, links: x.links.map((l) => l.id === link.id ? { ...l, label: v } : l) } : x);
                      set('columns', arr);
                    }} />
                    <TextField label="URL" value={link.href} onChange={(v) => {
                      const arr = c.columns.map((x) => x.id === col.id ? { ...x, links: x.links.map((l) => l.id === link.id ? { ...l, href: v } : l) } : x);
                      set('columns', arr);
                    }} />
                  </div>
                )}
              />
            </div>
          )}
        />
      </AdminPanel>
      <AdminPanel title="Social Media Icons">
        <ListEditor
          items={c.socials}
          addLabel="Add Social"
          onAdd={() => set('socials', [...c.socials, { id: crypto.randomUUID(), icon: 'Twitter', href: '#' }])}
          onRemove={(i) => set('socials', c.socials.filter((_, j) => j !== i))}
          onMove={(i, dir) => {
            const arr = [...c.socials];
            const swap = dir === 'up' ? i - 1 : i + 1;
            [arr[i], arr[swap]] = [arr[swap], arr[i]];
            set('socials', arr);
          }}
          renderItem={(soc) => (
            <div className="grid grid-cols-2 gap-2">
              <IconPicker label="Icon" value={soc.icon} onChange={(v) => {
                const arr = c.socials.map((x) => x.id === soc.id ? { ...x, icon: v } : x);
                set('socials', arr);
              }} />
              <TextField label="URL" value={soc.href} onChange={(v) => {
                const arr = c.socials.map((x) => x.id === soc.id ? { ...x, href: v } : x);
                set('socials', arr);
              }} />
            </div>
          )}
        />
      </AdminPanel>
    </Section>
  );
}
