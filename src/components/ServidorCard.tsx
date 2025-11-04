import { useState } from 'react'
import { 
  User, 
  Briefcase, 
  Award, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Activity
} from 'lucide-react'
import { Servidor, Gerencia } from '../types'
import { formatDate } from '../utils/helpers'

interface ServidorCardProps {
  servidor: Servidor
  gerencia?: Gerencia
  atividadesCount: number
  projetosCount: number
  onEdit?: (servidor: Servidor) => void
  onDelete?: (id: string) => void
  onView?: (servidor: Servidor) => void
  viewMode?: 'card' | 'list'
}

const ServidorCard = ({ 
  servidor, 
  gerencia, 
  atividadesCount, 
  projetosCount, 
  onEdit, 
  onDelete, 
  onView,
  viewMode = 'card'
}: ServidorCardProps) => {
  const [showActions, setShowActions] = useState(false)

  const getInitials = (nome: string) => {
    return nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-100 text-green-800'
      case 'inativo':
        return 'bg-red-100 text-red-800'
      case 'afastado':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: gerencia?.cor || '#6B7280' }}
              >
                {getInitials(servidor.nome)}
              </div>

              {/* Informações Principais */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">{servidor.nome}</h3>
                  <span 
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(servidor.status || 'ativo')}`}
                  >
                    {servidor.status || 'Ativo'}
                  </span>
                  {gerencia && (
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: gerencia.cor }}
                    >
                      {gerencia.sigla}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Briefcase size={14} />
                    <span>{servidor.cargo}</span>
                  </div>
                  {servidor.email && (
                    <div className="flex items-center gap-1">
                      <Mail size={14} />
                      <span>{servidor.email}</span>
                    </div>
                  )}
                  {servidor.telefone && (
                    <div className="flex items-center gap-1">
                      <Phone size={14} />
                      <span>{servidor.telefone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Estatísticas */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{atividadesCount}</div>
                  <div className="text-xs text-gray-500">Atividades</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">{projetosCount}</div>
                  <div className="text-xs text-gray-500">Projetos</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{servidor.atribuicoes.length}</div>
                  <div className="text-xs text-gray-500">Atribuições</div>
                </div>
              </div>

              {/* Ações */}
              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <MoreVertical size={16} />
                </button>

                {showActions && (
                  <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                    {onView && (
                      <button
                        onClick={() => {
                          onView(servidor)
                          setShowActions(false)
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <Eye size={14} />
                        <span>Ver detalhes</span>
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => {
                          onEdit(servidor)
                          setShowActions(false)
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <Edit size={14} />
                        <span>Editar</span>
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => {
                          onDelete(servidor.id)
                          setShowActions(false)
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <Trash2 size={14} />
                        <span>Excluir</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Atribuições */}
          {servidor.atribuicoes.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Award size={14} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Principais Atribuições</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {servidor.atribuicoes.slice(0, 3).map((atribuicao, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                  >
                    {atribuicao}
                  </span>
                ))}
                {servidor.atribuicoes.length > 3 && (
                  <span className="px-2 py-1 bg-gray-50 text-gray-500 rounded-full text-xs">
                    +{servidor.atribuicoes.length - 3} mais
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Modo card (original)
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all overflow-hidden">
      {/* Header colorido */}
      <div 
        className="h-24 relative"
        style={{ 
          background: `linear-gradient(135deg, ${gerencia?.cor || '#6B7280'} 0%, ${gerencia?.cor || '#6B7280'}dd 100%)`
        }}
      >
        <div className="absolute -bottom-12 left-6">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg"
            style={{ backgroundColor: gerencia?.cor || '#6B7280' }}
          >
            {getInitials(servidor.nome)}
          </div>
        </div>
      </div>

      <div className="pt-14 p-6">
        {/* Nome e Cargo */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-1">{servidor.nome}</h3>
          <div className="flex items-center gap-2 mb-2">
            <Briefcase size={14} className="text-gray-500" />
            <p className="text-sm text-gray-600">{servidor.cargo}</p>
          </div>
          <div className="flex items-center gap-2">
            {gerencia && (
              <span 
                className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: gerencia.cor }}
              >
                {gerencia.sigla}
              </span>
            )}
            <span 
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(servidor.status || 'ativo')}`}
            >
              {servidor.status || 'Ativo'}
            </span>
          </div>
        </div>

        {/* Contato */}
        {(servidor.email || servidor.telefone) && (
          <div className="mb-4 space-y-1">
            {servidor.email && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={14} />
                <span>{servidor.email}</span>
              </div>
            )}
            {servidor.telefone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={14} />
                <span>{servidor.telefone}</span>
              </div>
            )}
          </div>
        )}

        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{atividadesCount}</div>
            <div className="text-xs text-gray-600 mt-1">Atividades</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">{projetosCount}</div>
            <div className="text-xs text-gray-600 mt-1">Projetos</div>
          </div>
        </div>

        {/* Atribuições */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Award size={16} className="text-gray-500" />
            <h4 className="text-sm font-semibold text-gray-700">Atribuições Principais</h4>
          </div>
          <ul className="space-y-2">
            {servidor.atribuicoes.slice(0, 3).map((atribuicao, idx) => (
              <li 
                key={idx}
                className="text-xs text-gray-600 flex items-start gap-2"
              >
                <span 
                  className="mt-1 flex-shrink-0"
                  style={{ color: gerencia?.cor || '#6B7280' }}
                >
                  •
                </span>
                <span className="flex-1">{atribuicao}</span>
              </li>
            ))}
            {servidor.atribuicoes.length > 3 && (
              <li className="text-xs text-gray-500 italic pl-3">
                +{servidor.atribuicoes.length - 3} atribuições adicionais
              </li>
            )}
          </ul>
        </div>

        {/* Ações */}
        <div className="border-t border-gray-200 pt-4 mt-4 flex justify-end gap-2">
          {onView && (
            <button
              onClick={() => onView(servidor)}
              className="px-3 py-1 text-xs text-primary-600 hover:text-primary-700 transition-colors"
            >
              Ver detalhes
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(servidor)}
              className="px-3 py-1 text-xs text-gray-600 hover:text-gray-700 transition-colors"
            >
              Editar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ServidorCard
