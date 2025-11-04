import { useState, useEffect, useCallback } from 'react'
import { 
  DashboardDesempenho, 
  Atividade, 
  Projeto,
  FatorComplexidadeAtividade,
  FatorComplexidadeProjeto,
  HistoricoExecucao
} from '../types'
import { desempenhoService } from '../services/desempenhoService'
import { useToast } from './useToast'

export const useDesempenho = (gerenciaId?: string) => {
  const [dashboard, setDashboard] = useState<DashboardDesempenho | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await desempenhoService.getDashboardDesempenho(gerenciaId)
      setDashboard(data)
    } catch (err) {
      console.error('Erro ao buscar dashboard de desempenho:', err)
      setError('Erro ao carregar dashboard de desempenho.')
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível carregar o dashboard de desempenho.',
      })
    } finally {
      setLoading(false)
    }
  }, [gerenciaId, showToast])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  const atualizarFatorComplexidadeAtividade = useCallback(async (
    atividadeId: string, 
    fatorComplexidade: FatorComplexidadeAtividade
  ) => {
    try {
      const atividade = await desempenhoService.atualizarFatorComplexidadeAtividade(
        atividadeId, 
        fatorComplexidade
      )
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Fator de complexidade atualizado com sucesso!',
      })
      return atividade
    } catch (err) {
      console.error('Erro ao atualizar fator de complexidade:', err)
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível atualizar o fator de complexidade.',
      })
      throw err
    }
  }, [showToast])

  const registrarExecucaoAtividade = useCallback(async (
    atividadeId: string, 
    execucao: Omit<HistoricoExecucao, 'data'>
  ) => {
    try {
      const atividade = await desempenhoService.registrarExecucaoAtividade(
        atividadeId, 
        execucao
      )
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Execução registrada com sucesso!',
      })
      return atividade
    } catch (err) {
      console.error('Erro ao registrar execução:', err)
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível registrar a execução.',
      })
      throw err
    }
  }, [showToast])

  const avaliarQualidadeAtividade = useCallback(async (
    atividadeId: string, 
    qualidade: number
  ) => {
    try {
      const atividade = await desempenhoService.avaliarQualidadeAtividade(
        atividadeId, 
        qualidade
      )
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Qualidade avaliada com sucesso!',
      })
      return atividade
    } catch (err) {
      console.error('Erro ao avaliar qualidade:', err)
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível avaliar a qualidade.',
      })
      throw err
    }
  }, [showToast])

  const atualizarFatorComplexidadeProjeto = useCallback(async (
    projetoId: string, 
    fatorComplexidade: FatorComplexidadeProjeto
  ) => {
    try {
      const projeto = await desempenhoService.atualizarFatorComplexidadeProjeto(
        projetoId, 
        fatorComplexidade
      )
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Fator de complexidade atualizado com sucesso!',
      })
      return projeto
    } catch (err) {
      console.error('Erro ao atualizar fator de complexidade:', err)
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível atualizar o fator de complexidade.',
      })
      throw err
    }
  }, [showToast])

  const avaliarQualidadeProjeto = useCallback(async (
    projetoId: string, 
    qualidade: number
  ) => {
    try {
      const projeto = await desempenhoService.avaliarQualidadeProjeto(
        projetoId, 
        qualidade
      )
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Qualidade avaliada com sucesso!',
      })
      return projeto
    } catch (err) {
      console.error('Erro ao avaliar qualidade:', err)
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível avaliar a qualidade.',
      })
      throw err
    }
  }, [showToast])

  const avaliarSatisfacaoEquipe = useCallback(async (
    projetoId: string, 
    satisfacao: number
  ) => {
    try {
      const projeto = await desempenhoService.avaliarSatisfacaoEquipe(
        projetoId, 
        satisfacao
      )
      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Satisfação da equipe avaliada com sucesso!',
      })
      return projeto
    } catch (err) {
      console.error('Erro ao avaliar satisfação:', err)
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível avaliar a satisfação da equipe.',
      })
      throw err
    }
  }, [showToast])

  return {
    dashboard,
    loading,
    error,
    fetchDashboard,
    atualizarFatorComplexidadeAtividade,
    registrarExecucaoAtividade,
    avaliarQualidadeAtividade,
    atualizarFatorComplexidadeProjeto,
    avaliarQualidadeProjeto,
    avaliarSatisfacaoEquipe
  }
}

// Hook para relatórios
export const useRelatorioDesempenho = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

  const gerarRelatorioMensal = useCallback(async (
    gerenciaId?: string, 
    mes?: number, 
    ano?: number
  ) => {
    try {
      setLoading(true)
      setError(null)
      const relatorio = await desempenhoService.getRelatorioMensal(gerenciaId, mes, ano)
      return relatorio
    } catch (err) {
      console.error('Erro ao gerar relatório:', err)
      setError('Erro ao gerar relatório.')
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível gerar o relatório.',
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [showToast])

  return {
    loading,
    error,
    gerarRelatorioMensal
  }
}
