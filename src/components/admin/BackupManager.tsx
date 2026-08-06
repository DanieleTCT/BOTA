import { useRef } from 'react';
import { Download, Upload, RotateCcw, FileJson, AlertTriangle } from 'lucide-react';
import { AdminPanel } from './Controls';

export function BackupManager({
  onExport,
  onImport,
  onReset,
}: {
  onExport: () => void;
  onImport: (file: File) => void;
  onReset: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-slate-800">Backup & Presets</h2>
      <p className="mb-6 text-sm text-slate-500">Export your configuration, import a saved template, or reset to defaults.</p>

      <div className="grid gap-4 lg:grid-cols-2">
        <AdminPanel title="Export Template" description="Download your full site configuration as a JSON file">
          <p className="text-sm text-slate-500">
            This file contains all your content, theme settings, section order, and tool configurations.
            Save it as a backup or share it to replicate your design on another site.
          </p>
          <button
            onClick={onExport}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Download className="h-4 w-4" />
            Export as JSON
          </button>
        </AdminPanel>

        <AdminPanel title="Import Template" description="Load a previously exported JSON configuration">
          <p className="text-sm text-slate-500">
            Upload a JSON file to replace your current configuration. This will overwrite all current content and settings.
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onImport(file);
              e.target.value = '';
            }}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 rounded-lg border-2 border-blue-600 px-5 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            <Upload className="h-4 w-4" />
            Import JSON File
          </button>
        </AdminPanel>

        <AdminPanel title="Reset to Default" description="Restore the original demo content and settings">
          <div className="flex items-start gap-2 rounded-lg bg-rose-50 p-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
            <p className="text-xs text-rose-600">
              This will permanently replace all your current content, theme, and settings with the default demo data. This cannot be undone.
            </p>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-2 rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Default Demo Data
          </button>
        </AdminPanel>

        <AdminPanel title="About This System" description="How persistence works">
          <div className="flex items-start gap-2">
            <FileJson className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <div className="text-xs text-slate-500">
              <p className="mb-2">
                Your configuration is automatically saved to your browser's LocalStorage on every change.
                It persists across page reloads and browser restarts.
              </p>
              <p className="mb-2">
                Form submissions are saved to Supabase when connected, or to LocalStorage as a fallback.
              </p>
              <p>
                Use the export/import tools above to transfer your configuration between browsers or devices.
              </p>
            </div>
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}
