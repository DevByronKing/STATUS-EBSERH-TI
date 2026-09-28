export const initialUnits = [
  {
    id: 'barros-barreto',
    name: 'Barros Barreto',
    fullName: 'Hospital Universitário João de Barros Barreto (EBSERH)',
    subtitle: 'Implantação Tecnológica',
    description: 'Sistemas base operacionais. Ajustes finais e portais de evasão em andamento.',
    order_index: 0
  },
  {
    id: 'betina-ferro',
    name: 'Betina Ferro',
    fullName: 'Hospital Universitário Bettina Ferro de Souza (EBSERH)',
    subtitle: 'Implantação Tecnológica',
    description: 'Fase inicial. Dependente de adequações de infraestrutura e espaço físico.',
    order_index: 1
  }
];

export const initialActivities = [
  // Barros Barreto
  {
    id: 'act-bb-1',
    unit_id: 'barros-barreto',
    title: 'Portal Entrada',
    icon: '🚪',
    status: 'completed',
    description: 'Instalado, configurado e sincronizado em Abril.',
    validation: 'Validado Myelis',
    alert: null,
    comments: [
      { id: 'c1', date: '15/04/2026 14:30', author: 'Luiz Barbosa', text: 'Hardware testado e leitura de tags 100% calibrada.' }
    ],
    order_index: 0,
    updated_at: '2026-09-20T10:00:00Z'
  },
  {
    id: 'act-bb-2',
    unit_id: 'barros-barreto',
    title: 'Portal Expurgo',
    icon: '🚪',
    status: 'completed',
    description: 'Instalado, configurado e sincronizado em Junho.',
    validation: 'Validado Myelis',
    alert: null,
    comments: [],
    order_index: 1,
    updated_at: '2026-09-20T10:00:00Z'
  },
  {
    id: 'act-bb-3',
    unit_id: 'barros-barreto',
    title: 'Mesa Distribuição',
    icon: '🖥️',
    status: 'completed',
    description: 'Funcional e validada pelos sistemas desde Abril.',
    validation: 'Validado Myelis',
    alert: null,
    comments: [],
    order_index: 2,
    updated_at: '2026-09-20T10:00:00Z'
  },
  {
    id: 'act-bb-4',
    unit_id: 'barros-barreto',
    title: 'Totem Peso',
    icon: '⚖️',
    status: 'completed',
    description: 'Instalado, configurado e sincronizado desde Abril.',
    validation: 'Operacional',
    alert: null,
    comments: [],
    order_index: 3,
    updated_at: '2026-09-20T10:00:00Z'
  },
  {
    id: 'act-bb-5',
    unit_id: 'barros-barreto',
    title: 'CMCs',
    icon: '📱',
    status: 'completed',
    description: 'Unidades móveis configuradas e em uso desde Abril.',
    validation: 'Operacional',
    alert: null,
    comments: [],
    order_index: 4,
    updated_at: '2026-09-20T10:00:00Z'
  },
  {
    id: 'act-bb-6',
    unit_id: 'barros-barreto',
    title: 'PC Admin',
    icon: '💻',
    status: 'pending',
    description: 'Equipamento funcional desde Abril.',
    validation: 'Aguardando VPN',
    alert: {
      type: 'warning',
      title: 'Ação Necessária',
      message: 'Configuração VPN para acesso Elis (Técnico + TI Elis).'
    },
    comments: [
      { id: 'c2', date: '10/09/2026 09:15', author: 'Luiz Barbosa', text: 'Chamado de suporte aberto para liberação da rota de VPN.' }
    ],
    order_index: 5,
    updated_at: '2026-09-22T11:00:00Z'
  },
  {
    id: 'act-bb-7',
    unit_id: 'barros-barreto',
    title: 'Server Barros',
    icon: '🗄️',
    status: 'pending',
    description: 'Servidor já configurado e fisicamente instalado.',
    validation: 'Pré-instalado',
    alert: {
      type: 'warning',
      title: 'Bloqueio Físico',
      message: 'Aguarda término de obras e fixação de portais.'
    },
    comments: [],
    order_index: 6,
    updated_at: '2026-09-23T15:30:00Z'
  },
  {
    id: 'act-bb-8',
    unit_id: 'barros-barreto',
    title: 'Portais Evasão',
    icon: '🚪',
    status: 'pending',
    description: 'Sistema misto: 4 portais ativos e 8 inativos.',
    validation: 'Parcial',
    alert: {
      type: 'warning',
      title: 'Reparo Necessário',
      message: 'Aguardando manutenção nos vidros físicos.'
    },
    comments: [
      { id: 'c3', date: '16/09/2026 19:50', author: 'Luiz Barbosa', text: 'Planejamento e preventiva finalizados sob o chamado T 26 09 13480.' }
    ],
    order_index: 7,
    updated_at: '2026-09-24T16:00:00Z'
  },

  // Betina Ferro
  {
    id: 'act-bf-1',
    unit_id: 'betina-ferro',
    title: 'Portais Evasão',
    icon: '🚪',
    status: 'pending',
    description: 'Lógica configurada e funcional no sistema.',
    validation: 'Aguardando Vidros',
    alert: {
      type: 'warning',
      title: 'Reparo Físico',
      message: 'Aguardando manutenção nos vidros físicos.'
    },
    comments: [],
    order_index: 0,
    updated_at: '2026-09-20T10:00:00Z'
  },
  {
    id: 'act-bf-2',
    unit_id: 'betina-ferro',
    title: 'PC Admin',
    icon: '💻',
    status: 'waiting',
    description: 'Equipamento em estoque, pronto para uso.',
    validation: 'Em Estoque',
    alert: {
      type: 'danger',
      title: 'Bloqueio de Infraestrutura',
      message: 'Aguardando disponibilidade de espaço para montagem.'
    },
    comments: [],
    order_index: 1,
    updated_at: '2026-09-20T10:00:00Z'
  },
  {
    id: 'act-bf-3',
    unit_id: 'betina-ferro',
    title: 'Server Betina',
    icon: '🗄️',
    status: 'waiting',
    description: 'Servidor em estoque, pronto para configuração.',
    validation: 'Em Estoque',
    alert: {
      type: 'danger',
      title: 'Bloqueio de Rack',
      message: 'Aguardando disponibilidade de espaço físico / rack.'
    },
    comments: [],
    order_index: 2,
    updated_at: '2026-09-20T10:00:00Z'
  },
  {
    id: 'act-bf-4',
    unit_id: 'betina-ferro',
    title: 'Portal Expurgo',
    icon: 'ℹ️',
    status: 'info',
    description: 'Hardware transferido fisicamente para a unidade Barros Barreto.',
    validation: 'Transferido',
    alert: {
      type: 'info',
      title: 'Requisito Futuro',
      message: 'Necessidade de solicitação de nova compra/adição de equipamento.'
    },
    comments: [],
    order_index: 3,
    updated_at: '2026-09-20T10:00:00Z'
  }
];

export const initialPendencies = [
  {
    id: 'pend-1',
    unit_id: 'barros-barreto',
    activity_id: 'act-bb-6',
    title: 'Configuração de VPN para acesso Elis no PC Admin',
    severity: 'high',
    status: 'open',
    description: 'Necessário alinhar entre o técnico local e a equipe de TI Elis a liberação de porta e credencial de VPN.',
    created_at: '2026-09-10T09:15:00Z',
    resolved_at: null,
    closure_report: null
  },
  {
    id: 'pend-2',
    unit_id: 'barros-barreto',
    activity_id: 'act-bb-7',
    title: 'Término de obras civis e fixação para o Server Barros',
    severity: 'high',
    status: 'in_progress',
    description: 'Servidor já configurado e fisicamente no hospital. Aguarda término de obras e fixação dos portais para subida final.',
    created_at: '2026-09-12T14:00:00Z',
    resolved_at: null,
    closure_report: null
  },
  {
    id: 'pend-3',
    unit_id: 'betina-ferro',
    activity_id: 'act-bf-2',
    title: 'Disponibilização de espaço físico e montagem do PC Admin',
    severity: 'medium',
    status: 'open',
    description: 'Equipamento encontra-se em estoque. Bloqueado aguardando liberação da mesa/sala pela administração do hospital.',
    created_at: '2026-09-14T11:20:00Z',
    resolved_at: null,
    closure_report: null
  },
  {
    id: 'pend-4',
    unit_id: 'betina-ferro',
    activity_id: 'act-bf-3',
    title: 'Espaço em rack para instalação do Server Betina',
    severity: 'high',
    status: 'open',
    description: 'Servidor pronto em estoque aguardando rack climatizado com energia estabilizada.',
    created_at: '2026-09-14T11:30:00Z',
    resolved_at: null,
    closure_report: null
  },
  // Chamado Modelo Fechado anexado ao projeto (T 26 09 13480)
  {
    id: 'pend-resolved-13480',
    unit_id: 'barros-barreto',
    activity_id: 'act-bb-8',
    title: 'Planejamento de Portais de Evasão e Manutenção Preventiva de Dispositivos',
    severity: 'high',
    status: 'resolved',
    description: 'Mapeamento estratégico dos portais de evasão RFID e manutenção preventiva geral em 100% dos periféricos e dispositivos ativos.',
    created_at: '2026-09-16T19:50:00Z',
    resolved_at: '2026-09-16T20:12:00Z',
    closure_report: {
      ticketNumber: 'T 26 09 13480',
      title: 'Planejamento de Portais de Evasão e Manutenção Preventiva de Dispositivos',
      requester: {
        name: 'Luiz Henrique Barbosa Silva',
        country: 'Brazil',
        employeeId: '03784221203',
        login: 'lbarbosa3',
        email: 'luiz.barbosa@elis.com',
        department: 'Tecnologia da Informação',
        room: 'Unknown'
      },
      details: {
        shortDesc: 'Planejamento de Portais de Evasão e Manutenção Preventiva de Dispositivos',
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
        targetDate: '17 de Setembro de 2026 19:50',
        processingTime: '1 day',
        onHold: 'Não'
      },
      processing: {
        operatorGroup: 'BR-IT Center West',
        operator: 'Luiz Henrique Barbosa Silva',
        status: 'Completed',
        resolved: 'Sim',
        resolutionDate: '16 de Setembro de 2026 20:12',
        closed: 'Não',
        registeredTime: '08:00'
      },
      request: {
        author: 'Luiz Henrique Barbosa Silva',
        date: '16 de Setembro de 2026 20:13',
        unitName: 'EBSERH - Hospital Universitário João de Barros Barreto',
        objective: 'Solicitação de atendimento presencial e suporte técnico na unidade EBSERH Barros Barreto para alinhamento estratégico da infraestrutura de controle de enxoval e manutenção da planta.',
        justifications: [
          'Projeção de Portais de Evasão: Necessidade de mapear, planejar e estruturar a estratégia de instalação dos portais de evasão (leitura/rastreamento RFID) para mitigar a perda/evasão de peças e garantir a acurácia do fluxo operacional entre o hospital e a lavanderia.',
          'Integridade Operacional: Execução de rotina preventiva nos equipamentos operacionais já instalados na unidade, evitando paradas não programadas e mantendo a alta disponibilidade dos sistemas de leitura e pesagem.'
        ]
      },
      actions: {
        author: 'Luiz Henrique Barbosa Silva',
        date: '16 de Setembro de 2026 20:13',
        executionDate: '15/09/2026',
        summary: 'Planejamento de infraestrutura para portais de evasão concluído e manutenção preventiva geral realizada com sucesso nos dispositivos da unidade EBSERH Barros Barreto.',
        items: [
          {
            title: 'Planejamento Estratégico e Visita Técnica (Portais de Evasão)',
            bullets: [
              'Acompanhamento presencial no local para levantamento de requisitos de infraestrutura e fluxo de circulação.',
              'Mapeamento e definição dos pontos críticos para posicionamento dos portais de evasão.',
              'Elaboração da estratégia técnica de instalação (comunicação de rede, alimentação elétrica e posicionamento de antenas/leitores).'
            ]
          },
          {
            title: 'Manutenção Preventiva dos Dispositivos Existentes',
            bullets: [
              'Inspeção física e limpeza técnica em 100% dos periféricos e dispositivos ativos na unidade.',
              'Verificação e reaperto de conexões físicas (cabos de rede, fontes e conectores seriais/USB).',
              'Testes de conectividade, porta lógica e validação do fluxo de leitura/comunicação com os sistemas centrais.'
            ]
          }
        ]
      },
      conclusion: 'Todos os dispositivos da unidade encontram-se limpos, revisados e operando em perfeita normalidade. A estratégia de instalação dos portais foi alinhada e documentada para a próxima etapa. Chamado finalizado e serviço homologado no local.',
      technicalInfo: {
        registrationDate: '16 de Setembro de 2026 19:50',
        effectiveTime: '00:22',
        holdTime: '00:00',
        adjustedTime: '00:22',
        resolvedTime: '00:00',
        progressTime: '00:22',
        registeredTime: '08:00',
        standardSolution: 'Não há solução padrão vinculada'
      },
      ticketDetails: {
        objects: {
          engineer: 'Não',
          noNotifications: 'Não',
          partiallyValidated: 'Não',
          reactedTime: '0.0',
          escalationTime: '0.0',
          adjustedDuration: '0.0',
          excludeFromSLA: 'Não'
        },
        prioritisation: {
          wsjf: '0.0',
          l2ResolutionTime: '0.0'
        },
        equipment: {
          productionLosses: 'Não'
        },
        additional: {
          supplyChain: { internalMistake: 'Não', quantity: '0.0', value: '0.0' },
          allFunctions: {
            chasingCounter: '0.0',
            reopened: 'Não',
            reassignmentTime: '0.0',
            supplierAssignTime: '0.0',
            firstTimeResolution: 'Não',
            usePriorityMatrix: 'Não'
          }
        }
      },
      metadata: {
        printedBy: 'Luiz Henrique Barbosa',
        printedAt: '16 de Setembro de 2026 20:19'
      }
    }
  }
];
