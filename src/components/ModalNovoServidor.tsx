import { useState, useEffect } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { useServidores } from '../hooks/useServidores'
import { useGerencias } from '../hooks/useGerencias'
import { Servidor } from '../types'

interface ModalNovoServidorProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  servidor?: Servidor | null
}

const ModalNovoServidor = ({ isOpen, onClose, onSuccess, servidor }: ModalNovoServidorProps) => {
  const { createServidor, updateServidor } = useServidores()
  const { gerencias } = useGerencias()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    cargo: '',
    gerenciaId: '',
    email: '',
    telefone: '',
    status: 'ativo' as 'ativo' | 'inativo' | 'afastado',
    atribuicoes: [''] as string[]
  })

  const isEditing = !!servidor

  useEffect(() => {
    if (servidor) {
      setFormData({
        nome: servidor.nome,
        cargo: servidor.cargo,
        gerenciaId: servidor.gerenciaId,
        email: servidor.email || '',
        telefone: servidor.telefone || '',
        status: (servidor.status as any) || 'ativo',
        atribuicoes: servidor.atribuicoes.length > 0 ? servidor.atribuicoes : ['']
      })
    } else {
      setFormData({
        nome: '',
        cargo: '',
        gerenciaId: '',
        email: '',
        telefone: '',
        status: 'ativo',
        atribuicoes: ['']
      })
    }
  }, [servidor])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome || !formData.cargo || !formData.gerenciaId) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    const atribuicoesLimpas = formData.atribuicoes.filter(a => a.trim() !== '')

    try {
      setLoading(true)
      
      const servidorData = {
        nome: formData.nome,
        cargo: formData.cargo,
        gerenciaId: formData.gerenciaId,
        email: formData.email,
        telefone: formData.telefone,
        status: formData.status,
        atribuicoes: atribuicoesLimpas
      }

      if (isEditing && servidor) {
        await updateServidor(servidor.id, servidorData)
        alert('Servidor atualizado com sucesso!')
      } else {
        await createServidor(servidorData)
        alert('Servidor cadastrado com sucesso!')
      }
      
      onSuccess?.()
      onClose()
      
      setFormData({
        nome: '',
        cargo: '',
        gerenciaId: '',
        email: '',
        telefone: '',
        status: 'ativo',
        atribuicoes: ['']
      })
    } catch (error) {
      console.error('Erro ao salvar servidor:', error)
      alert('Erro ao salvar servidor. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAtribuicaoChange = (index: number, value: string) => {
    const novasAtribuicoes = [...formData.atribuicoes]
    novasAtribuicoes[index] = value
    handleChange('atribuicoes', novasAtribuicoes)
  }

  const addAtribuicao = () => {
    handleChange('atribuicoes', [...formData.atribuicoes, ''])
  }

  const removeAtribuicao = (index: number) => {
    const novasAtribuicoes = formData.atribuicoes.filter((_, i) => i !== index)
    handleChange('atribuicoes', novasAtribuicoes.length > 0 ? novasAtribuicoes : [''])
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditing ? 'Editar Servidor' : 'Novo Servidor'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo *</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Ex: João Silva Santos"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cargo *</label>
              <input
                type="text"
                value={formData.cargo}
                onChange={(e) => handleChange('cargo', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Ex: Analista Ambiental"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="afastado">Afastado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="email@exemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Telefone</label>
              <input
                type="tel"
                value={formData.telefone}
                onChange={(e) => handleChange('telefone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Gerência *</label>
            <select
              value={formData.gerenciaId}
              onChange={(e) => handleChange('gerenciaId', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Selecione...</option>
              {gerencias.map(g => (
                <option key={g.id} value={g.id}>{g.sigla} - {g.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">Atribuições</label>
              <button
                type="button"
                onClick={addAtribuicao}
                className="flex items-center gap-1 px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <Plus size={16} />
                Adicionar
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.atribuicoes.map((atribuicao, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={atribuicao}
                    onChange={(e) => handleAtribuicaoChange(index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder={`Atribuição ${index + 1}`}
                  />
                  {formData.atribuicoes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAtribuicao(index)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Adicione as principais atribuições do servidor
            </p>
          </div>

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
              {loading ? 'Salvando...' : (isEditing ? 'Atualizar Servidor' : 'Cadastrar Servidor')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalNovoServidor

