import type { SiteConfig } from '@/types';
import { DEFAULT_CONFIG, STORAGE_KEY } from '@/defaults';
import { supabase } from '@/lib/supabase';
import { getCurrentSiteId } from './siteDetection';

export function loadConfig(): SiteConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_CONFIG);
    const parsed = JSON.parse(raw) as Partial<SiteConfig>;
    return mergeWithDefaults(parsed);
  } catch {
    return structuredClone(DEFAULT_CONFIG);
  }
}

export async function loadConfigFromSupabase(): Promise<SiteConfig> {
  if (!supabase) return loadConfig();
  try {
    const siteId = await getCurrentSiteId();
    const { data, error } = await supabase
      .from('site_config')
      .select('data')
      .eq('site_id', siteId)
      .maybeSingle();
    
    if (error || !data || !data.data || Object.keys(data.data).length === 0) {
      // No config exists for this site, return defaults
      return structuredClone(DEFAULT_CONFIG);
    }
    
    return mergeWithDefaults(data.data as Partial<SiteConfig>);
  } catch {
    return loadConfig();
  }
}

export function saveConfig(config: SiteConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export async function saveConfigToSupabase(config: SiteConfig): Promise<boolean> {
  if (!supabase) return false;
  try {
    const siteId = await getCurrentSiteId();
    
    // Use upsert to handle both insert and update atomically
    const { error } = await supabase
      .from('site_config')
      .upsert({ site_id: siteId, data: config }, { onConflict: 'site_id' });
    
    if (error) {
      console.error('Error saving config to Supabase:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving config to Supabase:', error);
    return false;
  }
}

export async function publishConfigToSupabase(config: SiteConfig): Promise<boolean> {
  const ok = await saveConfigToSupabase(config);
  if (ok) {
    saveConfig(config);
  }
  return ok;
}

export function resetConfig(): SiteConfig {
  const fresh = structuredClone(DEFAULT_CONFIG);
  saveConfig(fresh);
  return fresh;
}

/**
 * Initialize default config in Supabase for a site if not present
 * This ensures the default template is available online
 */
export async function initializeDefaultConfig(): Promise<boolean> {
  if (!supabase) return false;
  try {
    const siteId = await getCurrentSiteId();
    
    // Check if config exists
    const { data, error: selectError } = await supabase
      .from('site_config')
      .select('data')
      .eq('site_id', siteId)
      .maybeSingle();
    
    if (selectError) {
      console.error('Error checking config:', selectError);
      return false;
    }
    
    // If no config or empty config, seed with defaults
    if (!data || !data.data || Object.keys(data.data).length === 0) {
      const { error: insertError } = await supabase
        .from('site_config')
        .insert({ site_id: siteId, data: structuredClone(DEFAULT_CONFIG) });
      
      if (insertError) {
        console.error('Error seeding default config:', insertError);
        return false;
      }
      
      console.log('Default config seeded for site:', siteId);
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing default config:', error);
    return false;
  }
}

export function exportConfig(config: SiteConfig): void {
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `website-template-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importConfig(file: File): Promise<SiteConfig> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string) as Partial<SiteConfig>;
        resolve(mergeWithDefaults(parsed));
      } catch {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

function mergeWithDefaults(partial: Partial<SiteConfig>): SiteConfig {
  const base = structuredClone(DEFAULT_CONFIG);
  if (!partial || typeof partial !== 'object') return base;
  return {
    ...base,
    ...partial,
    theme: { ...base.theme, ...(partial.theme ?? {}) },
    announcement: { ...base.announcement, ...(partial.announcement ?? {}) },
    header: { ...base.header, ...(partial.header ?? {}) },
    hero: { ...base.hero, ...(partial.hero ?? {}) },
    features: { ...base.features, ...(partial.features ?? {}) },
    about: { ...base.about, ...(partial.about ?? {}) },
    products: { ...base.products, ...(partial.products ?? {}) },
    pricing: { ...base.pricing, ...(partial.pricing ?? {}) },
    testimonials: { ...base.testimonials, ...(partial.testimonials ?? {}) },
    faq: { ...base.faq, ...(partial.faq ?? {}) },
    orari: { ...base.orari, ...(partial.orari ?? {}) },
    galleria: { ...base.galleria, ...(partial.galleria ?? {}) },
    contact: { ...base.contact, ...(partial.contact ?? {}) },
    footer: { ...base.footer, ...(partial.footer ?? {}) },
    whatsapp: { ...base.whatsapp, ...(partial.whatsapp ?? {}) },
    cookie: { ...base.cookie, ...(partial.cookie ?? {}) },
    seo: { ...base.seo, ...(partial.seo ?? {}) },
    code: { ...base.code, ...(partial.code ?? {}) },
    sections: partial.sections ?? base.sections,
  };
}
