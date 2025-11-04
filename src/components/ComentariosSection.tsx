import { useState } from 'react'
import { MessageCircle, Send, Loader } from 'lucide-react'
import { useComentarios } from '../hooks/useComentarios'
import { useToast } from '../hooks/useToast'
import ComentarioCard from './ComentarioCard'

interface ComentariosSectionProps {
  atividadeId?: string
  projetoId?: string
  autorId: string
  canEdit?: boolean
}

const ComentariosSection = ({ 
  atividadeId, 
  projetoId, 
  autorId, 
  canEdit = true 
}: ComentariosSectionProps) => {
  const [novoComentario, setNovoComentario] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { comentarios, loading, createComentario, updateComentario, deleteComentario, count } = useComentarios({
    atividadeId,
    projetoId
  })
  
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!novoComentario.trim()) return

    if (!autorId) {
      showToast({
        type: 'error',
        title: 'Erro ao adicionar comentário',
        message: 'Não foi possível identificar o autor do comentário.'
      })
      return
    }

    try {
      setIsSubmitting(true)
      await createComentario(novoComentario.trim(), autorId)
      setNovoComentario('')
      showToast({
        type: 'success',
        title: 'Comentário adicionado!',
        message: 'Seu comentário foi publicado com sucesso.'
      })
    } catch (error) {
      console.error('Erro ao criar comentário:', error)
      showToast({
        type: 'error',
        title: 'Erro ao adicionar comentário',
        message: error instanceof Error ? error.message : 'Tente novamente em alguns instantes.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async (id: string, conteudo: string) => {
    try {
      await updateComentario(id, conteudo)
      showToast({
        type: 'success',
        title: 'Comentário atualizado!',
        message: 'As alterações foram salvas.'
      })
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Erro ao atualizar comentário',
        message: 'Tente novamente em alguns instantes.'
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteComentario(id)
      showToast({
        type: 'success',
        title: 'Comentário excluído!',
        message: 'O comentário foi removido.'
      })
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Erro ao excluir comentário',
        message: 'Tente novamente em alguns instantes.'
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="w-6 h-6 animate-spin text-primary-600" />
        <span className="ml-2 text-gray-600">Carregando comentários...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Comentários
          </h3>
          <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
            {count}
          </span>
        </div>
      </div>

      {/* Formulário de novo comentário */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="bg-gray-50 rounded-lg p-4">
          <textarea
            value={novoComentario}
            onChange={(e) => setNovoComentario(e.target.value)}
            placeholder="Adicione um comentário... (use @nome para mencionar alguém)"
            className="w-full bg-transparent border-none outline-none resize-none text-sm text-gray-700 placeholder-gray-500"
            rows={3}
            disabled={isSubmitting}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!novoComentario.trim() || isSubmitting}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader className="w-4 h-4 animate-spin mr-2" />
                Publicando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Comentar
              </>
            )}
          </button>
        </div>
      </form>

      {/* Lista de comentários */}
      <div className="space-y-3">
        {comentarios.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Nenhum comentário ainda.</p>
            <p className="text-xs text-gray-400">Seja o primeiro a comentar!</p>
          </div>
        ) : (
          comentarios.map((comentario) => (
            <ComentarioCard
              key={comentario.id}
              comentario={comentario}
              onEdit={handleEdit}
              onDelete={handleDelete}
              canEdit={canEdit && comentario.autorId === autorId}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default ComentariosSection
