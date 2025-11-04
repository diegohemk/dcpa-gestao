import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageCircle, History, Clock, Edit, Trash2, Users, Calendar, DollarSign, Tag, AlertTriangle, CheckCircle, BarChart3, GitBranch } from 'lucide-react'
import { useProjetos } from '../hooks/useProjetos'
import { useServidores } from '../hooks/useServidores'
import { useGerencias } from '../hooks/useGerencias'
import { useToast } from '../hooks/useToast'
import ComentariosSection from '../components/ComentariosSection'
import HistoricoAlteracoes from '../components/HistoricoAlteracoes'
import TimelineAtividades from '../components/TimelineAtividades'
import SubetapasManager from '../components/SubetapasManager'
import WBSEditor from '../components/WBSEditor'
import EVMDashboard from '../components/EVMDashboard'
import GanttChart from '../components/GanttChart'
import ModalEditarProjeto from '../components/ModalEditarProjeto'
import { StatusBadge, CounterBadge } from '../components/Badge'

const ProjetoDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'overview' | 'subetapas' | 'wbs' | 'evm' | 'gantt' | 'comentarios' | 'historico' | 'timeline'>('overview')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  const { projetos, loading, deleteProjeto, reload } = useProjetos()
  const { servidores } = useServidores()
  const { gerencias } = useGerencias()
  const { showToast } = useToast()

  const projeto = projetos.find(p => p.id === id)
  const responsavel = servidores.find(s => s.id === projeto?.responsavelId)
  const gerencia = gerencias.find(g => g.id === projeto?.gerenciaId)
  const equipeServidores = servidores.filter(s => projeto?.equipe.includes(s.id))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando projeto...</p>
        </div>
      </div>
    )
  }

  if (!projeto) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Projeto não encontrado</h2>
        <p className="text-gray-600 mb-4">O projeto solicitado não existe ou foi removido.</p>
        <button
          onClick={() => navigate('/projetos')}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Projetos
        </button>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: Clock },
    { id: 'subetapas', label: 'Subetapas', icon: Calendar },
    { id: 'wbs', label: 'WBS', icon: GitBranch },
    { id: 'evm', label: 'EVM', icon: BarChart3 },
    { id: 'gantt', label: 'Cronograma', icon: Calendar },
    { id: 'comentarios', label: 'Comentários', icon: MessageCircle },
    { id: 'historico', label: 'Histórico', icon: History },
    { id: 'timeline', label: 'Timeline', icon: Clock }
  ]

  const getIndicadorColor = () => {
    switch (projeto.indicador) {
      case 'verde':
        return 'text-green-600'
      case 'amarelo':
        return 'text-yellow-600'
      case 'vermelho':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const handleDelete = async () => {
    console.log('[DEBUG] handleDelete chamado - INÍCIO')
    
    if (!projeto) {
      console.error('[DEBUG] Projeto não encontrado para exclusão')
      return
    }
    
    console.log('[DEBUG] Projeto encontrado:', projeto.id, projeto.nome)
    
    const confirmed = window.confirm(`Tem certeza que deseja excluir o projeto "${projeto.nome}"? Esta ação não pode ser desfeita.`)
    
    if (!confirmed) {
      console.log('[DEBUG] Exclusão cancelada pelo usuário')
      return
    }

    try {
      console.log('[DEBUG] Iniciando exclusão do projeto...')
      await deleteProjeto(projeto.id)
      
      showToast({
        type: 'success',
        title: 'Projeto excluído',
        message: 'O projeto foi excluído com sucesso.'
      })
      
      navigate('/projetos')
    } catch (error) {
      console.error('[DEBUG] Erro ao excluir projeto:', error)
      showToast({
        type: 'error',
        title: 'Erro ao excluir projeto',
        message: 'Tente novamente em alguns instantes.'
      })
    }
  }

  const handleEdit = () => {
    console.log('[DEBUG] handleEdit chamado - INÍCIO')
    
    if (!projeto) {
      console.error('[DEBUG] Projeto não encontrado para edição')
      return
    }
    
    console.log('[DEBUG] Projeto encontrado:', projeto.id, projeto.nome)
    console.log('[DEBUG] Abrindo modal de edição...')
    setIsEditModalOpen(true)
    console.log('[DEBUG] Estado isEditModalOpen atualizado para:', true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/projetos')}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{projeto.nome}</h1>
            <p className="text-sm text-gray-600">
              {gerencia?.nome} • Responsável: {responsavel?.nome}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <StatusBadge status={projeto.indicador} />
          <div className="flex space-x-2">
            <button 
              type="button"
              onClick={(e) => {
                console.log('[DEBUG] Botão Editar clicado - evento recebido')
                e.preventDefault()
                e.stopPropagation()
                handleEdit()
              }}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100 cursor-pointer flex items-center justify-center relative z-50"
              style={{ position: 'relative', zIndex: 50 }}
              title="Editar projeto"
              aria-label="Editar projeto"
            >
              <Edit size={16} />
            </button>
            <button 
              type="button"
              onClick={(e) => {
                console.log('[DEBUG] Botão Excluir clicado - evento recebido')
                e.preventDefault()
                e.stopPropagation()
                handleDelete()
              }}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 cursor-pointer flex items-center justify-center relative z-50"
              style={{ position: 'relative', zIndex: 50 }}
              title="Excluir projeto"
              aria-label="Excluir projeto"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {tab.id === 'comentarios' && (
                  <CounterBadge count={0} variant="info" />
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {activeTab === 'overview' && (
          <div className="p-6 space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Andamento do Projeto</span>
                <span className={`text-sm font-semibold ${getIndicadorColor()}`}>
                  {projeto.andamento}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    projeto.indicador === 'verde' ? 'bg-green-500' :
                    projeto.indicador === 'amarelo' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${projeto.andamento}%` }}
                ></div>
              </div>
            </div>

            {/* Informações Financeiras */}
            {(projeto.orcamento || projeto.custoReal) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projeto.orcamento && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign size={16} className="text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Orçamento</span>
                    </div>
                    <div className="text-lg font-bold text-blue-900">
                      R$ {projeto.orcamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                )}
                {projeto.custoReal && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign size={16} className="text-green-600" />
                      <span className="text-sm font-medium text-green-800">Custo Real</span>
                    </div>
                    <div className="text-lg font-bold text-green-900">
                      R$ {projeto.custoReal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tags e Riscos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projeto.tags && projeto.tags.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Tag size={16} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {projeto.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {projeto.riscos && projeto.riscos.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={16} className="text-red-600" />
                    <span className="text-sm font-medium text-gray-700">Riscos</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {projeto.riscos.map((risco, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs"
                      >
                        {risco}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Gerais</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Nome do Projeto</dt>
                    <dd className="text-sm text-gray-900">{projeto.nome}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Indicador</dt>
                    <dd className="text-sm text-gray-900">
                      <StatusBadge status={projeto.indicador} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Gerência</dt>
                    <dd className="text-sm text-gray-900">{gerencia?.nome}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Responsável</dt>
                    <dd className="text-sm text-gray-900">{responsavel?.nome}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Prazo</dt>
                    <dd className="text-sm text-gray-900">
                      {new Date(projeto.prazo).toLocaleDateString('pt-BR')}
                    </dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Objetivo</h3>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed">{projeto.objetivo}</p>
                </div>
              </div>
            </div>

            {/* Equipe */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Equipe ({equipeServidores.length} membros)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {equipeServidores.map((membro) => (
                  <div key={membro.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium text-sm">
                          {membro.nome.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{membro.nome}</h4>
                        <p className="text-xs text-gray-500">{membro.cargo}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'subetapas' && (
          <div className="p-6">
            <SubetapasManager
              subetapas={projeto.subetapas || []}
              servidores={servidores}
              onAdd={(subetapa) => {
                // Implementar adição de subetapa
                console.log('Adicionar subetapa:', subetapa)
              }}
              onEdit={(id, subetapa) => {
                // Implementar edição de subetapa
                console.log('Editar subetapa:', id, subetapa)
              }}
              onDelete={(id) => {
                // Implementar exclusão de subetapa
                console.log('Excluir subetapa:', id)
              }}
            />
          </div>
        )}

        {activeTab === 'wbs' && (
          <div className="p-6">
            <WBSEditor projetoId={projeto.id} />
          </div>
        )}

        {activeTab === 'evm' && (
          <div className="p-6">
            <EVMDashboard projetoId={projeto.id} />
          </div>
        )}

        {activeTab === 'gantt' && (
          <div className="p-6">
            <GanttChart 
              wbsItems={projeto.wbs || []} 
              projetoId={projeto.id} 
            />
          </div>
        )}

        {activeTab === 'comentarios' && (
          <div className="p-6">
            <ComentariosSection
              projetoId={projeto.id}
              autorId="admin" // Em um sistema real, isso viria do contexto de autenticação
              canEdit={true}
            />
          </div>
        )}

        {activeTab === 'historico' && (
          <div className="p-6">
            <HistoricoAlteracoes
              entidadeTipo="projeto"
              entidadeId={projeto.id}
            />
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="p-6">
            <TimelineAtividades
              entidadeTipo="projeto"
              entidadeId={projeto.id}
              autorId="admin" // Em um sistema real, isso viria do contexto de autenticação
            />
          </div>
        )}
      </div>

      {/* Modal Editar Projeto */}
      <ModalEditarProjeto
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {
          reload()
          setIsEditModalOpen(false)
        }}
        projeto={projeto}
      />
    </div>
  )
}

export default ProjetoDetail
