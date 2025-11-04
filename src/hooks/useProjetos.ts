import { useState, useEffect } from 'react'
import { Projeto } from '../types'
import { projetosService } from '../services/projetosService'

export const useProjetos = (gerenciaId?: string) => {
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProjetos()
  }, [gerenciaId])

  const loadProjetos = async () => {
    try {
      setLoading(true)
      const data = gerenciaId 
        ? await projetosService.getByGerencia(gerenciaId)
        : await projetosService.getAll()
      setProjetos(data)
      setError(null)
    } catch (err) {
      setError('Erro ao carregar projetos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createProjeto = async (projeto: Omit<Projeto, 'id'>) => {
    try {
      const newProjeto = await projetosService.create(projeto)
      setProjetos([...projetos, newProjeto])
      return newProjeto
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  const updateProjeto = async (id: string, projeto: Partial<Projeto>) => {
    try {
      const updated = await projetosService.update(id, projeto)
      setProjetos(projetos.map(p => p.id === id ? updated : p))
      return updated
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  const deleteProjeto = async (id: string) => {
    try {
      await projetosService.delete(id)
      setProjetos(projetos.filter(p => p.id !== id))
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  const toggleFavorite = async (id: string) => {
    try {
      const updated = await projetosService.toggleFavorite(id)
      setProjetos(projetos.map(p => p.id === id ? updated : p))
      return updated
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  return { 
    projetos, 
    loading, 
    error, 
    reload: loadProjetos,
    createProjeto,
    updateProjeto,
    deleteProjeto,
    toggleFavorite
  }
}

