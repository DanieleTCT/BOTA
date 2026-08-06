import { useCallback, useEffect, useRef, useState } from 'react';
import type { SiteConfig } from '@/types';
import { loadConfig, loadConfigFromSupabase, saveConfig, publishConfigToSupabase } from '@/lib/config';

export function useConfig(preferLocal = false) {
  const [config, setConfig] = useState<SiteConfig>(() => loadConfig());
  const [loading, setLoading] = useState(true);

  // Load remote config on mount only if not preferring local
  useEffect(() => {
    if (preferLocal) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const remote = await loadConfigFromSupabase();
      if (!cancelled && remote) {
        setConfig(remote);
        // Small delay to ensure smooth transition
        setTimeout(() => setLoading(false), 300);
      } else {
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [preferLocal]);

  // Persist to localStorage only
  useEffect(() => {
    saveConfig(config);
  }, [config]);

  const update = useCallback(<K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateTheme = useCallback(<K extends keyof SiteConfig['theme']>(key: K, value: SiteConfig['theme'][K]) => {
    setConfig((prev) => ({ ...prev, theme: { ...prev.theme, [key]: value } }));
  }, []);

  const toggleSection = useCallback((id: string) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    }));
  }, []);

  const moveSection = useCallback((id: string, dir: 'up' | 'down') => {
    setConfig((prev) => {
      const sections = [...prev.sections];
      const idx = sections.findIndex((s) => s.id === id);
      if (idx < 0) return prev;
      const swap = dir === 'up' ? idx - 1 : idx + 1;
      if (swap < 0 || swap >= sections.length) return prev;
      [sections[idx], sections[swap]] = [sections[swap], sections[idx]];
      return { ...prev, sections };
    });
  }, []);

  const replaceConfig = useCallback((next: SiteConfig) => {
    setLoading(true);
    setConfig(next);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const publish = useCallback(async () => {
    const ok = await publishConfigToSupabase(config);
    return ok;
  }, [config]);

  return { config, update, updateTheme, toggleSection, moveSection, replaceConfig, publish, loading };
}

export function useDebouncedToast(message: string, delay = 1500) {
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!message) return;
    setShow(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setShow(false), delay);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [message, delay]);
  return show;
}
