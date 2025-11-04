import { useState } from 'react'
import { X, Plus, Calendar, Clock, Users, MapPin, BookOpen, Save, Loader } from 'lucide-react'
import { Curso, Gerencia } from '../types'
import { useToast } from '../hooks/useToast'

interface ModalCursoProps {
  isOpen: boolean
  onClose: () => void
  onSave: (curso: Omit<Curso, 'id' | 'createdAt' | 'updatedAt' | 'gerencia'>) => Promise<void>
  curso?: Curso | null
  servidores: any[] // Mantido para participantes, mas não precisa mais do tipo Servidor
  gerencias: Gerencia[]
  title: string
}

const ModalCurso = ({ 
  isOpen, 
  onClose, 
  onSave, 
  curso, 
  servidores, 
  gerencias, 
  title 
}: ModalCursoProps) => {
  const [formData, setFormData] = useState({
    nome: curso?.nome || '',
    descricao: curso?.descricao || '',
    ministrado: curso?.ministrado || false,
    dataInicio: curso?.dataInicio || '',
    dataFim: curso?.dataFim || '',
    cargaHoraria: curso?.cargaHoraria || '',
    gerenciaId: curso?.gerenciaId || '',
    participantes: curso?.participantes || [],
    status: curso?.status || 'planejado' as const,
    tipo: (curso?.tipo === 'online' || curso?.tipo === 'presencial' ? 'interno' : curso?.tipo) || 'interno' as 'interno' | 'externo',
    modalidade: curso?.modalidade || (curso?.tipo === 'online' ? 'online' : curso?.tipo === 'presencial' ? 'presencial' : 'hibrido') as 'hibrido' | 'online' | 'presencial',
    local: curso?.local || '',
    observacoes: curso?.observacoes || '',
    documentos: curso?.documentos || []
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [novoParticipante, setNovoParticipante] = useState('')
  const [novaTag, setNovaTag] = useState('')
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome.trim()) {
      showToast({
        type: 'error',
        title: 'Erro de validação',
        message: 'Nome do curso é obrigatório.'
      })
      return
    }

    try {
      setIsSubmitting(true)
      await onSave(formData)
      showToast({
        type: 'success',
        title: 'Sucesso!',
        message: `Curso ${curso ? 'atualizado' : 'criado'} com sucesso.`
      })
      onClose()
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao salvar curso. Tente novamente.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const addParticipante = () => {
    if (novoParticipante && !formData.participantes.includes(novoParticipante)) {
      setFormData(prev => ({
        ...prev,
        participantes: [...prev.participantes, novoParticipante]
      }))
      setNovoParticipante('')
    }
  }

  const removeParticipante = (participanteId: string) => {
    setFormData(prev => ({
      ...prev,
      participantes: prev.participantes.filter(id => id !== participanteId)
    }))
  }

  const addTag = () => {
    if (novaTag && !formData.documentos.includes(novaTag)) {
      setFormData(prev => ({
        ...prev,
        documentos: [...prev.documentos, novaTag]
      }))
      setNovaTag('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      documentos: prev.documentos.filter(t => t !== tag)
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Curso *
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Digite o nome do curso"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as 'interno' | 'externo' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="interno">Interno</option>
                <option value="externo">Externo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modalidade
              </label>
              <select
                value={formData.modalidade}
                onChange={(e) => setFormData(prev => ({ ...prev, modalidade: e.target.value as 'hibrido' | 'online' | 'presencial' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="hibrido">Híbrido</option>
                <option value="online">Online</option>
                <option value="presencial">Presencial</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
              placeholder="Descreva o curso..."
            />
          </div>

          {/* Datas e Carga Horária */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                Data de Fim
              </label>
              <input
                type="date"
                value={formData.dataFim}
                onChange={(e) => setFormData(prev => ({ ...prev, dataFim: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carga Horária
              </label>
              <input
                type="number"
                value={formData.cargaHoraria}
                onChange={(e) => setFormData(prev => ({ ...prev, cargaHoraria: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Horas"
                min="0"
              />
            </div>
          </div>

          {/* Status e Ministrado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="planejado">Planejado</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluido">Concluído</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.ministrado}
                  onChange={(e) => setFormData(prev => ({ ...prev, ministrado: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Curso Ministrado</span>
              </label>
            </div>
          </div>

          {/* Gerência */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gerência
            </label>
            <select
              value={formData.gerenciaId}
              onChange={(e) => setFormData(prev => ({ ...prev, gerenciaId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Selecione uma gerência</option>
              {gerencias.map(gerencia => (
                <option key={gerencia.id} value={gerencia.id}>
                  {gerencia.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Local */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Local
            </label>
            <input
              type="text"
              value={formData.local}
              onChange={(e) => setFormData(prev => ({ ...prev, local: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Local do curso"
            />
          </div>

          {/* Participantes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Participantes
            </label>
            <div className="flex gap-2 mb-2">
              <select
                value={novoParticipante}
                onChange={(e) => setNovoParticipante(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Selecione um participante</option>
                {servidores.filter(s => !formData.participantes.includes(s.id)).map(servidor => (
                  <option key={servidor.id} value={servidor.id}>
                    {servidor.nome}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addParticipante}
                className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.participantes.map(participanteId => {
                const servidor = servidores.find(s => s.id === participanteId)
                return (
                  <span
                    key={participanteId}
                    className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                  >
                    {servidor?.nome}
                    <button
                      type="button"
                      onClick={() => removeParticipante(participanteId)}
                      className="ml-2 text-primary-600 hover:text-primary-800"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )
              })}
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
              placeholder="Observações adicionais..."
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalCurso
