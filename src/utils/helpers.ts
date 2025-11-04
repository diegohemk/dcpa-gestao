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

