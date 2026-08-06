import type { SiteConfig, SectionId } from '@/types';
import { AnnouncementBar } from '@/components/sections/AnnouncementBar';
import { Header } from '@/components/sections/Header';
import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { About } from '@/components/sections/About';
import { ProductsSection } from '@/components/sections/ProductsSection';
import { Pricing } from '@/components/sections/Pricing';
import { Testimonials } from '@/components/sections/Testimonials';
import { Faq } from '@/components/sections/Faq';
import { Orari } from '@/components/sections/Orari';
import { Galleria } from '@/components/sections/Galleria';
import { ContactForm } from '@/components/sections/ContactForm';
import { Footer } from '@/components/sections/Footer';
import { FloatingWhatsApp } from '@/components/widgets/FloatingWhatsApp';
import { CookieBanner } from '@/components/widgets/CookieBanner';

const SECTION_RENDERERS: Record<SectionId, (config: SiteConfig) => React.ReactNode> = {
  announcement: (c) => <AnnouncementBar config={c.announcement} />,
  header: (c) => <Header config={c.header} />,
  hero: (c) => <Hero config={c.hero} />,
  features: (c) => <Features config={c.features} />,
  about: (c) => <About config={c.about} />,
  products: (c) => <ProductsSection config={c} />,
  pricing: (c) => <Pricing config={c.pricing} />,
  testimonials: (c) => <Testimonials config={c.testimonials} />,
  faq: (c) => <Faq config={c.faq} />,
  orari: (c) => <Orari config={c.orari} />,
  galleria: (c) => <Galleria config={c.galleria} />,
  contact: (c) => <ContactForm config={c.contact} />,
  footer: (c) => <Footer config={c.footer} />,
};

export function PublicPage({ config }: { config: SiteConfig }) {
  const enabled = config.sections.filter((s) => s.enabled);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {enabled.map((section) => (
        <div key={section.id}>{SECTION_RENDERERS[section.id](config)}</div>
      ))}
      <FloatingWhatsApp config={config.whatsapp} />
      <CookieBanner config={config.cookie} />
    </div>
  );
}