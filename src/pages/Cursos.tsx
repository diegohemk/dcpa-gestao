import { useState } from 'react'
import { Search, Filter, BookOpen, Plus, Loader, GraduationCap, Users, Calendar } from 'lucide-react'
import { useCursos } from '../hooks/useCursos'
import { useServidores } from '../hooks/useServidores'
import { useGerencias } from '../hooks/useGerencias'
import { useToast } from '../hooks/useToast'
import CursoCard from '../components/CursoCard'
import ModalCurso from '../components/ModalCurso'
import { Curso } from '../types'

const Cursos = () => {
  const { cursos, loading, createCurso, updateCurso, deleteCurso, reload } = useCursos()
  const { servidores } = useServidores()
  const { gerencias } = useGerencias()
  const { showToast } = useToast()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  const [tipoFilter, setTipoFilter] = useState<string>('todos')
  const [ministradoFilter, setMinistradoFilter] = useState<string>('todos')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCurso, setEditingCurso] = useState<Curso | null>(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando cursos...</p>
        </div>
      </div>
    )
  }

  const filteredCursos = cursos.filter(curso => {
    const matchSearch = curso.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       curso.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === 'todos' || curso.status === statusFilter
    const matchTipo = tipoFilter === 'todos' || curso.tipo === tipoFilter
    const matchMinistrado = ministradoFilter === 'todos' || 
                           (ministradoFilter === 'ministrado' && curso.ministrado) ||
                           (ministradoFilter === 'nao_ministrado' && !curso.ministrado)
    
    return matchSearch && matchStatus && matchTipo && matchMinistrado
  })

  const statusCount = {
    todos: cursos.length,
    planejado: cursos.filter(c => c.status === 'planejado').length,
    em_andamento: cursos.filter(c => c.status === 'em_andamento').length,
    concluido: cursos.filter(c => c.status === 'concluido').length,
    cancelado: cursos.filter(c => c.status === 'cancelado').length
  }

  const ministradoCount = {
    ministrados: cursos.filter(c => c.ministrado).length,
    naoMinistrados: cursos.filter(c => !c.ministrado).length
  }

  const handleCreateCurso = async (curso: Omit<Curso, 'id' | 'createdAt' | 'updatedAt' | 'gerencia'>) => {
    try {
      await createCurso(curso)
      setIsModalOpen(false)
    } catch (error) {
      throw error
    }
  }

  const handleUpdateCurso = async (curso: Omit<Curso, 'id' | 'createdAt' | 'updatedAt' | 'gerencia'>) => {
    try {
      await updateCurso(editingCurso!.id, curso)
      setEditingCurso(null)
    } catch (error) {
      throw error
    }
  }

  const handleDeleteCurso = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este curso?')) {
      try {
        await deleteCurso(id)
        showToast({
          type: 'success',
          title: 'Curso excluído!',
          message: 'O curso foi removido com sucesso.'
        })
      } catch (error) {
        showToast({
          type: 'error',
          title: 'Erro ao excluir',
          message: 'Não foi possível excluir o curso.'
        })
      }
    }
  }

  const handleEditCurso = (curso: Curso) => {
    setEditingCurso(curso)
  }

  const handleViewCurso = (curso: Curso) => {
    // Implementar visualização de detalhes do curso
    console.log('Visualizar curso:', curso)
  }

  return (
    <div className="space-y-6">
      {/* Header com Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-primary-500">
          <div className="text-sm text-gray-600 mb-1">Total de Cursos</div>
          <div className="text-2xl font-bold text-gray-800">{statusCount.todos}</div>
        </div>
        <div 
          className={`bg-white rounded-lg shadow-sm p-4 border-l-4 cursor-pointer transition-all ${
            statusFilter === 'planejado' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-300'
          }`}
          onClick={() => setStatusFilter(statusFilter === 'planejado' ? 'todos' : 'planejado')}
        >
          <div className="text-sm text-gray-600 mb-1">Planejados</div>
          <div className="text-2xl font-bold text-blue-600">{statusCount.planejado}</div>
        </div>
        <div 
          className={`bg-white rounded-lg shadow-sm p-4 border-l-4 cursor-pointer transition-all ${
            statusFilter === 'em_andamento' ? 'border-yellow-500 ring-2 ring-yellow-100' : 'border-gray-300'
          }`}
          onClick={() => setStatusFilter(statusFilter === 'em_andamento' ? 'todos' : 'em_andamento')}
        >
          <div className="text-sm text-gray-600 mb-1">Em Andamento</div>
          <div className="text-2xl font-bold text-yellow-600">{statusCount.em_andamento}</div>
        </div>
        <div 
          className={`bg-white rounded-lg shadow-sm p-4 border-l-4 cursor-pointer transition-all ${
            statusFilter === 'concluido' ? 'border-green-500 ring-2 ring-green-100' : 'border-gray-300'
          }`}
          onClick={() => setStatusFilter(statusFilter === 'concluido' ? 'todos' : 'concluido')}
        >
          <div className="text-sm text-gray-600 mb-1">Concluídos</div>
          <div className="text-2xl font-bold text-green-600">{statusCount.concluido}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
          <div className="text-sm text-gray-600 mb-1">Ministrados</div>
          <div className="text-2xl font-bold text-purple-600">{ministradoCount.ministrados}</div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Buscar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            <option value="todos">Todos os Status</option>
            <option value="planejado">Planejado</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="concluido">Concluído</option>
            <option value="cancelado">Cancelado</option>
          </select>

          <select
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            <option value="todos">Todos os Tipos</option>
            <option value="interno">Interno</option>
            <option value="externo">Externo</option>
            <option value="online">Online</option>
            <option value="presencial">Presencial</option>
          </select>

          <select
            value={ministradoFilter}
            onChange={(e) => setMinistradoFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            <option value="todos">Todos</option>
            <option value="ministrado">Ministrados</option>
            <option value="nao_ministrado">Não Ministrados</option>
          </select>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Curso
          </button>
        </div>
      </div>

      {/* Lista de Cursos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCursos.map((curso) => (
          <CursoCard
            key={curso.id}
            curso={curso}
            onEdit={handleEditCurso}
            onDelete={handleDeleteCurso}
            onView={handleViewCurso}
          />
        ))}
      </div>

      {filteredCursos.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-100">
          <div className="text-gray-400 mb-4">
            <BookOpen size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum curso encontrado</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'todos' || tipoFilter !== 'todos' || ministradoFilter !== 'todos'
              ? 'Tente ajustar os filtros de busca'
              : 'Comece criando seu primeiro curso'
            }
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeiro Curso
          </button>
        </div>
      )}

      {/* Modais */}
      <ModalCurso
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateCurso}
        servidores={servidores}
        gerencias={gerencias}
        title="Novo Curso"
      />

      <ModalCurso
        isOpen={!!editingCurso}
        onClose={() => setEditingCurso(null)}
        onSave={handleUpdateCurso}
        curso={editingCurso}
        servidores={servidores}
        gerencias={gerencias}
        title="Editar Curso"
      />
    </div>
  )
}

export default Cursos
