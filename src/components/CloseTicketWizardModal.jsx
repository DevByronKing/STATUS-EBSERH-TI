import React, { useState } from 'react';
import { X, CheckCircle, FileText, Sparkles, Building, User, Calendar, Wrench, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CloseTicketWizardModal({
  pendency,
  units,
  activities,
  onClose,
  onSaveReport
}) {
  const selectedUnit = units.find(u => u.id === pendency?.unit_id) || units[0];
  const linkedActivity = activities.find(a => a.id === pendency?.activity_id);

  // Gerador de número de chamado padrão Elis (ex: T 26 09 13481)
  const generateTicketNumber = () => {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const randomSeq = Math.floor(10000 + Math.random() * 90000);
    return `T ${yy} ${mm} ${randomSeq}`;
  };

  const [ticketNumber, setTicketNumber] = useState(generateTicketNumber());
  const [ticketTitle, setTicketTitle] = useState(
    pendency ? pendency.title : linkedActivity ? `Resolução e Homologação: ${linkedActivity.title}` : 'Fechamento de Chamado Técnico'
  );

  const [unitName, setUnitName] = useState(
    selectedUnit ? `EBSERH - ${selectedUnit.fullName || selectedUnit.name}` : 'EBSERH - Hospital Universitário João de Barros Barreto'
  );

  const [requesterName, setRequesterName] = useState('Luiz Henrique Barbosa Silva');
  const [operatorName, setOperatorName] = useState('Luiz Henrique Barbosa Silva');
  const [operatorLogin, setOperatorLogin] = useState('lbarbosa3');
  const [operatorEmail, setOperatorEmail] = useState('luiz.barbosa@elis.com');

  const [objective, setObjective] = useState(
    pendency?.description || 'Solicitação de atendimento presencial e suporte técnico na unidade para alinhamento estratégico e encerramento de pendência operacional.'
  );

  const [justifications, setJustifications] = useState(
    'Garantir a integridade operacional e mitigação de perdas no fluxo de leitura e pesagem.\nAtendimento aos requisitos contratuais de homologação técnica da unidade.'
  );

  const [actionsSummary, setActionsSummary] = useState(
    'Planejamento, manutenção preventiva e ajustes técnicos concluídos com sucesso nos dispositivos da unidade.'
  );

  const [actionItems, setActionItems] = useState(
    'Visita Técnica e Alinhamento: Levantamento presencial, testes de comunicação e validação de infraestrutura.\nManutenção Preventiva e Calibração: Inspeção física e limpeza técnica em 100% dos periféricos e dispositivos ativos na unidade.'
  );

  const [conclusion, setConclusion] = useState(
    'Todos os dispositivos da unidade encontram-se limpos, revisados e operando em perfeita normalidade. Chamado finalizado e serviço homologado no local.'
  );

  const handleFinish = (e) => {
    e.preventDefault();

    // Divide justificativas e ações em linhas estruturadas
    const justList = justifications.split('\n').map(j => j.trim()).filter(Boolean);
    const actionListParsed = actionItems.split('\n').map(a => a.trim()).filter(Boolean).map(text => {
      const parts = text.split(':');
      return {
        title: parts[0]?.trim() || 'Ação Realizada',
        bullets: parts[1] ? [parts[1].trim()] : ['Atividade concluída com validação técnica presencial.']
      };
    });

    const nowStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const closureReport = {
      ticketNumber,
      title: ticketTitle,
      requester: {
        name: requesterName,
        country: 'Brazil',
        employeeId: '03784221203',
        login: operatorLogin,
        email: operatorEmail,
        department: 'Tecnologia da Informação',
        room: 'Unknown'
      },
      details: {
        shortDesc: ticketTitle,
        incidentType: 'Request',
        category: 'Software',
        subcategory: 'Assistance',
        country: 'Brazil',
        location: 'Unknown'
      },
      planning: {
        impact: 'External Customer',
        urgency: 'Partially able to work',
        priority: 'P2 High',
        targetDate: nowStr,
        processingTime: '1 day',
        onHold: 'Não'
      },
      processing: {
        operatorGroup: 'BR-IT Center West',
        operator: operatorName,
        status: 'Completed',
        resolved: 'Sim',
        resolutionDate: nowStr,
        closed: 'Sim',
        registeredTime: '08:00'
      },
      request: {
        author: requesterName,
        date: nowStr,
        unitName: unitName,
        objective: objective,
        justifications: justList
      },
      actions: {
        author: operatorName,
        date: nowStr,
        executionDate: new Date().toLocaleDateString('pt-BR'),
        summary: actionsSummary,
        items: actionListParsed
      },
      conclusion: conclusion,
      technicalInfo: {
        registrationDate: nowStr,
        effectiveTime: '00:22',
        holdTime: '00:00',
        adjustedTime: '00:22',
        resolvedTime: '00:00',
        progressTime: '00:22',
        registeredTime: '08:00',
        standardSolution: 'Homologação Técnica Local Concluída'
      },
      ticketDetails: {
        objects: { engineer: 'Não', noNotifications: 'Não', partiallyValidated: 'Não', reactedTime: '0.0', escalationTime: '0.0', adjustedDuration: '0.0', excludeFromSLA: 'Não' },
        prioritisation: { wsjf: '0.0', l2ResolutionTime: '0.0' },
        equipment: { productionLosses: 'Não' },
        additional: {
          supplyChain: { internalMistake: 'Não', quantity: '0.0', value: '0.0' },
          allFunctions: { chasingCounter: '0.0', reopened: 'Não', reassignmentTime: '0.0', supplierAssignTime: '0.0', firstTimeResolution: 'Sim', usePriorityMatrix: 'Não' }
        }
      },
      metadata: {
        printedBy: operatorName,
        printedAt: nowStr
      }
    };

    // Confetti comemoração
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    onSaveReport(closureReport);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container wizard-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <FileText size={22} className="text-primary" />
            <div>
              <h3>Fechar Pendência & Gerar Documento de Chamado</h3>
              <p>Preencha os dados para emissão do relatório oficial Elis</p>
            </div>
          </div>
          <button className="btn-close-modal" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleFinish} className="modal-form">
          <div className="form-grid-2">
            <div className="form-group">
              <label>Número do Chamado Elis</label>
              <input 
                type="text" 
                value={ticketNumber} 
                onChange={(e) => setTicketNumber(e.target.value)} 
                required 
              />
              <span className="form-hint">Padrão Elis: T 26 09 XXXXX</span>
            </div>

            <div className="form-group">
              <label>Título do Chamado</label>
              <input 
                type="text" 
                value={ticketTitle} 
                onChange={(e) => setTicketTitle(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Unidade Hospitalar</label>
              <input 
                type="text" 
                value={unitName} 
                onChange={(e) => setUnitName(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Operador Técnico (Elis)</label>
              <input 
                type="text" 
                value={operatorName} 
                onChange={(e) => setOperatorName(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Necessidade e Objetivo do Chamado</label>
            <textarea 
              rows={3} 
              value={objective} 
              onChange={(e) => setObjective(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Justificativas / Por quê (uma por linha)</label>
            <textarea 
              rows={2} 
              value={justifications} 
              onChange={(e) => setJustifications(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Resumo das Ações Executadas</label>
            <input 
              type="text" 
              value={actionsSummary} 
              onChange={(e) => setActionsSummary(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Ações Técnicas Detalhadas (Título: Descrição, uma por linha)</label>
            <textarea 
              rows={3} 
              value={actionItems} 
              onChange={(e) => setActionItems(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Status e Conclusão / Homologação</label>
            <textarea 
              rows={2} 
              value={conclusion} 
              onChange={(e) => setConclusion(e.target.value)} 
              required 
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary-action submit-btn">
              <Check size={16} />
              <span>Finalizar & Gerar Relatório Elis</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
