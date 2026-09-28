-- ========================================================
-- SCHEMA SQL PARA SUPABASE - STATUS ELIS / EBSERH
-- Cole este script no SQL Editor do seu projeto Supabase e clique em 'Run'
-- ========================================================

-- 1. Tabela de Unidades Hospitalares
CREATE TABLE IF NOT EXISTS elis_units (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT DEFAULT 'Implantação Tecnológica',
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de Atividades
CREATE TABLE IF NOT EXISTS elis_activities (
  id TEXT PRIMARY KEY,
  unit_id TEXT REFERENCES elis_units(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  icon TEXT DEFAULT '📦',
  status TEXT DEFAULT 'pending', -- 'completed', 'in_progress', 'pending', 'waiting', 'info'
  description TEXT,
  validation TEXT,
  alert JSONB, -- { type: 'warning'|'danger', title: '...', message: '...' }
  comments JSONB DEFAULT '[]'::jsonb, -- array of { id, date, text, author }
  order_index INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Pendências e Chamados Fechados
CREATE TABLE IF NOT EXISTS elis_pendencies (
  id TEXT PRIMARY KEY,
  unit_id TEXT REFERENCES elis_units(id) ON DELETE CASCADE,
  activity_id TEXT REFERENCES elis_activities(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  severity TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'resolved'
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  closure_report JSONB -- Relatório completo de fechamento de chamado (Padrão Elis)
);

-- 4. Habilitar RLS (Row Level Security) e permitir leitura pública para Gestores
ALTER TABLE elis_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE elis_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE elis_pendencies ENABLE ROW LEVEL SECURITY;

-- Políticas de Leitura Pública (Qualquer gestor com o link pode visualizar)
CREATE POLICY "Leitura pública para unidades" ON elis_units FOR SELECT USING (true);
CREATE POLICY "Leitura pública para atividades" ON elis_activities FOR SELECT USING (true);
CREATE POLICY "Leitura pública para pendencias" ON elis_pendencies FOR SELECT USING (true);

-- Políticas de Escrita para a chave anônima (ou autenticada)
CREATE POLICY "Modificação para unidades" ON elis_units FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Modificação para atividades" ON elis_activities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Modificação para pendencias" ON elis_pendencies FOR ALL USING (true) WITH CHECK (true);

-- Habilitar Realtime para que todos os gestores vejam atualizações ao vivo
ALTER PUBLICATION supabase_realtime ADD TABLE elis_units;
ALTER PUBLICATION supabase_realtime ADD TABLE elis_activities;
ALTER PUBLICATION supabase_realtime ADD TABLE elis_pendencies;
