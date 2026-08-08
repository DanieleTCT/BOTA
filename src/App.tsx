import { useEffect, useState } from 'react';
import { ToastProvider } from '@/hooks/useToast';
import { useConfig } from '@/hooks/useConfig';
import { useApplyTheme } from '@/hooks/useApplyTheme';
import { useSeoAndCodeInjection } from '@/components/widgets/SeoAndCode';
import { PublicPage } from '@/components/PublicPage';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = () => {
      const params = new URLSearchParams(window.location.search);
      setIsAdmin(params.get('admin') === '1');
    };
    checkAdmin();
    window.addEventListener('popstate', checkAdmin);
    return () => window.removeEventListener('popstate', checkAdmin);
  }, []);

  return (
    <ToastProvider>
      <AppContent isAdmin={isAdmin} />
    </ToastProvider>
  );
}

function AppContent({ isAdmin }: { isAdmin: boolean }) {
  const ctx = useConfig(isAdmin);
  const { config, loading } = ctx;
  useApplyTheme(config);
  useSeoAndCodeInjection(config.seo, config.code);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-sm text-slate-500">Caricamento...</p>
        </div>
      </div>
    );
  }

  return isAdmin ? <AdminDashboard ctx={ctx} /> : <PublicPage config={config} />;
}

export default App;
