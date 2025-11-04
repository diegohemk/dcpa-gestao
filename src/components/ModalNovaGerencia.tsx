import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useGerencias } from '../hooks/useGerencias'
import { Gerencia } from '../types'
import { useToast } from '../hooks/useToast'

interface ModalNovaGerenciaProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  gerencia?: Gerencia | null
}

const coresDisponiveis = [
  { nome: 'Azul', valor: '#3B82F6' },
  { nome: 'Verde', valor: '#10B981' },
  { nome: 'Roxo', valor: '#8B5CF6' },
  { nome: 'Rosa', valor: '#EC4899' },
  { nome: 'Laranja', valor: '#F59E0B' },
  { nome: 'Vermelho', valor: '#EF4444' },
  { nome: 'Indigo', valor: '#6366F1' },
  { nome: 'Cyan', valor: '#06B6D4' },
  { nome: 'Amarelo', valor: '#EAB308' },
  { nome: 'Teal', valor: '#14B8A6' },
  { nome: 'Violeta', valor: '#A855F7' },
  { nome: 'Pink', valor: '#F472B6' }
]

const ModalNovaGerencia = ({ isOpen, onClose, onSuccess, gerencia }: ModalNovaGerenciaProps) => {
  const { createGerencia, updateGerencia } = useGerencias()
  const { showToast } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    sigla: '',
    cor: '#3B82F6'
  })

  const isEditing = !!gerencia

  useEffect(() => {
    if (gerencia) {
      setFormData({
        nome: gerencia.nome,
        sigla: gerencia.sigla,
        cor: gerencia.cor
      })
    } else {
      setFormData({
        nome: '',
        sigla: '',
        cor: '#3B82F6'
      })
    }
  }, [gerencia, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome.trim() || !formData.sigla.trim()) {
      showToast({
        type: 'error',
        title: 'Campos obrigatórios',
        message: 'Por favor, preencha todos os campos obrigatórios.'
      })
      return
    }

    // Validar sigla (deve ser única e não muito longa)
    if (formData.sigla.length > 10) {
      showToast({
        type: 'error',
        title: 'Sigla inválida',
        message: 'A sigla deve ter no máximo 10 caracteres.'
      })
      return
    }

    try {
      setLoading(true)
      
      if (isEditing && gerencia) {
        await updateGerencia(gerencia.id, formData)
        showToast({
          type: 'success',
          title: 'Gerência atualizada!',
          message: 'A gerência foi atualizada com sucesso.'
        })
      } else {
        await createGerencia(formData)
        showToast({
          type: 'success',
          title: 'Gerência cadastrada!',
          message: 'A nova gerência foi cadastrada com sucesso.'
        })
      }
      
      onSuccess?.()
      onClose()
      
      setFormData({
        nome: '',
        sigla: '',
        cor: '#3B82F6'
      })
    } catch (error: any) {
      console.error('Erro ao salvar gerência:', error)
      
      // Verificar se é erro de sigla duplicada
      if (error?.message?.includes('unique') || error?.message?.includes('duplicate')) {
        showToast({
          type: 'error',
          title: 'Sigla já existe',
          message: 'Já existe uma gerência com esta sigla. Por favor, escolha outra.'
        })
      } else {
        showToast({
          type: 'error',
          title: 'Erro ao salvar',
          message: 'Não foi possível salvar a gerência. Tente novamente.'
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditing ? 'Editar Gerência' : 'Nova Gerência'}
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Ex: Gerência de Auditoria e Desempenho"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sigla *
            </label>
            <input
              type="text"
              value={formData.sigla}
              onChange={(e) => handleChange('sigla', e.target.value.toUpperCase())}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 uppercase"
              placeholder="Ex: GEaud"
              maxLength={10}
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Máximo de 10 caracteres. Será convertido para maiúsculas.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Cor da Gerência *
            </label>
            <div className="grid grid-cols-6 gap-3 mb-3">
              {coresDisponiveis.map((cor) => (
                <button
                  key={cor.valor}
                  type="button"
                  onClick={() => handleChange('cor', cor.valor)}
                  className={`w-full h-12 rounded-lg border-2 transition-all ${
                    formData.cor === cor.valor
                      ? 'border-gray-800 scale-110 shadow-lg'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: cor.valor }}
                  title={cor.nome}
                  disabled={loading}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.cor}
                onChange={(e) => handleChange('cor', e.target.value)}
                className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
                disabled={loading}
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.cor}
                  onChange={(e) => handleChange('cor', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                  placeholder="#3B82F6"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  disabled={loading}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Escolha uma cor para identificar esta gerência no sistema
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Salvando...' : (isEditing ? 'Atualizar Gerência' : 'Cadastrar Gerência')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalNovaGerencia

