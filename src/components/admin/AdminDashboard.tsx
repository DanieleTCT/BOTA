import { useState, useRef, useCallback, useEffect } from 'react';
import {
  LayoutGrid, Palette, Zap, Mail, Settings, Download, RotateCcw,
  ExternalLink, Globe, Package, FolderOpen, Upload,
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
import { listSiteFiles, deleteSiteFile, uploadSiteFile } from '@/lib/storage';

type Tab = 'sections' | 'theme' | 'content' | 'products' | 'media' | 'leads' | 'tools' | 'backup';

const TABS: { id: Tab; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'sections', label: 'Sezioni', icon: LayoutGrid },
  { id: 'theme', label: 'Tema', icon: Palette },
  { id: 'content', label: 'Contenuti', icon: Settings },
  { id: 'products', label: 'Menu', icon: Package },
  { id: 'media', label: 'Immagini', icon: FolderOpen },
  { id: 'leads', label: 'Prenotazioni', icon: Mail },
  { id: 'tools', label: 'Strumenti', icon: Zap },
  { id: 'backup', label: 'Backup', icon: Download },
];

export function AdminDashboard() {
  const ctx = useConfig();
  const { config } = ctx;
  const { notify } = useToast();
  const [tab, setTab] = useState<Tab>('sections');

  // Media manager state
  const [mediaFiles, setMediaFiles] = useState<Array<{ name: string; url: string }>>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize default config in Supabase on mount if needed
  const [initDone, setInitDone] = useState(false);
  if (!initDone) {
    initializeDefaultConfig().then((ok) => {
      if (ok) notify('Configurazione online inizializzata', 'success');
      setInitDone(true);
    });
  }

  const handleReset = () => {
    if (confirm('Reset tutti i contenuti e le impostazioni ai valori predefiniti? Operazione irreversibile.')) {
      const fresh = resetConfig();
      ctx.replaceConfig(fresh);
      notify('Reset completato', 'success');
    }
  };

  const handleExport = () => {
    exportConfig(config);
    notify('Template esportato come JSON', 'success');
  };

  const handlePublish = async () => {
    const ok = await ctx.publish();
    notify(ok ? 'Configurazione pubblicata online' : 'Pubblicazione fallita', ok ? 'success' : 'error');
  };

  const handleImport = async (file: File) => {
    try {
      const imported = await importConfig(file);
      ctx.replaceConfig(imported);
      notify('Template importato con successo', 'success');
    } catch {
      notify('Import fallito: file JSON non valido', 'error');
    }
  };

  // Media manager functions
  const refreshMedia = useCallback(async () => {
    setLoadingMedia(true);
    setMediaError(null);
    try {
      const files = await listSiteFiles();
      setMediaFiles(files.map(f => ({ name: f.name, url: f.url })));
    } catch (err) {
      setMediaError(err instanceof Error ? err.message : 'Errore caricamento immagini');
    } finally {
      setLoadingMedia(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'media') {
      refreshMedia();
    }
  }, [tab, refreshMedia]);

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
      setMediaError(err instanceof Error ? err.message : 'Upload fallito');
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
      setMediaError(err instanceof Error ? err.message : 'Eliminazione fallita');
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
              <h1 className="text-base font-bold text-slate-800">Bota Admin</h1>
              <p className="text-xs text-slate-500">Pizzeria Ristorante — Fano</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Visualizza Sito
            </a>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
            <button
              onClick={handlePublish}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
            >
              <Globe className="h-3.5 w-3.5" />
              Pubblica
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 lg:px-8">
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
              Reset Predefinito
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
                  <p className="text-sm text-slate-500">Carica e gestisci le immagini dal bucket img-bota.</p>
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
                            onClick={() => handleMediaDelete(file.name)}
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
      </div>
    </div>
  );
}

export type AdminContext = ReturnType<typeof useConfig>;
export type { SectionId };