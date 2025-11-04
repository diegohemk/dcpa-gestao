import { useState, useEffect } from 'react'
import { Servidor } from '../types'
import { servidoresService } from '../services/servidoresService'

export const useServidores = (gerenciaId?: string) => {
  const [servidores, setServidores] = useState<Servidor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadServidores()
  }, [gerenciaId])

  const loadServidores = async () => {
    try {
      setLoading(true)
      const data = gerenciaId 
        ? await servidoresService.getByGerencia(gerenciaId)
        : await servidoresService.getAll()
      setServidores(data)
      setError(null)
    } catch (err) {
      setError('Erro ao carregar servidores')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createServidor = async (servidor: Omit<Servidor, 'id'>) => {
    try {
      const newServidor = await servidoresService.create(servidor)
      setServidores([...servidores, newServidor])
      return newServidor
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  const updateServidor = async (id: string, servidor: Partial<Servidor>) => {
    try {
      const updated = await servidoresService.update(id, servidor)
      setServidores(servidores.map(s => s.id === id ? updated : s))
      return updated
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  const deleteServidor = async (id: string) => {
    try {
      await servidoresService.delete(id)
      setServidores(servidores.filter(s => s.id !== id))
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  return { 
    servidores, 
    loading, 
    error, 
    reload: loadServidores,
    createServidor,
    updateServidor,
    deleteServidor
  }
}

