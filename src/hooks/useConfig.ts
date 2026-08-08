import { useCallback, useEffect, useRef, useState } from 'react';
import type { SiteConfig } from '@/types';
import { loadConfig, loadConfigFromSupabase, saveConfig, publishConfigToSupabase } from '@/lib/config';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function useConfig(preferLocal = false) {
  const [config, setConfig] = useState<SiteConfig>(() => loadConfig());
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadedRef = useRef(false);
  const isAdmin = preferLocal;

  // Load remote config on mount (both for admin and public)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const remote = await loadConfigFromSupabase();
      if (!cancelled && remote) {
        setConfig(remote);
        loadedRef.current = true;
        // Small delay to ensure smooth transition
        setTimeout(() => setLoading(false), 300);
      } else {
        loadedRef.current = true;
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Persist to localStorage
  useEffect(() => {
    saveConfig(config);
  }, [config]);

  // Auto-save to Supabase with debounce (only in admin mode, after initial load)
  useEffect(() => {
    if (!isAdmin || !loadedRef.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveStatus('saving');
    saveTimer.current = setTimeout(async () => {
      const ok = await publishConfigToSupabase(config);
      setSaveStatus(ok ? 'saved' : 'error');
      // Reset to idle after a short delay
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1500);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [config, isAdmin]);

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
    setSaveStatus('saving');
    const ok = await publishConfigToSupabase(config);
    setSaveStatus(ok ? 'saved' : 'error');
    setTimeout(() => setSaveStatus('idle'), 2000);
    return ok;
  }, [config]);

  return { config, update, updateTheme, toggleSection, moveSection, replaceConfig, publish, loading, saveStatus };
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