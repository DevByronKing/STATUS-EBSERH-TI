import React from 'react';
import ActivityCard from './ActivityCard';
import { Plus, CheckCircle, Clock } from 'lucide-react';

export default function UnitSection({
  unit,
  activities,
  pendencies,
  isAdmin,
  onEditActivity,
  onDeleteActivity,
  onAddComment,
  onViewPdf,
  onCompleteWithPdf,
  onAddActivityInUnit
}) {
  const total = activities.length;
  const completed = activities.filter(a => a.status === 'completed').length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Raio e circunferência do círculo SVG
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getProgressColor = (pct) => {
    if (pct >= 75) return 'var(--elis-teal)';
    if (pct >= 40) return 'var(--elis-cyan)';
    return 'var(--elis-primary)';
  };

  const getGlowColor = (pct) => {
    if (pct >= 75) return 'rgba(0, 192, 181, 0.4)';
    if (pct >= 40) return 'rgba(0, 163, 224, 0.4)';
    return 'rgba(0, 114, 206, 0.4)';
  };

  const progressColor = getProgressColor(percentage);
  const glowColor = getGlowColor(percentage);

  return (
    <section className="hospital-container">
      {/* Sidebar Executiva com Gráfico Circular */}
      <div className="hospital-info">
        <div className="unit-elis-stripe"></div>

        <div className="h-header">
          <div className="unit-title-with-tag">
            <span className="elis-title-tag"></span>
            <h2 className="h-title">{unit.name}</h2>
          </div>
          <span className="h-subtitle">{unit.subtitle || 'Implantação Tecnológica'}</span>
        </div>

        <div className="circular-progress" style={{ '--glow-color': glowColor }}>
          <svg viewBox="0 0 160 160">
            <circle 
              className="bg" 
              cx="80" 
              cy="80" 
              r={radius} 
            />
            <circle
              className="progress"
              cx="80"
              cy="80"
              r={radius}
              style={{
                stroke: progressColor,
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset
              }}
            />
          </svg>
          <div className="percentage-container">
            <span className="percentage" style={{ color: progressColor }}>
              {percentage}%
            </span>
            <span className="percentage-label">Concluído</span>
          </div>
        </div>

        <div className="unit-summary">
          <div className="unit-stat-pills">
            <span className="stat-pill success">
              <CheckCircle size={13} />
              {completed} Prontos
            </span>
            <span className="stat-pill pending">
              <Clock size={13} />
              {total - completed} Pendentes
            </span>
          </div>
          <p className="unit-desc">{unit.description}</p>
        </div>

        {isAdmin && (
          <button 
            className="btn-add-unit-activity"
            onClick={() => onAddActivityInUnit(unit.id)}
            title="Adicionar atividade específica nesta unidade"
          >
            <Plus size={15} />
            <span>Adicionar Atividade</span>
          </button>
        )}
      </div>

      {/* Grid de Atividades */}
      <div className="cards-grid">
        {activities.length > 0 ? (
          activities.map((activity) => {
            const linked = pendencies.find(
              p => p.activity_id === activity.id || (p.closureDocument && p.activity_id === activity.id)
            );
            return (
              <ActivityCard
                key={activity.id}
                activity={activity}
                isAdmin={isAdmin}
                onEdit={onEditActivity}
                onDelete={onDeleteActivity}
                onAddComment={onAddComment}
                onViewPdf={onViewPdf}
                onCompleteWithPdf={onCompleteWithPdf}
                linkedPendency={linked}
              />
            );
          })
        ) : (
          <div className="empty-unit-card">
            <p>Nenhuma atividade encontrada com o filtro atual nesta unidade.</p>
          </div>
        )}
      </div>
    </section>
  );
}
