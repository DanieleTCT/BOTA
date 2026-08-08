export type SectionId =
  | 'announcement'
  | 'header'
  | 'hero'
  | 'features'
  | 'about'
  | 'products'
  | 'pricing'
  | 'testimonials'
  | 'faq'
  | 'orari'
  | 'galleria'
  | 'contact'
  | 'footer';

export type MealType = 'lunch' | 'dinner' | 'both';
export type DishType = 'antipasto' | 'primo' | 'contorno' | 'secondo' | 'dolce' | 'bevanda' | 'pizza' | 'altro';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface SectionMeta {
  id: SectionId;
  enabled: boolean;
}

export type ThemeMode = 'light' | 'dark';
export type RadiusStyle = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type ShadowStyle = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type FontPreset = 'inter' | 'poppins' | 'roboto' | 'playfair' | 'mono';

export interface ThemeConfig {
  mode: ThemeMode;
  primary: string;
  secondary: string;
  background: string;
  accent: string;
  text: string;
  mutedText: string;
  card: string;
  border: string;
  fontPreset: FontPreset;
  baseFontSize: number;
  radius: RadiusStyle;
  shadow: ShadowStyle;
}

export interface NavLink {
  id: string;
  label: string;
  href: string;
}

export interface AnnouncementConfig {
  text: string;
  linkText: string;
  linkHref: string;
  bg: string;
  fg: string;
}

export interface HeaderConfig {
  logoText: string;
  logoUrl: string;
  links: NavLink[];
  ctaText: string;
  ctaHref: string;
  sticky: boolean;
}

export interface HeroConfig {
  badge: string;
  title: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  bgType: 'gradient' | 'image';
  gradientFrom: string;
  gradientTo: string;
  imageUrl: string;
  overlayOpacity: number;
}

export interface FeatureCard {
  id: string;
  icon: string;
  title: string;
  description: string;
  badge: string;
}

export interface FeaturesConfig {
  heading: string;
  subheading: string;
  columns: 2 | 3 | 4;
  cards: FeatureCard[];
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
}

export interface AboutConfig {
  heading: string;
  body: string;
  imageUrl: string;
  imageAlt: string;
  stats: StatItem[];
}

export interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: string;
  yearlyPrice: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonHref: string;
  popular: boolean;
}

export interface PricingConfig {
  heading: string;
  subheading: string;
  plans: PricingPlan[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  badge?: string;
  features: string[];
  ingredients: string;
  allergens: string;
  buttonText: string;
  buttonHref: string;
  categoryId: string;
  meal: MealType;
  dishType: DishType;
  availableDays?: DayOfWeek[];
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface NightModeTheme {
  enabled: boolean;
  background: string;
  cardBackground: string;
  textPrimary: string;
  textSecondary: string;
  borderColor: string;
  accentColor: string;
  badgeBackground: string;
  badgeText: string;
}

export interface ProductsConfig {
  heading: string;
  subheading: string;
  layout: 'grid' | 'list';
  columns: 2 | 3 | 4;
  categories: MenuCategory[];
  products: Product[];
  nightModeTheme: NightModeTheme;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
}

export interface TestimonialsConfig {
  heading: string;
  subheading: string;
  layout: 'grid' | 'carousel';
  items: Testimonial[];
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface FaqConfig {
  heading: string;
  subheading: string;
  items: FaqItem[];
}

export interface OrariItem {
  id: string;
  day: string;
  lunch: string;
  dinner: string;
  closed: boolean;
}

export interface OrariConfig {
  heading: string;
  subheading: string;
  items: OrariItem[];
  note: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption: string;
}

export interface GalleryConfig {
  heading: string;
  subheading: string;
  images: GalleryImage[];
}

export type FormFieldType = 'text' | 'email' | 'phone' | 'textarea' | 'select';

export interface FormFieldDef {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder: string;
  required: boolean;
  options: string[];
}

export interface ContactConfig {
  heading: string;
  subheading: string;
  buttonText: string;
  fields: FormFieldDef[];
  successMessage: string;
}

export interface FooterColumn {
  id: string;
  title: string;
  links: NavLink[];
}

export interface FooterConfig {
  logoText: string;
  description: string;
  columns: FooterColumn[];
  socials: { id: string; icon: string; href: string }[];
  copyright: string;
  showLegalDisclaimer: boolean;
  legalText: string;
}

export interface WhatsAppConfig {
  enabled: boolean;
  phone: string;
  message: string;
}

export interface CookieConfig {
  enabled: boolean;
  message: string;
  acceptText: string;
  declineText: string;
}

export interface SeoConfig {
  pageTitle: string;
  metaDescription: string;
  ogImageUrl: string;
}

export interface CodeInjectionConfig {
  googleAnalyticsId: string;
  customHeadScripts: string;
  customBodyScripts: string;
}

export interface SiteConfig {
  version: number;
  sections: SectionMeta[];
  theme: ThemeConfig;
  announcement: AnnouncementConfig;
  header: HeaderConfig;
  hero: HeroConfig;
  features: FeaturesConfig;
  about: AboutConfig;
  products: ProductsConfig;
  pricing: PricingConfig;
  testimonials: TestimonialsConfig;
  faq: FaqConfig;
  orari: OrariConfig;
  galleria: GalleryConfig;
  contact: ContactConfig;
  footer: FooterConfig;
  whatsapp: WhatsAppConfig;
  cookie: CookieConfig;
  seo: SeoConfig;
  code: CodeInjectionConfig;
}

export type SubmissionStatus = 'received' | 'processing' | 'submitted' | 'archived';

export interface FormSubmission {
  id: string;
  created_at: string;
  data: Record<string, string>;
  status: SubmissionStatus;
}