import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Check, 
  AlertCircle, 
  Copy, 
  Download, 
  Upload, 
  RefreshCw, 
  ExternalLink,
  Sparkles,
  Server
} from 'lucide-react';
import { 
  getSupabaseCredentials, 
  saveSupabaseCredentials, 
  testSupabaseConnection 
} from '../services/supabaseClient';
import { exportBackupJSON, importBackupJSON } from '../services/storage';

export default function CloudSettingsModal({
  allData,
  onClose,
  onDataImported,
  onResetToDefault
}) {
  const currentCreds = getSupabaseCredentials();
  const [url, setUrl] = useState(currentCreds.url || '');
  const [key, setKey] = useState(currentCreds.key || '');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleTest = async () => {
    if (!url || !key) {
      setTestResult({ success: false, message: 'Preencha a URL e a Anon Key do Supabase.' });
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    const result = await testSupabaseConnection(url, key);
    setIsTesting(false);
    setTestResult(result);
  };

  const handleSave = () => {
    saveSupabaseCredentials(url, key);
    alert('Credenciais salvas com sucesso! A página será atualizada para sincronizar.');
    window.location.reload();
  };

  const handleDisconnect = () => {
    saveSupabaseCredentials('', '');
    alert('Desconectado do Supabase. O aplicativo agora opera no Modo Local.');
    window.location.reload();
  };

  const copySqlSchema = () => {
    const sql = `-- SCHEMA SQL OFICIAL - STATUS ELIS / EBSERH
-- Cole este script no SQL Editor do seu projeto Supabase e clique em 'RUN':

CREATE TABLE IF NOT EXISTS elis_units (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  full_name TEXT,
  subtitle TEXT DEFAULT 'Implantação Tecnológica',
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE elis_units ADD COLUMN IF NOT EXISTS full_name TEXT;

CREATE TABLE IF NOT EXISTS elis_activities (
  id TEXT PRIMARY KEY,
  unit_id TEXT REFERENCES elis_units(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  icon TEXT DEFAULT '📦',
  status TEXT DEFAULT 'pending',
  description TEXT,
  validation TEXT,
  alert JSONB,
  closure_document JSONB,
  comments JSONB DEFAULT '[]'::jsonb,
  order_index INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE elis_activities ADD COLUMN IF NOT EXISTS closure_document JSONB;

CREATE TABLE IF NOT EXISTS elis_pendencies (
  id TEXT PRIMARY KEY,
  unit_id TEXT REFERENCES elis_units(id) ON DELETE CASCADE,
  activity_id TEXT REFERENCES elis_activities(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  severity TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'open',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  closure_document JSONB,
  closure_report JSONB
);
ALTER TABLE elis_pendencies ADD COLUMN IF NOT EXISTS closure_document JSONB;
ALTER TABLE elis_pendencies ADD COLUMN IF NOT EXISTS closure_report JSONB;

ALTER TABLE elis_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE elis_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE elis_pendencies ENABLE ROW LEVEL SECURITY;

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

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'elis_units') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE elis_units;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'elis_activities') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE elis_activities;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'elis_pendencies') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE elis_pendencies;
  END IF;
END $$;`;

    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const result = importBackupJSON(content);
        if (result.success) {
          alert('Backup importado com sucesso!');
          onDataImported(result.data);
          onClose();
        } else {
          alert(result.message);
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Database size={24} className="text-primary" />
            <div>
              <h3>Configurações de Nuvem & Backup</h3>
              <p>Sincronização em tempo real para gestores e gestão de dados</p>
            </div>
          </div>
          <button className="btn-close-modal" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="settings-body">
          {/* Sessão Supabase */}
          <div className="settings-section">
            <div className="section-title-wrap">
              <Server size={18} className="text-primary" />
              <h4>Sincronização em Nuvem (Supabase)</h4>
            </div>
            <p className="section-help">
              Ao conectar o Supabase, qualquer alteração feita por você é visualizada instantaneamente por todos os gestores com o link no Vercel.
            </p>

            <div className="form-group">
              <label>Project URL do Supabase</label>
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Project API Anon Key</label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
            </div>

            {testResult && (
              <div className={`auth-alert ${testResult.success ? 'success' : 'error'}`}>
                {testResult.success ? <Check size={16} /> : <AlertCircle size={16} />}
                <span>{testResult.message}</span>
              </div>
            )}

            <div className="settings-buttons-row">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={handleTest}
                disabled={isTesting}
              >
                {isTesting ? 'Testando...' : 'Testar Conexão'}
              </button>

              <button 
                type="button" 
                className="btn-primary-action"
                onClick={handleSave}
              >
                <Check size={16} />
                <span>Salvar & Ativar Nuvem</span>
              </button>

              {currentCreds.url && (
                <button 
                  type="button" 
                  className="btn-disconnect"
                  onClick={handleDisconnect}
                >
                  Desconectar
                </button>
              )}
            </div>

            <div className="supabase-guide-box">
              <div className="guide-title">
                <Sparkles size={16} />
                <span>Como configurar o Supabase Grátis (1 minuto):</span>
              </div>
              <ol className="guide-steps">
                <li>Crie uma conta gratuita em <a href="https://supabase.com" target="_blank" rel="noreferrer">supabase.com <ExternalLink size={12} /></a></li>
                <li>Crie um novo projeto (ex: <code>status-elis</code>)</li>
                <li>Vá em <strong>SQL Editor</strong>, cole o script das tabelas e clique em <strong>Run</strong></li>
                <li>Copie a <strong>Project URL</strong> e a <strong>anon key</strong> em <em>Project Settings &gt; API</em></li>
              </ol>
              <button className="btn-copy-sql" onClick={copySqlSchema}>
                <Copy size={14} />
                <span>{copiedSql ? 'SQL Copiado para Área de Transferência!' : 'Copiar Script SQL das Tabelas'}</span>
              </button>
            </div>
          </div>

          {/* Sessão Backup Local */}
          <div className="settings-section">
            <h4>Backup e Arquivos Locais</h4>
            <p className="section-help">
              Exporte seus dados para um arquivo JSON no seu computador ou restaure a qualquer momento.
            </p>

            <div className="backup-actions-grid">
              <button 
                className="btn-backup-item"
                onClick={() => exportBackupJSON(allData)}
              >
                <Download size={18} />
                <div className="backup-item-text">
                  <strong>Exportar Backup JSON</strong>
                  <span>Baixar todas as atividades e chamados</span>
                </div>
              </button>

              <label className="btn-backup-item upload-btn">
                <Upload size={18} />
                <div className="backup-item-text">
                  <strong>Importar Backup JSON</strong>
                  <span>Restaurar arquivo salvo no computador</span>
                </div>
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleFileUpload} 
                  style={{ display: 'none' }} 
                />
              </label>

              <button 
                className="btn-backup-item reset-btn"
                onClick={onResetToDefault}
              >
                <RefreshCw size={18} />
                <div className="backup-item-text">
                  <strong>Restaurar Padrão Elis</strong>
                  <span>Voltar aos dados originais (Barros Barreto e Betina)</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
