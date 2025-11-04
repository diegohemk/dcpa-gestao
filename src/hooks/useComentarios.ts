import { useState, useEffect, useCallback } from 'react'
import { Comentario } from '../types'
import { comentariosService } from '../services/comentariosService'

interface UseComentariosProps {
  atividadeId?: string
  projetoId?: string
}

interface UseComentariosReturn {
  comentarios: Comentario[]
  loading: boolean
  error: string | null
  createComentario: (conteudo: string, autorId: string) => Promise<void>
  updateComentario: (id: string, conteudo: string) => Promise<void>
  deleteComentario: (id: string) => Promise<void>
  reload: () => Promise<void>
  count: number
}

export const useComentarios = ({ atividadeId, projetoId }: UseComentariosProps): UseComentariosReturn => {
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [count, setCount] = useState(0)

  const loadComentarios = useCallback(async () => {
    if (!atividadeId && !projetoId) return

    try {
      setLoading(true)
      setError(null)

      let data: Comentario[]
      if (atividadeId) {
        data = await comentariosService.getByAtividade(atividadeId)
      } else {
        data = await comentariosService.getByProjeto(projetoId!)
      }

      setComentarios(data)
      setCount(data.length)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar comentários')
    } finally {
      setLoading(false)
    }
  }, [atividadeId, projetoId])

  const createComentario = useCallback(async (conteudo: string, autorId: string) => {
    try {
      setError(null)
      
      const novoComentario = await comentariosService.create({
        conteudo,
        autorId,
        atividadeId,
        projetoId
      })

      setComentarios(prev => [novoComentario, ...prev])
      setCount(prev => prev + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar comentário')
      throw err
    }
  }, [atividadeId, projetoId])

  const updateComentario = useCallback(async (id: string, conteudo: string) => {
    try {
      setError(null)
      
      const comentarioAtualizado = await comentariosService.update(id, conteudo)
      
      setComentarios(prev => 
        prev.map(comentario => 
          comentario.id === id ? comentarioAtualizado : comentario
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar comentário')
      throw err
    }
  }, [])

  const deleteComentario = useCallback(async (id: string) => {
    try {
      setError(null)
      
      await comentariosService.delete(id)
      
      setComentarios(prev => prev.filter(comentario => comentario.id !== id))
      setCount(prev => prev - 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir comentário')
      throw err
    }
  }, [])

  const reload = useCallback(async () => {
    await loadComentarios()
  }, [loadComentarios])

  useEffect(() => {
    loadComentarios()
  }, [loadComentarios])

  return {
    comentarios,
    loading,
    error,
    createComentario,
    updateComentario,
    deleteComentario,
    reload,
    count
  }
}
