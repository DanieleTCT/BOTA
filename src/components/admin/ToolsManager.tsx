import type { AdminContext } from './AdminDashboard';
import type { SiteConfig } from '@/types';
import { AdminPanel, TextField, TextArea, Toggle } from './Controls';

export function ToolsManager({ config, ctx }: { config: SiteConfig; ctx: AdminContext }) {
  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-slate-800">Tools & Widgets</h2>
      <p className="mb-6 text-sm text-slate-500">Manage floating buttons, cookie consent, SEO, and custom code injection.</p>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* WhatsApp */}
        <AdminPanel title="Floating WhatsApp Button" description="A floating contact button that appears on every page">
          <Toggle
            label="Enable WhatsApp Button"
            checked={config.whatsapp.enabled}
            onChange={(v) => ctx.update('whatsapp', { ...config.whatsapp, enabled: v })}
          />
          {config.whatsapp.enabled && (
            <>
              <TextField
                label="Phone Number (international format, no +)"
                value={config.whatsapp.phone}
                onChange={(v) => ctx.update('whatsapp', { ...config.whatsapp, phone: v })}
                placeholder="15551234567"
              />
              <TextArea
                label="Predefined Message"
                value={config.whatsapp.message}
                onChange={(v) => ctx.update('whatsapp', { ...config.whatsapp, message: v })}
              />
            </>
          )}
        </AdminPanel>

        {/* Cookie Consent */}
        <AdminPanel title="Cookie Consent Banner" description="GDPR-style consent banner shown to new visitors">
          <Toggle
            label="Enable Cookie Banner"
            checked={config.cookie.enabled}
            onChange={(v) => ctx.update('cookie', { ...config.cookie, enabled: v })}
          />
          {config.cookie.enabled && (
            <>
              <TextArea
                label="Banner Message"
                value={config.cookie.message}
                onChange={(v) => ctx.update('cookie', { ...config.cookie, message: v })}
              />
              <div className="grid grid-cols-2 gap-3">
                <TextField
                  label="Accept Button Text"
                  value={config.cookie.acceptText}
                  onChange={(v) => ctx.update('cookie', { ...config.cookie, acceptText: v })}
                />
                <TextField
                  label="Decline Button Text"
                  value={config.cookie.declineText}
                  onChange={(v) => ctx.update('cookie', { ...config.cookie, declineText: v })}
                />
              </div>
            </>
          )}
        </AdminPanel>

        {/* SEO */}
        <AdminPanel title="SEO Meta Tags" description="Control how your site appears in search results and social shares">
          <TextField
            label="Page Title"
            value={config.seo.pageTitle}
            onChange={(v) => ctx.update('seo', { ...config.seo, pageTitle: v })}
          />
          <TextArea
            label="Meta Description"
            value={config.seo.metaDescription}
            onChange={(v) => ctx.update('seo', { ...config.seo, metaDescription: v })}
          />
          <TextField
            label="Open Graph Image URL"
            value={config.seo.ogImageUrl}
            onChange={(v) => ctx.update('seo', { ...config.seo, ogImageUrl: v })}
            placeholder="https://example.com/og-image.png"
          />
          {config.seo.ogImageUrl && (
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <img src={config.seo.ogImageUrl} alt="OG Preview" className="h-32 w-full object-cover" />
            </div>
          )}
        </AdminPanel>

        {/* Code Injection */}
        <AdminPanel title="Custom Code Injection" description="Add analytics or custom scripts to your site">
          <TextField
            label="Google Analytics ID"
            value={config.code.googleAnalyticsId}
            onChange={(v) => ctx.update('code', { ...config.code, googleAnalyticsId: v })}
            placeholder="G-XXXXXXXXXX"
          />
          <TextArea
            label="Custom Head Scripts"
            value={config.code.customHeadScripts}
            onChange={(v) => ctx.update('code', { ...config.code, customHeadScripts: v })}
            rows={4}
          />
          <TextArea
            label="Custom Body Scripts"
            value={config.code.customBodyScripts}
            onChange={(v) => ctx.update('code', { ...config.code, customBodyScripts: v })}
            rows={4}
          />
        </AdminPanel>
      </div>
    </div>
  );
}
