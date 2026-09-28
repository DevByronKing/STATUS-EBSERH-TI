import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Plus, 
  FileText, 
  Trash2, 
  Building, 
  ShieldAlert,
  Calendar,
  Check
} from 'lucide-react';

export default function PendenciesModal({
  pendencies,
  units,
  activities,
  isAdmin,
  onClose,
  onOpenNewPendency,
  onStartCloseTicket,
  onViewReport,
  onDeletePendency
}) {
  const [filterStatus, setFilterStatus] = useState('open'); // 'open', 'resolved', 'all'
  const [selectedUnit, setSelectedUnit] = useState('all');

  const filtered = pendencies.filter(p => {
    const matchesStatus = 
      filterStatus === 'all' ? true :
      filterStatus === 'open' ? p.status !== 'resolved' :
      p.status === 'resolved';

    const matchesUnit = selectedUnit === 'all' || p.unit_id === selectedUnit;
    return matchesStatus && matchesUnit;
  });

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'critical':
        return { label: 'Crítica', className: 'severity-badge critical' };
      case 'high':
        return { label: 'Alta', className: 'severity-badge high' };
      case 'medium':
        return { label: 'Média', className: 'severity-badge medium' };
      case 'low':
      default:
        return { label: 'Baixa', className: 'severity-badge low' };
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container pendencies-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <AlertTriangle size={22} className="text-rose" />
            <div>
              <h3>Gestão de Pendências & Chamados</h3>
              <p>Acompanhamento de bloqueios operacionais e relatórios de resolução</p>
            </div>
          </div>
          <button className="btn-close-modal" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Barra de Filtros e Ação */}
        <div className="pendencies-toolbar">
          <div className="toolbar-filters">
            <div className="tabs-group">
              <button 
                className={`tab-btn ${filterStatus === 'open' ? 'active' : ''}`}
                onClick={() => setFilterStatus('open')}
              >
                Abertas ({pendencies.filter(p => p.status !== 'resolved').length})
              </button>
              <button 
                className={`tab-btn ${filterStatus === 'resolved' ? 'active' : ''}`}
                onClick={() => setFilterStatus('resolved')}
              >
                Resolvidas / Relatórios ({pendencies.filter(p => p.status === 'resolved').length})
              </button>
              <button 
                className={`tab-btn ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                Todas ({pendencies.length})
              </button>
            </div>

            <select 
              value={selectedUnit} 
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="select-unit-filter"
            >
              <option value="all">Todas as Unidades</option>
              {units.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          {isAdmin && (
            <button className="btn-primary-action" onClick={onOpenNewPendency}>
              <Plus size={15} />
              <span>Registrar Pendência</span>
            </button>
          )}
        </div>

        {/* Lista de Pendências */}
        <div className="pendencies-list-wrap">
          {filtered.length > 0 ? (
            filtered.map((item) => {
              const unit = units.find(u => u.id === item.unit_id);
              const activity = activities.find(a => a.id === item.activity_id);
              const sev = getSeverityBadge(item.severity);
              const isResolved = item.status === 'resolved';

              return (
                <div key={item.id} className={`pendency-item-card ${isResolved ? 'resolved' : ''}`}>
                  <div className="pendency-top">
                    <div className="pendency-badges">
                      <span className={sev.className}>{sev.label}</span>
                      <span className="unit-tag">
                        <Building size={12} />
                        {unit?.name || 'Geral'}
                      </span>
                      {activity && (
                        <span className="activity-tag">
                          {activity.icon} {activity.title}
                        </span>
                      )}
                    </div>
                    <div className="pendency-date">
                      <Calendar size={13} />
                      <span>{new Date(item.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>

                  <h4 className="pendency-title">{item.title}</h4>
                  <p className="pendency-desc">{item.description}</p>

                  <div className="pendency-footer">
                    <div className="pendency-status-indicator">
                      {isResolved ? (
                        <span className="status-resolved-tag">
                          <CheckCircle2 size={15} />
                          <span>Resolvida & Homologada</span>
                        </span>
                      ) : (
                        <span className="status-open-tag">
                          <Clock size={15} />
                          <span>Pendente de Ação</span>
                        </span>
                      )}
                    </div>

                    <div className="pendency-actions-group">
                      {/* Se tem relatório de fechamento */}
                      {item.closure_report && (
                        <button 
                          className="btn-view-report"
                          onClick={() => onViewReport(item.closure_report)}
                        >
                          <FileText size={14} />
                          <span>Ver Relatório ({item.closure_report.ticketNumber})</span>
                        </button>
                      )}

                      {/* Se for Admin e estiver aberta, botão para fechar e emitir documento */}
                      {isAdmin && !isResolved && (
                        <button 
                          className="btn-resolve-wizard"
                          onClick={() => onStartCloseTicket(item)}
                          title="Fechar chamado e emitir relatório Elis"
                        >
                          <Check size={14} />
                          <span>Fechar Pendência (Emitir Chamado)</span>
                        </button>
                      )}

                      {/* Se for Admin, pode excluir */}
                      {isAdmin && (
                        <button 
                          className="btn-delete-pendency"
                          onClick={() => onDeletePendency(item.id)}
                          title="Excluir pendência"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-pendencies-state">
              <CheckCircle2 size={36} className="text-emerald" />
              <p>Nenhuma pendência encontrada com os filtros selecionados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
