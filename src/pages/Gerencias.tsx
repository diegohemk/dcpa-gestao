import { useState } from 'react'
import { Search, Plus, Edit, Trash2, Building2, Users, Briefcase, FolderKanban } from 'lucide-react'
import { useGerencias } from '../hooks/useGerencias'
import { useServidores } from '../hooks/useServidores'
import { useAtividades } from '../hooks/useAtividades'
import { useProjetos } from '../hooks/useProjetos'
import { useToast } from '../hooks/useToast'
import ModalNovaGerencia from '../components/ModalNovaGerencia'
import { Gerencia } from '../types'
import { Link } from 'react-router-dom'

const Gerencias = () => {
  const { gerencias, loading, deleteGerencia } = useGerencias()
  const { servidores } = useServidores()
  const { atividades } = useAtividades()
  const { projetos } = useProjetos()
  const { showToast } = useToast()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGerencia, setEditingGerencia] = useState<Gerencia | null>(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando gerências...</p>
        </div>
      </div>
    )
  }

  const filteredGerencias = gerencias.filter(gerencia => {
    const matchSearch = gerencia.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       gerencia.sigla.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchSearch
  })

  const handleDeleteGerencia = async (id: string) => {
    const gerencia = gerencias.find(g => g.id === id)
    const servidoresGerencia = servidores.filter(s => s.gerenciaId === id)
    
    if (servidoresGerencia.length > 0) {
      showToast({
        type: 'error',
        title: 'Não é possível excluir',
        message: `Esta gerência possui ${servidoresGerencia.length} servidor(es) vinculado(s). Remova os servidores antes de excluir a gerência.`
      })
      return
    }

    if (window.confirm(`Tem certeza que deseja excluir a gerência "${gerencia?.sigla}"?`)) {
      try {
        await deleteGerencia(id)
        showToast({
          type: 'success',
          title: 'Gerência excluída!',
          message: 'A gerência foi removida com sucesso.'
        })
      } catch (error: any) {
        console.error('Erro ao excluir gerência:', error)
        showToast({
          type: 'error',
          title: 'Erro ao excluir',
          message: error?.message || 'Não foi possível excluir a gerência.'
        })
      }
    }
  }

  const handleEditGerencia = (gerencia: Gerencia) => {
    setEditingGerencia(gerencia)
    setIsModalOpen(true)
  }

  const handleNewGerencia = () => {
    setEditingGerencia(null)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingGerencia(null)
  }

  const getGerenciaStats = (gerenciaId: string) => {
    return {
      servidores: servidores.filter(s => s.gerenciaId === gerenciaId).length,
      atividades: atividades.filter(a => a.gerenciaId === gerenciaId).length,
      projetos: projetos.filter(p => p.gerenciaId === gerenciaId).length
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary-500">
          <div className="text-sm text-gray-600 mb-1">Total de Gerências</div>
          <div className="text-3xl font-bold text-gray-800">{gerencias.length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
          <div className="text-sm text-gray-600 mb-1">Servidores Totais</div>
          <div className="text-3xl font-bold text-purple-600">{servidores.length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
          <div className="text-sm text-gray-600 mb-1">Atividades Totais</div>
          <div className="text-3xl font-bold text-blue-600">{atividades.length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <div className="text-sm text-gray-600 mb-1">Projetos Totais</div>
          <div className="text-3xl font-bold text-green-600">{projetos.length}</div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nome ou sigla..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            onClick={handleNewGerencia}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
          >
            <Plus size={20} />
            Nova Gerência
          </button>
        </div>
      </div>

      {/* Lista de Gerências */}
      {filteredGerencias.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {searchTerm ? 'Nenhuma gerência encontrada' : 'Nenhuma gerência cadastrada'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm 
              ? 'Tente ajustar os termos de busca.' 
              : 'Comece cadastrando uma nova gerência usando o botão acima.'}
          </p>
          {!searchTerm && (
            <button
              onClick={handleNewGerencia}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
            >
              <Plus size={20} />
              Cadastrar Primeira Gerência
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGerencias.map((gerencia) => {
            const stats = getGerenciaStats(gerencia.id)
            
            return (
              <div
                key={gerencia.id}
                className="bg-white rounded-xl shadow-sm border-2 hover:shadow-md transition-all"
                style={{ borderColor: gerencia.cor }}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: gerencia.cor }}
                      >
                        {gerencia.sigla.substring(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">{gerencia.sigla}</h3>
                        <p className="text-sm text-gray-600">{gerencia.nome}</p>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditGerencia(gerencia)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Editar gerência"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteGerencia(gerencia.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir gerência"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <Users size={20} className="mx-auto text-gray-600 mb-1" />
                      <div className="text-xl font-bold text-gray-800">{stats.servidores}</div>
                      <div className="text-xs text-gray-500">Servidores</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <Briefcase size={20} className="mx-auto text-gray-600 mb-1" />
                      <div className="text-xl font-bold text-gray-800">{stats.atividades}</div>
                      <div className="text-xs text-gray-500">Atividades</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <FolderKanban size={20} className="mx-auto text-gray-600 mb-1" />
                      <div className="text-xl font-bold text-gray-800">{stats.projetos}</div>
                      <div className="text-xs text-gray-500">Projetos</div>
                    </div>
                  </div>

                  {/* View Details Link */}
                  <Link
                    to={`/gerencia/${gerencia.id}`}
                    className="block w-full text-center px-4 py-2 rounded-lg font-medium transition-colors"
                    style={{
                      backgroundColor: gerencia.cor,
                      color: 'white'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.9'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1'
                    }}
                  >
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      <ModalNovaGerencia
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={() => {
          handleModalClose()
        }}
        gerencia={editingGerencia}
      />
    </div>
  )
}

export default Gerencias

