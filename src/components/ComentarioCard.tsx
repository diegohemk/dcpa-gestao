import { useState } from 'react'
import { MessageCircle, Send, Edit2, Trash2, MoreVertical } from 'lucide-react'
import { Comentario } from '../types'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ComentarioCardProps {
  comentario: Comentario
  onEdit: (id: string, conteudo: string) => void
  onDelete: (id: string) => void
  canEdit: boolean
}

const ComentarioCard = ({ comentario, onEdit, onDelete, canEdit }: ComentarioCardProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comentario.conteudo)
  const [showActions, setShowActions] = useState(false)

  const handleSave = () => {
    if (editContent.trim() && editContent !== comentario.conteudo) {
      onEdit(comentario.id, editContent.trim())
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditContent(comentario.conteudo)
    setIsEditing(false)
  }

  const formatMentions = (text: string) => {
    // Simple mention highlighting - in a real app you'd want more sophisticated parsing
    return text.split(/(@\w+)/g).map((part, index) => {
      if (part.startsWith('@')) {
        return (
          <span key={index} className="bg-blue-100 text-blue-800 px-1 rounded text-sm font-medium">
            {part}
          </span>
        )
      }
      return part
    })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-medium text-sm">
              {comentario.autor?.nome?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900">
              {comentario.autor?.nome || 'Usuário'}
            </h4>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(comentario.createdAt), { 
                addSuffix: true, 
                locale: ptBR 
              })}
            </p>
          </div>
        </div>

        {canEdit && (
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <MoreVertical size={16} />
            </button>

            {showActions && (
              <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                <button
                  onClick={() => {
                    setIsEditing(true)
                    setShowActions(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Edit2 size={14} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => {
                    onDelete(comentario.id)
                    setShowActions(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <Trash2 size={14} />
                  <span>Excluir</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            rows={3}
            placeholder="Digite seu comentário..."
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
            >
              Salvar
            </button>
          </div>
        </div>
      ) : (
        <div className="text-gray-700 text-sm leading-relaxed">
          {formatMentions(comentario.conteudo)}
        </div>
      )}
    </div>
  )
}

export default ComentarioCard
