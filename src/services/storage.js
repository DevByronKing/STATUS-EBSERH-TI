import { initialUnits, initialActivities, initialPendencies } from '../data/initialData';
import { getSupabaseClient } from './supabaseClient';

const LOCAL_STORAGE_KEY = 'elis_dashboard_data_v2';
const ADMIN_PIN_KEY = 'elis_admin_pin';
const ADMIN_SESSION_KEY = 'elis_admin_session';
const DEFAULT_PIN = 'elis2026';

// PIN de Acesso Administrativo
export function getAdminPin() {
  return localStorage.getItem(ADMIN_PIN_KEY) || DEFAULT_PIN;
}

export function setAdminPin(newPin) {
  localStorage.setItem(ADMIN_PIN_KEY, newPin);
}

export function checkAdminSession() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
}

export function setAdminSession(isActive) {
  if (isActive) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
  } else {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  }
}

// Carregar dados locais (Fallback garantido)
export function getLocalData() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.units && parsed.activities && parsed.pendencies) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Erro ao ler LocalStorage:', err);
  }

  // Se não existir, salva os dados iniciais
  const defaultData = {
    units: initialUnits,
    activities: initialActivities,
    pendencies: initialPendencies,
    lastUpdated: new Date().toISOString()
  };
  saveLocalData(defaultData);
  return defaultData;
}

export function saveLocalData(data) {
  try {
    const toSave = {
      ...data,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(toSave));
    return true;
  } catch (err) {
    console.error('Erro ao salvar no LocalStorage:', err);
    return false;
  }
}

// Carregar dados (Nuvem Supabase com fallback Local)
export async function loadAllData() {
  const supabase = getSupabaseClient();
  const localData = getLocalData();

  if (!supabase) {
    return { data: localData, source: 'local' };
  }

  try {
    const [unitsRes, activitiesRes, pendenciesRes] = await Promise.all([
      supabase.from('elis_units').select('*').order('order_index'),
      supabase.from('elis_activities').select('*').order('order_index'),
      supabase.from('elis_pendencies').select('*').order('created_at', { ascending: false })
    ]);

    // Se houve erro de tabela não criada, usa local
    if (unitsRes.error || activitiesRes.error || pendenciesRes.error) {
      console.warn('Erro ao consultar Supabase, usando LocalStorage:', unitsRes.error || activitiesRes.error || pendenciesRes.error);
      return { data: localData, source: 'local' };
    }

    // Se as tabelas estiverem vazias pela primeira vez, faz o seed inicial no Supabase!
    if ((!unitsRes.data || unitsRes.data.length === 0) && (!activitiesRes.data || activitiesRes.data.length === 0)) {
      console.log('Tabelas Supabase vazias. Populando dados iniciais da Elis...');
      await seedSupabaseInitialData(supabase, localData);
      return { data: localData, source: 'supabase' };
    }

    // Mapeia colunas do Supabase para formato JS camelCase
    const formattedData = {
      units: unitsRes.data.map(u => ({
        id: u.id,
        name: u.name,
        fullName: u.full_name || u.name,
        subtitle: u.subtitle,
        description: u.description,
        order_index: u.order_index
      })),
      activities: activitiesRes.data.map(a => ({
        id: a.id,
        unit_id: a.unit_id,
        title: a.title,
        icon: a.icon,
        status: a.status,
        description: a.description,
        validation: a.validation,
        alert: a.alert,
        closureDocument: a.closure_document || null,
        comments: a.comments || [],
        order_index: a.order_index,
        updated_at: a.updated_at
      })),
      pendencies: pendenciesRes.data.map(p => ({
        id: p.id,
        unit_id: p.unit_id,
        activity_id: p.activity_id,
        title: p.title,
        severity: p.severity,
        status: p.status,
        description: p.description,
        created_at: p.created_at,
        resolved_at: p.resolved_at,
        closureDocument: p.closure_document || p.closure_report || null,
        closure_report: p.closure_report || p.closure_document || null
      })),
      lastUpdated: new Date().toISOString()
    };

    // Atualiza cache local
    saveLocalData(formattedData);
    return { data: formattedData, source: 'supabase' };
  } catch (err) {
    console.error('Falha na comunicação com Supabase:', err);
    return { data: localData, source: 'local' };
  }
}

// Popular dados iniciais no Supabase
export async function seedSupabaseInitialData(supabase, data) {
  try {
    for (const unit of data.units) {
      await supabase.from('elis_units').upsert({
        id: unit.id,
        name: unit.name,
        subtitle: unit.subtitle,
        description: unit.description,
        order_index: unit.order_index
      });
    }

    for (const act of data.activities) {
      await supabase.from('elis_activities').upsert({
        id: act.id,
        unit_id: act.unit_id,
        title: act.title,
        icon: act.icon,
        status: act.status,
        description: act.description,
        validation: act.validation,
        alert: act.alert,
        closure_document: act.closureDocument || null,
        comments: act.comments,
        order_index: act.order_index
      });
    }

    for (const pend of data.pendencies) {
      await supabase.from('elis_pendencies').upsert({
        id: pend.id,
        unit_id: pend.unit_id,
        activity_id: pend.activity_id,
        title: pend.title,
        severity: pend.severity,
        status: pend.status,
        description: pend.description,
        created_at: pend.created_at,
        resolved_at: pend.resolved_at,
        closure_document: pend.closureDocument || pend.closure_report || null,
        closure_report: pend.closure_report || pend.closureDocument || null
      });
    }
  } catch (err) {
    console.error('Erro ao popular dados no Supabase:', err);
  }
}

// Sincronizar criação/atualização de Atividade
export async function syncSaveActivity(activity, allData) {
  saveLocalData(allData);
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('elis_activities').upsert({
        id: activity.id,
        unit_id: activity.unit_id,
        title: activity.title,
        icon: activity.icon || '📦',
        status: activity.status,
        description: activity.description,
        validation: activity.validation,
        alert: activity.alert,
        closure_document: activity.closureDocument || null,
        comments: activity.comments || [],
        order_index: activity.order_index ?? 0,
        updated_at: new Date().toISOString()
      });
    } catch (e) {
      console.error('Erro ao sincronizar atividade com Supabase:', e);
    }
  }
}

// Sincronizar exclusão de Atividade
export async function syncDeleteActivity(activityId, allData) {
  saveLocalData(allData);
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('elis_activities').delete().eq('id', activityId);
    } catch (e) {
      console.error('Erro ao deletar atividade no Supabase:', e);
    }
  }
}

// Sincronizar Pendência
export async function syncSavePendency(pendency, allData) {
  saveLocalData(allData);
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('elis_pendencies').upsert({
        id: pendency.id,
        unit_id: pendency.unit_id,
        activity_id: pendency.activity_id || null,
        title: pendency.title,
        severity: pendency.severity,
        status: pendency.status,
        description: pendency.description,
        created_at: pendency.created_at || new Date().toISOString(),
        resolved_at: pendency.resolved_at || null,
        closure_document: pendency.closureDocument || pendency.closure_report || null,
        closure_report: pendency.closure_report || pendency.closureDocument || null
      });
    } catch (e) {
      console.error('Erro ao sincronizar pendência com Supabase:', e);
    }
  }
}

// Sincronizar exclusão de Pendência
export async function syncDeletePendency(pendencyId, allData) {
  saveLocalData(allData);
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('elis_pendencies').delete().eq('id', pendencyId);
    } catch (e) {
      console.error('Erro ao deletar pendência no Supabase:', e);
    }
  }
}

// Exportar e Importar Backup JSON
export function exportBackupJSON(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `status_elis_backup_${dateStr}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importBackupJSON(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.units && parsed.activities && parsed.pendencies) {
      saveLocalData(parsed);
      return { success: true, data: parsed };
    }
    return { success: false, message: 'Estrutura do arquivo JSON inválida.' };
  } catch (err) {
    return { success: false, message: 'Arquivo JSON corrompido ou inválido.' };
  }
}
