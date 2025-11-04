import { useState } from 'react'
import { X, Save, AlertCircle } from 'lucide-react'
import { FatorComplexidadeAtividade } from '../types'

interface ModalFatorComplexidadeAtividadeProps {
  isOpen: boolean
  onClose: () => void
  onSave: (fatorComplexidade: FatorComplexidadeAtividade) => void
  fatorComplexidade?: FatorComplexidadeAtividade
}

const ModalFatorComplexidadeAtividade = ({
  isOpen,
  onClose,
  onSave,
  fatorComplexidade
}: ModalFatorComplexidadeAtividadeProps) => {
  const [formData, setFormData] = useState<FatorComplexidadeAtividade>({
    nivelRotina: fatorComplexidade?.nivelRotina || 'simples',
    tempoEstimado: fatorComplexidade?.tempoEstimado || 1,
    recursosNecessarios: fatorComplexidade?.recursosNecessarios || 1,
    criticidade: fatorComplexidade?.criticidade || 'baixa'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (formData.tempoEstimado <= 0) {
      newErrors.tempoEstimado = 'Tempo estimado deve ser maior que zero'
    }

    if (formData.recursosNecessarios <= 0) {
      newErrors.recursosNecessarios = 'Recursos necessários deve ser maior que zero'
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

  const handleInputChange = (field: keyof FatorComplexidadeAtividade, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Fator de Complexidade - Atividade
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
          {/* Nível de Rotina */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nível de Rotina
            </label>
            <select
              value={formData.nivelRotina}
              onChange={(e) => handleInputChange('nivelRotina', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="simples">Simples - Tarefa básica, procedimento claro</option>
              <option value="moderada">Moderada - Requer conhecimento específico, algumas decisões</option>
              <option value="complexa">Complexa - Requer expertise, múltiplas decisões, análise</option>
            </select>
          </div>

          {/* Tempo Estimado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tempo Estimado (horas)
            </label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={formData.tempoEstimado}
              onChange={(e) => handleInputChange('tempoEstimado', parseFloat(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.tempoEstimado ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.tempoEstimado && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.tempoEstimado}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Tempo médio necessário para executar a atividade
            </p>
          </div>

          {/* Recursos Necessários */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recursos Necessários (pessoas)
            </label>
            <input
              type="number"
              min="1"
              value={formData.recursosNecessarios}
              onChange={(e) => handleInputChange('recursosNecessarios', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.recursosNecessarios ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.recursosNecessarios && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.recursosNecessarios}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Número de pessoas envolvidas na execução
            </p>
          </div>

          {/* Criticidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Criticidade
            </label>
            <select
              value={formData.criticidade}
              onChange={(e) => handleInputChange('criticidade', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="baixa">Baixa - Impacto mínimo se não executada</option>
              <option value="media">Média - Impacto moderado na operação</option>
              <option value="alta">Alta - Impacto significativo na operação</option>
              <option value="critica">Crítica - Impacto crítico, pode parar operação</option>
            </select>
          </div>

          {/* Preview dos Pontos */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Preview da Pontuação</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Tempo: {formData.tempoEstimado <= 2 ? '1 ponto' : formData.tempoEstimado <= 8 ? '2 pontos' : '3 pontos'}</p>
              <p>• Recursos: {formData.recursosNecessarios === 1 ? '1 ponto' : formData.recursosNecessarios <= 3 ? '2 pontos' : '3 pontos'}</p>
              <p>• Criticidade: {
                formData.criticidade === 'baixa' ? '1 ponto' :
                formData.criticidade === 'media' ? '2 pontos' :
                formData.criticidade === 'alta' ? '3 pontos' : '4 pontos'
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

export default ModalFatorComplexidadeAtividade
