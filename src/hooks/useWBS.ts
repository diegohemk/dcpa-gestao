import { useState, useEffect, useCallback } from 'react'
import { 
  WBSItem, 
  Dependencia, 
  WBSTemplate, 
  EVMData, 
  EVMResumo, 
  CaminhoCritico, 
  AlocacaoRecurso
} from '../types'
import { wbsService, evmService, alocacaoService } from '../services/wbsEvmService'
import { useToast } from './useToast'

export const useWBS = (projetoId: string) => {
  const [wbs, setWbs] = useState<WBSItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

  const fetchWBS = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      // Em um sistema real, isso viria de uma consulta específica
      // Por enquanto, vamos simular dados
      const mockWBS: WBSItem[] = [
        {
          id: 'wbs_1',
          codigo: '1',
          nome: 'Projeto Principal',
          descricao: 'Projeto principal',
          nivel: 0,
          filhos: [
            {
              id: 'wbs_1_1',
              codigo: '1.1',
              nome: 'Fase 1: Planejamento',
              descricao: 'Fase de planejamento do projeto',
              nivel: 1,
              paiId: 'wbs_1',
              filhos: [
                {
                  id: 'wbs_1_1_1',
                  codigo: '1.1.1',
                  nome: 'Definição de Requisitos',
                  descricao: 'Levantamento e definição de requisitos',
                  nivel: 2,
                  paiId: 'wbs_1_1',
                  filhos: [],
                  responsavelId: 's1',
                  estimativaHoras: 40,
                  estimativaCusto: 2000,
                  status: 'em_andamento',
                  percentualCompleto: 60,
                  dataInicio: '2025-01-01',
                  dataFim: '2025-01-15',
                  dependencias: [],
                  riscos: [],
                  createdAt: '2025-01-01T00:00:00Z',
                  updatedAt: '2025-01-01T00:00:00Z'
                }
              ],
              responsavelId: 's1',
              estimativaHoras: 80,
              estimativaCusto: 4000,
              status: 'em_andamento',
              percentualCompleto: 30,
              dataInicio: '2025-01-01',
              dataFim: '2025-02-01',
              dependencias: [],
              riscos: [],
              createdAt: '2025-01-01T00:00:00Z',
              updatedAt: '2025-01-01T00:00:00Z'
            }
          ],
          responsavelId: 's1',
          estimativaHoras: 200,
          estimativaCusto: 10000,
          status: 'em_andamento',
          percentualCompleto: 15,
          dataInicio: '2025-01-01',
          dataFim: '2025-06-01',
          dependencias: [],
          riscos: [],
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z'
        }
      ]
      setWbs(mockWBS)
    } catch (err) {
      console.error('Erro ao buscar WBS:', err)
      setError('Erro ao carregar WBS.')
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível carregar a WBS.',
      })
    } finally {
      setLoading(false)
    }
  }, [projetoId, showToast])

  useEffect(() => {
    fetchWBS()
  }, [fetchWBS])

  const criarWBS = useCallback(async (wbsItems: WBSItem[]) => {
    try {
      const resultado = await wbsService.criarWBS(projetoId, wbsItems)
      setWbs(resultado)
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'WBS criada com sucesso!',
      })
      return resultado
    } catch (err) {
      console.error('Erro ao criar WBS:', err)
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível criar a WBS.',
      })
      throw err
    }
  }, [projetoId, showToast])

  const atualizarWBSItem = useCallback(async (wbsItem: WBSItem) => {
    try {
      const resultado = await wbsService.atualizarWBSItem(projetoId, wbsItem)
      await fetchWBS() // Recarregar WBS
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Item WBS atualizado com sucesso!',
      })
      return resultado
    } catch (err) {
      console.error('Erro ao atualizar item WBS:', err)
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível atualizar o item WBS.',
      })
      throw err
    }
  }, [projetoId, showToast, fetchWBS])

  const adicionarDependencia = useCallback(async (wbsItemId: string, dependencia: Omit<Dependencia, 'id'>) => {
    try {
      await wbsService.adicionarDependencia(projetoId, wbsItemId, dependencia)
      await fetchWBS() // Recarregar WBS
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Dependência adicionada com sucesso!',
      })
    } catch (err) {
      console.error('Erro ao adicionar dependência:', err)
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível adicionar a dependência.',
      })
      throw err
    }
  }, [projetoId, showToast, fetchWBS])

  const calcularCaminhoCritico = useCallback(async () => {
    try {
      const caminhoCritico = await wbsService.calcularCaminhoCritico(projetoId)
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Caminho crítico calculado com sucesso!',
      })
      return caminhoCritico
    } catch (err) {
      console.error('Erro ao calcular caminho crítico:', err)
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível calcular o caminho crítico.',
      })
      throw err
    }
  }, [projetoId, showToast])

  return {
    wbs,
    loading,
    error,
    fetchWBS,
    criarWBS,
    atualizarWBSItem,
    adicionarDependencia,
    calcularCaminhoCritico
  }
}

export const useEVM = (projetoId: string) => {
  const [evmData, setEvmData] = useState<EVMData | null>(null)
  const [evmResumo, setEvmResumo] = useState<EVMResumo | null>(null)
  const [historicoEVM, setHistoricoEVM] = useState<EVMData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

  const calcularEVM = useCallback(async (dataMedicao?: string) => {
    try {
      setLoading(true)
      const resultado = await evmService.calcularEVM(projetoId, dataMedicao)
      setEvmData(resultado)
      
      // Buscar resumo atualizado
      const resumo = await evmService.getResumoEVM(projetoId)
      setEvmResumo(resumo)
      
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Métricas EVM calculadas com sucesso!',
      })
      return resultado
    } catch (err) {
      console.error('Erro ao calcular EVM:', err)
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível calcular as métricas EVM.',
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [projetoId, showToast])

  const fetchHistoricoEVM = useCallback(async () => {
    try {
      const historico = await evmService.getHistoricoEVM(projetoId)
      setHistoricoEVM(historico)
    } catch (err) {
      console.error('Erro ao buscar histórico EVM:', err)
      setError('Erro ao carregar histórico EVM.')
    }
  }, [projetoId])

  const fetchResumoEVM = useCallback(async () => {
    try {
      const resumo = await evmService.getResumoEVM(projetoId)
      setEvmResumo(resumo)
    } catch (err) {
      console.error('Erro ao buscar resumo EVM:', err)
      setError('Erro ao carregar resumo EVM.')
    }
  }, [projetoId])

  useEffect(() => {
    fetchResumoEVM()
    fetchHistoricoEVM()
  }, [fetchResumoEVM, fetchHistoricoEVM])

  return {
    evmData,
    evmResumo,
    historicoEVM,
    loading,
    error,
    calcularEVM,
    fetchHistoricoEVM,
    fetchResumoEVM
  }
}

export const useAlocacaoRecursos = (projetoId?: string) => {
  const [alocacoes, setAlocacoes] = useState<AlocacaoRecurso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

  const fetchAlocacoes = useCallback(async () => {
    if (!projetoId) return
    
    try {
      setLoading(true)
      const resultado = await alocacaoService.getAlocacoesProjeto(projetoId)
      setAlocacoes(resultado)
    } catch (err) {
      console.error('Erro ao buscar alocações:', err)
      setError('Erro ao carregar alocações.')
    } finally {
      setLoading(false)
    }
  }, [projetoId])

  const criarAlocacao = useCallback(async (alocacao: Omit<AlocacaoRecurso, 'id'>) => {
    try {
      const resultado = await alocacaoService.criarAlocacao(alocacao)
      await fetchAlocacoes()
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Alocação criada com sucesso!',
      })
      return resultado
    } catch (err) {
      console.error('Erro ao criar alocação:', err)
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível criar a alocação.',
      })
      throw err
    }
  }, [showToast, fetchAlocacoes])

  const verificarSobrecarga = useCallback(async (servidorId: string, dataInicio: string, dataFim: string) => {
    try {
      const resultado = await alocacaoService.verificarSobrecarga(servidorId, dataInicio, dataFim)
      return resultado
    } catch (err) {
      console.error('Erro ao verificar sobrecarga:', err)
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível verificar a sobrecarga.',
      })
      throw err
    }
  }, [showToast])

  useEffect(() => {
    fetchAlocacoes()
  }, [fetchAlocacoes])

  return {
    alocacoes,
    loading,
    error,
    fetchAlocacoes,
    criarAlocacao,
    verificarSobrecarga
  }
}

export const useWBSTemplates = () => {
  const [templates, setTemplates] = useState<WBSTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true)
      const resultado = await wbsService.getTemplates()
      setTemplates(resultado)
    } catch (err) {
      console.error('Erro ao buscar templates:', err)
      setError('Erro ao carregar templates.')
    } finally {
      setLoading(false)
    }
  }, [])

  const criarTemplate = useCallback(async (template: Omit<WBSTemplate, 'id' | 'createdAt'>) => {
    try {
      const resultado = await wbsService.criarTemplate(template)
      await fetchTemplates()
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Template criado com sucesso!',
      })
      return resultado
    } catch (err) {
      console.error('Erro ao criar template:', err)
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível criar o template.',
      })
      throw err
    }
  }, [showToast, fetchTemplates])

  const aplicarTemplate = useCallback(async (projetoId: string, templateId: string) => {
    try {
      const resultado = await wbsService.aplicarTemplate(projetoId, templateId)
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Template aplicado com sucesso!',
      })
      return resultado
    } catch (err) {
      console.error('Erro ao aplicar template:', err)
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível aplicar o template.',
      })
      throw err
    }
  }, [showToast])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  return {
    templates,
    loading,
    error,
    fetchTemplates,
    criarTemplate,
    aplicarTemplate
  }
}
