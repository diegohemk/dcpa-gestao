export interface Gerencia {
  id: string
  nome: string
  sigla: string
  cor: string
  listarNoOrganograma?: boolean // Por padrão true, se false não aparece no organograma
}

export interface Servidor {
  id: string
  nome: string
  cargo: string
  gerenciaId: string
  atribuicoes: string[]
}

// Interfaces para Sistema de Desempenho

export interface FatorComplexidadeAtividade {
  nivelRotina: 'simples' | 'moderada' | 'complexa'
  tempoEstimado: number // em horas
  recursosNecessarios: number // pessoas envolvidas
  criticidade: 'baixa' | 'media' | 'alta' | 'critica'
}

export interface MetricasAtividade {
  // Eficiência Operacional
  taxaConclusao: number // % de atividades concluídas no prazo
  tempoMedioExecucao: number // Tempo médio para conclusão
  frequenciaExecucao: number // Quantas vezes executada por período
  
  // Qualidade
  qualidadeExecucao: number // Avaliação de 1-5
  conformidade: number // % de conformidade com padrões
  
  // Produtividade
  volumeProcessado: number // Quantidade de itens processados
  eficienciaTemporal: number // Volume/tempo
}

export interface FatorComplexidadeProjeto {
  tamanho: 'pequeno' | 'medio' | 'grande' | 'mega'
  duracao: number // em dias
  equipe: number // tamanho da equipe
  orcamento: number // valor do orçamento
  risco: 'baixo' | 'medio' | 'alto' | 'critico'
}

export interface MetricasProjeto {
  // Performance Temporal
  prazoCumprimento: number // % de projetos no prazo
  atrasoMedio: number // Dias de atraso médio
  
  // Performance Financeira
  variacaoOrcamento: number // % de variação do orçamento
  eficienciaFinanceira: number // Valor entregue/custo
  
  // Performance de Escopo
  escopoCompletude: number // % do escopo entregue
  qualidadeEntregas: number // Avaliação das entregas
  
  // Performance de Equipe
  utilizacaoRecursos: number // % de utilização da equipe
  satisfacaoEquipe: number // Avaliação da equipe
}

export interface DashboardDesempenho {
  // Visão Geral
  scoreGeral: number // 0-100
  
  // Breakdown por Tipo
  scoreAtividades: number // Performance em rotinas
  scoreProjetos: number // Performance em projetos
  
  // Indicadores de Tendência
  tendenciaAtividades: 'melhorando' | 'estavel' | 'piorando'
  tendenciaProjetos: 'melhorando' | 'estavel' | 'piorando'
  
  // Comparativo Temporal
  comparativoMesAnterior: {
    atividades: number // % de variação
    projetos: number // % de variação
  }
  
  // Alertas
  alertas: {
    atividadesAtrasadas: number
    projetosCriticos: number
    recursosSobrecarregados: string[]
  }
}

export interface HistoricoExecucao {
  data: string
  tempoGasto: number
  qualidade: number
  observacoes: string
}

// Interfaces para WBS (Work Breakdown Structure)
export interface WBSItem {
  id: string
  codigo: string // Ex: 1.1.2
  nome: string
  descricao: string
  nivel: number // 0=projeto, 1=fase, 2=pacote, 3=tarefa
  paiId?: string
  filhos: WBSItem[]
  responsavelId: string
  estimativaHoras: number
  estimativaCusto: number
  horasReais?: number
  custoReal?: number
  status: 'nao_iniciado' | 'em_andamento' | 'concluido' | 'suspenso'
  percentualCompleto: number
  dataInicio?: string
  dataFim?: string
  dataInicioReal?: string
  dataFimReal?: string
  dependencias: Dependencia[]
  riscos: string[]
  observacoes?: string
  createdAt: string
  updatedAt: string
}

export interface Dependencia {
  id: string
  tarefaId: string
  tipo: 'FS' | 'SS' | 'FF' | 'SF' // Finish-to-Start, Start-to-Start, Finish-to-Finish, Start-to-Finish
  lag: number // dias de atraso ou antecipação
  descricao?: string
}

export interface WBSTemplate {
  id: string
  nome: string
  descricao: string
  categoria: string
  estrutura: WBSItem[]
  createdAt: string
}

// Interfaces para EVM (Earned Value Management)
export interface EVMData {
  id: string
  projetoId: string
  dataMedicao: string
  pv: number // Planned Value
  ev: number // Earned Value
  ac: number // Actual Cost
  spi: number // Schedule Performance Index
  cpi: number // Cost Performance Index
  sv: number // Schedule Variance
  cv: number // Cost Variance
  eac: number // Estimate at Completion
  etc: number // Estimate to Complete
  vac: number // Variance at Completion
  bac: number // Budget at Completion
  createdAt: string
}

export interface EVMResumo {
  projetoId: string
  dataUltimaMedicao: string
  pvAtual: number
  evAtual: number
  acAtual: number
  spiAtual: number
  cpiAtual: number
  svAtual: number
  cvAtual: number
  eacProjetado: number
  etcProjetado: number
  vacProjetado: number
  statusGeral: 'excelente' | 'bom' | 'atencao' | 'critico'
  tendencia: 'melhorando' | 'estavel' | 'piorando'
}

export interface CaminhoCritico {
  projetoId: string
  tarefasCriticas: string[] // IDs das tarefas no caminho crítico
  duracaoTotal: number // dias
  margemTotal: number // dias de folga
  atualizadoEm: string
}

export interface AlocacaoRecurso {
  id: string
  projetoId: string
  servidorId: string
  wbsItemId: string
  percentualAlocacao: number // 0-100%
  dataInicio: string
  dataFim: string
  horasEstimadas: number
  horasReais?: number
  custoHora: number
  observacoes?: string
}

export interface Atividade {
  id: string
  titulo: string
  descricao: string
  frequencia: 'diária' | 'semanal' | 'mensal'
  responsaveis: string[] // Array de IDs dos responsáveis
  gerenciaId: string
  status: 'pendente' | 'em andamento' | 'concluída'
  ultimaAtualizacao: string
  documentos?: string[]
  
  // Novos campos para sistema de desempenho
  fatorComplexidade?: FatorComplexidadeAtividade
  metricas?: MetricasAtividade
  historicoExecucoes?: HistoricoExecucao[]
  
  // Métricas calculadas
  eficiencia?: number // tempoEstimado/tempoReal
  consistencia?: number // variação na qualidade
  pontosDesempenho?: number // pontos calculados
  
  // Campo mantido para compatibilidade (deprecated - usar responsaveis)
  responsavelId?: string
}

export interface Projeto {
  id: string
  nome: string
  objetivo: string
  responsavelId: string
  gerenciaId: string
  equipe: string[]
  prazo: string
  andamento: number
  indicador: 'verde' | 'amarelo' | 'vermelho'
  favorito: boolean
  // Novos campos adicionados
  subetapas: Subetapa[]
  orcamento?: number
  custoReal?: number
  prioridade: 'baixa' | 'media' | 'alta' | 'critica'
  categoria?: string
  tags: string[]
  riscos: string[]
  marcos: Marco[]
  recursos: string[]
  observacoes?: string
  dataInicio?: string
  dataConclusao?: string
  statusDetalhado: 'planejamento' | 'execucao' | 'monitoramento' | 'concluido' | 'suspenso' | 'cancelado'
  documentos: string[]
  updatedAt: string
  
  // Novos campos para sistema de desempenho
  fatorComplexidade?: FatorComplexidadeProjeto
  metricas?: MetricasProjeto
  
  // Métricas calculadas
  scorePerformance?: number // score consolidado
  tendencia?: 'melhorando' | 'estavel' | 'piorando'
  pontosDesempenho?: number // pontos calculados
  
  // Campos para WBS e EVM
  wbs?: WBSItem[]
  evmResumo?: EVMResumo
  caminhoCritico?: CaminhoCritico
  alocacoesRecursos?: AlocacaoRecurso[]
  baseline?: {
    cronograma: string
    orcamento: number
    escopo: string
    dataBaseline: string
  }
}

export interface Subetapa {
  id: string
  nome: string
  descricao: string
  responsavelId: string
  prazo: string
  status: 'pendente' | 'em_andamento' | 'concluida'
  andamento: number
  dependencias: string[] // IDs de outras subetapas
}

export interface Marco {
  id: string
  nome: string
  descricao: string
  dataPrevista: string
  dataRealizada?: string
  status: 'pendente' | 'concluido' | 'atrasado'
}

export interface Curso {
  id: string
  nome: string
  descricao?: string
  ministrado: boolean
  dataInicio?: string
  dataFim?: string
  cargaHoraria?: number
  gerenciaId?: string
  participantes: string[]
  status: 'planejado' | 'em_andamento' | 'concluido' | 'cancelado'
  tipo: 'interno' | 'externo'
  modalidade: 'hibrido' | 'online' | 'presencial'
  local?: string
  observacoes?: string
  documentos: string[]
  createdAt: string
  updatedAt: string
  // Campos expandidos para exibição
  gerencia?: Gerencia
}

export interface Indicadores {
  atividadesEmAndamento: number
  projetosAtivos: number
  conclusaoMedia: number
  servidoresAtivos: number
  relatoriosMensais: number
}

// Interfaces para funcionalidades colaborativas
export interface Comentario {
  id: string
  conteudo: string
  autorId: string
  atividadeId?: string
  projetoId?: string
  createdAt: string
  updatedAt: string
  // Campos expandidos para exibição
  autor?: Servidor
}

export interface HistoricoAlteracao {
  id: string
  entidadeTipo: 'atividade' | 'projeto' | 'servidor' | 'gerencia'
  entidadeId: string
  acao: 'criou' | 'atualizou' | 'excluiu' | 'comentou'
  usuarioId: string
  campoAlterado?: string
  valorAnterior?: string
  valorNovo?: string
  createdAt: string
  // Campos expandidos para exibição
  usuario?: Servidor
}

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  duration?: number
}

export interface TimelineItem {
  id: string
  type: 'comentario' | 'alteracao' | 'marco'
  data: Comentario | HistoricoAlteracao
  timestamp: string
  usuario?: Servidor
}

