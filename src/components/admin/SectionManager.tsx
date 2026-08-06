import { ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react';
import type { AdminContext } from './AdminDashboard';
import type { SiteConfig } from '@/types';
import {
  Megaphone, Menu, Zap, LayoutGrid, Image, DollarSign,
  Star, HelpCircle, Mail, Columns3, Package, Clock, Camera,
} from 'lucide-react';

const SECTION_INFO: Record<string, { label: string; icon: typeof Megaphone; desc: string }> = {
  announcement: { label: 'Announcement Bar', icon: Megaphone, desc: 'Dismissable promo banner' },
  header: { label: 'Header & Navigation', icon: Menu, desc: 'Logo, menu links, CTA' },
  hero: { label: 'Hero Section', icon: Zap, desc: 'Headline, CTAs, background' },
  features: { label: 'Feature Grid', icon: LayoutGrid, desc: 'Cards with icons' },
  about: { label: 'About / Media', icon: Image, desc: 'Text, image, stats' },
  products: { label: 'Products', icon: Package, desc: 'Product cards grid/list' },
  pricing: { label: 'Pricing Tables', icon: DollarSign, desc: 'Plans and pricing' },
  testimonials: { label: 'Testimonials', icon: Star, desc: 'Reviews and ratings' },
  faq: { label: 'FAQ Accordion', icon: HelpCircle, desc: 'Q&A with categories' },
  orari: { label: 'Orari di Apertura', icon: Clock, desc: 'Opening hours table' },
  galleria: { label: 'Galleria', icon: Camera, desc: 'Photo gallery grid' },
  contact: { label: 'Contact Form', icon: Mail, desc: 'Lead capture form' },
  footer: { label: 'Footer', icon: Columns3, desc: 'Links, socials, copyright' },
};

export function SectionManager({ config, ctx }: { config: SiteConfig; ctx: AdminContext }) {
  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-slate-800">Section Manager</h2>
      <p className="mb-6 text-sm text-slate-500">Toggle sections on/off and reorder them. Changes apply instantly to your live site.</p>

      <div className="space-y-2">
        {config.sections.map((section, idx) => {
          const info = SECTION_INFO[section.id];
          const Icon = info.icon;
          return (
            <div
              key={section.id}
              className={`flex items-center gap-3 rounded-xl border bg-white p-4 transition ${
                section.enabled ? 'border-slate-200' : 'border-slate-200 opacity-50'
              }`}
            >
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => ctx.moveSection(section.id, 'up')}
                  disabled={idx === 0}
                  className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => ctx.moveSection(section.id, 'down')}
                  disabled={idx === config.sections.length - 1}
                  className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Icon className="h-5 w-5 text-blue-600" />
              </div>

              <div className="flex-1">
                <div className="text-sm font-bold text-slate-800">{info.label}</div>
                <div className="text-xs text-slate-500">{info.desc}</div>
              </div>

              <div className="text-xs font-semibold text-slate-400">#{idx + 1}</div>

              <button
                onClick={() => ctx.toggleSection(section.id)}
                className={`flex h-8 w-14 items-center rounded-full p-1 transition ${
                  section.enabled ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`h-6 w-6 rounded-full bg-white shadow transition-transform ${
                    section.enabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                >
                  {section.enabled ? (
                    <Eye className="h-full w-full p-1 text-blue-600" />
                  ) : (
                    <EyeOff className="h-full w-full p-1 text-slate-400" />
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
