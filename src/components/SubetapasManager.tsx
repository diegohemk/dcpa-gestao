import { useState } from 'react'
import { Plus, Edit, Trash2, Calendar, User, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { Subetapa, Servidor } from '../types'
import { formatDate } from '../utils/helpers'

interface SubetapasManagerProps {
  subetapas: Subetapa[]
  servidores: Servidor[]
  onAdd: (subetapa: Omit<Subetapa, 'id'>) => void
  onEdit: (id: string, subetapa: Partial<Subetapa>) => void
  onDelete: (id: string) => void
}

const SubetapasManager = ({ subetapas, servidores, onAdd, onEdit, onDelete }: SubetapasManagerProps) => {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    responsavelId: '',
    prazo: '',
    status: 'pendente' as const,
    andamento: 0,
    dependencias: [] as string[]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingId) {
      onEdit(editingId, formData)
      setEditingId(null)
    } else {
      onAdd(formData)
    }
    
    setFormData({
      nome: '',
      descricao: '',
      responsavelId: '',
      prazo: '',
      status: 'pendente',
      andamento: 0,
      dependencias: []
    })
    setIsAdding(false)
  }

  const handleEdit = (subetapa: Subetapa) => {
    setFormData({
      nome: subetapa.nome,
      descricao: subetapa.descricao,
      responsavelId: subetapa.responsavelId,
      prazo: subetapa.prazo,
      status: subetapa.status,
      andamento: subetapa.andamento,
      dependencias: subetapa.dependencias
    })
    setEditingId(subetapa.id)
    setIsAdding(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-gray-100 text-gray-800'
      case 'em_andamento':
        return 'bg-yellow-100 text-yellow-800'
      case 'concluida':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Clock size={14} />
      case 'em_andamento':
        return <AlertCircle size={14} />
      case 'concluida':
        return <CheckCircle size={14} />
      default:
        return <Clock size={14} />
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Subetapas do Projeto</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
        >
          <Plus size={16} className="mr-2" />
          Adicionar Subetapa
        </button>
      </div>

      {/* Formulário de Adição/Edição */}
      {isAdding && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Subetapa *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  placeholder="Digite o nome da subetapa"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsável *
                </label>
                <select
                  value={formData.responsavelId}
                  onChange={(e) => setFormData(prev => ({ ...prev, responsavelId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  required
                >
                  <option value="">Selecione um responsável</option>
                  {servidores.map(servidor => (
                    <option key={servidor.id} value={servidor.id}>
                      {servidor.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                rows={2}
                placeholder="Descreva a subetapa..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prazo *
                </label>
                <input
                  type="date"
                  value={formData.prazo}
                  onChange={(e) => setFormData(prev => ({ ...prev, prazo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                >
                  <option value="pendente">Pendente</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="concluida">Concluída</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Andamento (%)
                </label>
                <input
                  type="number"
                  value={formData.andamento}
                  onChange={(e) => setFormData(prev => ({ ...prev, andamento: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false)
                  setEditingId(null)
                  setFormData({
                    nome: '',
                    descricao: '',
                    responsavelId: '',
                    prazo: '',
                    status: 'pendente',
                    andamento: 0,
                    dependencias: []
                  })
                }}
                className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
              >
                {editingId ? 'Atualizar' : 'Adicionar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Subetapas */}
      <div className="space-y-3">
        {subetapas.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Nenhuma subetapa cadastrada</p>
            <p className="text-xs text-gray-400">Adicione subetapas para organizar melhor o projeto</p>
          </div>
        ) : (
          subetapas.map((subetapa) => {
            const responsavel = servidores.find(s => s.id === subetapa.responsavelId)
            return (
              <div key={subetapa.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900 text-sm">{subetapa.nome}</h4>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subetapa.status)}`}>
                        {getStatusIcon(subetapa.status)}
                        <span className="ml-1">{subetapa.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                    
                    {subetapa.descricao && (
                      <p className="text-sm text-gray-600 mb-2">{subetapa.descricao}</p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User size={12} />
                        <span>{responsavel?.nome}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>Prazo: {formatDate(subetapa.prazo)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Andamento: {subetapa.andamento}%</span>
                      </div>
                    </div>

                    {/* Barra de Progresso */}
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${subetapa.andamento}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 ml-4">
                    <button
                      onClick={() => handleEdit(subetapa)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Editar subetapa"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(subetapa.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Excluir subetapa"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default SubetapasManager
