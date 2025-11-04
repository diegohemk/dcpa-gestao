import { useState } from 'react'
import { X } from 'lucide-react'
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
    responsavelId: '',
    gerenciaId: '',
    status: 'pendente' as 'pendente' | 'em andamento' | 'concluída'
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.titulo || !formData.descricao || !formData.responsavelId || !formData.gerenciaId) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    try {
      setLoading(true)
      await createAtividade({
        ...formData,
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
        responsavelId: '',
        gerenciaId: '',
        status: 'pendente'
      })
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
    ? servidores.filter(s => s.gerenciaId === formData.gerenciaId)
    : []

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
                  handleChange('responsavelId', '') // Limpar responsável ao mudar gerência
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

          {/* Responsável e Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Responsável *
              </label>
              <select
                value={formData.responsavelId}
                onChange={(e) => handleChange('responsavelId', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
                disabled={!formData.gerenciaId}
              >
                <option value="">
                  {formData.gerenciaId ? 'Selecione...' : 'Selecione uma gerência primeiro'}
                </option>
                {servidoresFiltrados.map(s => (
                  <option key={s.id} value={s.id}>{s.nome}</option>
                ))}
              </select>
            </div>

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

