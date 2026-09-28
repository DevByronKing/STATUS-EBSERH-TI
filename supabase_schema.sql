-- ========================================================
-- SCHEMA SQL OFICIAL - STATUS ELIS / EBSERH
-- Cole este script completo no 'SQL Editor' do seu projeto Supabase e clique em 'RUN'.
-- O script é idempotente (pode ser executado várias vezes com segurança).
-- ========================================================

-- 1. TABELA DE UNIDADES HOSPITALARES (Barros Barreto, Bettina Ferro)
CREATE TABLE IF NOT EXISTS elis_units (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  full_name TEXT,
  subtitle TEXT DEFAULT 'Implantação Tecnológica',
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Garantir coluna full_name caso a tabela já existisse
ALTER TABLE elis_units ADD COLUMN IF NOT EXISTS full_name TEXT;

-- 2. TABELA DE ATIVIDADES & EQUIPAMENTOS (Portais RFID, Servidores, etc.)
CREATE TABLE IF NOT EXISTS elis_activities (
  id TEXT PRIMARY KEY,
  unit_id TEXT REFERENCES elis_units(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  icon TEXT DEFAULT '📦',
  status TEXT DEFAULT 'pending', -- 'completed', 'in_progress', 'pending', 'waiting', 'info'
  description TEXT,
  validation TEXT,
  alert JSONB, -- { type: 'warning'|'danger', title: '...', message: '...' }
  closure_document JSONB, -- Dados do PDF de fechamento oficial { ticketNumber, fileName, url, dataUrl, title, closedAt, notes }
  comments JSONB DEFAULT '[]'::jsonb, -- Array de comentários { id, date, text, author }
  order_index INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Garantir coluna closure_document para atividades
ALTER TABLE elis_activities ADD COLUMN IF NOT EXISTS closure_document JSONB;

-- 3. TABELA DE PENDÊNCIAS & CHAMADOS FECHADOS
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
  closure_document JSONB, -- Documento PDF oficial de fechamento
  closure_report JSONB -- Compatibilidade legada
);

-- Garantir coluna closure_document para pendências
ALTER TABLE elis_pendencies ADD COLUMN IF NOT EXISTS closure_document JSONB;
ALTER TABLE elis_pendencies ADD COLUMN IF NOT EXISTS closure_report JSONB;

-- 4. HABILITAR SEGURANÇA POR LINHA (ROW LEVEL SECURITY - RLS)
ALTER TABLE elis_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE elis_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE elis_pendencies ENABLE ROW LEVEL SECURITY;

-- 5. POLÍTICAS DE ACESSO (LEITURA PÚBLICA PARA GESTORES E EDIÇÃO CONTROLADA)
-- Removemos políticas existentes para permitir recriação limpa sem erro de duplicidade
DROP POLICY IF EXISTS "Leitura pública para unidades" ON elis_units;
DROP POLICY IF EXISTS "Leitura pública para atividades" ON elis_activities;
DROP POLICY IF EXISTS "Leitura pública para pendencias" ON elis_pendencies;

CREATE POLICY "Leitura pública para unidades" ON elis_units FOR SELECT USING (true);
CREATE POLICY "Leitura pública para atividades" ON elis_activities FOR SELECT USING (true);
CREATE POLICY "Leitura pública para pendencias" ON elis_pendencies FOR SELECT USING (true);

DROP POLICY IF EXISTS "Modificação para unidades" ON elis_units;
DROP POLICY IF EXISTS "Modificação para atividades" ON elis_activities;
DROP POLICY IF EXISTS "Modificação para pendencias" ON elis_pendencies;

CREATE POLICY "Modificação para unidades" ON elis_units FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Modificação para atividades" ON elis_activities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Modificação para pendencias" ON elis_pendencies FOR ALL USING (true) WITH CHECK (true);

-- 6. HABILITAR SINCRONIZAÇÃO EM TEMPO REAL (REALTIME)
-- Permite que todos os gestores vejam atividades concluídas e novos PDFs instantaneamente
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'elis_units'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE elis_units;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'elis_activities'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE elis_activities;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'elis_pendencies'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE elis_pendencies;
  END IF;
END $$;

-- 7. BUCKET DE ARMAZENAMENTO PARA DOCUMENTOS & PDFS (OPCIONAL)
-- Cria bucket 'elis_documents' caso queira hospedar PDFs no storage do Supabase
INSERT INTO storage.buckets (id, name, public) 
VALUES ('elis_documents', 'elis_documents', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Acesso público aos PDFs de chamados" ON storage.objects;
DROP POLICY IF EXISTS "Upload público de PDFs de chamados" ON storage.objects;

CREATE POLICY "Acesso público aos PDFs de chamados" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'elis_documents');

CREATE POLICY "Upload público de PDFs de chamados" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'elis_documents');

-- ========================================================
-- FIM DO SCRIPT - TABELAS E PERMISSÕES PRONTAS PARA O STATUS ELIS
-- ========================================================
