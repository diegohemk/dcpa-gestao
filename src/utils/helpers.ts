import { Indicadores, Atividade, Projeto, Servidor } from '../types'

export const getIndicadoresByGerencia = (
  gerenciaId: string,
  atividades: Atividade[],
  projetos: Projeto[],
  servidores: Servidor[]
): Indicadores => {
  const atividadesGerencia = atividades.filter(a => a.gerenciaId === gerenciaId)
  const projetosGerencia = projetos.filter(p => p.gerenciaId === gerenciaId)
  const servidoresGerencia = servidores.filter(s => s.gerenciaId === gerenciaId)

  const atividadesEmAndamento = atividadesGerencia.filter(
    a => a.status === 'em andamento'
  ).length

  const projetosAtivos = projetosGerencia.length

  const atividadesConcluidas = atividadesGerencia.filter(
    a => a.status === 'concluída'
  ).length
  
  const conclusaoMedia = atividadesGerencia.length > 0 
    ? Math.round((atividadesConcluidas / atividadesGerencia.length) * 100)
    : 0

  const servidoresAtivos = servidoresGerencia.length

  const relatoriosMensais = atividadesGerencia.filter(
    a => a.frequencia === 'mensal'
  ).length

  return {
    atividadesEmAndamento,
    projetosAtivos,
    conclusaoMedia,
    servidoresAtivos,
    relatoriosMensais
  }
}

export const getIndicadoresGerais = (
  atividades: Atividade[],
  projetos: Projeto[],
  servidores: Servidor[]
): Indicadores => {
  const atividadesEmAndamento = atividades.filter(
    a => a.status === 'em andamento'
  ).length

  const projetosAtivos = projetos.length

  const atividadesConcluidas = atividades.filter(
    a => a.status === 'concluída'
  ).length
  
  const conclusaoMedia = atividades.length > 0 
    ? Math.round((atividadesConcluidas / atividades.length) * 100)
    : 0

  const servidoresAtivos = servidores.length

  const relatoriosMensais = atividades.filter(
    a => a.frequencia === 'mensal' && a.status === 'concluída'
  ).length

  return {
    atividadesEmAndamento,
    projetosAtivos,
    conclusaoMedia,
    servidoresAtivos,
    relatoriosMensais
  }
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'pendente':
      return 'bg-yellow-100 text-yellow-800'
    case 'em andamento':
      return 'bg-blue-100 text-blue-800'
    case 'concluída':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export const getIndicadorColor = (indicador: string): string => {
  switch (indicador) {
    case 'verde':
      return 'bg-green-500'
    case 'amarelo':
      return 'bg-yellow-500'
    case 'vermelho':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

/**
 * Calcula o indicador do projeto automaticamente baseado em:
 * - Status do prazo (vencido ou não)
 * - Percentual de andamento vs tempo decorrido
 * - Status detalhado do projeto
 * - Variação de custo (se houver orçamento)
 */
export const calcularIndicadorProjeto = (projeto: {
  prazo: string
  andamento: number
  dataInicio?: string
  dataConclusao?: string
  statusDetalhado?: 'planejamento' | 'execucao' | 'monitoramento' | 'concluido' | 'suspenso' | 'cancelado'
  orcamento?: number
  custoReal?: number
}): 'verde' | 'amarelo' | 'vermelho' => {
  // Se o projeto está concluído, suspenso ou cancelado, retorna verde (não precisa de atenção)
  if (projeto.statusDetalhado === 'concluido') {
    return 'verde'
  }
  
  if (projeto.statusDetalhado === 'suspenso' || projeto.statusDetalhado === 'cancelado') {
    return 'amarelo' // Suspenso/cancelado precisa atenção mas não é crítico
  }

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  
  const prazoDate = new Date(projeto.prazo)
  prazoDate.setHours(0, 0, 0, 0)

  // Calcula dias restantes até o prazo
  const diasRestantes = Math.ceil((prazoDate.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
  
  // Se o prazo já venceu e o projeto não está concluído
  if (diasRestantes < 0) {
    // Se está muito atrasado (mais de 7 dias), é crítico
    if (Math.abs(diasRestantes) > 7) {
      return 'vermelho'
    }
    // Se está atrasado mas não tanto, é amarelo
    return 'amarelo'
  }

  // Calcula o progresso esperado baseado no tempo decorrido
  let progressoEsperado = 0
  
  if (projeto.dataInicio) {
    const dataInicio = new Date(projeto.dataInicio)
    dataInicio.setHours(0, 0, 0, 0)
    
    const duracaoTotal = Math.ceil((prazoDate.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24))
    const diasDecorridos = Math.ceil((hoje.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24))
    
    if (duracaoTotal > 0 && diasDecorridos >= 0) {
      progressoEsperado = Math.min(100, Math.round((diasDecorridos / duracaoTotal) * 100))
    }
  } else {
    // Se não tem data de início, calcula baseado no prazo
    // Se o prazo está no futuro, assume que o projeto começou recentemente
    // Se o prazo está no passado, assume que já deveria estar concluído
    if (diasRestantes > 0) {
      // Estima que o projeto começou há alguns dias (ex: 30 dias antes do prazo)
      const duracaoEstimada = diasRestantes + 30 // Assume 30 dias de duração total
      const diasEstimados = 30 - diasRestantes // Dias que já passaram desde o início estimado
      if (duracaoEstimada > 0 && diasEstimados > 0) {
        progressoEsperado = Math.min(100, Math.max(0, Math.round((diasEstimados / duracaoEstimada) * 100)))
      }
    } else {
      // Prazo vencido sem data de início - deveria estar concluído
      progressoEsperado = 100
    }
  }

  // Calcula a diferença entre andamento real e esperado
  const diferencaProgresso = projeto.andamento - progressoEsperado

  // Verifica variação de custo
  let variacaoCusto = 0
  if (projeto.orcamento && projeto.orcamento > 0 && projeto.custoReal) {
    variacaoCusto = ((projeto.custoReal - projeto.orcamento) / projeto.orcamento) * 100
  }

  // REGRA 1: Se está muito atrasado no prazo (>7 dias), é vermelho
  if (diasRestantes < 0 && Math.abs(diasRestantes) > 7) {
    return 'vermelho'
  }

  // REGRA 2: Se está atrasado no prazo, é amarelo ou vermelho dependendo do progresso
  if (diasRestantes < 0) {
    if (diferencaProgresso < -20) {
      return 'vermelho' // Muito atrasado no progresso também
    }
    return 'amarelo'
  }

  // REGRA 3: Se está próximo do prazo (menos de 7 dias) e não está no ritmo esperado
  if (diasRestantes <= 7 && diasRestantes > 0) {
    if (diferencaProgresso < -15) {
      return 'vermelho' // Muito atrasado no progresso
    }
    if (diferencaProgresso < -5 || variacaoCusto > 20) {
      return 'amarelo' // Atrasado ou com custo acima do esperado
    }
    return 'verde'
  }

  // REGRA 4: Se está muito atrasado no progresso em relação ao esperado
  if (diferencaProgresso < -20) {
    return 'vermelho'
  }

  // REGRA 5: Se o custo está muito acima do orçamento (>30%)
  if (variacaoCusto > 30) {
    return 'vermelho'
  }

  // REGRA 6: Se está um pouco atrasado no progresso ou com custo acima
  if (diferencaProgresso < -5 || variacaoCusto > 10) {
    return 'amarelo'
  }

  // REGRA 7: Se tudo está ok, é verde
  return 'verde'
}

