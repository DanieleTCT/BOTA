import type { FormSubmission } from '@/types';
import { SUBMISSIONS_KEY } from '@/defaults';
import { supabase } from './supabase';
import { getCurrentSiteId } from './siteDetection';

const TABLE = 'form_submissions';
let useSupabase = true;

export async function saveSubmission(
  data: Record<string, string>,
): Promise<{ ok: boolean; error?: string }> {
  const payload = { data, status: 'received' as const };

  if (useSupabase && supabase) {
    try {
      const siteId = await getCurrentSiteId();
      const { error } = await supabase.from(TABLE).insert({ ...payload, site_id: siteId });
      if (!error) return { ok: true };
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        useSupabase = false;
      } else {
        return { ok: false, error: error.message };
      }
    } catch {
      useSupabase = false;
    }
  }

  saveLocal({ ...payload, id: crypto.randomUUID(), created_at: new Date().toISOString() });
  return { ok: true };
}

export async function fetchSubmissions(): Promise<FormSubmission[]> {
  if (useSupabase && supabase) {
    try {
      const siteId = await getCurrentSiteId();
      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .eq('site_id', siteId)
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data as unknown as FormSubmission[];
      }
      if (error && (error.message.includes('relation') || error.message.includes('does not exist'))) {
        useSupabase = false;
      }
    } catch {
      useSupabase = false;
    }
  }
  return getLocal();
}

export async function updateSubmissionStatus(
  id: string,
  status: FormSubmission['status'],
): Promise<{ ok: boolean; error?: string }> {
  if (useSupabase && supabase) {
    try {
      const { error } = await supabase.from(TABLE).update({ status }).eq('id', id);
      if (!error) return { ok: true };
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        useSupabase = false;
      } else {
        return { ok: false, error: error.message };
      }
    } catch {
      useSupabase = false;
    }
  }

  const all = getLocal();
  const idx = all.findIndex((s) => s.id === id);
  if (idx >= 0) {
    all[idx].status = status;
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(all));
  }
  return { ok: true };
}

export async function deleteSubmission(id: string): Promise<{ ok: boolean; error?: string }> {
  if (useSupabase && supabase) {
    try {
      const { error } = await supabase.from(TABLE).delete().eq('id', id);
      if (!error) return { ok: true };
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        useSupabase = false;
      } else {
        return { ok: false, error: error.message };
      }
    } catch {
      useSupabase = false;
    }
  }

  const all = getLocal().filter((s) => s.id !== id);
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(all));
  return { ok: true };
}

function saveLocal(sub: FormSubmission) {
  const all = getLocal();
  all.unshift(sub);
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(all));
}

function getLocal(): FormSubmission[] {
  try {
    return JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function isUsingSupabase() {
  return useSupabase && !!supabase;
}
