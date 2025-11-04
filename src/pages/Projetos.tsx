import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, AlertCircle, Clock, Users as UsersIcon, Plus, Eye, Calendar, TrendingUp, Filter, Edit, Trash2 } from 'lucide-react'
import { useProjetos } from '../hooks/useProjetos'
import { useServidores } from '../hooks/useServidores'
import { useGerencias } from '../hooks/useGerencias'
import { useToast } from '../hooks/useToast'
import { getIndicadorColor, formatDate } from '../utils/helpers'
import ModalNovoProjeto from '../components/ModalNovoProjeto'
import ModalEditarProjeto from '../components/ModalEditarProjeto'
import FavoriteButton from '../components/FavoriteButton'

const Projetos = () => {
  const { projetos, loading, reload, toggleFavorite, deleteProjeto } = useProjetos()
  const { servidores } = useServidores()
  const { gerencias } = useGerencias()
  const { showToast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [indicadorFilter, setIndicadorFilter] = useState<string>('todos')
  const [gerenciaFilter, setGerenciaFilter] = useState<string>('todas')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [projetoSelecionado, setProjetoSelecionado] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando projetos...</p>
        </div>
      </div>
    )
  }

  const filteredProjetos = projetos.filter(projeto => {
    const matchSearch = projeto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       projeto.objetivo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchIndicador = indicadorFilter === 'todos' || projeto.indicador === indicadorFilter
    const matchGerencia = gerenciaFilter === 'todas' || projeto.gerenciaId === gerenciaFilter
    
    return matchSearch && matchIndicador && matchGerencia
  })

  const indicadorCount = {
    todos: projetos.length,
    verde: projetos.filter(p => p.indicador === 'verde').length,
    amarelo: projetos.filter(p => p.indicador === 'amarelo').length,
    vermelho: projetos.filter(p => p.indicador === 'vermelho').length
  }

  const andamentoMedio = Math.round(
    projetos.reduce((acc, p) => acc + p.andamento, 0) / projetos.length
  )

  const getStatusBadge = (indicador: string) => {
    const colors = {
      verde: 'bg-green-100 text-green-800',
      amarelo: 'bg-yellow-100 text-yellow-800',
      vermelho: 'bg-red-100 text-red-800'
    }
    return colors[indicador as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (indicador: string) => {
    const texts = {
      verde: 'No Prazo',
      amarelo: 'Atenção',
      vermelho: 'Atrasado'
    }
    return texts[indicador as keyof typeof texts] || 'Indefinido'
  }

  const handleEdit = (projetoId: string) => {
    try {
      console.log('[DEBUG] handleEdit chamado para projeto:', projetoId)
      setProjetoSelecionado(projetoId)
      setIsEditModalOpen(true)
      console.log('[DEBUG] Modal de edição aberto')
    } catch (error) {
      console.error('[DEBUG] Erro ao abrir modal de edição:', error)
    }
  }

  const handleDelete = async (projetoId: string, projetoNome: string) => {
    try {
      console.log('[DEBUG] handleDelete chamado para projeto:', projetoId, projetoNome)
      
      const confirmed = window.confirm(`Tem certeza que deseja excluir o projeto "${projetoNome}"? Esta ação não pode ser desfeita.`)
      
      if (!confirmed) {
        console.log('[DEBUG] Exclusão cancelada pelo usuário')
        return
      }

      console.log('[DEBUG] Iniciando exclusão do projeto...')
      await deleteProjeto(projetoId)
      
      showToast({
        type: 'success',
        title: 'Projeto excluído',
        message: 'O projeto foi excluído com sucesso.'
      })
      
      reload()
    } catch (error) {
      console.error('[DEBUG] Erro ao excluir projeto:', error)
      showToast({
        type: 'error',
        title: 'Erro ao excluir projeto',
        message: 'Tente novamente em alguns instantes.'
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header com Stats Compactas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-primary-500">
          <div className="text-xs text-gray-600 mb-1">Total</div>
          <div className="text-2xl font-bold text-gray-800">{indicadorCount.todos}</div>
        </div>
        <div 
          className={`bg-white rounded-lg shadow-sm p-4 border-l-4 cursor-pointer transition-all ${
            indicadorFilter === 'verde' ? 'border-green-500 ring-2 ring-green-100' : 'border-gray-300'
          }`}
          onClick={() => setIndicadorFilter(indicadorFilter === 'verde' ? 'todos' : 'verde')}
        >
          <div className="text-xs text-gray-600 mb-1">No Prazo</div>
          <div className="text-2xl font-bold text-green-600">{indicadorCount.verde}</div>
        </div>
        <div 
          className={`bg-white rounded-lg shadow-sm p-4 border-l-4 cursor-pointer transition-all ${
            indicadorFilter === 'amarelo' ? 'border-yellow-500 ring-2 ring-yellow-100' : 'border-gray-300'
          }`}
          onClick={() => setIndicadorFilter(indicadorFilter === 'amarelo' ? 'todos' : 'amarelo')}
        >
          <div className="text-xs text-gray-600 mb-1">Atenção</div>
          <div className="text-2xl font-bold text-yellow-600">{indicadorCount.amarelo}</div>
        </div>
        <div 
          className={`bg-white rounded-lg shadow-sm p-4 border-l-4 cursor-pointer transition-all ${
            indicadorFilter === 'vermelho' ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-300'
          }`}
          onClick={() => setIndicadorFilter(indicadorFilter === 'vermelho' ? 'todos' : 'vermelho')}
        >
          <div className="text-xs text-gray-600 mb-1">Atrasado</div>
          <div className="text-2xl font-bold text-red-600">{indicadorCount.vermelho}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
          <div className="text-xs text-gray-600 mb-1">Médio</div>
          <div className="text-2xl font-bold text-blue-600">{andamentoMedio}%</div>
        </div>
      </div>

      {/* Filtros e Busca Compactos */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>
          <select
            value={gerenciaFilter}
            onChange={(e) => setGerenciaFilter(e.target.value)}
            className="px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            <option value="todas">Todas as Gerências</option>
            {gerencias.map((gerencia) => (
              <option key={gerencia.id} value={gerencia.id}>{gerencia.sigla}</option>
            ))}
          </select>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium text-sm whitespace-nowrap"
          >
            <Plus size={18} />
            Novo Projeto
          </button>
        </div>
      </div>

      {/* Lista de Projetos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Header da Lista */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">
              Projetos ({filteredProjetos.length})
            </h3>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <span className="text-xs text-gray-500">Lista</span>
            </div>
          </div>
        </div>

        {/* Lista Responsiva */}
        <div className="divide-y divide-gray-100">
          {filteredProjetos.map((projeto) => {
            const responsavel = servidores.find(s => s.id === projeto.responsavelId)
            const gerencia = gerencias.find(g => g.id === projeto.gerenciaId)
            const equipeNomes = projeto.equipe
              .map(id => servidores.find(s => s.id === id)?.nome.split(' ')[0])
              .filter(Boolean)

            const prazoDate = new Date(projeto.prazo)
            const hoje = new Date()
            const diasRestantes = Math.ceil((prazoDate.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))

            return (
              <div key={projeto.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  {/* Informações Principais */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Link 
                        to={`/projeto/${projeto.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors truncate"
                      >
                        {projeto.nome}
                      </Link>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(projeto.indicador)}`}>
                        {getStatusText(projeto.indicador)}
                      </span>
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: gerencia?.cor }}
                      >
                        {gerencia?.sigla}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {projeto.objetivo}
                    </p>

                    {/* Informações Detalhadas */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <UsersIcon size={14} className="text-gray-400" />
                        <span className="text-gray-600">Responsável:</span>
                        <span className="font-medium text-gray-900 truncate">
                          {responsavel?.nome.split(' ').slice(0, 2).join(' ')}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-gray-600">Prazo:</span>
                        <span className="font-medium text-gray-900">
                          {formatDate(projeto.prazo)}
                        </span>
                        {diasRestantes > 0 && (
                          <span className="text-xs text-gray-500">
                            ({diasRestantes}d)
                          </span>
                        )}
                        {diasRestantes <= 0 && (
                          <span className="text-xs text-red-600 font-medium">
                            (Vencido)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <UsersIcon size={14} className="text-gray-400" />
                        <span className="text-gray-600">Equipe:</span>
                        <span className="font-medium text-gray-900">
                          {projeto.equipe.length} membros
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <TrendingUp size={14} className="text-gray-400" />
                        <span className="text-gray-600">Andamento:</span>
                        <span className="font-medium text-gray-900">
                          {projeto.andamento}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${projeto.andamento}%`,
                            backgroundColor: gerencia?.cor
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2 ml-4">
                    <FavoriteButton
                      isFavorite={projeto.favorito}
                      onToggle={() => toggleFavorite(projeto.id)}
                      projectName={projeto.nome}
                    />
                    {projeto.indicador !== 'verde' && (
                      <AlertCircle 
                        size={16} 
                        className={projeto.indicador === 'amarelo' ? 'text-yellow-500' : 'text-red-500'}
                        title={projeto.indicador === 'amarelo' ? 'Requer atenção' : 'Atrasado'}
                      />
                    )}
                    <Link
                      to={`/projeto/${projeto.id}`}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Eye size={14} className="mr-1" />
                      Ver
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        e.nativeEvent.stopImmediatePropagation()
                        handleEdit(projeto.id)
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      onMouseUp={(e) => e.stopPropagation()}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors relative z-10"
                      title="Editar projeto"
                      aria-label="Editar projeto"
                    >
                      <Edit size={14} className="mr-1 pointer-events-none" />
                      <span className="pointer-events-none">Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        e.nativeEvent.stopImmediatePropagation()
                        handleDelete(projeto.id, projeto.nome)
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      onMouseUp={(e) => e.stopPropagation()}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors relative z-10"
                      title="Excluir projeto"
                      aria-label="Excluir projeto"
                    >
                      <Trash2 size={14} className="mr-1 pointer-events-none" />
                      <span className="pointer-events-none">Excluir</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Estado Vazio */}
        {filteredProjetos.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-gray-400 mb-3">
              <Search size={48} className="mx-auto" />
            </div>
            <p className="text-gray-600 font-medium">Nenhum projeto encontrado</p>
            <p className="text-sm text-gray-500 mt-1">Tente ajustar os filtros de busca</p>
          </div>
        )}
      </div>

      {/* Modal Novo Projeto */}
      <ModalNovoProjeto
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => reload()}
      />

      {/* Modal Editar Projeto */}
      {projetoSelecionado && (
        <ModalEditarProjeto
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setProjetoSelecionado(null)
          }}
          onSuccess={() => {
            reload()
            setIsEditModalOpen(false)
            setProjetoSelecionado(null)
          }}
          projeto={projetos.find(p => p.id === projetoSelecionado) || null}
        />
      )}
    </div>
  )
}

export default Projetos

