import React, { useRef, useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Edit3, 
  Trash2, 
  MessageSquare, 
  Send,
  FileCheck,
  Check
} from 'lucide-react';

export default function ActivityCard({
  activity,
  isAdmin,
  onEdit,
  onDelete,
  onAddComment,
  onViewPdf,
  onCompleteWithPdf,
  linkedPendency
}) {
  const cardRef = useRef(null);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(true);

  // Efeito 3D Tilt e Spotlight
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  const handleSendComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(activity.id, commentText.trim());
    setCommentText('');
  };

  // Badge de status
  const getBadgeConfig = (status) => {
    switch (status) {
      case 'completed':
        return { label: 'Concluído', className: 'badge success' };
      case 'in_progress':
        return { label: 'Em Andamento', className: 'badge info' };
      case 'pending':
        return { label: 'Pendente', className: 'badge warning' };
      case 'waiting':
        return { label: 'Aguardando', className: 'badge waiting' };
      case 'info':
      default:
        return { label: 'Informativo', className: 'badge info' };
    }
  };

  const badge = getBadgeConfig(activity.status);
  const closureDoc = activity.closureDocument || linkedPendency?.closureDocument;

  return (
    <div 
      className="card"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="card-content">
        {/* Cabeçalho do Card */}
        <div className="card-header">
          <div className="card-title-group">
            <span className="card-icon">{activity.icon || '📦'}</span>
            <h3 className="card-title">{activity.title}</h3>
          </div>
          <span className={badge.className}>{badge.label}</span>
        </div>

        {/* Descrição e Validação */}
        <div className="card-desc">
          <p>{activity.description}</p>
          {activity.validation && (
            <div className={`validation-badge ${activity.status === 'completed' ? 'success' : 'muted'}`}>
              {activity.status === 'completed' ? '✓ ' : 'ℹ '}
              {activity.validation}
            </div>
          )}
        </div>

        {/* Alerta de Ação / Bloqueio */}
        {activity.alert && (
          <div className={`alert-box ${activity.alert.type || 'warning'}`}>
            <span className="alert-icon">
              {activity.alert.type === 'danger' ? '🛑' : activity.alert.type === 'info' ? 'ℹ️' : '⚠️'}
            </span>
            <div className="alert-content">
              <strong>{activity.alert.title}:</strong> {activity.alert.message}
            </div>
          </div>
        )}

        {/* BOTÃO VISUALIZAR PDF DO CHAMADO (Se já concluído com PDF) */}
        {closureDoc && (
          <div 
            className="card-closure-link"
            onClick={() => onViewPdf(closureDoc)}
            title="Clique para visualizar o PDF emitido pelo sistema de chamados da Elis"
          >
            <div className="pdf-mini-icon">
              <FileText size={18} className="text-primary" />
            </div>
            <div className="closure-link-text">
              <span className="closure-ticket">{closureDoc.ticketNumber || 'Chamado Homologado'}</span>
              <span className="closure-status">📄 Ver Relatório em PDF anexado</span>
            </div>
          </div>
        )}

        {/* BOTÃO CONCLUIR ATIVIDADE COM UPLOAD OBRIGATÓRIO DE PDF (Modo Admin) */}
        {isAdmin && activity.status !== 'completed' && (
          <button 
            className="btn-complete-card-action"
            onClick={() => onCompleteWithPdf(activity)}
            title="Concluir atividade e fazer upload obrigatório do PDF do chamado"
          >
            <Check size={15} />
            <span>Concluir & Anexar PDF do Chamado</span>
          </button>
        )}

        {/* Ações de Administrador (Editar / Excluir) */}
        {isAdmin && (
          <div className="card-admin-actions">
            <button 
              className="btn-card-action edit" 
              onClick={() => onEdit(activity)}
              title="Editar atividade"
            >
              <Edit3 size={14} />
              <span>Editar</span>
            </button>
            <button 
              className="btn-card-action delete" 
              onClick={() => onDelete(activity.id)}
              title="Excluir atividade"
            >
              <Trash2 size={14} />
              <span>Excluir</span>
            </button>
          </div>
        )}

        {/* Seção de Comentários / Anotações */}
        <div className="comments-section">
          <div className="comments-header" onClick={() => setShowComments(!showComments)}>
            <div className="comments-header-left">
              <MessageSquare size={13} />
              <span>Anotações & Histórico ({activity.comments ? activity.comments.length : 0})</span>
            </div>
          </div>

          {showComments && (
            <>
              <div className="comments-list">
                {activity.comments && activity.comments.length > 0 ? (
                  activity.comments.map((c) => (
                    <div key={c.id} className="comment-item">
                      <div className="comment-meta">
                        <span className="comment-author">{c.author || 'Técnico'}</span>
                        <span className="comment-date">{c.date}</span>
                      </div>
                      <div className="comment-body">{c.text}</div>
                    </div>
                  ))
                ) : (
                  <div className="empty-comments">Nenhuma anotação registrada ainda.</div>
                )}
              </div>

              <form onSubmit={handleSendComment} className="input-group">
                <input
                  type="text"
                  placeholder="Adicionar anotação rápida..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button type="submit" title="Salvar anotação">
                  <Send size={13} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
