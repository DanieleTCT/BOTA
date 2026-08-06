/**
 * Site Detection Utility
 * 
 * Determines which site is currently being accessed based on:
 * - Domain/subdomain
 * - Environment variables
 * - URL parameters
 * - Default fallback
 */

import { supabase } from './supabase';

const DEFAULT_SITE_ID = '11111111-1111-1111-1111-111111111111';

export interface SiteInfo {
  id: string;
  name: string;
  domain: string | null;
  status: string;
}

/**
 * Get the current site ID based on the current domain
 */
export async function getCurrentSiteId(): Promise<string> {
  try {
    // 1. Check for explicit site ID in URL (for development/testing)
    const urlParams = new URLSearchParams(window.location.search);
    const siteIdFromUrl = urlParams.get('site_id');
    if (siteIdFromUrl) {
      return siteIdFromUrl;
    }

    // 2. Check for site ID in localStorage (for admin panel)
    const storedSiteId = localStorage.getItem('current_site_id');
    if (storedSiteId) {
      return storedSiteId;
    }

    // 3. Detect from domain/subdomain
    const domain = window.location.hostname;
    const siteIdFromDomain = await getSiteIdByDomain(domain);
    if (siteIdFromDomain) {
      return siteIdFromDomain;
    }

    // 4. Check environment variable
    const envSiteId = import.meta.env.VITE_SITE_ID;
    if (envSiteId) {
      return envSiteId;
    }

    // 5. Fallback to default site
    return DEFAULT_SITE_ID;
  } catch (error) {
    console.error('Error detecting site:', error);
    return DEFAULT_SITE_ID;
  }
}

/**
 * Get site ID by domain name
 */
export async function getSiteIdByDomain(domain: string): Promise<string | null> {
  try {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('sites')
      .select('id')
      .eq('domain', domain)
      .eq('status', 'active')
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data.id;
  } catch (error) {
    console.error('Error getting site by domain:', error);
    return null;
  }
}

/**
 * Get full site information by ID
 */
export async function getSiteInfo(siteId: string): Promise<SiteInfo | null> {
  try {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('id', siteId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      domain: data.domain,
      status: data.status,
    };
  } catch (error) {
    console.error('Error getting site info:', error);
    return null;
  }
}

/**
 * Set the current site ID (for admin panel switching)
 */
export function setCurrentSiteId(siteId: string): void {
  localStorage.setItem('current_site_id', siteId);
}

/**
 * Clear the current site ID (reset to auto-detection)
 */
export function clearCurrentSiteId(): void {
  localStorage.removeItem('current_site_id');
}

/**
 * Get all available sites (for admin panel)
 */
export async function getAllSites(): Promise<SiteInfo[]> {
  try {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .order('name', { ascending: true });

    if (error || !data) {
      return [];
    }

    return data.map(site => ({
      id: site.id,
      name: site.name,
      domain: site.domain,
      status: site.status,
    }));
  } catch (error) {
    console.error('Error getting all sites:', error);
    return [];
  }
}

/**
 * Check if we're running in development mode
 */
export function isDevelopment(): boolean {
  return import.meta.env.DEV || import.meta.env.MODE === 'development';
}

/**
 * Get site ID for development/testing
 * In development, you can specify a site ID via URL parameter
 */
export async function getDevelopmentSiteId(): Promise<string> {
  if (!isDevelopment()) {
    return await getCurrentSiteId();
  }

  // In development, allow site selection via URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const devSiteId = urlParams.get('site_id');
  
  if (devSiteId) {
    return devSiteId;
  }

  return await getCurrentSiteId();
}