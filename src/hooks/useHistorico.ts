import { useState, useEffect, useCallback } from 'react'
import { HistoricoAlteracao } from '../types'
import { historicoService } from '../services/historicoService'

interface UseHistoricoProps {
  entidadeTipo: 'atividade' | 'projeto' | 'servidor' | 'gerencia'
  entidadeId: string
}

interface UseHistoricoReturn {
  historico: HistoricoAlteracao[]
  loading: boolean
  error: string | null
  reload: () => Promise<void>
  getByAction: (acao: 'criou' | 'atualizou' | 'excluiu' | 'comentou') => Promise<HistoricoAlteracao[]>
  getByPeriod: (startDate: string, endDate: string) => Promise<HistoricoAlteracao[]>
}

export const useHistorico = ({ entidadeTipo, entidadeId }: UseHistoricoProps): UseHistoricoReturn => {
  const [historico, setHistorico] = useState<HistoricoAlteracao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadHistorico = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await historicoService.getByEntity(entidadeTipo, entidadeId)
      setHistorico(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar histórico')
    } finally {
      setLoading(false)
    }
  }, [entidadeTipo, entidadeId])

  const getByAction = useCallback(async (acao: 'criou' | 'atualizou' | 'excluiu' | 'comentou') => {
    try {
      setError(null)
      return await historicoService.getByAction(entidadeTipo, entidadeId, acao)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao filtrar histórico')
      throw err
    }
  }, [entidadeTipo, entidadeId])

  const getByPeriod = useCallback(async (startDate: string, endDate: string) => {
    try {
      setError(null)
      return await historicoService.getByPeriod(entidadeTipo, entidadeId, startDate, endDate)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao filtrar histórico por período')
      throw err
    }
  }, [entidadeTipo, entidadeId])

  const reload = useCallback(async () => {
    await loadHistorico()
  }, [loadHistorico])

  useEffect(() => {
    loadHistorico()
  }, [loadHistorico])

  return {
    historico,
    loading,
    error,
    reload,
    getByAction,
    getByPeriod
  }
}

// Hook para histórico global (todas as entidades)
export const useHistoricoGlobal = (limit: number = 50) => {
  const [historico, setHistorico] = useState<HistoricoAlteracao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadHistorico = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await historicoService.getGlobal(limit)
      setHistorico(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar histórico global')
    } finally {
      setLoading(false)
    }
  }, [limit])

  const reload = useCallback(async () => {
    await loadHistorico()
  }, [loadHistorico])

  useEffect(() => {
    loadHistorico()
  }, [loadHistorico])

  return {
    historico,
    loading,
    error,
    reload
  }
}
