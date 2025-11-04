import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Calendar, User, Tag, Plus, Eye } from 'lucide-react'
import { useAtividades } from '../hooks/useAtividades'
import { useServidores } from '../hooks/useServidores'
import { useGerencias } from '../hooks/useGerencias'
import { getStatusColor, formatDate } from '../utils/helpers'
import ModalNovaAtividade from '../components/ModalNovaAtividade'

const Atividades = () => {
  const { atividades, loading, reload } = useAtividades()
  const { servidores } = useServidores()
  const { gerencias } = useGerencias()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('todas')
  const [gerenciaFilter, setGerenciaFilter] = useState<string>('todas')
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando atividades...</p>
        </div>
      </div>
    )
  }

  const filteredAtividades = atividades.filter(atividade => {
    const matchSearch = atividade.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       atividade.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === 'todas' || atividade.status === statusFilter
    const matchGerencia = gerenciaFilter === 'todas' || atividade.gerenciaId === gerenciaFilter
    
    return matchSearch && matchStatus && matchGerencia
  })

  const statusCount = {
    todas: atividades.length,
    pendente: atividades.filter(a => a.status === 'pendente').length,
    'em andamento': atividades.filter(a => a.status === 'em andamento').length,
    'concluída': atividades.filter(a => a.status === 'concluída').length
  }

  return (
    <div className="space-y-5">
      {/* Header com Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div 
          className={`bg-white rounded-lg shadow-sm p-4 border-l-4 cursor-pointer transition-all ${
            statusFilter === 'todas' ? 'border-primary-500 ring-2 ring-primary-100' : 'border-gray-300'
          }`}
          onClick={() => setStatusFilter('todas')}
        >
          <div className="text-sm text-gray-600 mb-1">Total de Atividades</div>
          <div className="text-2xl font-bold text-gray-800">{statusCount.todas}</div>
        </div>
        <div 
          className={`bg-white rounded-lg shadow-sm p-4 border-l-4 cursor-pointer transition-all ${
            statusFilter === 'pendente' ? 'border-yellow-500 ring-2 ring-yellow-100' : 'border-gray-300'
          }`}
          onClick={() => setStatusFilter('pendente')}
        >
          <div className="text-sm text-gray-600 mb-1">Pendentes</div>
          <div className="text-2xl font-bold text-yellow-600">{statusCount.pendente}</div>
        </div>
        <div 
          className={`bg-white rounded-lg shadow-sm p-4 border-l-4 cursor-pointer transition-all ${
            statusFilter === 'em andamento' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-300'
          }`}
          onClick={() => setStatusFilter('em andamento')}
        >
          <div className="text-sm text-gray-600 mb-1">Em Andamento</div>
          <div className="text-2xl font-bold text-blue-600">{statusCount['em andamento']}</div>
        </div>
        <div 
          className={`bg-white rounded-lg shadow-sm p-4 border-l-4 cursor-pointer transition-all ${
            statusFilter === 'concluída' ? 'border-green-500 ring-2 ring-green-100' : 'border-gray-300'
          }`}
          onClick={() => setStatusFilter('concluída')}
        >
          <div className="text-sm text-gray-600 mb-1">Concluídas</div>
          <div className="text-2xl font-bold text-green-600">{statusCount['concluída']}</div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Buscar atividades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>
          <select
            value={gerenciaFilter}
            onChange={(e) => setGerenciaFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            <option value="todas">Todas as Gerências</option>
            {gerencias.map((gerencia) => (
              <option key={gerencia.id} value={gerencia.id}>{gerencia.sigla}</option>
            ))}
          </select>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold whitespace-nowrap text-sm"
          >
            <Plus size={16} />
            Nova Atividade
          </button>
        </div>
      </div>

      {/* Lista de Atividades */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-800">
              {filteredAtividades.length} Atividade{filteredAtividades.length !== 1 ? 's' : ''}
            </h3>
            {statusFilter !== 'todas' && (
              <button
                onClick={() => setStatusFilter('todas')}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                Limpar filtro
              </button>
            )}
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {filteredAtividades.map((atividade) => {
            const responsaveis = atividade.responsaveis?.map(id => servidores.find(s => s.id === id)).filter(Boolean) ||
                                (atividade.responsavelId ? [servidores.find(s => s.id === atividade.responsavelId)].filter(Boolean) : [])
            const gerencia = gerencias.find(g => g.id === atividade.gerenciaId)

            return (
              <div 
                key={atividade.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-2 mb-2">
                      <div 
                        className="w-1 h-12 rounded-full flex-shrink-0"
                        style={{ backgroundColor: gerencia?.cor }}
                      ></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Link 
                            to={`/atividade/${atividade.id}`}
                            className="font-semibold text-gray-800 text-sm hover:text-primary-600 transition-colors"
                          >
                            {atividade.titulo}
                          </Link>
                          <span 
                            className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                            style={{ backgroundColor: gerencia?.cor }}
                          >
                            {gerencia?.sigla}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{atividade.descricao}</p>
                        
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            <span>
                              {responsaveis.length > 0 
                                ? responsaveis.map(s => s?.nome).filter(Boolean).join(', ')
                                : 'Não definido'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span className="capitalize">{atividade.frequencia}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Tag size={14} />
                            <span>Atualizado em {formatDate(atividade.ultimaAtualizacao)}</span>
                          </div>
                        </div>

                        {atividade.documentos && atividade.documentos.length > 0 && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-gray-500">Documentos:</span>
                            {atividade.documentos.map((doc, idx) => (
                              <span 
                                key={idx}
                                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                              >
                                {doc}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getStatusColor(atividade.status)}`}>
                      {atividade.status}
                    </span>
                    <Link
                      to={`/atividade/${atividade.id}`}
                      className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                      title="Ver detalhes"
                    >
                      <Eye size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}

          {filteredAtividades.length === 0 && (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-2">
                <Filter size={48} className="mx-auto" />
              </div>
              <p className="text-gray-600">Nenhuma atividade encontrada</p>
              <p className="text-sm text-gray-500 mt-1">Tente ajustar os filtros de busca</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Nova Atividade */}
      <ModalNovaAtividade
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => reload()}
      />
    </div>
  )
}

export default Atividades

