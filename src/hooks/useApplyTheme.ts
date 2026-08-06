import { useEffect } from 'react';
import type { SiteConfig } from '@/types';

const FONT_MAP: Record<string, string> = {
  inter: "'Inter', system-ui, sans-serif",
  poppins: "'Poppins', system-ui, sans-serif",
  roboto: "'Roboto', system-ui, sans-serif",
  playfair: "'Playfair Display', Georgia, serif",
  mono: "'JetBrains Mono', 'Courier New', monospace",
};

const RADIUS_MAP: Record<string, string> = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '16px',
  xl: '24px',
};

const SHADOW_MAP: Record<string, string> = {
  none: 'none',
  sm: '0 1px 3px rgba(0,0,0,0.08)',
  md: '0 4px 12px rgba(0,0,0,0.10)',
  lg: '0 10px 30px rgba(0,0,0,0.12)',
  xl: '0 20px 50px rgba(0,0,0,0.15)',
};

export function useApplyTheme(config: SiteConfig) {
  const { theme } = config;
  useEffect(() => {
    const root = document.documentElement;
    const isDark = theme.mode === 'dark';
    const bg = isDark ? darken(theme.background) : theme.background;
    const card = isDark ? darken(theme.card, 15) : theme.card;
    const text = isDark ? lighten(theme.text) : theme.text;
    const mutedText = isDark ? lighten(theme.mutedText, 10) : theme.mutedText;
    const border = isDark ? lighten(theme.border, 10) : theme.border;

    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-secondary', theme.secondary);
    root.style.setProperty('--color-bg', bg);
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-text', text);
    root.style.setProperty('--color-muted', mutedText);
    root.style.setProperty('--color-card', card);
    root.style.setProperty('--color-border', border);
    root.style.setProperty('--font-main', FONT_MAP[theme.fontPreset] ?? FONT_MAP.inter);
    root.style.setProperty('--radius-main', RADIUS_MAP[theme.radius] ?? RADIUS_MAP.lg);
    root.style.setProperty('--shadow-main', SHADOW_MAP[theme.shadow] ?? SHADOW_MAP.md);
    root.style.fontSize = `${theme.baseFontSize}px`;
  }, [theme]);
}

function darken(hex: string, amount = 30): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(Math.max(0, r - amount), Math.max(0, g - amount), Math.max(0, b - amount));
}

function lighten(hex: string, amount = 30): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(Math.min(255, r + amount), Math.min(255, g + amount), Math.min(255, b + amount));
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}
