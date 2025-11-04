import { useState, useEffect, useCallback } from 'react'
import { Curso } from '../types'
import { cursosService } from '../services/cursosService'

interface UseCursosReturn {
  cursos: Curso[]
  loading: boolean
  error: string | null
  createCurso: (curso: Omit<Curso, 'id' | 'createdAt' | 'updatedAt' | 'gerencia'>) => Promise<void>
  updateCurso: (id: string, updates: Partial<Curso>) => Promise<void>
  deleteCurso: (id: string) => Promise<void>
  reload: () => Promise<void>
  getByStatus: (status: string) => Promise<Curso[]>
  getByTipo: (tipo: string) => Promise<Curso[]>
  getByMinistrado: (ministrado: boolean) => Promise<Curso[]>
  countByStatus: () => Promise<Record<string, number>>
  countByMinistrado: () => Promise<{ ministrados: number; naoMinistrados: number }>
}

export const useCursos = (): UseCursosReturn => {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCursos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await cursosService.getAll()
      setCursos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar cursos')
    } finally {
      setLoading(false)
    }
  }, [])

  const createCurso = useCallback(async (curso: Omit<Curso, 'id' | 'createdAt' | 'updatedAt' | 'gerencia'>) => {
    try {
      setError(null)
      const novoCurso = await cursosService.create({
        nome: curso.nome,
        descricao: curso.descricao,
        ministrado: curso.ministrado,
        dataInicio: curso.dataInicio,
        dataFim: curso.dataFim,
        cargaHoraria: curso.cargaHoraria,
        gerenciaId: curso.gerenciaId,
        participantes: curso.participantes,
        status: curso.status,
        tipo: curso.tipo,
        modalidade: curso.modalidade,
        local: curso.local,
        observacoes: curso.observacoes,
        documentos: curso.documentos
      })
      setCursos(prev => [novoCurso, ...prev])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar curso')
      throw err
    }
  }, [])

  const updateCurso = useCallback(async (id: string, updates: Partial<Curso>) => {
    try {
      setError(null)
      const cursoAtualizado = await cursosService.update(id, updates)
      setCursos(prev => 
        prev.map(curso => 
          curso.id === id ? cursoAtualizado : curso
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar curso')
      throw err
    }
  }, [])

  const deleteCurso = useCallback(async (id: string) => {
    try {
      setError(null)
      await cursosService.delete(id)
      setCursos(prev => prev.filter(curso => curso.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir curso')
      throw err
    }
  }, [])

  const getByStatus = useCallback(async (status: string) => {
    try {
      setError(null)
      return await cursosService.getByStatus(status)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao filtrar cursos por status')
      throw err
    }
  }, [])

  const getByTipo = useCallback(async (tipo: string) => {
    try {
      setError(null)
      return await cursosService.getByTipo(tipo)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao filtrar cursos por tipo')
      throw err
    }
  }, [])

  const getByMinistrado = useCallback(async (ministrado: boolean) => {
    try {
      setError(null)
      return await cursosService.getByMinistrado(ministrado)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao filtrar cursos por ministrado')
      throw err
    }
  }, [])

  const countByStatus = useCallback(async () => {
    try {
      setError(null)
      return await cursosService.countByStatus()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao contar cursos por status')
      throw err
    }
  }, [])

  const countByMinistrado = useCallback(async () => {
    try {
      setError(null)
      return await cursosService.countByMinistrado()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao contar cursos ministrados')
      throw err
    }
  }, [])

  const reload = useCallback(async () => {
    await loadCursos()
  }, [loadCursos])

  useEffect(() => {
    loadCursos()
  }, [loadCursos])

  return {
    cursos,
    loading,
    error,
    createCurso,
    updateCurso,
    deleteCurso,
    reload,
    getByStatus,
    getByTipo,
    getByMinistrado,
    countByStatus,
    countByMinistrado
  }
}
