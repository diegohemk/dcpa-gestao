import { supabase } from '../lib/supabase'
import { 
  Atividade, 
  Projeto, 
  DashboardDesempenho,
  FatorComplexidadeAtividade,
  FatorComplexidadeProjeto,
  HistoricoExecucao
} from '../types'
import { CalculadoraDesempenho } from '../utils/calculadoraDesempenho'

export const desempenhoService = {
  
  // ===== ATIVIDADES =====
  
  async atualizarFatorComplexidadeAtividade(
    atividadeId: string, 
    fatorComplexidade: FatorComplexidadeAtividade
  ): Promise<Atividade> {
    const { data, error } = await supabase
      .from('atividades')
      .update({ 
        fator_complexidade: fatorComplexidade,
        updated_at: new Date().toISOString()
      })
      .eq('id', atividadeId)
      .select('*')
      .single()

    if (error) throw error
    
    const atividade = this.mapearAtividade(data)
    return CalculadoraDesempenho.atualizarMetricasAtividade(atividade)
  },

  async registrarExecucaoAtividade(
    atividadeId: string, 
    execucao: Omit<HistoricoExecucao, 'data'>
  ): Promise<Atividade> {
    const novaExecucao: HistoricoExecucao = {
      ...execucao,
      data: new Date().toISOString()
    }

    // Buscar atividade atual
    const { data: atividadeData, error: fetchError } = await supabase
      .from('atividades')
      .select('*')
      .eq('id', atividadeId)
      .single()

    if (fetchError) throw fetchError

    const historicoAtual = atividadeData.historico_execucoes || []
    const novoHistorico = [...historicoAtual, novaExecucao]

    // Atualizar atividade
    const { data, error } = await supabase
      .from('atividades')
      .update({ 
        historico_execucoes: novoHistorico,
        ultima_atualizacao: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', atividadeId)
      .select('*')
      .single()

    if (error) throw error
    
    const atividade = this.mapearAtividade(data)
    return CalculadoraDesempenho.atualizarMetricasAtividade(atividade)
  },

  async avaliarQualidadeAtividade(
    atividadeId: string, 
    qualidade: number
  ): Promise<Atividade> {
    const { data: atividadeData, error: fetchError } = await supabase
      .from('atividades')
      .select('*')
      .eq('id', atividadeId)
      .single()

    if (fetchError) throw fetchError

    const metricas = atividadeData.metricas || {}
    metricas.qualidadeExecucao = qualidade

    const { data, error } = await supabase
      .from('atividades')
      .update({ 
        metricas: metricas,
        updated_at: new Date().toISOString()
      })
      .eq('id', atividadeId)
      .select('*')
      .single()

    if (error) throw error
    
    const atividade = this.mapearAtividade(data)
    return CalculadoraDesempenho.atualizarMetricasAtividade(atividade)
  },

  // ===== PROJETOS =====
  
  async atualizarFatorComplexidadeProjeto(
    projetoId: string, 
    fatorComplexidade: FatorComplexidadeProjeto
  ): Promise<Projeto> {
    const { data, error } = await supabase
      .from('projetos')
      .update({ 
        fator_complexidade: fatorComplexidade,
        updated_at: new Date().toISOString()
      })
      .eq('id', projetoId)
      .select('*')
      .single()

    if (error) throw error
    
    const projeto = this.mapearProjeto(data)
    return CalculadoraDesempenho.atualizarMetricasProjeto(projeto)
  },

  async avaliarQualidadeProjeto(
    projetoId: string, 
    qualidade: number
  ): Promise<Projeto> {
    const { data: projetoData, error: fetchError } = await supabase
      .from('projetos')
      .select('*')
      .eq('id', projetoId)
      .single()

    if (fetchError) throw fetchError

    const metricas = projetoData.metricas || {}
    metricas.qualidadeEntregas = qualidade

    const { data, error } = await supabase
      .from('projetos')
      .update({ 
        metricas: metricas,
        updated_at: new Date().toISOString()
      })
      .eq('id', projetoId)
      .select('*')
      .single()

    if (error) throw error
    
    const projeto = this.mapearProjeto(data)
    return CalculadoraDesempenho.atualizarMetricasProjeto(projeto)
  },

  async avaliarSatisfacaoEquipe(
    projetoId: string, 
    satisfacao: number
  ): Promise<Projeto> {
    const { data: projetoData, error: fetchError } = await supabase
      .from('projetos')
      .select('*')
      .eq('id', projetoId)
      .single()

    if (fetchError) throw fetchError

    const metricas = projetoData.metricas || {}
    metricas.satisfacaoEquipe = satisfacao

    const { data, error } = await supabase
      .from('projetos')
      .update({ 
        metricas: metricas,
        updated_at: new Date().toISOString()
      })
      .eq('id', projetoId)
      .select('*')
      .single()

    if (error) throw error
    
    const projeto = this.mapearProjeto(data)
    return CalculadoraDesempenho.atualizarMetricasProjeto(projeto)
  },

  // ===== DASHBOARD =====
  
  async getDashboardDesempenho(gerenciaId?: string): Promise<DashboardDesempenho> {
    // Buscar atividades
    let atividadesQuery = supabase.from('atividades').select('*')
    if (gerenciaId) {
      atividadesQuery = atividadesQuery.eq('gerencia_id', gerenciaId)
    }
    const { data: atividadesData, error: atividadesError } = await atividadesQuery

    if (atividadesError) throw atividadesError

    // Buscar projetos
    let projetosQuery = supabase.from('projetos').select('*')
    if (gerenciaId) {
      projetosQuery = projetosQuery.eq('gerencia_id', gerenciaId)
    }
    const { data: projetosData, error: projetosError } = await projetosQuery

    if (projetosError) throw projetosError

    // Mapear dados
    const atividades = atividadesData.map(this.mapearAtividade)
    const projetos = projetosData.map(this.mapearProjeto)

    // Calcular dashboard
    return CalculadoraDesempenho.calcularScoreGeral(atividades, projetos)
  },

  // ===== RELATÓRIOS =====
  
  async getRelatorioMensal(gerenciaId?: string, mes?: number, ano?: number): Promise<{
    atividades: {
      total: number
      concluidas: number
      emAndamento: number
      atrasadas: number
      scoreMedio: number
      topPerformers: Atividade[]
    }
    projetos: {
      total: number
      concluidos: number
      emAndamento: number
      atrasados: number
      scoreMedio: number
      topPerformers: Projeto[]
    }
    dashboard: DashboardDesempenho
  }> {
    const dashboard = await this.getDashboardDesempenho(gerenciaId)
    
    // Buscar dados do período
    const dataInicio = new Date(ano || new Date().getFullYear(), (mes || new Date().getMonth()) - 1, 1)
    const dataFim = new Date(ano || new Date().getFullYear(), mes || new Date().getMonth(), 0)

    // Atividades do período
    let atividadesQuery = supabase
      .from('atividades')
      .select('*')
      .gte('created_at', dataInicio.toISOString())
      .lte('created_at', dataFim.toISOString())
    
    if (gerenciaId) {
      atividadesQuery = atividadesQuery.eq('gerencia_id', gerenciaId)
    }

    const { data: atividadesData, error: atividadesError } = await atividadesQuery
    if (atividadesError) throw atividadesError

    // Projetos do período
    let projetosQuery = supabase
      .from('projetos')
      .select('*')
      .gte('created_at', dataInicio.toISOString())
      .lte('created_at', dataFim.toISOString())
    
    if (gerenciaId) {
      projetosQuery = projetosQuery.eq('gerencia_id', gerenciaId)
    }

    const { data: projetosData, error: projetosError } = await projetosQuery
    if (projetosError) throw projetosError

    const atividades = atividadesData.map(this.mapearAtividade)
    const projetos = projetosData.map(this.mapearProjeto)

    // Calcular estatísticas
    const atividadesConcluidas = atividades.filter(a => a.status === 'concluída').length
    const atividadesEmAndamento = atividades.filter(a => a.status === 'em andamento').length
    const atividadesAtrasadas = atividades.filter(a => 
      a.status === 'em andamento' && 
      new Date(a.ultimaAtualizacao) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length

    const projetosConcluidos = projetos.filter(p => p.statusDetalhado === 'concluido').length
    const projetosEmAndamento = projetos.filter(p => p.statusDetalhado === 'execucao').length
    const projetosAtrasados = projetos.filter(p => p.indicador === 'vermelho').length

    const scoreMedioAtividades = atividades.length > 0 ? 
      atividades.reduce((acc, a) => acc + (a.pontosDesempenho || 0), 0) / atividades.length : 0

    const scoreMedioProjetos = projetos.length > 0 ? 
      projetos.reduce((acc, p) => acc + (p.pontosDesempenho || 0), 0) / projetos.length : 0

    // Top performers (maiores pontuações)
    const topAtividades = [...atividades]
      .sort((a, b) => (b.pontosDesempenho || 0) - (a.pontosDesempenho || 0))
      .slice(0, 5)

    const topProjetos = [...projetos]
      .sort((a, b) => (b.pontosDesempenho || 0) - (a.pontosDesempenho || 0))
      .slice(0, 5)

    return {
      atividades: {
        total: atividades.length,
        concluidas: atividadesConcluidas,
        emAndamento: atividadesEmAndamento,
        atrasadas: atividadesAtrasadas,
        scoreMedio: Math.round(scoreMedioAtividades * 10) / 10,
        topPerformers: topAtividades
      },
      projetos: {
        total: projetos.length,
        concluidos: projetosConcluidos,
        emAndamento: projetosEmAndamento,
        atrasados: projetosAtrasados,
        scoreMedio: Math.round(scoreMedioProjetos * 10) / 10,
        topPerformers: topProjetos
      },
      dashboard
    }
  },

  // ===== UTILITÁRIOS =====
  
  mapearAtividade(data: any): Atividade {
    return {
      id: data.id,
      titulo: data.titulo,
      descricao: data.descricao,
      frequencia: data.frequencia,
      responsavelId: data.responsavel_id,
      gerenciaId: data.gerencia_id,
      status: data.status,
      ultimaAtualizacao: data.ultima_atualizacao,
      documentos: data.documentos || [],
      fatorComplexidade: data.fator_complexidade,
      metricas: data.metricas,
      historicoExecucoes: data.historico_execucoes || [],
      eficiencia: data.eficiencia,
      consistencia: data.consistencia,
      pontosDesempenho: data.pontos_desempenho
    }
  },

  mapearProjeto(data: any): Projeto {
    return {
      id: data.id,
      nome: data.nome,
      objetivo: data.objetivo,
      responsavelId: data.responsavel_id,
      gerenciaId: data.gerencia_id,
      equipe: data.equipe || [],
      prazo: data.prazo,
      andamento: data.andamento,
      indicador: data.indicador,
      subetapas: data.subetapas || [],
      orcamento: data.orcamento,
      custoReal: data.custo_real,
      prioridade: data.prioridade,
      categoria: data.categoria,
      tags: data.tags || [],
      riscos: data.riscos || [],
      marcos: data.marcos || [],
      recursos: data.recursos || [],
      observacoes: data.observacoes,
      dataInicio: data.data_inicio,
      dataConclusao: data.data_conclusao,
      statusDetalhado: data.status_detalhado,
      documentos: data.documentos || [],
      updatedAt: data.updated_at,
      fatorComplexidade: data.fator_complexidade,
      metricas: data.metricas,
      scorePerformance: data.score_performance,
      tendencia: data.tendencia,
      pontosDesempenho: data.pontos_desempenho
    }
  }
}
