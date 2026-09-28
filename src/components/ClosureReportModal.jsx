import React from 'react';
import { Printer, Download, X, CheckCircle, FileText, Calendar, User, ShieldCheck } from 'lucide-react';

export default function ClosureReportModal({ report, onClose }) {
  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container report-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Barra de Ações Superior do Modal (Não sai na impressão) */}
        <div className="report-modal-header no-print">
          <div className="report-header-left">
            <FileText size={20} className="text-primary" />
            <div>
              <h3>Documento de Fechamento de Chamado</h3>
              <p>Padrão Corporativo Elis &middot; {report.ticketNumber}</p>
            </div>
          </div>
          <div className="report-header-actions">
            <button className="btn-print" onClick={handlePrint} title="Imprimir ou Salvar como PDF">
              <Printer size={16} />
              <span>Imprimir / Gerar PDF</span>
            </button>
            <button className="btn-close-modal" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* DOCUMENTO OFICIAL ELIS (Formatado fielmente ao documento de fechamento da Elis) */}
        <div className="elis-report-document print-document">
          {/* PÁGINA 1 */}
          <div className="report-page page-1">
            {/* Cabeçalho do Ticket */}
            <div className="ticket-top-header">
              <div className="ticket-title-block">
                <div className="ticket-id-tag">T</div>
                <div className="ticket-title-wrap">
                  <h1 className="ticket-main-title">
                    {report.ticketNumber} {report.title}
                  </h1>
                  <div className="ticket-author-country">
                    {report.requester?.name || 'Luiz Henrique Barbosa Silva'} ({report.requester?.country || 'Brazil'})
                  </div>
                </div>
              </div>
              <div className="ticket-logo-block">
                <img src="/elis-logo.png" alt="Elis" className="elis-doc-logo" />
              </div>
            </div>

            {/* Metadados: Solicitante e Detalhes */}
            <div className="doc-section-grid">
              <div className="doc-col">
                <h4 className="doc-col-title">Solicitante</h4>
                <table className="doc-table">
                  <tbody>
                    <tr>
                      <td className="doc-label">Nome</td>
                      <td className="doc-val">{report.requester?.name || 'Luiz Henrique Barbosa Silva'}</td>
                    </tr>
                    <tr>
                      <td className="doc-label">País</td>
                      <td className="doc-val">{report.requester?.country || 'Brazil'}</td>
                    </tr>
                    <tr>
                      <td className="doc-label">Matrícula do funcionário</td>
                      <td className="doc-val">{report.requester?.employeeId || '03784221203'}</td>
                    </tr>
                    <tr>
                      <td className="doc-label">Login de rede</td>
                      <td className="doc-val">{report.requester?.login || 'lbarbosa3'}</td>
                    </tr>
                    <tr>
                      <td className="doc-label">E-mail</td>
                      <td className="doc-val">{report.requester?.email || 'luiz.barbosa@elis.com'}</td>
                    </tr>
                    <tr>
                      <td className="doc-label">Direção</td>
                      <td className="doc-val">{report.requester?.department || 'Tecnologia da Informação'}</td>
                    </tr>
                    <tr>
                      <td className="doc-label">Sala (Solicitante)</td>
                      <td className="doc-val">{report.requester?.room || 'Unknown'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="doc-col">
                <h4 className="doc-col-title">Detalhes</h4>
                <table className="doc-table">
                  <tbody>
                    <tr>
                      <td className="doc-label">Breve descrição</td>
                      <td className="doc-val">{report.details?.shortDesc || report.title}</td>
                    </tr>
                    <tr>
                      <td className="doc-label">Tipo de incidente</td>
                      <td className="doc-val">{report.details?.incidentType || 'Request'}</td>
                    </tr>
                    <tr>
                      <td className="doc-label">Categoria</td>
                      <td className="doc-val">{report.details?.category || 'Software'}</td>
                    </tr>
                    <tr>
                      <td className="doc-label">Subcategoria</td>
                      <td className="doc-val">{report.details?.subcategory || 'Assistance'}</td>
                    </tr>
                  </tbody>
                </table>

                <h4 className="doc-col-title" style={{ marginTop: '1rem' }}>Localização</h4>
                <table className="doc-table">
                  <tbody>
                    <tr>
                      <td className="doc-label">País</td>
                      <td className="doc-val">{report.details?.country || 'Brazil'}</td>
                    </tr>
                    <tr>
                      <td className="doc-label">Localização</td>
                      <td className="doc-val">{report.details?.location || 'Unknown'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <hr className="doc-divider" />

            {/* Planejamento e Processamento */}
            <div className="doc-section-grid">
              <div className="doc-col">
                <h4 className="doc-col-title">Planejamento</h4>
                <table className="doc-table">
                  <tbody>
                    <tr>
                      <td className="doc-label">Impacto</td>
                      <td className="doc-val">{report.planning?.impact || 'External Customer'}</td>
                    </tr>
                    <tr>
                      <td className="doc-label">Urgência</td>
                      <td className="doc-val">{report.planning?.urgency || 'Partially able to work'}</td>
                    </tr>
                    <tr>
                      <td className="doc-label">Prioridade</td>
                      <td className="doc-val font-semibold">{report.planning?.priority || 'P2 High'}</td>
                    </tr>
                    <tr>
                      <td className="doc-label">Data alvo</td>
                      <td className="doc-val">{report.planning?.targetDate || '17 de Setembro de 2026 19:50'}</td>
                    </tr>
                    <tr>
                      <td className="doc-label">Tempo de processamento</td>
                      <td className="doc-val">{report.planning?.processingTime || '1 day'}</td>
                    </tr>
                    <tr>
                      <td className="doc-label">Em espera</td>
                      <td className="doc-val">{report.planning?.onHold || 'Não'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="doc-col">
                <h4 className="doc-col-title">Processamento</h4>
                <table className="doc-table">
                  <tbody>
                    <tr>
                      <td className="doc-label">Grupo de operadores</td>
                      <td className="doc-val">{report.processing?.operatorGroup || 'BR-IT Center West'}</td>
                    </tr>
                    <tr>
                      <td className="doc-label">Operador</td>
                      <td className="doc-val">{report.processing?.operator || 'Luiz Henrique Barbosa Silva'}</td>
                    </tr>
                    <tr>
                      <td className="doc-label">Status</td>
                      <td className="doc-val font-semibold text-emerald-doc">{report.processing?.status || 'Completed'}</td>
                    </tr>
                    <tr>
                      <td className="doc-label">Resolvido(a)s</td>
                      <td className="doc-val">{report.processing?.resolved || 'Sim'}</td>
                    </tr>
                    <tr>
                      <td className="doc-label">Data de resolução</td>
                      <td className="doc-val">{report.processing?.resolutionDate || '16 de Setembro de 2026 20:12'}</td>
                    </tr>
                    <tr>
                      <td className="doc-label">Fechado(a)s</td>
                      <td className="doc-val">{report.processing?.closed || 'Não'}</td>
                    </tr>
                    <tr>
                      <td className="doc-label">Tempo registrado</td>
                      <td className="doc-val">{report.processing?.registeredTime || '08:00'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <hr className="doc-divider" />

            {/* Pedido */}
            <div className="doc-block">
              <h4 className="doc-block-title">Pedido</h4>
              <div className="doc-block-author-date">
                <span>{report.request?.author || 'Luiz Henrique Barbosa Silva'}</span>
                <span>{report.request?.date || '16 de Setembro de 2026 20:13'}</span>
              </div>
              <div className="doc-block-unit-name">
                {report.request?.unitName || 'EBSERH - Hospital Universitário João de Barros Barreto'}
              </div>
              
              <div className="doc-block-body">
                <strong>Necessidade e Objetivo:</strong>
                <p>{report.request?.objective}</p>

                {report.request?.justifications && report.request.justifications.length > 0 && (
                  <div className="doc-subblock">
                    <strong>Justificativa / Por quê:</strong>
                    <ol className="doc-ordered-list">
                      {report.request.justifications.map((just, idx) => (
                        <li key={idx}>{just}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>

            <hr className="doc-divider" />

            {/* Ação */}
            <div className="doc-block">
              <h4 className="doc-block-title">Ação</h4>
              <div className="doc-block-author-date">
                <span>{report.actions?.author || 'Luiz Henrique Barbosa Silva'}</span>
                <span>{report.actions?.date || '16 de Setembro de 2026 20:13'}</span>
              </div>

              {report.actions?.executionDate && (
                <div className="doc-realization-date">
                  Realização das ações em {report.actions.executionDate}
                </div>
              )}

              <p className="doc-actions-summary">{report.actions?.summary}</p>

              {report.actions?.items && report.actions.items.map((item, idx) => (
                <div key={idx} className="doc-action-item">
                  <div className="doc-action-item-title">
                    {idx + 1}. {item.title}:
                  </div>
                  <ul className="doc-bullet-list">
                    {item.bullets.map((b, bIdx) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Rodapé Página 1 */}
            <div className="doc-page-footer">
              <span>{report.metadata?.printedAt || '16 de Setembro de 2026 20:19'}</span>
              <span>Impresso por {report.metadata?.printedBy || 'Luiz Henrique Barbosa'}</span>
              <span>1/2</span>
            </div>
          </div>

          {/* PÁGINA 2 */}
          <div className="report-page page-2">
            {/* Status e Conclusão */}
            <div className="doc-block">
              <h4 className="doc-block-title">Status e Conclusão:</h4>
              <div className="doc-conclusion-box">
                <p>{report.conclusion || 'Todos os dispositivos da unidade encontram-se limpos, revisados e operando em perfeita normalidade. A estratégia de instalação dos portais foi alinhada e documentada para a próxima etapa. Chamado finalizado e serviço homologado no local.'}</p>
              </div>
            </div>

            <hr className="doc-divider" />

            {/* Informação e Tempos */}
            <div className="doc-section-grid">
              <div className="doc-col">
                <h4 className="doc-col-title">Informação</h4>
                <table className="doc-table">
                  <tbody>
                    <tr>
                      <td className="doc-label">Data do registro</td>
                      <td className="doc-val">{report.technicalInfo?.registrationDate || '16 de Setembro de 2026 19:50'}</td>
                    </tr>
                    <tr>
                      <td className="doc-label">Tempo de processamento efetivo</td>
                      <td className="doc-val">{report.technicalInfo?.effectiveTime || '00:22'}</td>
                    </tr>
                    <tr>
                      <td className="doc-label">Tempo de processamento ('em espera')</td>
                      <td className="doc-val">{report.technicalInfo?.holdTime || '00:00'}</td>
                    </tr>
                    <tr>
                      <td className="doc-label">Tempo de processamento ajustado</td>
                      <td className="doc-val">{report.technicalInfo?.adjustedTime || '00:22'}</td>
                    </tr>
                    <tr>
                      <td className="doc-label">'Resolvido' tempo de processamento</td>
                      <td className="doc-val">{report.technicalInfo?.resolvedTime || '00:00'}</td>
                    </tr>
                    <tr>
                      <td className="doc-label">'Andamento' tempo de processamento</td>
                      <td className="doc-val">{report.technicalInfo?.progressTime || '00:22'}</td>
                    </tr>
                    <tr>
                      <td className="doc-label">Tempo registrado</td>
                      <td className="doc-val">{report.technicalInfo?.registeredTime || '08:00'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="doc-col">
                <h4 className="doc-col-title">Solução padrão</h4>
                <p className="doc-solution-text">{report.technicalInfo?.standardSolution || 'Não há solução padrão vinculada'}</p>
              </div>
            </div>

            <hr className="doc-divider" />

            {/* Ticket Details */}
            <div className="doc-block">
              <h4 className="doc-block-title">Ticket Details</h4>
              <div className="doc-section-grid" style={{ marginTop: '0.8rem' }}>
                <div className="doc-col">
                  <div className="doc-sub-heading">Objects</div>
                  <table className="doc-table compact">
                    <tbody>
                      <tr><td className="doc-label">Engineer</td><td className="doc-val">Não</td></tr>
                      <tr><td className="doc-label">No notifications</td><td className="doc-val">Não</td></tr>
                      <tr><td className="doc-label">Partially Validated</td><td className="doc-val">Não</td></tr>
                      <tr><td className="doc-label">Reacted Time</td><td className="doc-val">0.0</td></tr>
                      <tr><td className="doc-label">Escalation Time</td><td className="doc-val">0.0</td></tr>
                      <tr><td className="doc-label">Adjusted Duration</td><td className="doc-val">0.0</td></tr>
                      <tr><td className="doc-label">Exclude from SLA</td><td className="doc-val">Não</td></tr>
                    </tbody>
                  </table>

                  <div className="doc-sub-heading" style={{ marginTop: '0.8rem' }}>Prioritisation</div>
                  <table className="doc-table compact">
                    <tbody>
                      <tr><td className="doc-label">Weighted Shortest Job First (WSJF)</td><td className="doc-val">0.0</td></tr>
                      <tr><td className="doc-label">L2 Resolution Time</td><td className="doc-val">0.0</td></tr>
                    </tbody>
                  </table>
                </div>

                <div className="doc-col">
                  <div className="doc-sub-heading">Equipment</div>
                  <table className="doc-table compact">
                    <tbody>
                      <tr><td className="doc-label">Production Losses</td><td className="doc-val">Não</td></tr>
                    </tbody>
                  </table>

                  <div className="doc-sub-heading" style={{ marginTop: '0.8rem' }}>Additional Information</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--doc-primary)' }}>Supply Chain</div>
                  <table className="doc-table compact">
                    <tbody>
                      <tr><td className="doc-label">Internal Mistake?</td><td className="doc-val">Não</td></tr>
                      <tr><td className="doc-label">Quantity</td><td className="doc-val">0.0</td></tr>
                      <tr><td className="doc-label">Value</td><td className="doc-val">0.0</td></tr>
                    </tbody>
                  </table>

                  <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--doc-primary)', marginTop: '0.5rem' }}>All Functions</div>
                  <table className="doc-table compact">
                    <tbody>
                      <tr><td className="doc-label">Chasing Counter</td><td className="doc-val">0.0</td></tr>
                      <tr><td className="doc-label">Reopened</td><td className="doc-val">Não</td></tr>
                      <tr><td className="doc-label">Reassignment Time</td><td className="doc-val">0.0</td></tr>
                      <tr><td className="doc-label">Supplier Assign Time</td><td className="doc-val">0.0</td></tr>
                      <tr><td className="doc-label">First Time Resolution</td><td className="doc-val">Não</td></tr>
                      <tr><td className="doc-label">Use Priority Matrix</td><td className="doc-val">Não</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Rodapé Página 2 */}
            <div className="doc-page-footer">
              <span>{report.metadata?.printedAt || '16 de Setembro de 2026 20:19'}</span>
              <span>Impresso por {report.metadata?.printedBy || 'Luiz Henrique Barbosa'}</span>
              <span>2/2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
