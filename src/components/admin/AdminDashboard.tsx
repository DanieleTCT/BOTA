import { useState, useEffect, useRef } from 'react';
import {
  LayoutGrid, Palette, Zap, Mail, Settings, Download, RotateCcw,
  ChevronDown, ExternalLink, Globe, Server, Package, FolderOpen, Upload,
} from 'lucide-react';
import type { SectionId } from '@/types';
import { useConfig } from '@/hooks/useConfig';
import { useToast } from '@/hooks/useToast';
import { resetConfig, exportConfig, importConfig, initializeDefaultConfig } from '@/lib/config';
import { SectionManager } from '@/components/admin/SectionManager';
import { ThemeEditor } from '@/components/admin/ThemeEditor';
import { ContentEditors } from '@/components/admin/ContentEditors';
import { ProductsManager } from '@/components/admin/ProductsManager';
import { LeadsManager } from '@/components/admin/LeadsManager';
import { ToolsManager } from '@/components/admin/ToolsManager';
import { BackupManager } from '@/components/admin/BackupManager';
import { getCurrentSiteId, getSiteInfo, getAllSites, setCurrentSiteId, type SiteInfo } from '@/lib/siteDetection';
import { listSiteFiles, deleteSiteFile, uploadSiteFile } from '@/lib/storage';

type Tab = 'sections' | 'theme' | 'content' | 'products' | 'media' | 'leads' | 'tools' | 'backup';

const TABS: { id: Tab; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'sections', label: 'Sections', icon: LayoutGrid },
  { id: 'theme', label: 'Theme', icon: Palette },
  { id: 'content', label: 'Content', icon: Settings },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'media', label: 'Media', icon: FolderOpen },
  { id: 'leads', label: 'Leads', icon: Mail },
  { id: 'tools', label: 'Tools', icon: Zap },
  { id: 'backup', label: 'Backup', icon: Download },
];

export function AdminDashboard() {
  const ctx = useConfig();
  const { config } = ctx;
  const { notify } = useToast();
  const [tab, setTab] = useState<Tab>('sections');
  const [currentSiteId, setCurrentSiteIdState] = useState<string>('');
  const [currentSite, setCurrentSite] = useState<SiteInfo | null>(null);
  const [allSites, setAllSites] = useState<SiteInfo[]>([]);
  const [showSiteSelector, setShowSiteSelector] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Media manager state
  const [mediaFiles, setMediaFiles] = useState<Array<{ name: string; url: string; id?: string; updated_at?: string }>>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load current site information
  useEffect(() => {
    async function loadSiteInfo() {
      try {
        setLoading(true);
        setError(null);
        
        const siteId = await getCurrentSiteId();
        setCurrentSiteIdState(siteId);
        
        const site = await getSiteInfo(siteId);
        setCurrentSite(site);
        
        const sites = await getAllSites();
        setAllSites(sites);
      } catch (error) {
        console.error('Error loading site info:', error);
        setError('Failed to load site information');
        // Set default values on error
        setCurrentSiteIdState('00000000-0000-0000-0000-000000000000');
        setCurrentSite({
          id: '00000000-0000-0000-0000-000000000000',
          name: 'Default Site',
          domain: null,
          status: 'active'
        });
        setAllSites([]);
      } finally {
        setLoading(false);
      }
    }
    
    loadSiteInfo();
  }, []);

  // Initialize default config in Supabase on mount if needed
  useEffect(() => {
    async function initConfig() {
      const initialized = await initializeDefaultConfig();
      if (initialized) {
        notify('Default config initialized online for this site', 'success');
      }
    }
    initConfig();
  }, [notify]);

  const handleReset = () => {
    if (confirm('Reset all content and settings to default demo data? This cannot be undone.')) {
      const fresh = resetConfig();
      ctx.replaceConfig(fresh);
      notify('Reset to default demo data', 'success');
    }
  };

  const handleExport = () => {
    exportConfig(config);
    notify('Template exported as JSON', 'success');
  };

  const handlePublish = async () => {
    const ok = await ctx.publish();
    const siteName = currentSite?.name || 'Default';
    notify(
      ok ? `Config published for site: ${siteName}` : 'Publish failed',
      ok ? 'success' : 'error'
    );
  };

  const handleSiteChange = async (siteId: string) => {
    setCurrentSiteId(siteId);
    setCurrentSiteIdState(siteId);
    const site = await getSiteInfo(siteId);
    setCurrentSite(site);
    setShowSiteSelector(false);
    
    // Reload config for the new site
    notify(`Switched to site: ${site?.name || 'Unknown'}`, 'success');
    
    // Refresh the page to reload config for the new site
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleImport = async (file: File) => {
    try {
      const imported = await importConfig(file);
      ctx.replaceConfig(imported);
      notify('Template imported successfully', 'success');
    } catch {
      notify('Failed to import: invalid JSON file', 'error');
    }
  };

  // Media manager functions
  const refreshMedia = async () => {
    setLoadingMedia(true);
    setMediaError(null);
    try {
      const files = await listSiteFiles();
      setMediaFiles(files);
    } catch (err) {
      setMediaError(err instanceof Error ? err.message : 'Failed to load media');
    } finally {
      setLoadingMedia(false);
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    setMediaError(null);
    try {
      await uploadSiteFile(file.name, file);
      await refreshMedia();
      notify('Immagine caricata con successo!', 'success');
    } catch (err) {
      setMediaError(err instanceof Error ? err.message : 'Upload failed');
      notify('Errore nel caricamento', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleMediaDelete = async (path: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo file?')) return;
    try {
      await deleteSiteFile(path);
      await refreshMedia();
      notify('File eliminato', 'success');
    } catch (err) {
      setMediaError(err instanceof Error ? err.message : 'Delete failed');
      notify('Errore nell\'eliminazione', 'error');
    }
  };

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      notify('URL copiato negli appunti', 'success');
    } catch {
      notify('Impossibile copiare l\'URL', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800">CMS Dashboard</h1>
              <p className="text-xs text-slate-500">
                {loading ? 'Loading...' : currentSite ? `Site: ${currentSite.name}` : 'Website Framework Admin'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {error && (
              <div className="rounded-lg bg-red-50 px-3 py-1.5 text-xs text-red-600">
                {error}
              </div>
            )}
            {/* Site Selector */}
            {allSites.length > 1 && (
              <div className="relative">
                <button
                  onClick={() => setShowSiteSelector(!showSiteSelector)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <Server className="h-3.5 w-3.5" />
                  {currentSite?.name || 'Select Site'}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {showSiteSelector && (
                  <div className="absolute right-0 top-full z-50 mt-1 w-64 rounded-lg border border-slate-200 bg-white shadow-lg">
                    <div className="p-2">
                      <div className="mb-1 px-2 text-xs font-semibold text-slate-500">
                        Select Site
                      </div>
                      {allSites.map((site) => (
                        <button
                          key={site.id}
                          onClick={() => handleSiteChange(site.id)}
                          className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                            site.id === currentSiteId
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="font-semibold">{site.name}</div>
                          {site.domain && (
                            <div className="text-xs text-slate-500">{site.domain}</div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <a
              href="/"
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Site
            </a>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
            {!loading && (
              <button
                onClick={handlePublish}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
              >
                <Globe className="h-3.5 w-3.5" />
                Imposta corrente come predefinito
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 lg:px-8">
        {loading ? (
          <div className="flex flex-1 items-center justify-center py-20">
            <div className="text-center">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              <p className="text-sm text-slate-500">Loading dashboard...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-1 items-center justify-center py-20">
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
              <p className="mb-2 text-sm font-semibold text-red-800">Error loading dashboard</p>
              <p className="text-xs text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Sidebar */}
            <aside className="hidden w-56 shrink-0 md:block">
              <nav className="sticky top-20 space-y-1">
                {TABS.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                        tab === t.id
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {t.label}
                    </button>
                  );
                })}
                <div className="my-3 border-t border-slate-200" />
                <button
                  onClick={handleReset}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset to Default
                </button>
              </nav>
            </aside>

            {/* Mobile tab selector */}
            <div className="md:hidden">
              <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                {TABS.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold ${
                        tab === t.id ? 'bg-blue-600 text-white' : 'bg-white text-slate-600'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Content */}
            <main className="min-w-0 flex-1 pb-20">
              {tab === 'sections' && <SectionManager config={config} ctx={ctx} />}
              {tab === 'theme' && <ThemeEditor config={config} ctx={ctx} />}
              {tab === 'content' && <ContentEditors config={config} ctx={ctx} />}
              {tab === 'products' && <ProductsManager config={config} ctx={ctx} />}
              {tab === 'leads' && <LeadsManager />}
              {tab === 'tools' && <ToolsManager config={config} ctx={ctx} />}
              {tab === 'media' && (
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-800">Gestione Immagini</h2>
                      <p className="text-sm text-slate-500">Carica e gestisci le immagini dal bucket img-bota su Supabase.</p>
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                    >
                      <Upload className="h-4 w-4" />
                      {uploading ? 'Caricamento...' : 'Carica Immagine'}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleMediaUpload}
                    />
                  </div>

                  {mediaError && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {mediaError}
                    </div>
                  )}

                  {loadingMedia ? (
                    <div className="py-6 text-center text-slate-400">Caricamento immagini...</div>
                  ) : mediaFiles.length === 0 ? (
                    <div className="py-6 text-center text-slate-400">Nessuna immagine caricata. Carica la prima immagine per iniziare!</div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                      {mediaFiles.map((file) => (
                        <div key={file.name} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                          <img src={file.url} alt={file.name} className="h-48 w-full object-cover" loading="lazy" />
                          <div className="p-3">
                            <p className="truncate text-xs font-medium text-slate-700" title={file.name}>{file.name}</p>
                            <div className="mt-2 flex gap-1.5">
                              <button
                                onClick={() => handleCopyUrl(file.url)}
                                className="flex-1 rounded-lg bg-blue-50 px-2 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                              >
                                Copia URL
                              </button>
                              <button
                                onClick={() => handleMediaDelete(`${file.name}`)}
                                className="rounded-lg bg-red-50 px-2 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                              >
                                Elimina
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {tab === 'backup' && <BackupManager onExport={handleExport} onImport={handleImport} onReset={handleReset} />}
            </main>
          </>
        )}
      </div>
    </div>
  );
}

export type AdminContext = ReturnType<typeof useConfig>;
export type { SectionId };