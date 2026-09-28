import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText,
  Building,
  Layers,
  Sparkles
} from 'lucide-react';

export default function PresentationModal({ 
  units, 
  activities, 
  pendencies, 
  onClose,
  onViewReport 
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const totalSlides = 5;

  const handleNext = () => {
    setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  };

  // Teclado: setas para navegar, ESC para sair
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Métricas gerais
  const totalActs = activities.length;
  const completedActs = activities.filter(a => a.status === 'completed').length;
  const pctTotal = totalActs > 0 ? Math.round((completedActs / totalActs) * 100) : 0;
  const openPends = pendencies.filter(p => p.status !== 'resolved').length;

  const barrosUnit = units.find(u => u.id === 'barros-barreto') || units[0];
  const betinaUnit = units.find(u => u.id === 'betina-ferro') || units[1];

  const barrosActs = activities.filter(a => a.unit_id === 'barros-barreto');
  const betinaActs = activities.filter(a => a.unit_id === 'betina-ferro');

  const barrosCompleted = barrosActs.filter(a => a.status === 'completed').length;
  const barrosPct = barrosActs.length > 0 ? Math.round((barrosCompleted / barrosActs.length) * 100) : 0;

  const betinaCompleted = betinaActs.filter(a => a.status === 'completed').length;
  const betinaPct = betinaActs.length > 0 ? Math.round((betinaCompleted / betinaActs.length) * 100) : 0;

  return (
    <div className="presentation-backdrop">
      {/* Barra de Controles Superiores */}
      <div className="presentation-top-bar">
        <div className="presentation-brand-tag">
          <img src="/elis-logo-tagline.png" alt="Elis" className="pres-logo-small" />
          <span className="pres-badge">PADRÃO ELIS &middot; MODO APRESENTAÇÃO</span>
        </div>

        <div className="presentation-controls">
          <span className="slide-counter">Slide {currentSlide + 1} de {totalSlides}</span>
          <button className="btn-pres-icon" onClick={handlePrev} title="Slide anterior (Seta esquerda)">
            <ChevronLeft size={18} />
          </button>
          <button className="btn-pres-icon" onClick={handleNext} title="Próximo slide (Seta direita / Espaço)">
            <ChevronRight size={18} />
          </button>
          <button className="btn-pres-icon" onClick={toggleFullscreen} title="Tela cheia">
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button className="btn-pres-close" onClick={onClose} title="Sair da apresentação (ESC)">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* ÁREA DO SLIDE */}
      <div className="presentation-viewport">
        {/* SLIDE 0: CAPA OFICIAL ELIS (Fiel aos Slides 1, 6 e 35 do PDF) */}
        {currentSlide === 0 && (
          <div className="slide-frame slide-cover-elis">
            <div className="cover-bg-chevrons"></div>
            <div className="cover-content">
              <div className="cover-logo-wrap">
                <img src="/elis-logo-tagline.png" alt="Elis - Circular services at work" className="cover-elis-logo" />
              </div>

              <div className="cover-title-group">
                <div className="cover-tagline-pill">RELATÓRIO EXECUTIVO DE IMPLANTAÇÃO TECNOLÓGICA</div>
                <h1 className="cover-main-title">Status EBSERH</h1>
                <h2 className="cover-subtitle">Hospital Universitário João de Barros Barreto & Bettina Ferro de Souza</h2>
              </div>

              <div className="cover-footer-info">
                <div className="cover-author-block">
                  <strong>Luiz Henrique Barbosa Silva</strong>
                  <span>Tecnologia da Informação &middot; BR-IT Center West</span>
                  <span>Elis Brasil</span>
                </div>
                <div className="cover-stat-summary">
                  <div className="cover-stat-item">
                    <span className="cover-num">{pctTotal}%</span>
                    <span className="cover-lbl">Progresso Geral</span>
                  </div>
                  <div className="cover-stat-item">
                    <span className="cover-num">{totalActs}</span>
                    <span className="cover-lbl">Atividades Mapeadas</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Barra tricolor característica Elis no rodapé */}
            <div className="elis-brand-footer-bar">
              <div className="bar-navy"></div>
              <div className="bar-cyan"></div>
              <div className="bar-teal"></div>
              <div className="bar-red"></div>
            </div>
          </div>
        )}

        {/* SLIDE 1: SUMMARY / SOMMAIRE (Fiel ao Slide 5 do PDF com 8 caixas) */}
        {currentSlide === 1 && (
          <div className="slide-frame slide-standard-elis">
            <div className="slide-header">
              <div className="elis-title-tag"></div>
              <div>
                <h3 className="slide-chapter-tag">SUMMARY / SOMMAIRE</h3>
                <h2 className="slide-title">Visão Estratégica dos Módulos Operacionais</h2>
              </div>
              <img src="/elis-logo-tagline.png" alt="Elis" className="slide-header-logo" />
            </div>

            <div className="slide-body summary-grid-8">
              {[
                { num: '1', title: 'Portais de Entrada', status: 'Concluído', desc: 'Hardware RFID calibrado e sincronizado Myelis', ok: true },
                { num: '2', title: 'Portais de Expurgo', status: 'Concluído', desc: 'Leitura de descarte operacional em Barros Barreto', ok: true },
                { num: '3', title: 'Mesa Distribuição', status: 'Concluído', desc: 'Recepção e triagem de enxoval hospitalar', ok: true },
                { num: '4', title: 'Totem de Peso', status: 'Concluído', desc: 'Pesagem e pesagem dinâmica integradas', ok: true },
                { num: '5', title: 'Coletores CMCs', status: 'Concluído', desc: 'Dispositivos móveis em produção no hospital', ok: true },
                { num: '6', title: 'Servidores Centrais', status: 'Pendente', desc: 'Aguardando entrega civil e fixação de racks', ok: false },
                { num: '7', title: 'Conectividade VPN', status: 'Pendente', desc: 'Liberação de rota segura para acesso técnico Elis', ok: false },
                { num: '8', title: 'Portais de Evasão RFID', status: 'Em Andamento', desc: 'Planejamento e preventiva finalizados (T 26 09 13480)', ok: false, special: true }
              ].map((item, idx) => (
                <div key={idx} className={`summary-box-card ${item.ok ? 'completed' : item.special ? 'special' : 'pending'}`}>
                  <div className="summary-box-header">
                    <span className="summary-box-num">{item.num}</span>
                    <span className={`summary-box-badge ${item.ok ? 'bg-success' : 'bg-warning'}`}>
                      {item.status}
                    </span>
                  </div>
                  <h4 className="summary-box-title">{item.title}</h4>
                  <p className="summary-box-desc">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="elis-brand-footer-bar">
              <div className="bar-navy"></div>
              <div className="bar-cyan"></div>
              <div className="bar-teal"></div>
              <div className="bar-red"></div>
            </div>
          </div>
        )}

        {/* SLIDE 2: UNIDADE BARROS BARRETO (Fiel aos Slides 7, 29 e 30 com Gráficos e Bullets) */}
        {currentSlide === 2 && (
          <div className="slide-frame slide-standard-elis">
            <div className="slide-header">
              <div className="elis-title-tag"></div>
              <div>
                <h3 className="slide-chapter-tag">UNIDADE OPERACIONAL</h3>
                <h2 className="slide-title">EBSERH - Hospital Universitário João de Barros Barreto</h2>
              </div>
              <img src="/elis-logo-tagline.png" alt="Elis" className="slide-header-logo" />
            </div>

            <div className="slide-body two-columns-slide">
              <div className="slide-left-col">
                <div className="slide-kpi-panel">
                  <div className="kpi-ring-wrap">
                    <div className="kpi-circle-stat">
                      <span className="kpi-pct-text">{barrosPct}%</span>
                      <span className="kpi-pct-sub">Implantado</span>
                    </div>
                  </div>
                  <div className="kpi-info-block">
                    <h4>Status da Implantação</h4>
                    <p>Sistemas base operacionais. 5 equipamentos validados pelo Myelis e em rotina ativa.</p>
                    <div className="kpi-badges-row">
                      <span className="badge-kpi success">✓ {barrosCompleted} Prontos</span>
                      <span className="badge-kpi warning">⚠️ {barrosActs.length - barrosCompleted} Pendentes</span>
                    </div>
                  </div>
                </div>

                <div className="elis-bullet-section">
                  <h4 className="bullet-section-title">≫ Principais Entregas Homologadas</h4>
                  <ul className="elis-styled-list">
                    <li><span className="arrow-bullet">≫</span> <strong>Portal de Entrada RFID:</strong> Instalado e calibrado com sucesso.</li>
                    <li><span className="arrow-bullet">≫</span> <strong>Portal de Expurgo:</strong> Operacional para controle de saída de sujidades.</li>
                    <li><span className="arrow-bullet">≫</span> <strong>Mesa de Distribuição & Totem Peso:</strong> Integrados com o sistema central.</li>
                  </ul>
                </div>
              </div>

              <div className="slide-right-col">
                <h4 className="bullet-section-title">≫ Pendências e Próximas Ações Críticas</h4>
                <div className="slide-cards-stack">
                  <div className="pres-action-card warning">
                    <div className="pres-card-head">
                      <span className="pres-icon">⚠️</span>
                      <strong>PC Admin & Conectividade</strong>
                    </div>
                    <p>Necessidade de alinhamento com a TI Elis para liberação de acesso seguro via VPN.</p>
                  </div>

                  <div className="pres-action-card warning">
                    <div className="pres-card-head">
                      <span className="pres-icon">🚧</span>
                      <strong>Server Barros</strong>
                    </div>
                    <p>Servidor fisicamente alocado. Bloqueado aguardando término de reformas civis.</p>
                  </div>

                  <div className="pres-action-card success">
                    <div className="pres-card-head">
                      <span className="pres-icon">✅</span>
                      <strong>Portais de Evasão RFID (Chamado T 26 09 13480)</strong>
                    </div>
                    <p>Planejamento estratégico de infraestrutura e preventiva realizados com sucesso.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="elis-brand-footer-bar">
              <div className="bar-navy"></div>
              <div className="bar-cyan"></div>
              <div className="bar-teal"></div>
              <div className="bar-red"></div>
            </div>
          </div>
        )}

        {/* SLIDE 3: UNIDADE BETTINA FERRO (Fiel aos Slides 15 e 16) */}
        {currentSlide === 3 && (
          <div className="slide-frame slide-standard-elis">
            <div className="slide-header">
              <div className="elis-title-tag"></div>
              <div>
                <h3 className="slide-chapter-tag">UNIDADE OPERACIONAL</h3>
                <h2 className="slide-title">EBSERH - Hospital Universitário Bettina Ferro de Souza</h2>
              </div>
              <img src="/elis-logo-tagline.png" alt="Elis" className="slide-header-logo" />
            </div>

            <div className="slide-body two-columns-slide">
              <div className="slide-left-col">
                <div className="slide-kpi-panel">
                  <div className="kpi-ring-wrap warning-ring">
                    <div className="kpi-circle-stat">
                      <span className="kpi-pct-text text-amber">{betinaPct}%</span>
                      <span className="kpi-pct-sub">Fase Inicial</span>
                    </div>
                  </div>
                  <div className="kpi-info-block">
                    <h4>Adequações de Infraestrutura</h4>
                    <p>Fase inicial de montagem. Dependente de adequação de espaço físico pela diretoria hospitalar.</p>
                    <div className="kpi-badges-row">
                      <span className="badge-kpi warning">🛑 Bloqueios Físicos</span>
                      <span className="badge-kpi info">📦 Equipamentos em Estoque</span>
                    </div>
                  </div>
                </div>

                <div className="elis-bullet-section">
                  <h4 className="bullet-section-title">≫ Inventário de Equipamentos Prontos</h4>
                  <ul className="elis-styled-list">
                    <li><span className="arrow-bullet">≫</span> <strong>PC Admin Bettina:</strong> Equipamento testado e em estoque, pronto para montagem.</li>
                    <li><span className="arrow-bullet">≫</span> <strong>Servidor Bettina:</strong> Configurado, aguardando rack climatizado.</li>
                    <li><span className="arrow-bullet">≫</span> <strong>Lógica dos Portais:</strong> Parametrizada no sistema.</li>
                  </ul>
                </div>
              </div>

              <div className="slide-right-col">
                <h4 className="bullet-section-title">≫ Ações Necessárias da Gestão Hospitalar</h4>
                <div className="slide-cards-stack">
                  <div className="pres-action-card danger">
                    <div className="pres-card-head">
                      <span className="pres-icon">🛑</span>
                      <strong>Espaço Físico para PC Admin</strong>
                    </div>
                    <p>Liberação de mesa e ponto de rede no setor para instalação do terminal.</p>
                  </div>

                  <div className="pres-action-card danger">
                    <div className="pres-card-head">
                      <span className="pres-icon">🛑</span>
                      <strong>Rack com Energia Estabilizada</strong>
                    </div>
                    <p>Disponibilização de espaço em rack de TI para fixação do servidor de unidade.</p>
                  </div>

                  <div className="pres-action-card info">
                    <div className="pres-card-head">
                      <span className="pres-icon">ℹ️</span>
                      <strong>Portal Expurgo</strong>
                    </div>
                    <p>Hardware realocado estrategicamente para a unidade Barros Barreto. Prevista aquisição complementar.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="elis-brand-footer-bar">
              <div className="bar-navy"></div>
              <div className="bar-cyan"></div>
              <div className="bar-teal"></div>
              <div className="bar-red"></div>
            </div>
          </div>
        )}

        {/* SLIDE 4: FECHAMENTO DE CHAMADOS E HOMOLOGAÇÃO (Fiel ao Padrão de Relatório Elis) */}
        {currentSlide === 4 && (
          <div className="slide-frame slide-standard-elis">
            <div className="slide-header">
              <div className="elis-title-tag"></div>
              <div>
                <h3 className="slide-chapter-tag">GOVERNANÇA & HOMOLOGAÇÃO</h3>
                <h2 className="slide-title">Chamados Técnicos e Relatórios de Fechamento</h2>
              </div>
              <img src="/elis-logo-tagline.png" alt="Elis" className="slide-header-logo" />
            </div>

            <div className="slide-body ticket-slide-layout">
              <div className="featured-ticket-card">
                <div className="ticket-badge-pill">
                  <FileText size={16} />
                  <span>DOCUMENTO HOMOLOGADO &middot; T 26 09 13480</span>
                </div>
                
                <h3 className="featured-ticket-title">Planejamento de Portais de Evasão e Manutenção Preventiva de Dispositivos</h3>
                
                <div className="ticket-meta-grid">
                  <div><strong>Solicitante / Operador:</strong> Luiz Henrique Barbosa Silva</div>
                  <div><strong>Unidade:</strong> EBSERH - Barros Barreto</div>
                  <div><strong>Status:</strong> Completed / Resolvido</div>
                  <div><strong>Data de Resolução:</strong> 16 de Setembro de 2026 20:12</div>
                </div>

                <div className="ticket-conclusion-quote">
                  "Todos os dispositivos da unidade encontram-se limpos, revisados e operando em perfeita normalidade. A estratégia de instalação dos portais foi alinhada e documentada para a próxima etapa. Chamado finalizado e serviço homologado no local."
                </div>

                <div className="ticket-card-actions">
                  {pendencies.find(p => p.closure_report)?.closure_report && (
                    <button 
                      className="btn-pres-action-doc"
                      onClick={() => {
                        const rep = pendencies.find(p => p.closure_report)?.closure_report;
                        if (rep) onViewReport(rep);
                      }}
                    >
                      <FileText size={16} />
                      <span>Visualizar Relatório Completo Padrão Elis (PDF)</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="governance-highlights">
                <div className="gov-item">
                  <CheckCircle2 size={24} className="text-emerald" />
                  <div>
                    <strong>Rastreabilidade Total</strong>
                    <p>Cada pendência encerrada gera um documento oficial auditável com justificativa, ações e conclusão técnica.</p>
                  </div>
                </div>
                <div className="gov-item">
                  <Sparkles size={24} className="text-primary" />
                  <div>
                    <strong>Padrão Visual Corporativo</strong>
                    <p>Formatado conforme diretrizes globais da Elis para relatórios e apresentações executivas.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="elis-brand-footer-bar">
              <div className="bar-navy"></div>
              <div className="bar-cyan"></div>
              <div className="bar-teal"></div>
              <div className="bar-red"></div>
            </div>
          </div>
        )}
      </div>

      {/* Miniaturas de Navegação Rápida no Rodapé */}
      <div className="presentation-bottom-nav">
        {[
          '1. Capa Elis',
          '2. Resumo dos 8 Módulos',
          '3. Barros Barreto',
          '4. Bettina Ferro',
          '5. Chamados & Homologação'
        ].map((name, idx) => (
          <button
            key={idx}
            className={`btn-slide-thumb ${currentSlide === idx ? 'active' : ''}`}
            onClick={() => setCurrentSlide(idx)}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
