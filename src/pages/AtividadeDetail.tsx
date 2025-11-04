import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageCircle, History, Clock, Edit, Trash2 } from 'lucide-react'
import { useAtividades } from '../hooks/useAtividades'
import { useServidores } from '../hooks/useServidores'
import { useGerencias } from '../hooks/useGerencias'
import { useToast } from '../hooks/useToast'
import ComentariosSection from '../components/ComentariosSection'
import HistoricoAlteracoes from '../components/HistoricoAlteracoes'
import TimelineAtividades from '../components/TimelineAtividades'
import ModalEditarAtividade from '../components/ModalEditarAtividade'
import { StatusBadge, CounterBadge } from '../components/Badge'

const AtividadeDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'overview' | 'comentarios' | 'historico' | 'timeline'>('overview')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  const { atividades, loading, deleteAtividade, reload } = useAtividades()
  const { servidores } = useServidores()
  const { gerencias } = useGerencias()
  const { showToast } = useToast()

  const atividade = atividades.find(a => a.id === id)
  const responsaveis = atividade?.responsaveis?.map(id => servidores.find(s => s.id === id)).filter(Boolean) || 
                       (atividade?.responsavelId ? [servidores.find(s => s.id === atividade.responsavelId)].filter(Boolean) : [])
  const gerencia = gerencias.find(g => g.id === atividade?.gerenciaId)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando atividade...</p>
        </div>
      </div>
    )
  }

  if (!atividade) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Atividade não encontrada</h2>
        <p className="text-gray-600 mb-4">A atividade solicitada não existe ou foi removida.</p>
        <button
          onClick={() => navigate('/atividades')}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Atividades
        </button>
      </div>
    )
  }

  const handleEdit = () => {
    setIsEditModalOpen(true)
  }

  const handleDelete = async () => {
    if (!atividade) return
    
    if (!confirm('Tem certeza que deseja excluir esta atividade? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      await deleteAtividade(atividade.id)
      showToast({
        type: 'success',
        title: 'Atividade excluída!',
        message: 'A atividade foi removida com sucesso.'
      })
      navigate('/atividades')
    } catch (error) {
      console.error('Erro ao excluir atividade:', error)
      showToast({
        type: 'error',
        title: 'Erro ao excluir atividade',
        message: 'Tente novamente em alguns instantes.'
      })
    }
  }

  const handleEditSuccess = () => {
    reload()
    setIsEditModalOpen(false)
  }

  // Usar o responsável da atividade como autorId padrão para comentários
  // Se não houver responsável, usar o primeiro servidor da mesma gerência ou qualquer servidor
  const autorId = atividade?.responsavelId || servidores.find(s => s.gerenciaId === atividade?.gerenciaId)?.id || servidores[0]?.id || 's1'

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: Clock },
    { id: 'comentarios', label: 'Comentários', icon: MessageCircle },
    { id: 'historico', label: 'Histórico', icon: History },
    { id: 'timeline', label: 'Timeline', icon: Clock }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/atividades')}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{atividade.titulo}</h1>
            <p className="text-sm text-gray-600">
              {gerencia?.nome} • Responsáveis: {responsaveis.map(s => s?.nome).filter(Boolean).join(', ') || 'Não definido'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <StatusBadge status={atividade.status} />
          <div className="flex space-x-2">
            <button 
              onClick={handleEdit}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Editar atividade"
            >
              <Edit size={16} />
            </button>
            <button 
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Excluir atividade"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Gerais</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Título</dt>
                    <dd className="text-sm text-gray-900">{atividade.titulo}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="text-sm text-gray-900">
                      <StatusBadge status={atividade.status} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Frequência</dt>
                    <dd className="text-sm text-gray-900 capitalize">{atividade.frequencia}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Gerência</dt>
                    <dd className="text-sm text-gray-900">{gerencia?.nome}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Responsáveis</dt>
                    <dd className="text-sm text-gray-900">
                      {responsaveis.length > 0 
                        ? responsaveis.map(s => s?.nome).filter(Boolean).join(', ')
                        : 'Não definido'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Última Atualização</dt>
                    <dd className="text-sm text-gray-900">
                      {new Date(atividade.ultimaAtualizacao).toLocaleDateString('pt-BR')}
                    </dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Descrição</h3>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed">{atividade.descricao}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'comentarios' && (
          <div className="p-6">
            <ComentariosSection
              atividadeId={atividade.id}
              autorId={autorId}
            />
          </div>
        )}

        {activeTab === 'historico' && (
          <div className="p-6">
            <HistoricoAlteracoes
              entidadeTipo="atividade"
              entidadeId={atividade.id}
            />
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="p-6">
            <TimelineAtividades
              entidadeTipo="atividade"
              entidadeId={atividade.id}
              autorId={autorId}
            />
          </div>
        )}
      </div>

      {/* Modal Editar Atividade */}
      <ModalEditarAtividade
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        atividade={atividade}
      />
    </div>
  )
}

export default AtividadeDetail
