import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Building, 
  Calendar, 
  HardDrive, 
  CheckCircle2, 
  Filter,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function DocumentRepositoryModal({
  activities,
  pendencies,
  units,
  onClose,
  onViewPdf
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('all');

  // Coleta todos os documentos de chamados anexados em atividades e pendências
  const documentsMap = new Map();

  // 1. De atividades
  activities.forEach(act => {
    if (act.closureDocument) {
      const doc = act.closureDocument;
      const key = doc.ticketNumber || doc.fileName || act.id;
      if (!documentsMap.has(key)) {
        documentsMap.set(key, {
          ...doc,
          id: key,
          sourceType: 'activity',
          sourceTitle: act.title,
          sourceIcon: act.icon || '📦',
          unitId: act.unit_id
        });
      }
    }
  });

  // 2. De pendências
  pendencies.forEach(pend => {
    if (pend.closureDocument) {
      const doc = pend.closureDocument;
      const key = doc.ticketNumber || doc.fileName || pend.id;
      if (!documentsMap.has(key)) {
        documentsMap.set(key, {
          ...doc,
          id: key,
          sourceType: 'pendency',
          sourceTitle: pend.title,
          sourceIcon: '⚠️',
          unitId: pend.unit_id
        });
      }
    }
  });

  const allDocuments = Array.from(documentsMap.values());

  // Filtragem
  const filteredDocuments = allDocuments.filter(doc => {
    const matchesUnit = selectedUnit === 'all' || doc.unitId === selectedUnit;
    
    if (!matchesUnit) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTicket = (doc.ticketNumber || '').toLowerCase().includes(q);
      const matchTitle = (doc.title || doc.sourceTitle || '').toLowerCase().includes(q);
      const matchFile = (doc.fileName || '').toLowerCase().includes(q);
      const matchNotes = (doc.notes || '').toLowerCase().includes(q);
      return matchTicket || matchTitle || matchFile || matchNotes;
    }

    return true;
  });

  // Métricas rápidas
  const totalDocs = allDocuments.length;
  const barrosDocs = allDocuments.filter(d => d.unitId === 'barros-barreto').length;
  const betinaDocs = allDocuments.filter(d => d.unitId === 'betina-ferro').length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container repo-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Cabeçalho */}
        <div className="modal-header repo-header">
          <div className="modal-title-wrap">
            <div className="repo-icon-wrap">
              <FileText size={24} className="text-primary" />
            </div>
            <div>
              <div className="repo-tagline">PADRÃO ELIS &middot; REPOSITÓRIO GERAL</div>
              <h3 className="repo-title">Central de Chamados & PDFs</h3>
              <p>Consulta, visualização e download de todos os relatórios homologados das unidades EBSERH</p>
            </div>
          </div>
          <button className="btn-close-modal" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Barra de Filtros e Busca */}
        <div className="repo-toolbar">
          <div className="repo-search-box">
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Buscar por número (ex: T 26 09 13480), título, atividade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>&times;</button>
            )}
          </div>

          <div className="repo-filter-group">
            <div className="filter-pill-label">
              <Filter size={14} />
              <span>Unidade:</span>
            </div>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="repo-select"
            >
              <option value="all">Todas ({totalDocs})</option>
              <option value="barros-barreto">Barros Barreto ({barrosDocs})</option>
              <option value="betina-ferro">Bettina Ferro ({betinaDocs})</option>
            </select>
          </div>
        </div>

        {/* Tabela de Documentos */}
        <div className="repo-table-container">
          {filteredDocuments.length > 0 ? (
            <table className="repo-table">
              <thead>
                <tr>
                  <th>Número do Chamado</th>
                  <th>Atividade / Equipamento</th>
                  <th>Unidade</th>
                  <th>Data Fechamento</th>
                  <th>Arquivo PDF</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => {
                  const unit = units.find(u => u.id === doc.unitId);
                  const pdfUrl = doc.url || doc.dataUrl;

                  return (
                    <tr key={doc.id} className="repo-row">
                      {/* Número do Chamado */}
                      <td>
                        <div className="repo-ticket-badge">
                          <span className="ticket-tag-letter">T</span>
                          <span className="ticket-tag-number">{doc.ticketNumber || 'T S/N'}</span>
                        </div>
                      </td>

                      {/* Atividade / Título */}
                      <td>
                        <div className="repo-activity-col">
                          <span className="repo-act-icon">{doc.sourceIcon}</span>
                          <div>
                            <strong className="repo-act-name">{doc.sourceTitle}</strong>
                            {doc.title && doc.title !== doc.sourceTitle && (
                              <span className="repo-act-sub">{doc.title}</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Unidade */}
                      <td>
                        <span className="repo-unit-tag">
                          <Building size={12} />
                          {unit?.name || 'EBSERH'}
                        </span>
                      </td>

                      {/* Data */}
                      <td>
                        <span className="repo-date-text">
                          <Calendar size={12} />
                          {doc.closedAt || 'Recente'}
                        </span>
                      </td>

                      {/* Arquivo & Tamanho */}
                      <td>
                        <div className="repo-file-info">
                          <FileText size={15} className="text-primary" />
                          <span className="repo-file-name" title={doc.fileName}>
                            {doc.fileName || 'relatorio.pdf'}
                          </span>
                        </div>
                      </td>

                      {/* Ações */}
                      <td style={{ textAlign: 'right' }}>
                        <div className="repo-action-buttons">
                          <button
                            className="btn-repo-action view"
                            onClick={() => onViewPdf(doc)}
                            title="Visualizar documento embutido no navegador"
                          >
                            <Eye size={14} />
                            <span>Visualizar</span>
                          </button>

                          {pdfUrl && (
                            <a
                              href={pdfUrl}
                              download={doc.fileName || 'chamado.pdf'}
                              className="btn-repo-action download"
                              title="Baixar arquivo original"
                            >
                              <Download size={14} />
                              <span>Baixar</span>
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="repo-empty-state">
              <FileText size={42} className="text-muted" />
              <h4>Nenhum documento encontrado</h4>
              <p>Nenhum chamado em PDF corresponde aos filtros de busca selecionados.</p>
            </div>
          )}
        </div>

        {/* Rodapé da Central de Documentos */}
        <div className="repo-footer">
          <div className="repo-footer-stat">
            <HardDrive size={15} className="text-primary" />
            <span>Total: <strong>{filteredDocuments.length}</strong> documento(s) oficial(is) homologado(s)</span>
          </div>
          <button className="btn-secondary" onClick={onClose}>
            Fechar Repositório
          </button>
        </div>
      </div>
    </div>
  );
}
