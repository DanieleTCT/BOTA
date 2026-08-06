import type { AdminContext } from './AdminDashboard';
import type { SiteConfig } from '@/types';
import { AdminPanel, ColorField, SelectField, NumberField, Toggle } from './Controls';

const FONT_OPTIONS = [
  { value: 'inter', label: 'Inter (Modern Sans)' },
  { value: 'poppins', label: 'Poppins (Geometric Sans)' },
  { value: 'roboto', label: 'Roboto (Neutral Sans)' },
  { value: 'playfair', label: 'Playfair Display (Elegant Serif)' },
  { value: 'mono', label: 'JetBrains Mono (Monospace)' },
];

const RADIUS_OPTIONS = [
  { value: 'none', label: 'Sharp (0px)' },
  { value: 'sm', label: 'Slightly Rounded (4px)' },
  { value: 'md', label: 'Rounded (8px)' },
  { value: 'lg', label: 'Very Rounded (16px)' },
  { value: 'xl', label: 'Pill-like (24px)' },
];

const SHADOW_OPTIONS = [
  { value: 'none', label: 'No Shadow' },
  { value: 'sm', label: 'Subtle Shadow' },
  { value: 'md', label: 'Medium Shadow' },
  { value: 'lg', label: 'Large Shadow' },
  { value: 'xl', label: 'Extra Large Shadow' },
];

export function ThemeEditor({ config, ctx }: { config: SiteConfig; ctx: AdminContext }) {
  const { theme } = config;
  const t = ctx.updateTheme;

  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-slate-800">Theme & Design System</h2>
      <p className="mb-6 text-sm text-slate-500">Customize the global look and feel. Changes preview in real-time.</p>

      <div className="grid gap-4 lg:grid-cols-2">
        <AdminPanel title="Mode" description="Light or dark appearance">
          <Toggle label="Dark Mode" checked={theme.mode === 'dark'} onChange={(v) => t('mode', v ? 'dark' : 'light')} />
        </AdminPanel>

        <AdminPanel title="Typography" description="Font family and base size">
          <SelectField label="Font Family" value={theme.fontPreset} onChange={(v) => t('fontPreset', v as SiteConfig['theme']['fontPreset'])} options={FONT_OPTIONS} />
          <NumberField label="Base Font Size (px)" value={theme.baseFontSize} onChange={(v) => t('baseFontSize', v)} min={12} max={20} />
        </AdminPanel>

        <AdminPanel title="Color Palette" description="Core brand colors">
          <ColorField label="Primary" value={theme.primary} onChange={(v) => t('primary', v)} />
          <ColorField label="Secondary" value={theme.secondary} onChange={(v) => t('secondary', v)} />
          <ColorField label="Background" value={theme.background} onChange={(v) => t('background', v)} />
          <ColorField label="Accent" value={theme.accent} onChange={(v) => t('accent', v)} />
          <ColorField label="Text" value={theme.text} onChange={(v) => t('text', v)} />
          <ColorField label="Muted Text" value={theme.mutedText} onChange={(v) => t('mutedText', v)} />
          <ColorField label="Card Background" value={theme.card} onChange={(v) => t('card', v)} />
          <ColorField label="Border" value={theme.border} onChange={(v) => t('border', v)} />
        </AdminPanel>

        <AdminPanel title="Shape & Depth" description="Border radius and shadow style">
          <SelectField label="Border Radius" value={theme.radius} onChange={(v) => t('radius', v as SiteConfig['theme']['radius'])} options={RADIUS_OPTIONS} />
          <SelectField label="Shadow Style" value={theme.shadow} onChange={(v) => t('shadow', v as SiteConfig['theme']['shadow'])} options={SHADOW_OPTIONS} />
        </AdminPanel>
      </div>

      {/* Live Preview */}
      <div className="mt-4">
        <AdminPanel title="Live Preview" description="A snapshot of how your theme looks">
          <div
            className="rounded-xl p-6"
            style={{
              backgroundColor: theme.mode === 'dark' ? '#1a1a2e' : theme.background,
              border: `1px solid ${theme.border}`,
              borderRadius: 'var(--radius-main)',
            }}
          >
            <div className="mb-3 flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg" style={{ backgroundColor: theme.primary }} />
              <div className="h-8 w-8 rounded-lg" style={{ backgroundColor: theme.secondary }} />
              <div className="h-8 w-8 rounded-lg" style={{ backgroundColor: theme.accent }} />
            </div>
            <h4 className="text-lg font-extrabold" style={{ color: theme.mode === 'dark' ? '#f1f5f9' : theme.text }}>
              Sample Heading
            </h4>
            <p className="mt-1 text-sm" style={{ color: theme.mode === 'dark' ? '#94a3b8' : theme.mutedText }}>
              This is how your body text will look with the current theme settings.
            </p>
            <div className="mt-4 flex gap-3">
              <button className="rounded-full px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: theme.primary }}>
                Primary Button
              </button>
              <button
                className="rounded-full border-2 px-5 py-2 text-sm font-semibold"
                style={{ borderColor: theme.primary, color: theme.primary }}
              >
                Outline Button
              </button>
            </div>
            <div
              className="mt-4 rounded-lg p-4"
              style={{
                backgroundColor: theme.mode === 'dark' ? '#16213e' : theme.card,
                border: `1px solid ${theme.border}`,
                boxShadow: 'var(--shadow-main)',
                borderRadius: 'var(--radius-main)',
              }}
            >
              <div className="text-sm font-bold" style={{ color: theme.mode === 'dark' ? '#f1f5f9' : theme.text }}>
                Card Component
              </div>
              <div className="mt-1 text-xs" style={{ color: theme.mode === 'dark' ? '#94a3b8' : theme.mutedText }}>
                Cards, buttons, and sections all use your radius and shadow settings.
              </div>
            </div>
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}
