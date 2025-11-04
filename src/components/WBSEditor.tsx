import { useState, useCallback } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  ChevronRight, 
  ChevronDown, 
  Link, 
  Calendar, 
  User, 
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause
} from 'lucide-react'
import { WBSItem, Dependencia } from '../types'
import { useWBS } from '../hooks/useWBS'
import { useServidores } from '../hooks/useServidores'

interface WBSEditorProps {
  projetoId: string
}

const WBSEditor = ({ projetoId }: WBSEditorProps) => {
  const { wbs, loading, error, atualizarWBSItem, adicionarDependencia, criarWBS } = useWBS(projetoId)
  const { servidores } = useServidores()
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState<string | null>(null)
  const [showDependencyForm, setShowDependencyForm] = useState<string | null>(null)

  // Função auxiliar para adicionar item ao WBS recursivamente
  const adicionarItemRecursivo = useCallback((items: WBSItem[], paiId: string, novoItem: WBSItem): WBSItem[] => {
    return items.map(item => {
      if (item.id === paiId) {
        return {
          ...item,
          filhos: [...item.filhos, novoItem]
        }
      } else if (item.filhos.length > 0) {
        return {
          ...item,
          filhos: adicionarItemRecursivo(item.filhos, paiId, novoItem)
        }
      }
      return item
    })
  }, [])

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'nao_iniciado':
        return <Pause size={16} className="text-gray-400" />
      case 'em_andamento':
        return <Play size={16} className="text-blue-500" />
      case 'concluido':
        return <CheckCircle size={16} className="text-green-500" />
      case 'suspenso':
        return <AlertTriangle size={16} className="text-yellow-500" />
      default:
        return <Pause size={16} className="text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nao_iniciado':
        return 'bg-gray-100 text-gray-800'
      case 'em_andamento':
        return 'bg-blue-100 text-blue-800'
      case 'concluido':
        return 'bg-green-100 text-green-800'
      case 'suspenso':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'nao_iniciado':
        return 'Não Iniciado'
      case 'em_andamento':
        return 'Em Andamento'
      case 'concluido':
        return 'Concluído'
      case 'suspenso':
        return 'Suspenso'
      default:
        return 'Não Iniciado'
    }
  }

  const renderWBSItem = (item: WBSItem, nivel: number = 0) => {
    const isExpanded = expandedItems.has(item.id)
    const temFilhos = item.filhos.length > 0
    const isEditing = editingItem === item.id
    const showAdd = showAddForm === item.id
    const showDep = showDependencyForm === item.id

    return (
      <div key={item.id} className="border border-gray-200 rounded-lg mb-2">
        {/* Item Principal */}
        <div 
          className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
            nivel === 0 ? 'bg-primary-50 border-primary-200' : ''
          }`}
          style={{ marginLeft: `${nivel * 20}px` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Expandir/Colapsar */}
              {temFilhos && (
                <button
                  onClick={() => toggleExpanded(item.id)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
              )}
              
              {/* Código */}
              <div className="font-mono text-sm font-medium text-gray-600 min-w-[60px]">
                {item.codigo}
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                {getStatusIcon(item.status)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {getStatusText(item.status)}
                </span>
              </div>

              {/* Nome */}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{item.nome}</h4>
                {item.descricao && (
                  <p className="text-sm text-gray-600 mt-1">{item.descricao}</p>
                )}
              </div>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-2">
              {/* Progress Bar */}
              <div className="w-20">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.percentualCompleto}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 text-center mt-1">
                  {item.percentualCompleto}%
                </div>
              </div>

              {/* Informações */}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{item.estimativaHoras}h</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign size={14} />
                  <span>R$ {item.estimativaCusto.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User size={14} />
                  <span>{servidores.find(s => s.id === item.responsavelId)?.nome.split(' ')[0] || 'N/A'}</span>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditingItem(item.id)}
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                  title="Editar"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => setShowDependencyForm(item.id)}
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                  title="Adicionar Dependência"
                >
                  <Link size={16} />
                </button>
                {item.nivel < 3 && (
                  <button
                    onClick={() => setShowAddForm(item.id)}
                    className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                    title="Adicionar Subitem"
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Datas */}
          {(item.dataInicio || item.dataFim) && (
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
              {item.dataInicio && (
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>Início: {new Date(item.dataInicio).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
              {item.dataFim && (
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>Fim: {new Date(item.dataFim).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
            </div>
          )}

          {/* Dependências */}
          {item.dependencias.length > 0 && (
            <div className="mt-2">
              <div className="text-xs text-gray-500 mb-1">Dependências:</div>
              <div className="flex flex-wrap gap-2">
                {item.dependencias.map((dep, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                  >
                    {dep.tipo} - {dep.lag > 0 ? `+${dep.lag}d` : dep.lag < 0 ? `${dep.lag}d` : '0d'}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Formulário de Edição */}
        {isEditing && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <WBSItemForm
              item={item}
              onSave={(updatedItem) => {
                atualizarWBSItem(updatedItem)
                setEditingItem(null)
              }}
              onCancel={() => setEditingItem(null)}
            />
          </div>
        )}

        {/* Formulário de Dependência */}
        {showDep && (
          <div className="p-4 bg-blue-50 border-t border-blue-200">
            <DependencyForm
              itemId={item.id}
              onSave={(dependencia) => {
                adicionarDependencia(item.id, dependencia)
                setShowDependencyForm(null)
              }}
              onCancel={() => setShowDependencyForm(null)}
            />
          </div>
        )}

        {/* Formulário de Adicionar Subitem */}
        {showAdd && (
          <div className="p-4 bg-green-50 border-t border-green-200">
            <AddWBSItemForm
              paiId={item.id}
              nivel={item.nivel + 1}
              codigoPai={item.codigo}
              onSave={async (novoItem) => {
                try {
                  const wbsAtualizado = adicionarItemRecursivo(wbs, item.id, novoItem)
                  await criarWBS(wbsAtualizado)
                  setShowAddForm(null)
                } catch (error) {
                  console.error('Erro ao adicionar item:', error)
                }
              }}
              onCancel={() => setShowAddForm(null)}
            />
          </div>
        )}

        {/* Filhos */}
        {isExpanded && temFilhos && (
          <div className="ml-4">
            {item.filhos.map(filho => renderWBSItem(filho, nivel + 1))}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando WBS...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
        <p className="text-red-600 font-medium">Erro ao carregar WBS</p>
        <p className="text-gray-500 text-sm mt-1">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Work Breakdown Structure (WBS)</h3>
          <p className="text-sm text-gray-600">Estrutura hierárquica do trabalho do projeto</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm('root')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus size={16} />
            Adicionar Item
          </button>
        </div>
      </div>

      {/* WBS Items */}
      <div className="space-y-2">
        {wbs.map(item => renderWBSItem(item))}
      </div>

      {/* Formulário para Adicionar Item Raiz */}
      {showAddForm === 'root' && (
        <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
          <AddWBSItemForm
            paiId="root"
            nivel={0}
            codigoPai=""
            onSave={async (novoItem) => {
              try {
                // Gerar código para item raiz
                const proximoCodigo = wbs.length + 1
                const itemComCodigo = {
                  ...novoItem,
                  codigo: proximoCodigo.toString()
                }
                const wbsAtualizado = [...wbs, itemComCodigo]
                await criarWBS(wbsAtualizado)
                setShowAddForm(null)
              } catch (error) {
                console.error('Erro ao adicionar item raiz:', error)
              }
            }}
            onCancel={() => setShowAddForm(null)}
          />
        </div>
      )}

      {/* Estado Vazio */}
      {wbs.length === 0 && showAddForm !== 'root' && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Plus size={48} className="mx-auto" />
          </div>
          <p className="text-gray-600 font-medium">Nenhum item WBS encontrado</p>
          <p className="text-sm text-gray-500 mt-1">Comece criando a estrutura do projeto</p>
          <button
            onClick={() => setShowAddForm('root')}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus size={16} />
            Criar Primeiro Item
          </button>
        </div>
      )}
    </div>
  )
}

// Componente de Formulário para Editar Item WBS
interface WBSItemFormProps {
  item: WBSItem
  onSave: (item: WBSItem) => void
  onCancel: () => void
}

const WBSItemForm = ({ item, onSave, onCancel }: WBSItemFormProps) => {
  const [formData, setFormData] = useState({
    nome: item.nome,
    descricao: item.descricao,
    estimativaHoras: item.estimativaHoras,
    estimativaCusto: item.estimativaCusto,
    percentualCompleto: item.percentualCompleto,
    status: item.status,
    dataInicio: item.dataInicio || '',
    dataFim: item.dataFim || ''
  })

  const handleSave = () => {
    const updatedItem: WBSItem = {
      ...item,
      ...formData,
      updatedAt: new Date().toISOString()
    }
    onSave(updatedItem)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input
            type="text"
            value={formData.nome}
            onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="nao_iniciado">Não Iniciado</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="concluido">Concluído</option>
            <option value="suspenso">Suspenso</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea
          value={formData.descricao}
          onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Horas Estimadas</label>
          <input
            type="number"
            value={formData.estimativaHoras}
            onChange={(e) => setFormData(prev => ({ ...prev, estimativaHoras: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Custo Estimado</label>
          <input
            type="number"
            value={formData.estimativaCusto}
            onChange={(e) => setFormData(prev => ({ ...prev, estimativaCusto: parseFloat(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">% Completo</label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.percentualCompleto}
            onChange={(e) => setFormData(prev => ({ ...prev, percentualCompleto: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
          <input
            type="date"
            value={formData.dataInicio}
            onChange={(e) => setFormData(prev => ({ ...prev, dataInicio: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
          <input
            type="date"
            value={formData.dataFim}
            onChange={(e) => setFormData(prev => ({ ...prev, dataFim: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Salvar
        </button>
      </div>
    </div>
  )
}

// Componente de Formulário para Dependências
interface DependencyFormProps {
  itemId: string
  onSave: (dependencia: Omit<Dependencia, 'id'>) => void
  onCancel: () => void
}

const DependencyForm = ({ itemId, onSave, onCancel }: DependencyFormProps) => {
  const [formData, setFormData] = useState({
    tarefaId: '',
    tipo: 'FS' as 'FS' | 'SS' | 'FF' | 'SF',
    lag: 0,
    descricao: ''
  })

  const handleSave = () => {
    onSave(formData)
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Adicionar Dependência</h4>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tarefa Dependente</label>
          <input
            type="text"
            placeholder="ID da tarefa"
            value={formData.tarefaId}
            onChange={(e) => setFormData(prev => ({ ...prev, tarefaId: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select
            value={formData.tipo}
            onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="FS">Finish-to-Start</option>
            <option value="SS">Start-to-Start</option>
            <option value="FF">Finish-to-Finish</option>
            <option value="SF">Start-to-Finish</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lag (dias)</label>
          <input
            type="number"
            value={formData.lag}
            onChange={(e) => setFormData(prev => ({ ...prev, lag: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <input
            type="text"
            placeholder="Descrição da dependência"
            value={formData.descricao}
            onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Adicionar
        </button>
      </div>
    </div>
  )
}

// Componente de Formulário para Adicionar Novo Item
interface AddWBSItemFormProps {
  paiId: string
  nivel: number
  codigoPai: string
  onSave: (item: WBSItem) => void
  onCancel: () => void
}

const AddWBSItemForm = ({ paiId, nivel, codigoPai, onSave, onCancel }: AddWBSItemFormProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    estimativaHoras: 0,
    estimativaCusto: 0,
    dataInicio: '',
    dataFim: ''
  })

  const handleSave = () => {
    // Gerar código baseado no pai
    let codigo: string
    if (paiId === 'root') {
      codigo = '' // Será definido pelo componente pai
    } else {
      // Contar quantos filhos o pai já tem para gerar o próximo número
      codigo = codigoPai ? `${codigoPai}.${nivel}` : `${nivel}`
    }

    const novoItem: WBSItem = {
      id: `wbs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      codigo,
      nome: formData.nome,
      descricao: formData.descricao,
      nivel,
      paiId: paiId === 'root' ? undefined : paiId,
      filhos: [],
      responsavelId: 's1', // Default
      estimativaHoras: formData.estimativaHoras,
      estimativaCusto: formData.estimativaCusto,
      status: 'nao_iniciado',
      percentualCompleto: 0,
      dataInicio: formData.dataInicio || undefined,
      dataFim: formData.dataFim || undefined,
      dependencias: [],
      riscos: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    onSave(novoItem)
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Adicionar Novo Item WBS</h4>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
        <input
          type="text"
          value={formData.nome}
          onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Nome do item"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea
          value={formData.descricao}
          onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Descrição do item"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Horas Estimadas</label>
          <input
            type="number"
            value={formData.estimativaHoras}
            onChange={(e) => setFormData(prev => ({ ...prev, estimativaHoras: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Custo Estimado</label>
          <input
            type="number"
            value={formData.estimativaCusto}
            onChange={(e) => setFormData(prev => ({ ...prev, estimativaCusto: parseFloat(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
          <input
            type="date"
            value={formData.dataInicio}
            onChange={(e) => setFormData(prev => ({ ...prev, dataInicio: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
          <input
            type="date"
            value={formData.dataFim}
            onChange={(e) => setFormData(prev => ({ ...prev, dataFim: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Criar Item
        </button>
      </div>
    </div>
  )
}

export default WBSEditor
