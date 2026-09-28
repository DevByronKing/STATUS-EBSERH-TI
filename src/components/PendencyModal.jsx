import React, { useState } from 'react';
import { X, Check, AlertTriangle } from 'lucide-react';

export default function PendencyModal({
  units,
  activities,
  defaultUnitId,
  onClose,
  onSave
}) {
  const [unitId, setUnitId] = useState(defaultUnitId || units[0]?.id || '');
  const [activityId, setActivityId] = useState('');
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState('high');
  const [description, setDescription] = useState('');

  const unitActivities = activities.filter(a => a.unit_id === unitId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      id: `pend-${Date.now()}`,
      unit_id: unitId,
      activity_id: activityId || null,
      title: title.trim(),
      severity: severity,
      status: 'open',
      description: description.trim(),
      created_at: new Date().toISOString(),
      resolved_at: null,
      closure_report: null
    };

    onSave(payload);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container pendency-create-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <AlertTriangle size={22} className="text-amber" />
            <div>
              <h3>Registrar Nova Pendência</h3>
              <p>Cadastre um bloqueio ou necessidade técnica a ser resolvida</p>
            </div>
          </div>
          <button className="btn-close-modal" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid-2">
            <div className="form-group">
              <label>Unidade / Hospital</label>
              <select value={unitId} onChange={(e) => { setUnitId(e.target.value); setActivityId(''); }} required>
                {units.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Criticidade / Severidade</label>
              <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta (P2 High)</option>
                <option value="critical">Crítica / Impeditiva</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Vincular a uma Atividade Existente (Opcional)</label>
            <select value={activityId} onChange={(e) => setActivityId(e.target.value)}>
              <option value="">Nenhuma (Pendência Geral da Unidade)</option>
              {unitActivities.map(a => (
                <option key={a.id} value={a.id}>{a.icon} {a.title}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Título da Pendência</label>
            <input 
              type="text" 
              placeholder="Ex: Configuração de VPN, Manutenção nos vidros físicos..." 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Descrição do Bloqueio / Ação Necessária</label>
            <textarea 
              rows={3} 
              placeholder="Descreva o motivo do bloqueio, setor responsável ou peças aguardadas..."
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary-action submit-btn">
              <Check size={16} />
              <span>Registrar Pendência</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
