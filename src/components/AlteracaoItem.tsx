import { Clock, Plus, Edit, Trash2, MessageCircle, Filter } from 'lucide-react'
import { HistoricoAlteracao } from '../types'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface AlteracaoItemProps {
  alteracao: HistoricoAlteracao
}

const AlteracaoItem = ({ alteracao }: AlteracaoItemProps) => {
  const getIcon = () => {
    switch (alteracao.acao) {
      case 'criou':
        return <Plus className="w-4 h-4 text-green-600" />
      case 'atualizou':
        return <Edit className="w-4 h-4 text-blue-600" />
      case 'excluiu':
        return <Trash2 className="w-4 h-4 text-red-600" />
      case 'comentou':
        return <MessageCircle className="w-4 h-4 text-purple-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getBackgroundColor = () => {
    switch (alteracao.acao) {
      case 'criou':
        return 'bg-green-50 border-green-200'
      case 'atualizou':
        return 'bg-blue-50 border-blue-200'
      case 'excluiu':
        return 'bg-red-50 border-red-200'
      case 'comentou':
        return 'bg-purple-50 border-purple-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

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

  const formatFieldChange = () => {
    if (!alteracao.campoAlterado) return null

    const fieldNames: Record<string, string> = {
      'titulo': 'Título',
      'nome': 'Nome',
      'descricao': 'Descrição',
      'objetivo': 'Objetivo',
      'status': 'Status',
      'andamento': 'Andamento',
      'prazo': 'Prazo',
      'indicador': 'Indicador',
      'cargo': 'Cargo',
      'atribuicoes': 'Atribuições',
      'equipe': 'Equipe',
      'responsavelId': 'Responsável'
    }

    const fieldName = fieldNames[alteracao.campoAlterado] || alteracao.campoAlterado

    return (
      <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
        <div className="font-medium text-gray-700 mb-1">
          Campo alterado: {fieldName}
        </div>
        {alteracao.valorAnterior && (
          <div className="text-red-600">
            <span className="font-medium">Antes:</span> {alteracao.valorAnterior}
          </div>
        )}
        {alteracao.valorNovo && (
          <div className="text-green-600">
            <span className="font-medium">Depois:</span> {alteracao.valorNovo}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`${getBackgroundColor()} border rounded-lg p-4 mb-3`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm font-medium text-gray-900">
              {alteracao.usuario?.nome || 'Usuário'}
            </span>
            <span className="text-sm text-gray-600">
              {getActionText()} {getEntityText()}
            </span>
          </div>
          
          <div className="text-xs text-gray-500 mb-2">
            {formatDistanceToNow(new Date(alteracao.createdAt), { 
              addSuffix: true, 
              locale: ptBR 
            })}
          </div>

          {formatFieldChange()}
        </div>
      </div>
    </div>
  )
}

export default AlteracaoItem
