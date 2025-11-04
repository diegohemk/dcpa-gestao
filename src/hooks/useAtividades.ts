import { useState, useEffect } from 'react'
import { Atividade } from '../types'
import { atividadesService } from '../services/atividadesService'

export const useAtividades = (gerenciaId?: string) => {
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAtividades()
  }, [gerenciaId])

  const loadAtividades = async () => {
    try {
      setLoading(true)
      const data = gerenciaId 
        ? await atividadesService.getByGerencia(gerenciaId)
        : await atividadesService.getAll()
      setAtividades(data)
      setError(null)
    } catch (err) {
      setError('Erro ao carregar atividades')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createAtividade = async (atividade: Omit<Atividade, 'id'>) => {
    try {
      const newAtividade = await atividadesService.create(atividade)
      setAtividades([newAtividade, ...atividades])
      return newAtividade
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  const updateAtividade = async (id: string, atividade: Partial<Atividade>) => {
    try {
      const updated = await atividadesService.update(id, atividade)
      setAtividades(atividades.map(a => a.id === id ? updated : a))
      return updated
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  const deleteAtividade = async (id: string) => {
    try {
      await atividadesService.delete(id)
      setAtividades(atividades.filter(a => a.id !== id))
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  return { 
    atividades, 
    loading, 
    error, 
    reload: loadAtividades,
    createAtividade,
    updateAtividade,
    deleteAtividade
  }
}

