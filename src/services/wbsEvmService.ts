import { supabase } from '../lib/supabase'
import { 
  WBSItem, 
  Dependencia, 
  WBSTemplate, 
  EVMData, 
  EVMResumo, 
  CaminhoCritico, 
  AlocacaoRecurso,
  Projeto
} from '../types'

export const wbsService = {
  
  // ===== WBS MANAGEMENT =====
  
  async criarWBS(projetoId: string, wbsItems: WBSItem[]): Promise<WBSItem[]> {
    const { data, error } = await supabase
      .from('projetos')
      .update({ 
        wbs: wbsItems,
        updated_at: new Date().toISOString()
      })
      .eq('id', projetoId)
      .select('wbs')
      .single()

    if (error) throw error
    return data.wbs || []
  },

  async atualizarWBSItem(projetoId: string, wbsItem: WBSItem): Promise<WBSItem> {
    // Buscar WBS atual
    const { data: projetoData, error: fetchError } = await supabase
      .from('projetos')
      .select('wbs')
      .eq('id', projetoId)
      .single()

    if (fetchError) throw fetchError

    const wbsAtual = projetoData.wbs || []
    
    // Atualizar item específico
    const atualizarItem = (items: WBSItem[]): WBSItem[] => {
      return items.map(item => {
        if (item.id === wbsItem.id) {
          return { ...item, ...wbsItem, updatedAt: new Date().toISOString() }
        }
        if (item.filhos.length > 0) {
          return { ...item, filhos: atualizarItem(item.filhos) }
        }
        return item
      })
    }

    const wbsAtualizado = atualizarItem(wbsAtual)

    // Salvar no banco
    const { data, error } = await supabase
      .from('projetos')
      .update({ 
        wbs: wbsAtualizado,
        updated_at: new Date().toISOString()
      })
      .eq('id', projetoId)
      .select('wbs')
      .single()

    if (error) throw error
    return wbsItem
  },

  async adicionarDependencia(projetoId: string, wbsItemId: string, dependencia: Omit<Dependencia, 'id'>): Promise<void> {
    const { data: projetoData, error: fetchError } = await supabase
      .from('projetos')
      .select('wbs')
      .eq('id', projetoId)
      .single()

    if (fetchError) throw fetchError

    const wbsAtual = projetoData.wbs || []
    
    const adicionarDependencia = (items: WBSItem[]): WBSItem[] => {
      return items.map(item => {
        if (item.id === wbsItemId) {
          const novaDependencia: Dependencia = {
            ...dependencia,
            id: `dep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          }
          return { 
            ...item, 
            dependencias: [...item.dependencias, novaDependencia],
            updatedAt: new Date().toISOString()
          }
        }
        if (item.filhos.length > 0) {
          return { ...item, filhos: adicionarDependencia(item.filhos) }
        }
        return item
      })
    }

    const wbsAtualizado = adicionarDependencia(wbsAtual)

    const { error } = await supabase
      .from('projetos')
      .update({ 
        wbs: wbsAtualizado,
        updated_at: new Date().toISOString()
      })
      .eq('id', projetoId)

    if (error) throw error
  },

  async calcularCaminhoCritico(projetoId: string): Promise<CaminhoCritico> {
    const { data: projetoData, error } = await supabase
      .from('projetos')
      .select('wbs')
      .eq('id', projetoId)
      .single()

    if (error) throw error

    const wbs = projetoData.wbs || []
    const caminhoCritico = this.calcularCaminhoCriticoRecursivo(wbs)

    // Salvar caminho crítico no projeto
    await supabase
      .from('projetos')
      .update({ 
        caminho_critico: caminhoCritico,
        updated_at: new Date().toISOString()
      })
      .eq('id', projetoId)

    return caminhoCritico
  },

  calcularCaminhoCriticoRecursivo(wbsItems: WBSItem[]): CaminhoCritico {
    // Algoritmo simplificado para calcular caminho crítico
    const tarefasCriticas: string[] = []
    let duracaoTotal = 0

    const processarItem = (item: WBSItem, duracaoAcumulada: number = 0) => {
      if (item.nivel >= 3) { // Tarefas de nível 3 ou superior
        const duracaoItem = this.calcularDuracaoItem(item)
        const novaDuracao = duracaoAcumulada + duracaoItem
        
        if (novaDuracao > duracaoTotal) {
          duracaoTotal = novaDuracao
          tarefasCriticas.push(item.id)
        }
      }

      item.filhos.forEach(filho => {
        processarItem(filho, duracaoAcumulada)
      })
    }

    wbsItems.forEach(item => processarItem(item))

    return {
      projetoId: '',
      tarefasCriticas,
      duracaoTotal,
      margemTotal: 0,
      atualizadoEm: new Date().toISOString()
    }
  },

  calcularDuracaoItem(item: WBSItem): number {
    if (item.dataInicio && item.dataFim) {
      const inicio = new Date(item.dataInicio)
      const fim = new Date(item.dataFim)
      return Math.ceil((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24))
    }
    return item.estimativaHoras / 8 // Assumindo 8 horas por dia
  },

  // ===== TEMPLATES =====
  
  async getTemplates(): Promise<WBSTemplate[]> {
    const { data, error } = await supabase
      .from('wbs_templates')
      .select('*')
      .order('nome')

    if (error) throw error
    return data || []
  },

  async criarTemplate(template: Omit<WBSTemplate, 'id' | 'createdAt'>): Promise<WBSTemplate> {
    const novoTemplate: WBSTemplate = {
      ...template,
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('wbs_templates')
      .insert(novoTemplate)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async aplicarTemplate(projetoId: string, templateId: string): Promise<WBSItem[]> {
    const { data: template, error: templateError } = await supabase
      .from('wbs_templates')
      .select('estrutura')
      .eq('id', templateId)
      .single()

    if (templateError) throw templateError

    // Adaptar template para o projeto específico
    const wbsAdaptado = this.adaptarTemplateParaProjeto(template.estrutura, projetoId)

    return this.criarWBS(projetoId, wbsAdaptado)
  },

  adaptarTemplateParaProjeto(template: WBSItem[], projetoId: string): WBSItem[] {
    const adaptarItem = (item: WBSItem): WBSItem => ({
      ...item,
      id: `wbs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      filhos: item.filhos.map(adaptarItem),
      dependencias: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    return template.map(adaptarItem)
  }
}

export const evmService = {
  
  // ===== EVM CALCULATIONS =====
  
  async calcularEVM(projetoId: string, dataMedicao?: string): Promise<EVMData> {
    const data = dataMedicao || new Date().toISOString()
    
    // Buscar dados do projeto
    const { data: projetoData, error: projetoError } = await supabase
      .from('projetos')
      .select('*')
      .eq('id', projetoId)
      .single()

    if (projetoError) throw projetoError

    const projeto = projetoData as Projeto
    const wbs = projeto.wbs || []

    // Calcular métricas EVM
    const pv = this.calcularPV(wbs, data)
    const ev = this.calcularEV(wbs, data)
    const ac = this.calcularAC(wbs, data)
    
    const spi = ev > 0 ? ev / pv : 0
    const cpi = ev > 0 ? ev / ac : 0
    const sv = ev - pv
    const cv = ev - ac
    
    const bac = projeto.orcamento || 0
    const eac = cpi > 0 ? bac / cpi : bac
    const etc = eac - ac
    const vac = bac - eac

    const evmData: EVMData = {
      id: `evm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      projetoId,
      dataMedicao: data,
      pv,
      ev,
      ac,
      spi,
      cpi,
      sv,
      cv,
      eac,
      etc,
      vac,
      bac,
      createdAt: new Date().toISOString()
    }

    // Salvar dados EVM
    const { error: saveError } = await supabase
      .from('evm_data')
      .insert(evmData)

    if (saveError) throw saveError

    // Atualizar resumo no projeto
    await this.atualizarResumoEVM(projetoId, evmData)

    return evmData
  },

  calcularPV(wbs: WBSItem[], dataMedicao: string): number {
    const data = new Date(dataMedicao)
    let pv = 0

    const processarItem = (item: WBSItem) => {
      if (item.dataInicio && item.dataFim) {
        const inicio = new Date(item.dataInicio)
        const fim = new Date(item.dataFim)
        
        if (data >= inicio && data <= fim) {
          // Calcular percentual do tempo decorrido
          const duracaoTotal = fim.getTime() - inicio.getTime()
          const tempoDecorrido = data.getTime() - inicio.getTime()
          const percentualTempo = Math.min(tempoDecorrido / duracaoTotal, 1)
          
          pv += item.estimativaCusto * percentualTempo
        } else if (data > fim) {
          pv += item.estimativaCusto
        }
      }
      
      item.filhos.forEach(processarItem)
    }

    wbs.forEach(processarItem)
    return pv
  },

  calcularEV(wbs: WBSItem[], dataMedicao: string): number {
    let ev = 0

    const processarItem = (item: WBSItem) => {
      ev += item.estimativaCusto * (item.percentualCompleto / 100)
      item.filhos.forEach(processarItem)
    }

    wbs.forEach(processarItem)
    return ev
  },

  calcularAC(wbs: WBSItem[], dataMedicao: string): number {
    let ac = 0

    const processarItem = (item: WBSItem) => {
      ac += item.custoReal || 0
      item.filhos.forEach(processarItem)
    }

    wbs.forEach(processarItem)
    return ac
  },

  async atualizarResumoEVM(projetoId: string, evmData: EVMData): Promise<void> {
    const statusGeral = this.determinarStatusGeral(evmData.spi, evmData.cpi)
    const tendencia = await this.calcularTendencia(projetoId)

    const resumo: EVMResumo = {
      projetoId,
      dataUltimaMedicao: evmData.dataMedicao,
      pvAtual: evmData.pv,
      evAtual: evmData.ev,
      acAtual: evmData.ac,
      spiAtual: evmData.spi,
      cpiAtual: evmData.cpi,
      svAtual: evmData.sv,
      cvAtual: evmData.cv,
      eacProjetado: evmData.eac,
      etcProjetado: evmData.etc,
      vacProjetado: evmData.vac,
      statusGeral,
      tendencia
    }

    await supabase
      .from('projetos')
      .update({ 
        evm_resumo: resumo,
        updated_at: new Date().toISOString()
      })
      .eq('id', projetoId)
  },

  determinarStatusGeral(spi: number, cpi: number): 'excelente' | 'bom' | 'atencao' | 'critico' {
    if (spi >= 1.0 && cpi >= 1.0) return 'excelente'
    if (spi >= 0.95 && cpi >= 0.95) return 'bom'
    if (spi >= 0.85 && cpi >= 0.85) return 'atencao'
    return 'critico'
  },

  async calcularTendencia(projetoId: string): Promise<'melhorando' | 'estavel' | 'piorando'> {
    const { data, error } = await supabase
      .from('evm_data')
      .select('spi, cpi')
      .eq('projeto_id', projetoId)
      .order('data_medicao', { ascending: false })
      .limit(3)

    if (error || !data || data.length < 2) return 'estavel'

    const ultimo = data[0]
    const anterior = data[1]

    const variacaoSPI = ultimo.spi - anterior.spi
    const variacaoCPI = ultimo.cpi - anterior.cpi

    if (variacaoSPI > 0.05 && variacaoCPI > 0.05) return 'melhorando'
    if (variacaoSPI < -0.05 || variacaoCPI < -0.05) return 'piorando'
    return 'estavel'
  },

  // ===== HISTÓRICO EVM =====
  
  async getHistoricoEVM(projetoId: string): Promise<EVMData[]> {
    const { data, error } = await supabase
      .from('evm_data')
      .select('*')
      .eq('projeto_id', projetoId)
      .order('data_medicao', { ascending: true })

    if (error) throw error
    return data || []
  },

  async getResumoEVM(projetoId: string): Promise<EVMResumo | null> {
    const { data, error } = await supabase
      .from('projetos')
      .select('evm_resumo')
      .eq('id', projetoId)
      .single()

    if (error) throw error
    return data.evm_resumo
  }
}

export const alocacaoService = {
  
  // ===== GESTÃO DE ALOCAÇÃO =====
  
  async criarAlocacao(alocacao: Omit<AlocacaoRecurso, 'id'>): Promise<AlocacaoRecurso> {
    const novaAlocacao: AlocacaoRecurso = {
      ...alocacao,
      id: `alloc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    const { data, error } = await supabase
      .from('alocacoes_recursos')
      .insert(novaAlocacao)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getAlocacoesProjeto(projetoId: string): Promise<AlocacaoRecurso[]> {
    const { data, error } = await supabase
      .from('alocacoes_recursos')
      .select('*')
      .eq('projeto_id', projetoId)
      .order('data_inicio')

    if (error) throw error
    return data || []
  },

  async getAlocacoesServidor(servidorId: string, dataInicio?: string, dataFim?: string): Promise<AlocacaoRecurso[]> {
    let query = supabase
      .from('alocacoes_recursos')
      .select('*')
      .eq('servidor_id', servidorId)

    if (dataInicio) {
      query = query.gte('data_inicio', dataInicio)
    }
    if (dataFim) {
      query = query.lte('data_fim', dataFim)
    }

    const { data, error } = await query.order('data_inicio')

    if (error) throw error
    return data || []
  },

  async verificarSobrecarga(servidorId: string, dataInicio: string, dataFim: string): Promise<{
    sobrecarga: boolean
    percentualTotal: number
    conflitos: AlocacaoRecurso[]
  }> {
    const alocacoes = await this.getAlocacoesServidor(servidorId, dataInicio, dataFim)
    
    let percentualTotal = 0
    const conflitos: AlocacaoRecurso[] = []

    alocacoes.forEach(alocacao => {
      percentualTotal += alocacao.percentualAlocacao
      if (percentualTotal > 100) {
        conflitos.push(alocacao)
      }
    })

    return {
      sobrecarga: percentualTotal > 100,
      percentualTotal,
      conflitos
    }
  }
}
