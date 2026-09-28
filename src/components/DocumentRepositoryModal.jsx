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
  Filter,
  Pencil,
  Trash2,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { fileToBase64, savePdfToIndexedDb } from '../services/pdfStorage';

export default function DocumentRepositoryModal({
  activities,
  pendencies,
  units,
  isAdmin,
  onClose,
  onViewPdf,
  onDeleteDocument,
  onEditDocument
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('all');

  // Estado para Edição de Documento
  const [editingDoc, setEditingDoc] = useState(null);
  const [editTicket, setEditTicket] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editFile, setEditFile] = useState(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Coleta todos os documentos de chamados anexados em atividades e pendências
  const documentsMap = new Map();

  // 1. De atividades
  (activities || []).forEach(act => {
    if (act.closureDocument) {
      const doc = act.closureDocument;
      const key = doc.ticketNumber || doc.fileName || act.id;
      if (!documentsMap.has(key)) {
        documentsMap.set(key, {
          ...doc,
          id: key,
          sourceType: 'activity',
          sourceId: act.id,
          sourceTitle: act.title,
          sourceIcon: act.icon || '📦',
          unitId: act.unit_id
        });
      }
    }
  });

  // 2. De pendências
  (pendencies || []).forEach(pend => {
    if (pend.closureDocument) {
      const doc = pend.closureDocument;
      const key = doc.ticketNumber || doc.fileName || pend.id;
      if (!documentsMap.has(key)) {
        documentsMap.set(key, {
          ...doc,
          id: key,
          sourceType: 'pendency',
          sourceId: pend.id,
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

  // Iniciar Edição
  const startEdit = (doc) => {
    setEditingDoc(doc);
    setEditTicket(doc.ticketNumber || '');
    setEditTitle(doc.title || doc.sourceTitle || '');
    setEditDate(doc.closedAt || new Date().toISOString().slice(0, 10));
    setEditNotes(doc.notes || '');
    setEditFile(null);
  };

  // Salvar Edição
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingDoc) return;

    if (!editTicket.trim()) {
      alert('Por favor, informe o número do chamado (ex: T 26 09 13480).');
      return;
    }

    setIsSavingEdit(true);
    try {
      let finalFileName = editingDoc.fileName;
      let finalDataUrl = editingDoc.dataUrl;
      let finalUrl = editingDoc.url;

      if (editFile) {
        finalFileName = editFile.name;
        finalDataUrl = await fileToBase64(editFile);
        finalUrl = finalDataUrl;
        await savePdfToIndexedDb(editTicket.trim(), editFile, {
          name: editFile.name,
          ticketNumber: editTicket.trim(),
          size: editFile.size
        });
      }

      const updatedPayload = {
        ticketNumber: editTicket.trim(),
        title: editTitle.trim(),
        closedAt: editDate,
        notes: editNotes.trim(),
        fileName: finalFileName,
        url: finalUrl,
        dataUrl: finalDataUrl
      };

      if (onEditDocument) {
        await onEditDocument(editingDoc, updatedPayload);
      }

      setEditingDoc(null);
    } catch (err) {
      console.error('Erro ao salvar edição do documento:', err);
      alert('Ocorreu um erro ao salvar as alterações do chamado.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Excluir Documento
  const handleDelete = (doc) => {
    const confirmMsg = `Tem certeza que deseja excluir o chamado "${doc.ticketNumber || 'T'}" e desvincular o documento PDF de "${doc.sourceTitle}"?`;
    if (window.confirm(confirmMsg)) {
      if (onDeleteDocument) {
        onDeleteDocument(doc);
      }
    }
  };

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
              <p>Consulta, visualização, edição e download de relatórios homologados das unidades EBSERH</p>
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
                  const unit = (units || []).find(u => u.id === doc.unitId);
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
                            <Eye size={13} />
                            <span>Visualizar</span>
                          </button>

                          {pdfUrl && (
                            <a
                              href={pdfUrl}
                              download={doc.fileName || 'chamado.pdf'}
                              className="btn-repo-action download"
                              title="Baixar arquivo original"
                            >
                              <Download size={13} />
                              <span>Baixar</span>
                            </a>
                          )}

                          {/* Ações de Edição e Exclusão exclusivas para Administrador */}
                          {isAdmin && (
                            <>
                              <button
                                className="btn-repo-action edit"
                                onClick={() => startEdit(doc)}
                                title="Editar dados do chamado e relatório"
                              >
                                <Pencil size={13} />
                                <span>Editar</span>
                              </button>

                              <button
                                className="btn-repo-action delete"
                                onClick={() => handleDelete(doc)}
                                title="Excluir chamado e desvincular documento"
                              >
                                <Trash2 size={13} />
                                <span>Excluir</span>
                              </button>
                            </>
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
              <p>Nenhum chamado em PDF homologado foi cadastrado até o momento.</p>
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

      {/* MODAL DE EDIÇÃO DE CHAMADO & DOCUMENTO */}
      {editingDoc && (
        <div className="modal-overlay" style={{ zIndex: 2600 }} onClick={() => setEditingDoc(null)}>
          <div className="repo-edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <Pencil size={20} className="text-warning" />
                <div>
                  <h3>Editar Chamado & Relatório</h3>
                  <p>{editingDoc.sourceTitle} &middot; {editingDoc.sourceType === 'activity' ? 'Atividade' : 'Pendência'}</p>
                </div>
              </div>
              <button className="btn-close-modal" onClick={() => setEditingDoc(null)}><X size={16} /></button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="repo-edit-body">
                <div className="repo-edit-field">
                  <label>Número do Chamado Oficial (ITSM / Elis)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: T 26 09 13480"
                    value={editTicket}
                    onChange={(e) => setEditTicket(e.target.value)}
                  />
                </div>

                <div className="repo-edit-field">
                  <label>Título / Descrição do Relatório</label>
                  <input
                    type="text"
                    placeholder="Ex: Validação de Portais RFID e Servidor Local"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </div>

                <div className="repo-edit-field">
                  <label>Data de Fechamento</label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                  />
                </div>

                <div className="repo-edit-field">
                  <label>Observações Técnicas Homologadas</label>
                  <textarea
                    rows={3}
                    placeholder="Informações adicionais sobre o atendimento, testes realizados..."
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                  />
                </div>

                <div className="repo-edit-field">
                  <label>Arquivo PDF Vinculado</label>
                  <div className="repo-file-replace-box">
                    <FileCheck size={20} className="text-primary" />
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '0.82rem', display: 'block' }}>
                        {editFile ? editFile.name : editingDoc.fileName || 'documento.pdf'}
                      </strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {editFile ? `${(editFile.size / 1024).toFixed(1)} KB (Novo arquivo selecionado)` : 'Arquivo atual homologado'}
                      </span>
                    </div>
                    <label className="btn-secondary" style={{ cursor: 'pointer', fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
                      <Upload size={13} style={{ marginRight: '4px' }} />
                      Substituir PDF
                      <input
                        type="file"
                        accept="application/pdf"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setEditFile(file);
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="modal-actions" style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)' }}>
                <button type="button" className="btn-secondary" onClick={() => setEditingDoc(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary-action" disabled={isSavingEdit}>
                  {isSavingEdit ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
