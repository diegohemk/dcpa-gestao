import { useState } from 'react'
import { X, Save, AlertCircle } from 'lucide-react'
import { FatorComplexidadeProjeto } from '../types'

interface ModalFatorComplexidadeProjetoProps {
  isOpen: boolean
  onClose: () => void
  onSave: (fatorComplexidade: FatorComplexidadeProjeto) => void
  fatorComplexidade?: FatorComplexidadeProjeto
}

const ModalFatorComplexidadeProjeto = ({
  isOpen,
  onClose,
  onSave,
  fatorComplexidade
}: ModalFatorComplexidadeProjetoProps) => {
  const [formData, setFormData] = useState<FatorComplexidadeProjeto>({
    tamanho: fatorComplexidade?.tamanho || 'pequeno',
    duracao: fatorComplexidade?.duracao || 30,
    equipe: fatorComplexidade?.equipe || 3,
    orcamento: fatorComplexidade?.orcamento || 10000,
    risco: fatorComplexidade?.risco || 'baixo'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (formData.duracao <= 0) {
      newErrors.duracao = 'Duração deve ser maior que zero'
    }

    if (formData.equipe <= 0) {
      newErrors.equipe = 'Tamanho da equipe deve ser maior que zero'
    }

    if (formData.orcamento < 0) {
      newErrors.orcamento = 'Orçamento não pode ser negativo'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData)
      onClose()
    }
  }

  const handleInputChange = (field: keyof FatorComplexidadeProjeto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Fator de Complexidade - Projeto
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Tamanho */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamanho do Projeto
            </label>
            <select
              value={formData.tamanho}
              onChange={(e) => handleInputChange('tamanho', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="pequeno">Pequeno - Até 1 mês, equipe pequena</option>
              <option value="medio">Médio - 1-6 meses, equipe média</option>
              <option value="grande">Grande - 6-12 meses, equipe grande</option>
              <option value="mega">Mega - Mais de 12 meses, múltiplas equipes</option>
            </select>
          </div>

          {/* Duração */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duração (dias)
            </label>
            <input
              type="number"
              min="1"
              value={formData.duracao}
              onChange={(e) => handleInputChange('duracao', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.duracao ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.duracao && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.duracao}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Duração estimada do projeto em dias
            </p>
          </div>

          {/* Equipe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamanho da Equipe (pessoas)
            </label>
            <input
              type="number"
              min="1"
              value={formData.equipe}
              onChange={(e) => handleInputChange('equipe', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.equipe ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.equipe && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.equipe}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Número de pessoas na equipe do projeto
            </p>
          </div>

          {/* Orçamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Orçamento (R$)
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={formData.orcamento}
              onChange={(e) => handleInputChange('orcamento', parseFloat(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.orcamento ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.orcamento && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.orcamento}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Orçamento total do projeto
            </p>
          </div>

          {/* Risco */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nível de Risco
            </label>
            <select
              value={formData.risco}
              onChange={(e) => handleInputChange('risco', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="baixo">Baixo - Baixa probabilidade de problemas</option>
              <option value="medio">Médio - Probabilidade moderada de problemas</option>
              <option value="alto">Alto - Alta probabilidade de problemas</option>
              <option value="critico">Crítico - Muito alta probabilidade de problemas críticos</option>
            </select>
          </div>

          {/* Preview dos Pontos */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Preview da Pontuação</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Duração: {formData.duracao <= 30 ? '1 ponto' : formData.duracao <= 180 ? '2 pontos' : formData.duracao <= 365 ? '3 pontos' : '4 pontos'}</p>
              <p>• Equipe: {formData.equipe <= 3 ? '1 ponto' : formData.equipe <= 8 ? '2 pontos' : formData.equipe <= 15 ? '3 pontos' : '4 pontos'}</p>
              <p>• Orçamento: {formData.orcamento <= 10000 ? '1 ponto' : formData.orcamento <= 100000 ? '2 pontos' : formData.orcamento <= 1000000 ? '3 pontos' : '4 pontos'}</p>
              <p>• Risco: {
                formData.risco === 'baixo' ? '1 ponto' :
                formData.risco === 'medio' ? '2 pontos' :
                formData.risco === 'alto' ? '3 pontos' : '4 pontos'
              }</p>
              <p>• Multiplicador Tamanho: {
                formData.tamanho === 'pequeno' ? '1.0x' :
                formData.tamanho === 'medio' ? '1.5x' :
                formData.tamanho === 'grande' ? '2.0x' : '2.5x'
              }</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <Save size={16} />
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalFatorComplexidadeProjeto
