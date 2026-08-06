import { supabase } from './supabase';
import { getCurrentSiteId } from './siteDetection';

const BUCKET = 'img-bota';

async function getSiteBasePath(): Promise<string> {
  const siteId = await getCurrentSiteId();
  const siteMap: Record<string, string> = {
    'b1a2c3d4-e5f6-7890-abcd-ef1234567890': 'bota',
    '550e8400-e29b-41d4-a716-446655440000': 'aradia',
    '660f8400-e29b-41d4-a716-446655440001': 'pizzeria'
  };
  const siteName = siteMap[siteId] || 'default';
  return `${siteName}/images`;
}

export async function uploadSiteFile(path: string, file: File): Promise<string> {
  if (!supabase) throw new Error('Supabase not configured');
  
  const basePath = await getSiteBasePath();
  const fullPath = `${basePath}/${Date.now()}_${path}`;
  
  const { error } = await supabase.storage.from(BUCKET).upload(fullPath, file, {
    cacheControl: '3600',
    upsert: true,
    contentType: file.type || 'application/octet-stream',
  });
  
  if (error) throw error;
  return fullPath;
}

export async function uploadImage(file: File): Promise<{ path: string; url: string } | null> {
  if (!supabase) {
    console.error('uploadImage: supabase client is null');
    return null;
  }
  try {
    const ext = file.name.split('.').pop() || 'bin';
    const basePath = await getSiteBasePath();
    const path = `${basePath}/${crypto.randomUUID()}.${ext}`;
    
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });
    if (error) throw error;

    const url = getSiteFilePublicUrl(path);
    return { path, url: url || '' };
  } catch (e) {
    console.error('uploadImage error', e);
    return null;
  }
}

export function getSiteFilePublicUrl(path: string): string | null {
  if (!supabase) return null;
  const result = supabase.storage.from(BUCKET).getPublicUrl(path);
  return result.data?.publicUrl || null;
}

export async function listSiteFiles(prefix = ''): Promise<Array<{ name: string; url: string; id?: string; updated_at?: string }>> {
  if (!supabase) return [];
  
  const basePath = await getSiteBasePath();
  const folder = prefix ? `${basePath}/${prefix}` : basePath;
  
  const { data, error } = await supabase.storage.from(BUCKET).list(folder, {
    limit: 100,
    offset: 0,
    sortBy: { column: 'name', order: 'desc' },
  });
  
  if (error) {
    console.error('Error listing files:', error);
    return [];
  }
  
  return data
    .filter((file) => file.name.includes('.'))
    .map((file) => {
      const fullPath = `${folder}/${file.name}`;
      return {
        name: file.name,
        url: getSiteFilePublicUrl(fullPath) || '',
        id: file.id,
        updated_at: file.updated_at,
      };
    });
}

export async function deleteSiteFile(path: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}

export async function renameSiteFile(oldPath: string, newPath: string): Promise<void> {
  if (!supabase) return;
  const basePath = await getSiteBasePath();
  const fullNewPath = `${basePath}/${newPath}`;
  const { error } = await supabase.storage.from(BUCKET).move(oldPath, fullNewPath);
  if (error) throw error;
}