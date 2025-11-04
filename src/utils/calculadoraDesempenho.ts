import { 
  Atividade, 
  Projeto, 
  FatorComplexidadeAtividade, 
  FatorComplexidadeProjeto,
  MetricasAtividade,
  MetricasProjeto,
  DashboardDesempenho,
  HistoricoExecucao
} from '../types'

export class CalculadoraDesempenho {
  
  // ===== CÁLCULO DE PONTOS PARA ATIVIDADES =====
  
  static calcularPontosAtividade(atividade: Atividade): number {
    if (!atividade.fatorComplexidade) return 0
    
    const { nivelRotina, tempoEstimado, recursosNecessarios, criticidade } = atividade.fatorComplexidade
    
    // Pontuação base
    const pontosTempo = this.getPontosTempoAtividade(tempoEstimado)
    const pontosRecursos = this.getPontosRecursosAtividade(recursosNecessarios)
    const pontosCriticidade = this.getPontosCriticidadeAtividade(criticidade)
    const pontosQualidade = atividade.metricas?.qualidadeExecucao || 3
    
    // Multiplicador de frequência
    const multiplicadorFrequencia = this.getMultiplicadorFrequencia(atividade.frequencia)
    
    // Cálculo final
    const pontosBase = (
      pontosTempo * 0.3 +
      pontosRecursos * 0.2 +
      pontosCriticidade * 0.3 +
      pontosQualidade * 0.2
    )
    
    return Math.round(pontosBase * multiplicadorFrequencia * 10) / 10
  }
  
  private static getPontosTempoAtividade(tempoEstimado: number): number {
    if (tempoEstimado <= 2) return 1
    if (tempoEstimado <= 8) return 2
    return 3
  }
  
  private static getPontosRecursosAtividade(recursosNecessarios: number): number {
    if (recursosNecessarios === 1) return 1
    if (recursosNecessarios <= 3) return 2
    return 3
  }
  
  private static getPontosCriticidadeAtividade(criticidade: string): number {
    switch (criticidade) {
      case 'baixa': return 1
      case 'media': return 2
      case 'alta': return 3
      case 'critica': return 4
      default: return 1
    }
  }
  
  private static getMultiplicadorFrequencia(frequencia: string): number {
    switch (frequencia) {
      case 'diária': return 1.5
      case 'semanal': return 1.2
      case 'mensal': return 1.0
      default: return 1.0
    }
  }
  
  // ===== CÁLCULO DE PONTOS PARA PROJETOS =====
  
  static calcularPontosProjeto(projeto: Projeto): number {
    if (!projeto.fatorComplexidade) return 0
    
    const { tamanho, duracao, equipe, orcamento, risco } = projeto.fatorComplexidade
    
    // Pontuação base
    const pontosDuracao = this.getPontosDuracaoProjeto(duracao)
    const pontosEquipe = this.getPontosEquipeProjeto(equipe)
    const pontosOrcamento = this.getPontosOrcamentoProjeto(orcamento)
    const pontosRisco = this.getPontosRiscoProjeto(risco)
    const pontosQualidade = projeto.metricas?.qualidadeEntregas || 3
    
    // Multiplicador de tamanho
    const multiplicadorTamanho = this.getMultiplicadorTamanho(tamanho)
    
    // Cálculo final
    const pontosBase = (
      pontosDuracao * 0.2 +
      pontosEquipe * 0.15 +
      pontosOrcamento * 0.15 +
      pontosRisco * 0.25 +
      pontosQualidade * 0.25
    )
    
    return Math.round(pontosBase * multiplicadorTamanho * 10) / 10
  }
  
  private static getPontosDuracaoProjeto(duracao: number): number {
    if (duracao <= 30) return 1
    if (duracao <= 180) return 2
    if (duracao <= 365) return 3
    return 4
  }
  
  private static getPontosEquipeProjeto(equipe: number): number {
    if (equipe <= 3) return 1
    if (equipe <= 8) return 2
    if (equipe <= 15) return 3
    return 4
  }
  
  private static getPontosOrcamentoProjeto(orcamento: number): number {
    if (orcamento <= 10000) return 1
    if (orcamento <= 100000) return 2
    if (orcamento <= 1000000) return 3
    return 4
  }
  
  private static getPontosRiscoProjeto(risco: string): number {
    switch (risco) {
      case 'baixo': return 1
      case 'medio': return 2
      case 'alto': return 3
      case 'critico': return 4
      default: return 1
    }
  }
  
  private static getMultiplicadorTamanho(tamanho: string): number {
    switch (tamanho) {
      case 'pequeno': return 1.0
      case 'medio': return 1.5
      case 'grande': return 2.0
      case 'mega': return 2.5
      default: return 1.0
    }
  }
  
  // ===== CÁLCULO DE MÉTRICAS PARA ATIVIDADES =====
  
  static calcularMetricasAtividade(atividade: Atividade): MetricasAtividade {
    const historico = atividade.historicoExecucoes || []
    
    if (historico.length === 0) {
      return {
        taxaConclusao: 0,
        tempoMedioExecucao: 0,
        frequenciaExecucao: 0,
        qualidadeExecucao: 0,
        conformidade: 0,
        volumeProcessado: 0,
        eficienciaTemporal: 0
      }
    }
    
    // Cálculos básicos
    const tempoTotal = historico.reduce((acc, h) => acc + h.tempoGasto, 0)
    const qualidadeMedia = historico.reduce((acc, h) => acc + h.qualidade, 0) / historico.length
    const volumeTotal = historico.length
    
    // Taxa de conclusão (baseada na frequência esperada)
    const frequenciaEsperada = this.getFrequenciaEsperada(atividade.frequencia)
    const taxaConclusao = Math.min(100, (volumeTotal / frequenciaEsperada) * 100)
    
    // Eficiência temporal
    const tempoEstimado = atividade.fatorComplexidade?.tempoEstimado || 1
    const eficienciaTemporal = volumeTotal / (tempoTotal / tempoEstimado)
    
    return {
      taxaConclusao: Math.round(taxaConclusao * 10) / 10,
      tempoMedioExecucao: Math.round((tempoTotal / volumeTotal) * 10) / 10,
      frequenciaExecucao: volumeTotal,
      qualidadeExecucao: Math.round(qualidadeMedia * 10) / 10,
      conformidade: Math.round(qualidadeMedia * 20), // Converte 1-5 para %
      volumeProcessado: volumeTotal,
      eficienciaTemporal: Math.round(eficienciaTemporal * 10) / 10
    }
  }
  
  private static getFrequenciaEsperada(frequencia: string): number {
    switch (frequencia) {
      case 'diária': return 30 // 30 dias no mês
      case 'semanal': return 4 // 4 semanas no mês
      case 'mensal': return 1 // 1 vez no mês
      default: return 1
    }
  }
  
  // ===== CÁLCULO DE MÉTRICAS PARA PROJETOS =====
  
  static calcularMetricasProjeto(projeto: Projeto): MetricasProjeto {
    const agora = new Date()
    const prazo = new Date(projeto.prazo)
    const inicio = projeto.dataInicio ? new Date(projeto.dataInicio) : agora
    const conclusao = projeto.dataConclusao ? new Date(projeto.dataConclusao) : null
    
    // Performance Temporal
    const prazoCumprimento = conclusao && conclusao <= prazo ? 100 : 
                            projeto.andamento >= 100 ? 0 : 
                            (projeto.andamento / 100) * 100
    
    const atrasoMedio = conclusao && conclusao > prazo ? 
                       Math.ceil((conclusao.getTime() - prazo.getTime()) / (1000 * 60 * 60 * 24)) : 0
    
    // Performance Financeira
    const variacaoOrcamento = projeto.orcamento && projeto.custoReal ? 
                             ((projeto.custoReal - projeto.orcamento) / projeto.orcamento) * 100 : 0
    
    const eficienciaFinanceira = projeto.orcamento && projeto.andamento > 0 ? 
                                (projeto.andamento / 100) / (projeto.custoReal || projeto.orcamento) * 1000 : 0
    
    // Performance de Escopo
    const escopoCompletude = projeto.andamento
    
    const qualidadeEntregas = this.calcularQualidadeEntregas(projeto)
    
    // Performance de Equipe
    const utilizacaoRecursos = this.calcularUtilizacaoRecursos(projeto)
    const satisfacaoEquipe = this.calcularSatisfacaoEquipe(projeto)
    
    return {
      prazoCumprimento: Math.round(prazoCumprimento * 10) / 10,
      atrasoMedio: atrasoMedio,
      variacaoOrcamento: Math.round(variacaoOrcamento * 10) / 10,
      eficienciaFinanceira: Math.round(eficienciaFinanceira * 10) / 10,
      escopoCompletude: escopoCompletude,
      qualidadeEntregas: qualidadeEntregas,
      utilizacaoRecursos: utilizacaoRecursos,
      satisfacaoEquipe: satisfacaoEquipe
    }
  }
  
  private static calcularQualidadeEntregas(projeto: Projeto): number {
    // Baseado no indicador e andamento
    const baseScore = projeto.andamento / 20 // Converte % para escala 1-5
    
    switch (projeto.indicador) {
      case 'verde': return Math.min(5, baseScore + 1)
      case 'amarelo': return Math.min(5, baseScore)
      case 'vermelho': return Math.max(1, baseScore - 1)
      default: return baseScore
    }
  }
  
  private static calcularUtilizacaoRecursos(projeto: Projeto): number {
    // Simulação baseada no tamanho da equipe e andamento
    const tamanhoEquipe = projeto.equipe.length
    const baseUtilizacao = (projeto.andamento / 100) * 80 // Máximo 80% de utilização
    
    // Ajuste baseado no tamanho da equipe
    const fatorEquipe = tamanhoEquipe <= 3 ? 1.2 : tamanhoEquipe <= 8 ? 1.0 : 0.8
    
    return Math.round(Math.min(100, baseUtilizacao * fatorEquipe) * 10) / 10
  }
  
  private static calcularSatisfacaoEquipe(projeto: Projeto): number {
    // Baseado no indicador e prioridade
    let baseScore = 3
    
    switch (projeto.indicador) {
      case 'verde': baseScore += 1; break
      case 'amarelo': break
      case 'vermelho': baseScore -= 1; break
    }
    
    switch (projeto.prioridade) {
      case 'baixa': baseScore += 0.5; break
      case 'media': break
      case 'alta': baseScore -= 0.5; break
      case 'critica': baseScore -= 1; break
    }
    
    return Math.max(1, Math.min(5, baseScore))
  }
  
  // ===== CÁLCULO DE SCORE GERAL =====
  
  static calcularScoreGeral(atividades: Atividade[], projetos: Projeto[]): DashboardDesempenho {
    // Score de Atividades
    const scoreAtividades = this.calcularScoreAtividades(atividades)
    
    // Score de Projetos
    const scoreProjetos = this.calcularScoreProjetos(projetos)
    
    // Score Geral (40% atividades + 60% projetos)
    const scoreGeral = (scoreAtividades * 0.4) + (scoreProjetos * 0.6)
    
    // Tendências (simulação baseada em dados históricos)
    const tendenciaAtividades = this.calcularTendencia(atividades)
    const tendenciaProjetos = this.calcularTendencia(projetos)
    
    // Comparativo (simulação)
    const comparativoMesAnterior = {
      atividades: Math.random() * 20 - 10, // -10% a +10%
      projetos: Math.random() * 20 - 10
    }
    
    // Alertas
    const alertas = this.calcularAlertas(atividades, projetos)
    
    return {
      scoreGeral: Math.round(scoreGeral * 10) / 10,
      scoreAtividades: Math.round(scoreAtividades * 10) / 10,
      scoreProjetos: Math.round(scoreProjetos * 10) / 10,
      tendenciaAtividades,
      tendenciaProjetos,
      comparativoMesAnterior,
      alertas
    }
  }
  
  private static calcularScoreAtividades(atividades: Atividade[]): number {
    if (atividades.length === 0) return 0
    
    const scores = atividades.map(atividade => {
      const metricas = atividade.metricas || this.calcularMetricasAtividade(atividade)
      const pontos = atividade.pontosDesempenho || this.calcularPontosAtividade(atividade)
      
      // Score baseado em métricas e pontos
      const scoreBase = (
        metricas.taxaConclusao * 0.3 +
        metricas.qualidadeExecucao * 20 * 0.3 + // Converte 1-5 para %
        metricas.eficienciaTemporal * 10 * 0.2 +
        pontos * 2 * 0.2 // Converte pontos para %
      )
      
      return Math.min(100, scoreBase)
    })
    
    return scores.reduce((acc, score) => acc + score, 0) / scores.length
  }
  
  private static calcularScoreProjetos(projetos: Projeto[]): number {
    if (projetos.length === 0) return 0
    
    const scores = projetos.map(projeto => {
      const metricas = projeto.metricas || this.calcularMetricasProjeto(projeto)
      const pontos = projeto.pontosDesempenho || this.calcularPontosProjeto(projeto)
      
      // Score baseado em métricas e pontos
      const scoreBase = (
        metricas.prazoCumprimento * 0.25 +
        metricas.escopoCompletude * 0.25 +
        metricas.qualidadeEntregas * 20 * 0.2 + // Converte 1-5 para %
        metricas.utilizacaoRecursos * 0.15 +
        pontos * 2 * 0.15 // Converte pontos para %
      )
      
      return Math.min(100, scoreBase)
    })
    
    return scores.reduce((acc, score) => acc + score, 0) / scores.length
  }
  
  private static calcularTendencia(items: (Atividade | Projeto)[]): 'melhorando' | 'estavel' | 'piorando' {
    // Simulação baseada no status dos itens
    const emAndamento = items.filter(item => 
      'status' in item ? item.status === 'em andamento' : 
      item.statusDetalhado === 'execucao'
    ).length
    
    const concluidos = items.filter(item => 
      'status' in item ? item.status === 'concluída' : 
      item.statusDetalhado === 'concluido'
    ).length
    
    const total = items.length
    
    if (total === 0) return 'estavel'
    
    const taxaConclusao = concluidos / total
    
    if (taxaConclusao > 0.7) return 'melhorando'
    if (taxaConclusao < 0.3) return 'piorando'
    return 'estavel'
  }
  
  private static calcularAlertas(atividades: Atividade[], projetos: Projeto[]): {
    atividadesAtrasadas: number
    projetosCriticos: number
    recursosSobrecarregados: string[]
  } {
    const atividadesAtrasadas = atividades.filter(a => 
      a.status === 'em andamento' && 
      new Date(a.ultimaAtualizacao) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length
    
    const projetosCriticos = projetos.filter(p => 
      p.indicador === 'vermelho' || p.prioridade === 'critica'
    ).length
    
    const recursosSobrecarregados: string[] = []
    
    // Simulação de recursos sobrecarregados
    const servidoresAtividades = atividades.reduce((acc, a) => {
      acc[a.responsavelId] = (acc[a.responsavelId] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    Object.entries(servidoresAtividades).forEach(([servidorId, count]) => {
      if (count > 5) { // Mais de 5 atividades
        recursosSobrecarregados.push(servidorId)
      }
    })
    
    return {
      atividadesAtrasadas,
      projetosCriticos,
      recursosSobrecarregados
    }
  }
  
  // ===== UTILITÁRIOS =====
  
  static atualizarMetricasAtividade(atividade: Atividade): Atividade {
    const metricas = this.calcularMetricasAtividade(atividade)
    const pontos = this.calcularPontosAtividade(atividade)
    const eficiencia = atividade.fatorComplexidade?.tempoEstimado && 
                      metricas.tempoMedioExecucao > 0 ? 
                      atividade.fatorComplexidade.tempoEstimado / metricas.tempoMedioExecucao : 0
    
    return {
      ...atividade,
      metricas,
      pontosDesempenho: pontos,
      eficiencia: Math.round(eficiencia * 10) / 10,
      consistencia: this.calcularConsistencia(atividade.historicoExecucoes || [])
    }
  }
  
  static atualizarMetricasProjeto(projeto: Projeto): Projeto {
    const metricas = this.calcularMetricasProjeto(projeto)
    const pontos = this.calcularPontosProjeto(projeto)
    const scorePerformance = this.calcularScoreProjetos([projeto])
    const tendencia = this.calcularTendencia([projeto])
    
    return {
      ...projeto,
      metricas,
      pontosDesempenho: pontos,
      scorePerformance: Math.round(scorePerformance * 10) / 10,
      tendencia
    }
  }
  
  private static calcularConsistencia(historico: HistoricoExecucao[]): number {
    if (historico.length < 2) return 0
    
    const qualidades = historico.map(h => h.qualidade)
    const media = qualidades.reduce((acc, q) => acc + q, 0) / qualidades.length
    const variacao = qualidades.reduce((acc, q) => acc + Math.pow(q - media, 2), 0) / qualidades.length
    
    // Converte variância para consistência (0-100%)
    return Math.round(Math.max(0, 100 - (variacao * 25)) * 10) / 10
  }
}
