import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, CheckSquare, Layers, Building } from 'lucide-react';

export default function MetricsBanner({ 
  activities, 
  pendencies, 
  units, 
  statusFilter, 
  setStatusFilter,
  selectedUnit,
  setSelectedUnit 
}) {
  const totalActivities = activities.length;
  const completedActivities = activities.filter(a => a.status === 'completed').length;
  const inProgressActivities = activities.filter(a => a.status === 'in_progress').length;
  const pendingActivities = activities.filter(a => a.status === 'pending' || a.status === 'waiting').length;
  const overallPercentage = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;

  const openPendencies = pendencies.filter(p => p.status !== 'resolved').length;
  const resolvedPendencies = pendencies.filter(p => p.status === 'resolved').length;

  return (
    <div className="metrics-banner">
      {/* Cards de Métricas Rápidas */}
      <div className="metrics-grid">
        <div 
          className={`metric-card ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          <div className="metric-icon-wrap primary">
            <Layers size={22} />
          </div>
          <div className="metric-content">
            <span className="metric-value">{totalActivities}</span>
            <span className="metric-label">Total de Atividades</span>
          </div>
        </div>

        <div 
          className={`metric-card ${statusFilter === 'completed' ? 'active' : ''}`}
          onClick={() => setStatusFilter(statusFilter === 'completed' ? 'all' : 'completed')}
        >
          <div className="metric-icon-wrap success">
            <CheckCircle2 size={22} />
          </div>
          <div className="metric-content">
            <div className="metric-value-row">
              <span className="metric-value text-emerald">{completedActivities}</span>
              <span className="metric-badge-pct">{overallPercentage}% Concluído</span>
            </div>
            <span className="metric-label">Operacionais & Validadas</span>
          </div>
        </div>

        <div 
          className={`metric-card ${statusFilter === 'pending' ? 'active' : ''}`}
          onClick={() => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending')}
        >
          <div className="metric-icon-wrap warning">
            <Clock size={22} />
          </div>
          <div className="metric-content">
            <span className="metric-value text-amber">{pendingActivities}</span>
            <span className="metric-label">Em Andamento / Pendentes</span>
          </div>
        </div>

        <div 
          className="metric-card highlight-pendency"
        >
          <div className="metric-icon-wrap danger">
            <AlertTriangle size={22} />
          </div>
          <div className="metric-content">
            <div className="metric-value-row">
              <span className="metric-value text-rose">{openPendencies}</span>
              <span className="metric-sub-count">{resolvedPendencies} Resolvidas</span>
            </div>
            <span className="metric-label">Pendências em Aberto</span>
          </div>
        </div>
      </div>

      {/* Barra de Filtro de Unidades / Hospitais */}
      <div className="units-filter-bar">
        <div className="filter-label">
          <Building size={16} />
          <span>Filtrar por Unidade:</span>
        </div>
        <div className="filter-pills">
          <button 
            className={`filter-pill ${selectedUnit === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedUnit('all')}
          >
            Todas as Unidades ({units.length})
          </button>
          {units.map(unit => {
            const unitActs = activities.filter(a => a.unit_id === unit.id);
            const unitCompleted = unitActs.filter(a => a.status === 'completed').length;
            const pct = unitActs.length > 0 ? Math.round((unitCompleted / unitActs.length) * 100) : 0;
            return (
              <button 
                key={unit.id}
                className={`filter-pill ${selectedUnit === unit.id ? 'active' : ''}`}
                onClick={() => setSelectedUnit(unit.id)}
              >
                <span>{unit.name}</span>
                <span className="pill-pct">{pct}%</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
