import { createClient } from '@supabase/supabase-js';

const STORAGE_KEY = 'elis_supabase_config';

export function getSupabaseCredentials() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.key) return parsed;
    }
  } catch (e) {
    console.error('Erro ao ler credenciais do localStorage:', e);
  }

  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (envUrl && envKey) {
    return { url: envUrl, key: envKey };
  }

  return { url: '', key: '' };
}

let cachedClient = null;
let lastUsedKey = '';

export function getSupabaseClient() {
  const { url, key } = getSupabaseCredentials();
  if (!url || !key) return null;

  const currentSignature = `${url}_${key}`;
  if (cachedClient && lastUsedKey === currentSignature) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, key);
    lastUsedKey = currentSignature;
    return cachedClient;
  } catch (err) {
    console.error('Falha ao inicializar Supabase Client:', err);
    return null;
  }
}

export function saveSupabaseCredentials(url, key) {
  if (!url || !key) {
    localStorage.removeItem(STORAGE_KEY);
    cachedClient = null;
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ url: url.trim(), key: key.trim() }));
  cachedClient = null;
}

export async function testSupabaseConnection(url, key) {
  try {
    const testClient = createClient(url, key);
    const { error } = await testClient.from('elis_units').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Conexão estabelecida com sucesso!' };
  } catch (err) {
    return { success: false, message: err.message || 'Falha ao conectar' };
  }
}
