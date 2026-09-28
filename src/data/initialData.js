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
    validation: 'Homologado Chamado T 26 09 13491',
    alert: null,
    closureDocument: {
      ticketNumber: 'T 26 09 13491',
      fileName: 'chamado-13491.pdf',
      url: '/documents/chamado-13491.pdf',
      title: 'T 26 09 13491 Preventiva e Conservação de Portais',
      closedAt: '2026-09-16'
    },
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
    validation: 'Homologado Chamado T 26 09 14617',
    alert: null,
    closureDocument: {
      ticketNumber: 'T 26 09 14617',
      fileName: 'chamado-14617.pdf',
      url: '/documents/chamado-14617.pdf',
      title: 'T 26 09 14617 Validação de Portais RFID e Servidor Local',
      closedAt: '2026-09-17'
    },
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
    closureDocument: {
      ticketNumber: 'T 26 09 13491',
      fileName: 'chamado-13491.pdf',
      url: '/documents/chamado-13491.pdf',
      title: 'Homologação Mesa Distribuição e Periféricos',
      closedAt: '2026-09-16'
    },
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
    title: 'Portais Evasão RFID',
    icon: '🚪',
    status: 'completed',
    description: 'Planejamento de infraestrutura concluído e manutenção preventiva geral realizada.',
    validation: 'Homologado Chamado T 26 09 13480',
    alert: null,
    closureDocument: {
      ticketNumber: 'T 26 09 13480',
      fileName: 'chamado-13480.pdf',
      url: '/documents/chamado-13480.pdf',
      title: 'T 26 09 13480 Planejamento de Portais de Evasão e Preventiva',
      closedAt: '2026-09-16'
    },
    comments: [
      { id: 'c3', date: '16/09/2026 19:50', author: 'Luiz Barbosa', text: 'Chamado finalizado e PDF anexado com sucesso.' }
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
    closureDocument: null
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
    closureDocument: null
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
    closureDocument: null
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
    closureDocument: null
  },
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
    closureDocument: {
      ticketNumber: 'T 26 09 13480',
      fileName: 'chamado-13480.pdf',
      url: '/documents/chamado-13480.pdf',
      title: 'T 26 09 13480 Planejamento de Portais de Evasão e Preventiva',
      closedAt: '2026-09-16'
    }
  }
];
