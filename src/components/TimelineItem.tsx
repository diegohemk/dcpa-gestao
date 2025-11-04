import { MessageCircle, Edit, Plus, Trash2, Clock, User } from 'lucide-react'
import { TimelineItem as TimelineItemType } from '../types'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface TimelineItemProps {
  item: TimelineItemType
}

const TimelineItem = ({ item }: TimelineItemProps) => {
  const getIcon = () => {
    switch (item.type) {
      case 'comentario':
        return <MessageCircle className="w-4 h-4 text-blue-600" />
      case 'alteracao':
        const alteracao = item.data as any
        switch (alteracao.acao) {
          case 'criou':
            return <Plus className="w-4 h-4 text-green-600" />
          case 'atualizou':
            return <Edit className="w-4 h-4 text-yellow-600" />
          case 'excluiu':
            return <Trash2 className="w-4 h-4 text-red-600" />
          case 'comentou':
            return <MessageCircle className="w-4 h-4 text-purple-600" />
          default:
            return <Clock className="w-4 h-4 text-gray-600" />
        }
      case 'marco':
        return <Clock className="w-4 h-4 text-indigo-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getBackgroundColor = () => {
    switch (item.type) {
      case 'comentario':
        return 'bg-blue-50 border-blue-200'
      case 'alteracao':
        const alteracao = item.data as any
        switch (alteracao.acao) {
          case 'criou':
            return 'bg-green-50 border-green-200'
          case 'atualizou':
            return 'bg-yellow-50 border-yellow-200'
          case 'excluiu':
            return 'bg-red-50 border-red-200'
          case 'comentou':
            return 'bg-purple-50 border-purple-200'
          default:
            return 'bg-gray-50 border-gray-200'
        }
      case 'marco':
        return 'bg-indigo-50 border-indigo-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getContent = () => {
    switch (item.type) {
      case 'comentario':
        const comentario = item.data as any
        return (
          <div>
            <div className="text-sm font-medium text-gray-900 mb-1">
              Novo comentário
            </div>
            <div className="text-sm text-gray-700">
              {comentario.conteudo}
            </div>
          </div>
        )
      
      case 'alteracao':
        const alteracao = item.data as any
        const getActionText = () => {
          switch (alteracao.acao) {
            case 'criou':
              return 'criou'
            case 'atualizou':
              return 'atualizou'
            case 'excluiu':
              return 'excluiu'
            case 'comentou':
              return 'comentou em'
            default:
              return 'alterou'
          }
        }

        const getEntityText = () => {
          switch (alteracao.entidadeTipo) {
            case 'atividade':
              return 'a atividade'
            case 'projeto':
              return 'o projeto'
            case 'servidor':
              return 'o servidor'
            case 'gerencia':
              return 'a gerência'
            default:
              return 'o item'
          }
        }

        return (
          <div>
            <div className="text-sm font-medium text-gray-900 mb-1">
              {getActionText()} {getEntityText()}
            </div>
            {alteracao.campoAlterado && (
              <div className="text-xs text-gray-600">
                Campo: {alteracao.campoAlterado}
              </div>
            )}
          </div>
        )
      
      case 'marco':
        return (
          <div>
            <div className="text-sm font-medium text-gray-900 mb-1">
              Marco importante
            </div>
            <div className="text-sm text-gray-700">
              Evento significativo registrado
            </div>
          </div>
        )
      
      default:
        return (
          <div className="text-sm text-gray-700">
            Evento registrado
          </div>
        )
    }
  }

  return (
    <div className="relative">
      {/* Linha vertical */}
      <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200"></div>
      
      {/* Item da timeline */}
      <div className="relative flex items-start space-x-4 pb-6">
        {/* Ícone */}
        <div className={`${getBackgroundColor()} border rounded-full p-2 flex-shrink-0 z-10`}>
          {getIcon()}
        </div>
        
        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <div className={`${getBackgroundColor()} border rounded-lg p-4`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                  <User size={12} className="text-primary-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {item.usuario?.nome || 'Usuário'}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(item.timestamp), { 
                  addSuffix: true, 
                  locale: ptBR 
                })}
              </span>
            </div>
            
            {getContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimelineItem
