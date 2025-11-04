import { useState, useEffect } from 'react'
import { Clock, Filter, Loader } from 'lucide-react'
import { useComentarios } from '../hooks/useComentarios'
import { useHistorico } from '../hooks/useHistorico'
import { TimelineItem as TimelineItemType, Comentario, HistoricoAlteracao } from '../types'
import TimelineItem from './TimelineItem'

interface TimelineAtividadesProps {
  entidadeTipo: 'atividade' | 'projeto'
  entidadeId: string
  autorId: string
}

const TimelineAtividades = ({ entidadeTipo, entidadeId, autorId }: TimelineAtividadesProps) => {
  const [timelineItems, setTimelineItems] = useState<TimelineItemType[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')

  const { comentarios, loading: loadingComentarios } = useComentarios({
    atividadeId: entidadeTipo === 'atividade' ? entidadeId : undefined,
    projetoId: entidadeTipo === 'projeto' ? entidadeId : undefined
  })

  const { historico, loading: loadingHistorico } = useHistorico({
    entidadeTipo,
    entidadeId
  })

  // Combinar comentários e histórico em timeline
  useEffect(() => {
    if (loadingComentarios || loadingHistorico) return

    const items: TimelineItemType[] = []

    // Adicionar comentários
    comentarios.forEach((comentario: Comentario) => {
      items.push({
        id: `comentario-${comentario.id}`,
        type: 'comentario',
        data: comentario,
        timestamp: comentario.createdAt,
        usuario: comentario.autor
      })
    })

    // Adicionar histórico
    historico.forEach((alteracao: HistoricoAlteracao) => {
      items.push({
        id: `alteracao-${alteracao.id}`,
        type: 'alteracao',
        data: alteracao,
        timestamp: alteracao.createdAt,
        usuario: alteracao.usuario
      })
    })

    // Ordenar por timestamp (mais recente primeiro)
    items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    setTimelineItems(items)
    setLoading(false)
  }, [comentarios, historico, loadingComentarios, loadingHistorico])

  // Filtrar timeline por tipo
  const timelineFiltrada = filtroTipo === 'todos' 
    ? timelineItems 
    : timelineItems.filter(item => item.type === filtroTipo)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="w-6 h-6 animate-spin text-primary-600" />
        <span className="ml-2 text-gray-600">Carregando timeline...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Timeline de Atividades
          </h3>
          <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
            {timelineFiltrada.length}
          </span>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filtrar por tipo</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFiltroTipo('todos')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              filtroTipo === 'todos'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Todos ({timelineItems.length})
          </button>
          <button
            onClick={() => setFiltroTipo('comentario')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              filtroTipo === 'comentario'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Comentários ({timelineItems.filter(i => i.type === 'comentario').length})
          </button>
          <button
            onClick={() => setFiltroTipo('alteracao')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              filtroTipo === 'alteracao'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Alterações ({timelineItems.filter(i => i.type === 'alteracao').length})
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-0">
        {timelineFiltrada.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Nenhuma atividade encontrada</p>
            <p className="text-xs text-gray-400">
              {filtroTipo !== 'todos' 
                ? 'Tente ajustar os filtros' 
                : 'As atividades aparecerão aqui'
              }
            </p>
          </div>
        ) : (
          timelineFiltrada.map((item, index) => (
            <TimelineItem
              key={item.id}
              item={item}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default TimelineAtividades
