import React from 'react';
import { 
  Shield, 
  Lock, 
  LogOut, 
  Sun, 
  Moon, 
  Share2, 
  Database, 
  AlertCircle, 
  Plus, 
  Search, 
  Tv, 
  CheckCircle2
} from 'lucide-react';

export default function Header({
  theme,
  toggleTheme,
  isAdmin,
  onOpenLogin,
  onLogoutAdmin,
  onOpenSettings,
  onOpenNewActivity,
  onOpenPendenciesModal,
  onOpenPresentation,
  openPendenciesCount,
  dataSource,
  searchQuery,
  setSearchQuery,
  onCopyLink,
  copiedLink
}) {
  return (
    <header className="site-header-wrapper">
      {/* Faixa Multicolorida Padrão Elis no Topo */}
      <div className="elis-top-brand-bar">
        <div className="bar-navy"></div>
        <div className="bar-cyan"></div>
        <div className="bar-teal"></div>
        <div className="bar-red"></div>
      </div>

      <div className="site-header">
        <div className="header-left">
          <div className="brand-group">
            <div className="logo-container">
              <img 
                src="/elis-logo-tagline.png" 
                alt="Elis - Circular services at work" 
                className="brand-logo" 
              />
            </div>
            <div className="brand-divider"></div>
            <div className="brand-text">
              <div className="brand-sub">EBSERH &middot; TECNOLOGIA DA INFORMAÇÃO</div>
              <h1 className="brand-title">Status Dashboard</h1>
            </div>
          </div>
        </div>

        <div className="header-center">
          <div className="search-bar">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar atividade, portal, servidor, pendência..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')}>&times;</button>
            )}
          </div>
        </div>

        <div className="header-right">
          {/* Botão Apresentação Padrão Elis */}
          <button 
            className="btn-presentation-mode" 
            onClick={onOpenPresentation}
            title="Abrir Apresentação Executiva em Slides no Padrão Elis"
          >
            <Tv size={16} />
            <span>Apresentação Elis</span>
          </button>

          {/* Status da Conexão / Nuvem */}
          {isAdmin ? (
            <button 
              className={`cloud-badge ${dataSource === 'supabase' ? 'connected' : 'local'}`}
              onClick={onOpenSettings}
              title={dataSource === 'supabase' ? 'Conectado à nuvem Supabase (Sincronizado)' : 'Armazenado no navegador (Configurações)'}
            >
              <Database size={14} />
              <span>{dataSource === 'supabase' ? 'Supabase' : 'Local'}</span>
            </button>
          ) : (
            <div 
              className={`cloud-badge static ${dataSource === 'supabase' ? 'connected' : 'local'}`}
              title={dataSource === 'supabase' ? 'Painel conectado em tempo real' : 'Painel Online'}
            >
              <Database size={14} />
              <span>{dataSource === 'supabase' ? 'Ao Vivo' : 'Online'}</span>
            </div>
          )}

          {/* Botão de Pendências com Badge */}
          <button className="btn-pendencies" onClick={onOpenPendenciesModal}>
            <AlertCircle size={16} />
            <span>Pendências</span>
            {openPendenciesCount > 0 && (
              <span className="pendency-counter-badge">{openPendenciesCount}</span>
            )}
          </button>

          {/* Compartilhar Link para Gestores */}
          <button 
            className={`btn-share ${copiedLink ? 'copied' : ''}`} 
            onClick={onCopyLink}
            title="Copiar link compartilhável para Gestores"
          >
            {copiedLink ? <CheckCircle2 size={16} /> : <Share2 size={16} />}
            <span>{copiedLink ? 'Copiado!' : 'Compartilhar'}</span>
          </button>

          {/* Ações Administrativas se logado */}
          {isAdmin ? (
            <div className="admin-actions-group">
              <button className="btn-primary-action" onClick={onOpenNewActivity} title="Criar nova atividade">
                <Plus size={16} />
                <span>Nova Atividade</span>
              </button>
              <button className="btn-admin-status active" onClick={onLogoutAdmin} title="Clique para sair do modo Administrador">
                <Shield size={16} className="text-emerald" />
                <span>Admin</span>
                <LogOut size={14} className="logout-icon" />
              </button>
            </div>
          ) : (
            <button className="btn-admin-status" onClick={onOpenLogin} title="Acesso Administrador para criar/editar atividades e pendências">
              <Lock size={15} />
              <span>Admin</span>
            </button>
          )}

          {/* Alternador de Tema */}
          <button className="btn-theme-toggle" onClick={toggleTheme} title="Alternar Tema Claro / Escuro">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
