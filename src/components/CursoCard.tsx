import { useState } from 'react'
import { X, Calendar, Clock, Users, MapPin, BookOpen, Edit, Trash2, Eye } from 'lucide-react'
import { Curso } from '../types'
import { formatDate } from '../utils/helpers'
import { StatusBadge } from './Badge'

interface CursoCardProps {
  curso: Curso
  onEdit: (curso: Curso) => void
  onDelete: (id: string) => void
  onView: (curso: Curso) => void
}

const CursoCard = ({ curso, onEdit, onDelete, onView }: CursoCardProps) => {
  const [showActions, setShowActions] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planejado':
        return 'bg-blue-100 text-blue-800'
      case 'em_andamento':
        return 'bg-yellow-100 text-yellow-800'
      case 'concluido':
        return 'bg-green-100 text-green-800'
      case 'cancelado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'interno':
        return 'bg-purple-100 text-purple-800'
      case 'externo':
        return 'bg-indigo-100 text-indigo-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getModalidadeColor = (modalidade: string) => {
    switch (modalidade) {
      case 'hibrido':
        return 'bg-blue-100 text-blue-800'
      case 'online':
        return 'bg-cyan-100 text-cyan-800'
      case 'presencial':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{curso.nome}</h3>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(curso.status)}`}>
                {curso.status.replace('_', ' ')}
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(curso.tipo)}`}>
                {curso.tipo}
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getModalidadeColor(curso.modalidade || 'hibrido')}`}>
                {curso.modalidade === 'hibrido' ? 'Híbrido' : curso.modalidade === 'online' ? 'Online' : 'Presencial'}
              </div>
            </div>
            
            {curso.descricao && (
              <p className="text-sm text-gray-600 mb-2">{curso.descricao}</p>
            )}

            <div className="flex items-center gap-4 text-xs text-gray-500">
              {curso.dataInicio && (
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>Início: {formatDate(curso.dataInicio)}</span>
                </div>
              )}
              {curso.cargaHoraria && (
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{curso.cargaHoraria}h</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Users size={12} />
                <span>{curso.participantes.length} participantes</span>
              </div>
              {curso.local && (
                <div className="flex items-center gap-1">
                  <MapPin size={12} />
                  <span>{curso.local}</span>
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <BookOpen size={16} />
            </button>

            {showActions && (
              <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                <button
                  onClick={() => {
                    onView(curso)
                    setShowActions(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Eye size={14} />
                  <span>Ver detalhes</span>
                </button>
                <button
                  onClick={() => {
                    onEdit(curso)
                    setShowActions(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Edit size={14} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => {
                    onDelete(curso.id)
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
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {curso.gerencia && (
              <div className="flex items-center gap-1">
                <span 
                  className="text-xs px-2 py-1 rounded-full text-white"
                  style={{ backgroundColor: curso.gerencia.cor }}
                >
                  {curso.gerencia.sigla}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge 
              status={curso.ministrado ? 'Ministrado' : 'Não Ministrado'} 
              className="text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CursoCard
