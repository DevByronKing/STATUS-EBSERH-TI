import React, { useState } from 'react';
import { X, Check, Layers, AlertTriangle } from 'lucide-react';

const COMMON_ICONS = ['🚪', '🖥️', '⚖️', '📱', '💻', '🗄️', '🏷️', '📶', '⚙️', '📦', '🔧', '🩺'];

export default function ActivityModal({
  activity, // null if creating, object if editing
  units,
  defaultUnitId,
  onClose,
  onSave
}) {
  const isEditing = !!activity;

  const [unitId, setUnitId] = useState(activity?.unit_id || defaultUnitId || units[0]?.id || '');
  const [title, setTitle] = useState(activity?.title || '');
  const [icon, setIcon] = useState(activity?.icon || '📦');
  const [status, setStatus] = useState(activity?.status || 'pending');
  const [description, setDescription] = useState(activity?.description || '');
  const [validation, setValidation] = useState(activity?.validation || '');
  
  // Alert box
  const [hasAlert, setHasAlert] = useState(!!activity?.alert);
  const [alertType, setAlertType] = useState(activity?.alert?.type || 'warning');
  const [alertTitle, setAlertTitle] = useState(activity?.alert?.title || 'Ação Necessária');
  const [alertMessage, setAlertMessage] = useState(activity?.alert?.message || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      ...(activity || {}),
      id: activity?.id || `act-${Date.now()}`,
      unit_id: unitId,
      title: title.trim(),
      icon: icon || '📦',
      status: status,
      description: description.trim(),
      validation: validation.trim(),
      alert: hasAlert && alertMessage.trim() ? {
        type: alertType,
        title: alertTitle.trim() || 'Atenção',
        message: alertMessage.trim()
      } : null,
      comments: activity?.comments || [],
      order_index: activity?.order_index ?? 99,
      updated_at: new Date().toISOString()
    };

    onSave(payload);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container activity-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Layers size={22} className="text-primary" />
            <div>
              <h3>{isEditing ? 'Editar Atividade' : 'Criar Nova Atividade'}</h3>
              <p>Configure os detalhes do equipamento ou processo</p>
            </div>
          </div>
          <button className="btn-close-modal" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid-2">
            <div className="form-group">
              <label>Unidade / Hospital</label>
              <select value={unitId} onChange={(e) => setUnitId(e.target.value)} required>
                {units.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Status Operacional</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="completed">Concluído / Operacional</option>
                <option value="in_progress">Em Andamento</option>
                <option value="pending">Pendente</option>
                <option value="waiting">Aguardando / Bloqueado</option>
                <option value="info">Informativo</option>
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Título da Atividade / Equipamento</label>
              <input 
                type="text" 
                placeholder="Ex: Portal Entrada, Server Barros, PC Admin..." 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Ícone de Identificação</label>
              <div className="icon-selector-row">
                <input 
                  type="text" 
                  value={icon} 
                  onChange={(e) => setIcon(e.target.value)} 
                  className="icon-input"
                  maxLength={4}
                />
                <div className="common-icons-picker">
                  {COMMON_ICONS.map(i => (
                    <button 
                      key={i} 
                      type="button" 
                      className={`btn-pick-icon ${icon === i ? 'selected' : ''}`}
                      onClick={() => setIcon(i)}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Descrição do Status</label>
            <textarea 
              rows={2} 
              placeholder="Ex: Instalado, configurado e sincronizado em Abril..."
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label>Validação / Tag de Sistema (Opcional)</label>
            <input 
              type="text" 
              placeholder="Ex: Validado Myelis, Em Operação, Homologado..."
              value={validation} 
              onChange={(e) => setValidation(e.target.value)} 
            />
          </div>

          {/* Toggle de Alerta / Bloqueio */}
          <div className="alert-toggle-box">
            <div className="toggle-header">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={hasAlert} 
                  onChange={(e) => setHasAlert(e.target.checked)} 
                />
                <span>Exibir caixa de Alerta / Bloqueio de Ação</span>
              </label>
            </div>

            {hasAlert && (
              <div className="alert-inputs-row">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Tipo do Alerta</label>
                    <select value={alertType} onChange={(e) => setAlertType(e.target.value)}>
                      <option value="warning">Atenção (Amarelo / Laranja)</option>
                      <option value="danger">Bloqueio Crítico (Vermelho)</option>
                      <option value="info">Informativo (Azul)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Título do Alerta</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Ação Necessária, Bloqueio Físico..."
                      value={alertTitle} 
                      onChange={(e) => setAlertTitle(e.target.value)} 
                    />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: '0.5rem' }}>
                  <label>Mensagem do Alerta</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Configuração de VPN necessária pelo técnico local..."
                    value={alertMessage} 
                    onChange={(e) => setAlertMessage(e.target.value)} 
                  />
                </div>
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary-action submit-btn">
              <Check size={16} />
              <span>{isEditing ? 'Salvar Alterações' : 'Criar Atividade'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
