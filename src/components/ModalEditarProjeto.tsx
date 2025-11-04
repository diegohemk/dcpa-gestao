import { useState, useEffect } from 'react'
import { X, Plus, Save, Loader, DollarSign, Tag, AlertTriangle, Calendar, Users } from 'lucide-react'
import { useProjetos } from '../hooks/useProjetos'
import { useServidores } from '../hooks/useServidores'
import { useGerencias } from '../hooks/useGerencias'
import { useToast } from '../hooks/useToast'
import { Projeto } from '../types'
import { calcularIndicadorProjeto } from '../utils/helpers'

interface ModalEditarProjetoProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  projeto: Projeto | null
}

const ModalEditarProjeto = ({ isOpen, onClose, onSuccess, projeto }: ModalEditarProjetoProps) => {
  const { updateProjeto } = useProjetos()
  const { servidores } = useServidores()
  const { gerencias } = useGerencias()
  const { showToast } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'basico' | 'avancado'>('basico')
  const [formData, setFormData] = useState({
    nome: '',
    objetivo: '',
    responsavelId: '',
    gerenciaId: '',
    equipe: [] as string[],
    prazo: '',
    andamento: 0,
    indicador: 'verde' as 'verde' | 'amarelo' | 'vermelho',
    orcamento: '',
    custoReal: '',
    prioridade: 'media' as 'baixa' | 'media' | 'alta' | 'critica',
    categoria: '',
    tags: [] as string[],
    riscos: [] as string[],
    recursos: [] as string[],
    observacoes: '',
    dataInicio: '',
    dataConclusao: '',
    statusDetalhado: 'planejamento' as 'planejamento' | 'execucao' | 'monitoramento' | 'concluido' | 'suspenso' | 'cancelado'
  })
  
  // Recalcula o indicador sempre que os dados relevantes mudarem
  useEffect(() => {
    if (formData.prazo) {
      const orcamento = formData.orcamento ? parseFloat(formData.orcamento) : undefined
      const custoReal = formData.custoReal ? parseFloat(formData.custoReal) : undefined
      
      const indicadorCalculado = calcularIndicadorProjeto({
        prazo: formData.prazo,
        andamento: formData.andamento,
        dataInicio: formData.dataInicio,
        dataConclusao: formData.dataConclusao,
        statusDetalhado: formData.statusDetalhado,
        orcamento,
        custoReal
      })
      
      setFormData(prev => ({ ...prev, indicador: indicadorCalculado }))
    }
  }, [formData.prazo, formData.andamento, formData.dataInicio, formData.dataConclusao, formData.statusDetalhado, formData.orcamento, formData.custoReal])

  const [novaTag, setNovaTag] = useState('')
  const [novoRisco, setNovoRisco] = useState('')
  const [novoRecurso, setNovoRecurso] = useState('')

  useEffect(() => {
    if (projeto && isOpen) {
      const prazoDate = projeto.prazo ? new Date(projeto.prazo).toISOString().split('T')[0] : ''
      const dataInicio = projeto.dataInicio ? new Date(projeto.dataInicio).toISOString().split('T')[0] : ''
      const dataConclusao = projeto.dataConclusao ? new Date(projeto.dataConclusao).toISOString().split('T')[0] : ''
      
      setFormData({
        nome: projeto.nome || '',
        objetivo: projeto.objetivo || '',
        responsavelId: projeto.responsavelId || '',
        gerenciaId: projeto.gerenciaId || '',
        equipe: projeto.equipe || [],
        prazo: prazoDate,
        andamento: projeto.andamento || 0,
        indicador: projeto.indicador || 'verde',
        orcamento: projeto.orcamento?.toString() || '',
        custoReal: projeto.custoReal?.toString() || '',
        prioridade: projeto.prioridade || 'media',
        categoria: projeto.categoria || '',
        tags: projeto.tags || [],
        riscos: projeto.riscos || [],
        recursos: projeto.recursos || [],
        observacoes: projeto.observacoes || '',
        dataInicio: dataInicio,
        dataConclusao: dataConclusao,
        statusDetalhado: projeto.statusDetalhado || 'planejamento'
      })
    }
  }, [projeto, isOpen])

  if (!isOpen || !projeto) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome || !formData.objetivo || !formData.responsavelId || !formData.gerenciaId || !formData.prazo) {
      showToast({
        type: 'error',
        title: 'Erro de validação',
        message: 'Por favor, preencha todos os campos obrigatórios.'
      })
      return
    }

    try {
      setLoading(true)
      
      const orcamento = formData.orcamento ? parseFloat(formData.orcamento) : undefined
      const custoReal = formData.custoReal ? parseFloat(formData.custoReal) : undefined
      
      // Calcula o indicador automaticamente
      const indicadorCalculado = calcularIndicadorProjeto({
        prazo: formData.prazo,
        andamento: formData.andamento,
        dataInicio: formData.dataInicio,
        dataConclusao: formData.dataConclusao,
        statusDetalhado: formData.statusDetalhado,
        orcamento,
        custoReal
      })
      
      const projetoData = {
        ...formData,
        indicador: indicadorCalculado,
        orcamento,
        custoReal,
        updatedAt: new Date().toISOString()
      }
      
      await updateProjeto(projeto.id, projetoData)
      
      showToast({
        type: 'success',
        title: 'Projeto atualizado!',
        message: 'O projeto foi atualizado com sucesso.'
      })
      
      onSuccess?.()
      onClose()
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Erro ao atualizar projeto',
        message: 'Tente novamente em alguns instantes.'
      })
    } finally {
      setLoading(false)
    }
  }

  const addTag = () => {
    if (novaTag && !formData.tags.includes(novaTag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, novaTag] }))
      setNovaTag('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  }

  const addRisco = () => {
    if (novoRisco && !formData.riscos.includes(novoRisco)) {
      setFormData(prev => ({ ...prev, riscos: [...prev.riscos, novoRisco] }))
      setNovoRisco('')
    }
  }

  const removeRisco = (risco: string) => {
    setFormData(prev => ({ ...prev, riscos: prev.riscos.filter(r => r !== risco) }))
  }

  const addRecurso = () => {
    if (novoRecurso && !formData.recursos.includes(novoRecurso)) {
      setFormData(prev => ({ ...prev, recursos: [...prev.recursos, novoRecurso] }))
      setNovoRecurso('')
    }
  }

  const removeRecurso = (recurso: string) => {
    setFormData(prev => ({ ...prev, recursos: prev.recursos.filter(r => r !== recurso) }))
  }

  const toggleEquipeMember = (servidorId: string) => {
    setFormData(prev => ({
      ...prev,
      equipe: prev.equipe.includes(servidorId)
        ? prev.equipe.filter(id => id !== servidorId)
        : [...prev.equipe, servidorId]
    }))
  }

  const tabs = [
    { id: 'basico', label: 'Informações Básicas', icon: Users },
    { id: 'avancado', label: 'Detalhes Avançados', icon: Tag }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Editar Projeto</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[60vh]">
          <div className="p-6 space-y-6">
            {/* Tab: Informações Básicas */}
            {activeTab === 'basico' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Projeto *
                    </label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Digite o nome do projeto"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria
                    </label>
                    <input
                      type="text"
                      value={formData.categoria}
                      onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Ex: Desenvolvimento, Infraestrutura, etc."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Objetivo *
                  </label>
                  <textarea
                    value={formData.objetivo}
                    onChange={(e) => setFormData(prev => ({ ...prev, objetivo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={3}
                    placeholder="Descreva o objetivo do projeto"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Responsável *
                    </label>
                    <select
                      value={formData.responsavelId}
                      onChange={(e) => setFormData(prev => ({ ...prev, responsavelId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gerência *
                    </label>
                    <select
                      value={formData.gerenciaId}
                      onChange={(e) => setFormData(prev => ({ ...prev, gerenciaId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value="">Selecione uma gerência</option>
                      {gerencias.map(gerencia => (
                        <option key={gerencia.id} value={gerencia.id}>
                          {gerencia.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prazo *
                    </label>
                    <input
                      type="date"
                      value={formData.prazo}
                      onChange={(e) => setFormData(prev => ({ ...prev, prazo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Andamento (%)
                    </label>
                    <input
                      type="number"
                      value={formData.andamento}
                      onChange={(e) => setFormData(prev => ({ ...prev, andamento: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Indicador (calculado automaticamente)
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full ${
                      formData.indicador === 'verde' ? 'bg-green-500' :
                      formData.indicador === 'amarelo' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm text-gray-600 capitalize">
                      {formData.indicador === 'verde' ? 'No Prazo' :
                       formData.indicador === 'amarelo' ? 'Atenção' : 'Atrasado'}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">
                      (baseado em prazo, andamento e custos)
                    </span>
                  </div>
                </div>

                {/* Equipe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Equipe ({formData.equipe.length} membros)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {servidores.map(servidor => (
                      <label key={servidor.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.equipe.includes(servidor.id)}
                          onChange={() => toggleEquipeMember(servidor.id)}
                          className="rounded"
                        />
                        <span className="text-sm">{servidor.nome}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Detalhes Avançados */}
            {activeTab === 'avancado' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign size={16} className="inline mr-1" />
                      Orçamento (R$)
                    </label>
                    <input
                      type="number"
                      value={formData.orcamento}
                      onChange={(e) => setFormData(prev => ({ ...prev, orcamento: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign size={16} className="inline mr-1" />
                      Custo Real (R$)
                    </label>
                    <input
                      type="number"
                      value={formData.custoReal}
                      onChange={(e) => setFormData(prev => ({ ...prev, custoReal: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prioridade
                    </label>
                    <select
                      value={formData.prioridade}
                      onChange={(e) => setFormData(prev => ({ ...prev, prioridade: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                      <option value="critica">Crítica</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status Detalhado
                    </label>
                    <select
                      value={formData.statusDetalhado}
                      onChange={(e) => setFormData(prev => ({ ...prev, statusDetalhado: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="planejamento">Planejamento</option>
                      <option value="execucao">Execução</option>
                      <option value="monitoramento">Monitoramento</option>
                      <option value="concluido">Concluído</option>
                      <option value="suspenso">Suspenso</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Início
                    </label>
                    <input
                      type="date"
                      value={formData.dataInicio}
                      onChange={(e) => setFormData(prev => ({ ...prev, dataInicio: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Conclusão
                    </label>
                    <input
                      type="date"
                      value={formData.dataConclusao}
                      onChange={(e) => setFormData(prev => ({ ...prev, dataConclusao: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag size={16} className="inline mr-1" />
                    Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={novaTag}
                      onChange={(e) => setNovaTag(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Digite uma tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-primary-600 hover:text-primary-800"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Riscos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <AlertTriangle size={16} className="inline mr-1" />
                    Riscos
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={novoRisco}
                      onChange={(e) => setNovoRisco(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Digite um risco"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRisco())}
                    />
                    <button
                      type="button"
                      onClick={addRisco}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.riscos.map((risco, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                      >
                        {risco}
                        <button
                          type="button"
                          onClick={() => removeRisco(risco)}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recursos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recursos Necessários
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={novoRecurso}
                      onChange={(e) => setNovoRecurso(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Digite um recurso"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRecurso())}
                    />
                    <button
                      type="button"
                      onClick={addRecurso}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.recursos.map((recurso, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {recurso}
                        <button
                          type="button"
                          onClick={() => removeRecurso(recurso)}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações
                  </label>
                  <textarea
                    value={formData.observacoes}
                    onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={3}
                    placeholder="Observações adicionais sobre o projeto..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalEditarProjeto

