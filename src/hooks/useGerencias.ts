import { useState, useEffect } from 'react'
import { Gerencia } from '../types'
import { gerenciasService } from '../services/gerenciasService'

export const useGerencias = () => {
  const [gerencias, setGerencias] = useState<Gerencia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadGerencias()
  }, [])

  const loadGerencias = async () => {
    try {
      setLoading(true)
      const data = await gerenciasService.getAll()
      setGerencias(data)
      setError(null)
    } catch (err) {
      setError('Erro ao carregar gerências')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createGerencia = async (gerencia: Omit<Gerencia, 'id'>): Promise<Gerencia> => {
    try {
      const novaGerencia = await gerenciasService.create(gerencia)
      await loadGerencias()
      return novaGerencia
    } catch (err) {
      console.error('Erro ao criar gerência:', err)
      throw err
    }
  }

  const updateGerencia = async (id: string, gerencia: Partial<Omit<Gerencia, 'id'>>): Promise<Gerencia> => {
    try {
      const gerenciaAtualizada = await gerenciasService.update(id, gerencia)
      await loadGerencias()
      return gerenciaAtualizada
    } catch (err) {
      console.error('Erro ao atualizar gerência:', err)
      throw err
    }
  }

  const deleteGerencia = async (id: string): Promise<void> => {
    try {
      await gerenciasService.delete(id)
      await loadGerencias()
    } catch (err) {
      console.error('Erro ao deletar gerência:', err)
      throw err
    }
  }

  return { 
    gerencias, 
    loading, 
    error, 
    reload: loadGerencias,
    createGerencia,
    updateGerencia,
    deleteGerencia
  }
}

