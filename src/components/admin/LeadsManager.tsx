import { useEffect, useState, useMemo } from 'react';
import { Search, Download, Trash2, Inbox } from 'lucide-react';
import type { FormSubmission, SubmissionStatus } from '@/types';
import { fetchSubmissions, updateSubmissionStatus, deleteSubmission, isUsingSupabase } from '@/lib/submissions';
import { useToast } from '@/hooks/useToast';

const STATUS_COLORS: Record<SubmissionStatus, string> = {
  received: 'bg-blue-100 text-blue-700',
  processing: 'bg-amber-100 text-amber-700',
  submitted: 'bg-green-100 text-green-700',
  archived: 'bg-slate-100 text-slate-600',
};

export function LeadsManager() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'all'>('all');
  const { notify } = useToast();

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    setLoading(true);
    const data = await fetchSubmissions();
    setSubmissions(data);
    setLoading(false);
  };

  const filtered = useMemo(() => {
    return submissions.filter((s) => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (search) {
        const json = JSON.stringify(s.data).toLowerCase();
        if (!json.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [submissions, search, statusFilter]);

  const handleStatusChange = async (id: string, status: SubmissionStatus) => {
    await updateSubmissionStatus(id, status);
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    notify('Status updated', 'success');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this submission?')) return;
    await deleteSubmission(id);
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    notify('Submission deleted', 'success');
  };

  const exportCSV = () => {
    if (filtered.length === 0) {
      notify('No submissions to export', 'info');
      return;
    }
    const allKeys = Array.from(new Set(filtered.flatMap((s) => Object.keys(s.data))));
    const headers = ['Date', 'Status', ...allKeys];
    const rows = filtered.map((s) => [
      new Date(s.created_at).toLocaleString(),
      s.status,
      ...allKeys.map((k) => `"${(s.data[k] ?? '').replace(/"/g, '""')}"`),
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    notify('CSV exported', 'success');
  };

  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-slate-800">Leads & Submissions</h2>
      <p className="mb-4 text-sm text-slate-500">
        {isUsingSupabase()
          ? 'Connected to Supabase — submissions are stored in your database.'
          : 'Storing submissions in browser LocalStorage. Connect Supabase to persist across devices.'}
      </p>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search submissions..."
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as SubmissionStatus | 'all')}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="received">Received</option>
          <option value="processing">Processing</option>
          <option value="submitted">Submitted</option>
          <option value="archived">Archived</option>
        </select>
        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-slate-400">Loading submissions...</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-20">
          <Inbox className="mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-semibold text-slate-500">No submissions yet</p>
          <p className="text-xs text-slate-400">Form submissions will appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold text-slate-500">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Details</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-slate-100 last:border-0">
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                    {new Date(s.created_at).toLocaleDateString()}
                    <br />
                    {new Date(s.created_at).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      {Object.entries(s.data).slice(0, 3).map(([k, v]) => (
                        <div key={k} className="text-xs">
                          <span className="font-semibold text-slate-600">{k}:</span>{' '}
                          <span className="text-slate-500">{v.length > 50 ? v.slice(0, 50) + '...' : v}</span>
                        </div>
                      ))}
                      {Object.keys(s.data).length > 3 && (
                        <div className="text-xs text-slate-400">+{Object.keys(s.data).length - 3} more fields</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={s.status}
                      onChange={(e) => handleStatusChange(s.id, e.target.value as SubmissionStatus)}
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold outline-none ${STATUS_COLORS[s.status]}`}
                    >
                      <option value="received">Received</option>
                      <option value="processing">Processing</option>
                      <option value="submitted">Submitted</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="rounded-lg p-1.5 text-rose-400 transition hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
