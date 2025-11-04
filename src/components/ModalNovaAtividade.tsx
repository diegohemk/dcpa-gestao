import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { useAtividades } from '../hooks/useAtividades'
import { useServidores } from '../hooks/useServidores'
import { useGerencias } from '../hooks/useGerencias'

interface ModalNovaAtividadeProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const ModalNovaAtividade = ({ isOpen, onClose, onSuccess }: ModalNovaAtividadeProps) => {
  const { createAtividade } = useAtividades()
  const { servidores } = useServidores()
  const { gerencias } = useGerencias()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    frequencia: 'semanal' as 'diária' | 'semanal' | 'mensal',
    responsaveis: [] as string[],
    gerenciaId: '',
    status: 'pendente' as 'pendente' | 'em andamento' | 'concluída'
  })
  const [novoResponsavel, setNovoResponsavel] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.titulo || !formData.descricao || formData.responsaveis.length === 0 || !formData.gerenciaId) {
      alert('Por favor, preencha todos os campos obrigatórios e selecione pelo menos um responsável')
      return
    }

    try {
      setLoading(true)
      await createAtividade({
        ...formData,
        responsaveis: formData.responsaveis,
        ultimaAtualizacao: new Date().toISOString().split('T')[0],
        documentos: []
      })
      
      alert('Atividade criada com sucesso!')
      onSuccess?.()
      onClose()
      
      // Limpar formulário
      setFormData({
        titulo: '',
        descricao: '',
        frequencia: 'semanal',
        responsaveis: [],
        gerenciaId: '',
        status: 'pendente'
      })
      setNovoResponsavel('')
    } catch (error) {
      console.error('Erro ao criar atividade:', error)
      alert('Erro ao criar atividade. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Filtrar servidores pela gerência selecionada
  const servidoresFiltrados = formData.gerenciaId
    ? servidores.filter(s => s.gerenciaId === formData.gerenciaId && !formData.responsaveis.includes(s.id))
    : []

  const adicionarResponsavel = () => {
    if (novoResponsavel && !formData.responsaveis.includes(novoResponsavel)) {
      setFormData(prev => ({
        ...prev,
        responsaveis: [...prev.responsaveis, novoResponsavel]
      }))
      setNovoResponsavel('')
    }
  }

  const removerResponsavel = (id: string) => {
    setFormData(prev => ({
      ...prev,
      responsaveis: prev.responsaveis.filter(r => r !== id)
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Nova Atividade</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => handleChange('titulo', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Digite o título da atividade"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descrição *
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => handleChange('descricao', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[100px]"
              placeholder="Descreva a atividade"
              required
            />
          </div>

          {/* Gerência e Frequência */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Gerência *
              </label>
              <select
                value={formData.gerenciaId}
                onChange={(e) => {
                  handleChange('gerenciaId', e.target.value)
                  setFormData(prev => ({ ...prev, responsaveis: [] })) // Limpar responsáveis ao mudar gerência
                  setNovoResponsavel('')
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Selecione...</option>
                {gerencias.map(g => (
                  <option key={g.id} value={g.id}>{g.sigla}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Frequência *
              </label>
              <select
                value={formData.frequencia}
                onChange={(e) => handleChange('frequencia', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="diária">Diária</option>
                <option value="semanal">Semanal</option>
                <option value="mensal">Mensal</option>
              </select>
            </div>
          </div>

          {/* Responsáveis */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Responsáveis * (pelo menos um)
            </label>
            <div className="space-y-3">
              {/* Lista de responsáveis selecionados */}
              {formData.responsaveis.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.responsaveis.map(responsavelId => {
                    const servidor = servidores.find(s => s.id === responsavelId)
                    return servidor ? (
                      <span
                        key={responsavelId}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-800 rounded-lg text-sm"
                      >
                        {servidor.nome}
                        <button
                          type="button"
                          onClick={() => removerResponsavel(responsavelId)}
                          className="hover:text-primary-600"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ) : null
                  })}
                </div>
              )}
              
              {/* Adicionar novo responsável */}
              {formData.gerenciaId && servidoresFiltrados.length > 0 && (
                <div className="flex gap-2">
                  <select
                    value={novoResponsavel}
                    onChange={(e) => setNovoResponsavel(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Selecione um responsável...</option>
                    {servidoresFiltrados.map(s => (
                      <option key={s.id} value={s.id}>{s.nome}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={adicionarResponsavel}
                    disabled={!novoResponsavel}
                    className="px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              )}
              
              {!formData.gerenciaId && (
                <p className="text-sm text-gray-500">Selecione uma gerência primeiro para adicionar responsáveis</p>
              )}
              
              {formData.gerenciaId && servidoresFiltrados.length === 0 && formData.responsaveis.length === 0 && (
                <p className="text-sm text-gray-500">Todos os servidores desta gerência já foram adicionados</p>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="pendente">Pendente</option>
              <option value="em andamento">Em Andamento</option>
              <option value="concluída">Concluída</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Criar Atividade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalNovaAtividade

