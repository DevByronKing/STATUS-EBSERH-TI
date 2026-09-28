import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MetricsBanner from './components/MetricsBanner';
import UnitSection from './components/UnitSection';
import ActivityModal from './components/ActivityModal';
import PendencyModal from './components/PendencyModal';
import PendenciesModal from './components/PendenciesModal';
import CloseTicketWizardModal from './components/CloseTicketWizardModal';
import ClosureReportModal from './components/ClosureReportModal';
import AdminLoginModal from './components/AdminLoginModal';
import CloudSettingsModal from './components/CloudSettingsModal';
import PresentationModal from './components/PresentationModal';

import { 
  loadAllData, 
  syncSaveActivity, 
  syncDeleteActivity, 
  syncSavePendency, 
  syncDeletePendency, 
  saveLocalData,
  checkAdminSession,
  setAdminSession
} from './services/storage';
import { initialUnits, initialActivities, initialPendencies } from './data/initialData';
import { getSupabaseClient } from './services/supabaseClient';

export default function App() {
  // Tema Claro / Escuro
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('elis_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('elis_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Modo Administrador (com PIN)
  const [isAdmin, setIsAdmin] = useState(() => checkAdminSession());

  // Dados Globais
  const [data, setData] = useState({
    units: initialUnits,
    activities: initialActivities,
    pendencies: initialPendencies,
    lastUpdated: new Date().toISOString()
  });
  const [dataSource, setDataSource] = useState('local'); // 'local' ou 'supabase'
  const [isLoading, setIsLoading] = useState(true);

  // Filtros de Pesquisa e Visualização
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'completed', 'pending'
  const [selectedUnit, setSelectedUnit] = useState('all');

  // Modais
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [defaultUnitForActivity, setDefaultUnitForActivity] = useState('');

  const [isPendencyModalOpen, setIsPendencyModalOpen] = useState(false);
  const [isPendenciesListModalOpen, setIsPendenciesListModalOpen] = useState(false);

  const [isCloseTicketWizardOpen, setIsCloseTicketWizardOpen] = useState(false);
  const [closingPendency, setClosingPendency] = useState(null);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [viewingReport, setViewingReport] = useState(null);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Carregar dados na inicialização
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      const res = await loadAllData();
      setData(res.data);
      setDataSource(res.source);
      setIsLoading(false);
    }
    init();
  }, []);

  // Inscrição Realtime no Supabase (se conectado)
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const channel = supabase
      .channel('elis-realtime-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'elis_activities' }, async () => {
        const refreshed = await loadAllData();
        setData(refreshed.data);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'elis_pendencies' }, async () => {
        const refreshed = await loadAllData();
        setData(refreshed.data);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'elis_units' }, async () => {
        const refreshed = await loadAllData();
        setData(refreshed.data);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [dataSource]);

  // Handlers de Autenticação Admin
  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setAdminSession(true);
    setIsLoginModalOpen(false);
  };

  const handleLogoutAdmin = () => {
    setIsAdmin(false);
    setAdminSession(false);
  };

  // Handlers de Atividades
  const handleOpenNewActivity = (unitId = '') => {
    setEditingActivity(null);
    setDefaultUnitForActivity(unitId || data.units[0]?.id || '');
    setIsActivityModalOpen(true);
  };

  const handleEditActivity = (act) => {
    setEditingActivity(act);
    setIsActivityModalOpen(true);
  };

  const handleSaveActivity = async (savedActivity) => {
    let updatedActivities;
    const exists = data.activities.some(a => a.id === savedActivity.id);
    if (exists) {
      updatedActivities = data.activities.map(a => a.id === savedActivity.id ? savedActivity : a);
    } else {
      updatedActivities = [...data.activities, savedActivity];
    }

    const newData = { ...data, activities: updatedActivities };
    setData(newData);
    setIsActivityModalOpen(false);
    setEditingActivity(null);

    await syncSaveActivity(savedActivity, newData);
  };

  const handleDeleteActivity = async (activityId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta atividade?')) return;

    const updatedActivities = data.activities.filter(a => a.id !== activityId);
    const newData = { ...data, activities: updatedActivities };
    setData(newData);

    await syncDeleteActivity(activityId, newData);
  };

  const handleAddComment = async (activityId, commentText) => {
    const act = data.activities.find(a => a.id === activityId);
    if (!act) return;

    const nowStr = new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    const newComment = {
      id: `comm-${Date.now()}`,
      author: isAdmin ? 'Luiz Henrique (Admin)' : 'Gestor / Visitante',
      date: nowStr,
      text: commentText
    };

    const updatedComments = [...(act.comments || []), newComment];
    const updatedAct = { ...act, comments: updatedComments };
    const updatedActivities = data.activities.map(a => a.id === activityId ? updatedAct : a);

    const newData = { ...data, activities: updatedActivities };
    setData(newData);

    await syncSaveActivity(updatedAct, newData);
  };

  // Handlers de Pendências
  const handleSavePendency = async (newPendency) => {
    const updatedPendencies = [newPendency, ...data.pendencies];
    const newData = { ...data, pendencies: updatedPendencies };
    setData(newData);
    setIsPendencyModalOpen(false);

    await syncSavePendency(newPendency, newData);
  };

  const handleDeletePendency = async (pendencyId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta pendência?')) return;

    const updatedPendencies = data.pendencies.filter(p => p.id !== pendencyId);
    const newData = { ...data, pendencies: updatedPendencies };
    setData(newData);

    await syncDeletePendency(pendencyId, newData);
  };

  // Fechamento de Chamado e Emissão de Documento Elis
  const handleStartCloseTicket = (pendency) => {
    setClosingPendency(pendency);
    setIsCloseTicketWizardOpen(true);
    setIsPendenciesListModalOpen(false);
  };

  const handleFinishCloseTicket = async (closureReport) => {
    if (!closingPendency) return;

    const updatedPendency = {
      ...closingPendency,
      status: 'resolved',
      resolved_at: new Date().toISOString(),
      closure_report: closureReport
    };

    const updatedPendencies = data.pendencies.map(p => 
      p.id === closingPendency.id ? updatedPendency : p
    );

    let updatedActivities = data.activities;
    if (closingPendency.activity_id) {
      updatedActivities = data.activities.map(a => {
        if (a.id === closingPendency.activity_id) {
          return {
            ...a,
            status: 'completed',
            validation: 'Homologado no Chamado ' + closureReport.ticketNumber,
            alert: null
          };
        }
        return a;
      });
    }

    const newData = {
      ...data,
      pendencies: updatedPendencies,
      activities: updatedActivities
    };

    setData(newData);
    setIsCloseTicketWizardOpen(false);
    setClosingPendency(null);

    await syncSavePendency(updatedPendency, newData);

    setViewingReport(closureReport);
    setIsReportModalOpen(true);
  };

  // Compartilhar Link com Gestores
  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Restaurar dados originais padrão Elis
  const handleResetToDefault = () => {
    if (window.confirm('Deseja realmente restaurar os dados originais da Elis (Barros Barreto e Betina Ferro)?')) {
      const resetData = {
        units: initialUnits,
        activities: initialActivities,
        pendencies: initialPendencies,
        lastUpdated: new Date().toISOString()
      };
      saveLocalData(resetData);
      setData(resetData);
      setIsSettingsModalOpen(false);
      alert('Dados restaurados com sucesso para o padrão inicial Elis.');
    }
  };

  const openPendenciesCount = data.pendencies.filter(p => p.status !== 'resolved').length;

  const filteredUnits = data.units.filter(u => selectedUnit === 'all' || u.id === selectedUnit);

  const getFilteredActivitiesForUnit = (unitId) => {
    return data.activities.filter(a => {
      if (a.unit_id !== unitId) return false;

      if (statusFilter === 'completed' && a.status !== 'completed') return false;
      if (statusFilter === 'pending' && a.status !== 'pending' && a.status !== 'waiting') return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = a.title.toLowerCase().includes(query);
        const matchesDesc = (a.description || '').toLowerCase().includes(query);
        const matchesAlert = (a.alert?.message || '').toLowerCase().includes(query);
        const matchesVal = (a.validation || '').toLowerCase().includes(query);
        return matchesTitle || matchesDesc || matchesAlert || matchesVal;
      }

      return true;
    });
  };

  return (
    <div className="app-layout">
      {/* Background Decorativo */}
      <div className="background-grid"></div>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      {/* Header com Padrão Elis */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        isAdmin={isAdmin}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogoutAdmin={handleLogoutAdmin}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenNewActivity={() => handleOpenNewActivity()}
        onOpenPendenciesModal={() => setIsPendenciesListModalOpen(true)}
        onOpenPresentation={() => setIsPresentationOpen(true)}
        openPendenciesCount={openPendenciesCount}
        dataSource={dataSource}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onCopyLink={handleCopyShareLink}
        copiedLink={copiedLink}
      />

      {/* Main Content */}
      <main className="app-main">
        {/* Banner de Métricas Executivas para Gestores */}
        <MetricsBanner
          activities={data.activities}
          pendencies={data.pendencies}
          units={data.units}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          selectedUnit={selectedUnit}
          setSelectedUnit={setSelectedUnit}
        />

        {/* Seções das Unidades Hospitalares */}
        {filteredUnits.map((unit) => {
          const unitActs = getFilteredActivitiesForUnit(unit.id);
          return (
            <UnitSection
              key={unit.id}
              unit={unit}
              activities={unitActs}
              pendencies={data.pendencies}
              isAdmin={isAdmin}
              onEditActivity={handleEditActivity}
              onDeleteActivity={handleDeleteActivity}
              onAddComment={handleAddComment}
              onViewReport={(rep) => {
                setViewingReport(rep);
                setIsReportModalOpen(true);
              }}
              onAddActivityInUnit={(unitId) => handleOpenNewActivity(unitId)}
            />
          );
        })}

        {/* Rodapé Oficial Padrão Elis */}
        <footer className="elis-corporate-footer">
          <div className="footer-left">
            <img src="/elis-logo-tagline.png" alt="Elis" className="footer-logo" />
            <div className="footer-copy">
              <span>EBSERH &middot; Empresa Brasileira de Serviços Hospitalares</span>
              <span>&copy; {new Date().getFullYear()} Elis Brasil &middot; Circular services at work</span>
            </div>
          </div>
          <div className="footer-right">
            <button className="btn-footer-link" onClick={() => setIsPresentationOpen(true)}>
              Modo Apresentação (Slides Padrão Elis)
            </button>
            <span className="footer-divider">&middot;</span>
            <button className="btn-footer-link" onClick={() => setIsSettingsModalOpen(true)}>
              Nuvem & Backup
            </button>
          </div>
        </footer>
      </main>

      {/* MODAL MODO APRESENTAÇÃO EXECUTIVA (SLIDES PADRÃO ELIS) */}
      {isPresentationOpen && (
        <PresentationModal
          units={data.units}
          activities={data.activities}
          pendencies={data.pendencies}
          onClose={() => setIsPresentationOpen(false)}
          onViewReport={(rep) => {
            setIsPresentationOpen(false);
            setViewingReport(rep);
            setIsReportModalOpen(true);
          }}
        />
      )}

      {/* Modais do Sistema */}
      {isActivityModalOpen && (
        <ActivityModal
          activity={editingActivity}
          units={data.units}
          defaultUnitId={defaultUnitForActivity}
          onClose={() => { setIsActivityModalOpen(false); setEditingActivity(null); }}
          onSave={handleSaveActivity}
        />
      )}

      {isPendencyModalOpen && (
        <PendencyModal
          units={data.units}
          activities={data.activities}
          defaultUnitId={selectedUnit !== 'all' ? selectedUnit : data.units[0]?.id}
          onClose={() => setIsPendencyModalOpen(false)}
          onSave={handleSavePendency}
        />
      )}

      {isPendenciesListModalOpen && (
        <PendenciesModal
          pendencies={data.pendencies}
          units={data.units}
          activities={data.activities}
          isAdmin={isAdmin}
          onClose={() => setIsPendenciesListModalOpen(false)}
          onOpenNewPendency={() => {
            setIsPendenciesListModalOpen(false);
            setIsPendencyModalOpen(true);
          }}
          onStartCloseTicket={handleStartCloseTicket}
          onViewReport={(rep) => {
            setViewingReport(rep);
            setIsReportModalOpen(true);
          }}
          onDeletePendency={handleDeletePendency}
        />
      )}

      {isCloseTicketWizardOpen && (
        <CloseTicketWizardModal
          pendency={closingPendency}
          units={data.units}
          activities={data.activities}
          onClose={() => { setIsCloseTicketWizardOpen(false); setClosingPendency(null); }}
          onSaveReport={handleFinishCloseTicket}
        />
      )}

      {isReportModalOpen && (
        <ClosureReportModal
          report={viewingReport}
          onClose={() => { setIsReportModalOpen(false); setViewingReport(null); }}
        />
      )}

      {isLoginModalOpen && (
        <AdminLoginModal
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {isSettingsModalOpen && (
        <CloudSettingsModal
          allData={data}
          onClose={() => setIsSettingsModalOpen(false)}
          onDataImported={(importedData) => setData(importedData)}
          onResetToDefault={handleResetToDefault}
        />
      )}
    </div>
  );
}
