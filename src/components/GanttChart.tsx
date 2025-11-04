import { useState, useMemo } from 'react'
import { 
  Calendar, 
  Clock, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  Play, 
  Pause,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut
} from 'lucide-react'
import { WBSItem } from '../types'

interface GanttChartProps {
  wbsItems: WBSItem[]
  projetoId: string
}

interface GanttTask {
  id: string
  nome: string
  codigo: string
  nivel: number
  responsavel: string
  status: string
  dataInicio: Date
  dataFim: Date
  percentualCompleto: number
  duracao: number
  isCritical: boolean
}

const GanttChart = ({ wbsItems, projetoId }: GanttChartProps) => {
  const [zoomLevel, setZoomLevel] = useState(1)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showCriticalPath, setShowCriticalPath] = useState(true)

  // Converter WBS para formato Gantt
  const tasks = useMemo(() => {
    const convertWBS = (items: WBSItem[], nivel: number = 0): GanttTask[] => {
      const result: GanttTask[] = []
      
      items.forEach(item => {
        if (item.dataInicio && item.dataFim) {
          result.push({
            id: item.id,
            nome: item.nome,
            codigo: item.codigo,
            nivel,
            responsavel: item.responsavelId,
            status: item.status,
            dataInicio: new Date(item.dataInicio),
            dataFim: new Date(item.dataFim),
            percentualCompleto: item.percentualCompleto,
            duracao: Math.ceil((new Date(item.dataFim).getTime() - new Date(item.dataInicio).getTime()) / (1000 * 60 * 60 * 24)),
            isCritical: false // Será calculado pelo algoritmo de caminho crítico
          })
        }
        
        if (item.filhos.length > 0) {
          result.push(...convertWBS(item.filhos, nivel + 1))
        }
      })
      
      return result
    }
    
    return convertWBS(wbsItems)
  }, [wbsItems])

  // Calcular datas mínimas e máximas
  const dateRange = useMemo(() => {
    if (tasks.length === 0) return { start: new Date(), end: new Date() }
    
    const dates = tasks.flatMap(task => [task.dataInicio, task.dataFim])
    const start = new Date(Math.min(...dates.map(d => d.getTime())))
    const end = new Date(Math.max(...dates.map(d => d.getTime())))
    
    // Adicionar margem
    start.setDate(start.getDate() - 7)
    end.setDate(end.getDate() + 7)
    
    return { start, end }
  }, [tasks])

  // Gerar array de datas para o eixo X
  const dates = useMemo(() => {
    const result: Date[] = []
    const current = new Date(dateRange.start)
    
    while (current <= dateRange.end) {
      result.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    return result
  }, [dateRange])

  // Calcular largura da coluna baseada no zoom
  const columnWidth = Math.max(20, 30 * zoomLevel)

  // Calcular posição X de uma data
  const getDateX = (date: Date) => {
    const daysDiff = Math.ceil((date.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24))
    return daysDiff * columnWidth
  }

  // Calcular largura de uma tarefa
  const getTaskWidth = (task: GanttTask) => {
    return task.duracao * columnWidth
  }

  // Obter cor da tarefa baseada no status
  const getTaskColor = (task: GanttTask) => {
    if (task.isCritical && showCriticalPath) {
      return 'bg-red-500'
    }
    
    switch (task.status) {
      case 'concluido':
        return 'bg-green-500'
      case 'em_andamento':
        return 'bg-blue-500'
      case 'suspenso':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-400'
    }
  }

  // Obter ícone do status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluido':
        return <CheckCircle size={14} className="text-green-600" />
      case 'em_andamento':
        return <Play size={14} className="text-blue-600" />
      case 'suspenso':
        return <AlertTriangle size={14} className="text-yellow-600" />
      default:
        return <Pause size={14} className="text-gray-400" />
    }
  }

  // Navegar pelas datas
  const navigateDates = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setDate(newDate.getDate() + 7)
    }
    setCurrentDate(newDate)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Cronograma do Projeto</h3>
          <p className="text-sm text-gray-600">Visualização Gantt com dependências</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Controles de Zoom */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Diminuir zoom"
            >
              <ZoomOut size={16} />
            </button>
            <span className="text-sm text-gray-600 min-w-[60px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Aumentar zoom"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          {/* Navegação */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateDates('prev')}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Semana anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-gray-600 min-w-[120px] text-center">
              {currentDate.toLocaleDateString('pt-BR')}
            </span>
            <button
              onClick={() => navigateDates('next')}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Próxima semana"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Caminho Crítico */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showCriticalPath}
              onChange={(e) => setShowCriticalPath(e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Mostrar caminho crítico</span>
          </label>
        </div>
      </div>

      {/* Gráfico Gantt */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Header do Gráfico */}
        <div className="flex border-b border-gray-200">
          {/* Coluna de Tarefas */}
          <div className="w-80 p-4 bg-gray-50 border-r border-gray-200">
            <div className="text-sm font-semibold text-gray-700">Tarefas</div>
          </div>
          
          {/* Timeline */}
          <div className="flex-1 overflow-x-auto">
            <div className="flex min-w-max">
              {dates.map((date, index) => (
                <div
                  key={index}
                  className="border-r border-gray-200 p-2 text-center"
                  style={{ width: columnWidth }}
                >
                  <div className="text-xs text-gray-600">
                    {date.getDate()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {date.toLocaleDateString('pt-BR', { weekday: 'short' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Linha de Hoje */}
        <div className="relative">
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
            style={{ left: getDateX(new Date()) + 320 }}
          >
            <div className="absolute -top-2 -left-1 w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="absolute -top-6 left-1 text-xs text-red-600 font-medium">
              Hoje
            </div>
          </div>
        </div>

        {/* Tarefas */}
        <div className="divide-y divide-gray-200">
          {tasks.map((task, index) => (
            <div key={task.id} className="flex hover:bg-gray-50 transition-colors">
              {/* Informações da Tarefa */}
              <div className="w-80 p-4 border-r border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-xs text-gray-500 font-mono">
                    {task.codigo}
                  </div>
                  {getStatusIcon(task.status)}
                </div>
                <div className="text-sm font-medium text-gray-900 truncate">
                  {task.nome}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                  <div className="flex items-center gap-1">
                    <User size={12} />
                    <span>{task.responsavel}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{task.duracao}d</span>
                  </div>
                </div>
                {/* Barra de Progresso */}
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${task.percentualCompleto}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {task.percentualCompleto}%
                  </div>
                </div>
              </div>

              {/* Barra da Tarefa */}
              <div className="flex-1 relative p-4">
                <div className="relative h-8">
                  {/* Barra da Tarefa */}
                  <div
                    className={`absolute top-1/2 transform -translate-y-1/2 h-6 rounded ${getTaskColor(task)} opacity-80 hover:opacity-100 transition-opacity`}
                    style={{
                      left: getDateX(task.dataInicio),
                      width: getTaskWidth(task),
                    }}
                  >
                    {/* Barra de Progresso dentro da tarefa */}
                    <div
                      className="h-full bg-white bg-opacity-30 rounded"
                      style={{ width: `${task.percentualCompleto}%` }}
                    ></div>
                  </div>

                  {/* Data de Início */}
                  <div
                    className="absolute top-0 text-xs text-gray-500"
                    style={{ left: getDateX(task.dataInicio) }}
                  >
                    {task.dataInicio.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  </div>

                  {/* Data de Fim */}
                  <div
                    className="absolute top-0 text-xs text-gray-500"
                    style={{ left: getDateX(task.dataFim) - 40 }}
                  >
                    {task.dataFim.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Estado Vazio */}
        {tasks.length === 0 && (
          <div className="p-12 text-center">
            <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 font-medium">Nenhuma tarefa com datas encontrada</p>
            <p className="text-sm text-gray-500 mt-1">Adicione datas de início e fim às tarefas da WBS</p>
          </div>
        )}
      </div>

      {/* Legenda */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Legenda</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-gray-600">Concluído</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-gray-600">Em Andamento</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-gray-600">Suspenso</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            <span className="text-gray-600">Não Iniciado</span>
          </div>
          {showCriticalPath && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-gray-600">Caminho Crítico</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GanttChart
