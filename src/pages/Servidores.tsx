import { useState } from 'react'
import { Search, Mail, Briefcase, Award, Plus, Grid3X3, List, Filter, Users } from 'lucide-react'
import { useServidores } from '../hooks/useServidores'
import { useGerencias } from '../hooks/useGerencias'
import { useAtividades } from '../hooks/useAtividades'
import { useProjetos } from '../hooks/useProjetos'
import { useToast } from '../hooks/useToast'
import ModalNovoServidor from '../components/ModalNovoServidor'
import ServidorCard from '../components/ServidorCard'
import { Servidor } from '../types'

const Servidores = () => {
  const { servidores, loading, reload, deleteServidor } = useServidores()
  const { gerencias } = useGerencias()
  const { atividades } = useAtividades()
  const { projetos } = useProjetos()
  const { showToast } = useToast()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [gerenciaFilter, setGerenciaFilter] = useState<string>('todas')
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingServidor, setEditingServidor] = useState<Servidor | null>(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando servidores...</p>
        </div>
      </div>
    )
  }

  const filteredServidores = servidores.filter(servidor => {
    const matchSearch = servidor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       servidor.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       servidor.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchGerencia = gerenciaFilter === 'todas' || servidor.gerenciaId === gerenciaFilter
    const matchStatus = statusFilter === 'todos' || servidor.status === statusFilter
    
    return matchSearch && matchGerencia && matchStatus
  })

  const handleDeleteServidor = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este servidor?')) {
      try {
        await deleteServidor(id)
        showToast({
          type: 'success',
          title: 'Servidor excluído!',
          message: 'O servidor foi removido com sucesso.'
        })
      } catch (error) {
        showToast({
          type: 'error',
          title: 'Erro ao excluir',
          message: 'Não foi possível excluir o servidor.'
        })
      }
    }
  }

  const handleEditServidor = (servidor: Servidor) => {
    setEditingServidor(servidor)
  }

  const handleViewServidor = (servidor: Servidor) => {
    // Implementar visualização de detalhes do servidor
    console.log('Visualizar servidor:', servidor)
  }

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary-500">
          <div className="text-sm text-gray-600 mb-1">Total de Servidores</div>
          <div className="text-3xl font-bold text-gray-800">{servidores.length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
          <div className="text-sm text-gray-600 mb-1">Gerências Ativas</div>
          <div className="text-3xl font-bold text-purple-600">{gerencias.length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
          <div className="text-sm text-gray-600 mb-1">Atividades Totais</div>
          <div className="text-3xl font-bold text-blue-600">{atividades.length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <div className="text-sm text-gray-600 mb-1">Projetos Ativos</div>
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
              placeholder="Buscar servidores por nome, cargo ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={gerenciaFilter}
              onChange={(e) => setGerenciaFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="todas">Todas as Gerências</option>
              {gerencias.map((gerencia) => (
                <option key={gerencia.id} value={gerencia.id}>{gerencia.sigla}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="todos">Todos os Status</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="afastado">Afastado</option>
            </select>

            {/* Toggle de Visualização */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-3 transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                title="Visualização em lista"
              >
                <List size={20} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-3 transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                title="Visualização em grade"
              >
                <Grid3X3 size={20} />
              </button>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold whitespace-nowrap"
            >
              <Plus size={20} />
              Novo Servidor
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Servidores */}
      {viewMode === 'list' ? (
        <div className="space-y-3">
          {filteredServidores.map((servidor) => {
            const gerencia = gerencias.find(g => g.id === servidor.gerenciaId)
            const atividadesServidor = atividades.filter(a => a.responsavelId === servidor.id)
            const projetosServidor = projetos.filter(p => 
              p.responsavelId === servidor.id || p.equipe.includes(servidor.id)
            )

            return (
              <ServidorCard
                key={servidor.id}
                servidor={servidor}
                gerencia={gerencia}
                atividadesCount={atividadesServidor.length}
                projetosCount={projetosServidor.length}
                viewMode="list"
                onEdit={handleEditServidor}
                onDelete={handleDeleteServidor}
                onView={handleViewServidor}
              />
            )
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServidores.map((servidor) => {
            const gerencia = gerencias.find(g => g.id === servidor.gerenciaId)
            const atividadesServidor = atividades.filter(a => a.responsavelId === servidor.id)
            const projetosServidor = projetos.filter(p => 
              p.responsavelId === servidor.id || p.equipe.includes(servidor.id)
            )

            return (
              <ServidorCard
                key={servidor.id}
                servidor={servidor}
                gerencia={gerencia}
                atividadesCount={atividadesServidor.length}
                projetosCount={projetosServidor.length}
                viewMode="card"
                onEdit={handleEditServidor}
                onDelete={handleDeleteServidor}
                onView={handleViewServidor}
              />
            )
          })}
        </div>
      )}

      {filteredServidores.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <div className="text-gray-400 mb-2">
            <Search size={48} className="mx-auto" />
          </div>
          <p className="text-gray-600">Nenhum servidor encontrado</p>
          <p className="text-sm text-gray-500 mt-1">Tente ajustar os filtros de busca</p>
        </div>
      )}

      {/* Resumo por Gerência */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Distribuição por Gerência</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {gerencias.map((gerencia) => {
            const servidoresGerencia = servidores.filter(s => s.gerenciaId === gerencia.id)
            
            return (
              <div 
                key={gerencia.id}
                className="p-4 border-2 rounded-lg"
                style={{ borderColor: gerencia.cor }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: gerencia.cor }}
                  >
                    {gerencia.sigla.substring(0, 2)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 text-sm">{gerencia.sigla}</h4>
                  </div>
                </div>
                <div className="text-center py-2">
                  <div className="text-3xl font-bold text-gray-800">{servidoresGerencia.length}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Servidor{servidoresGerencia.length !== 1 ? 'es' : ''}
                  </div>
                </div>
              </div>
            )
          }          )}
        </div>
      </div>

      {/* Modal Novo Servidor */}
      <ModalNovoServidor
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => reload()}
      />

      {/* Modal Editar Servidor */}
      {editingServidor && (
        <ModalNovoServidor
          isOpen={!!editingServidor}
          onClose={() => setEditingServidor(null)}
          onSuccess={() => {
            reload()
            setEditingServidor(null)
          }}
          servidor={editingServidor}
        />
      )}
    </div>
  )
}

export default Servidores

