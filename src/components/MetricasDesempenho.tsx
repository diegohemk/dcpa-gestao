import { TrendingUp, TrendingDown, Minus, Star, Clock, Users, DollarSign, Target } from 'lucide-react'
import { MetricasAtividade, MetricasProjeto } from '../types'

interface MetricasAtividadeCardProps {
  metricas: MetricasAtividade
  titulo?: string
}

export const MetricasAtividadeCard = ({ metricas, titulo = "Métricas de Atividade" }: MetricasAtividadeCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200'
    if (score >= 60) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  return (
    <div className={`rounded-lg border p-4 ${getScoreBgColor(metricas.taxaConclusao)}`}>
      <h4 className="font-semibold text-gray-900 mb-3">{titulo}</h4>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Taxa de Conclusão */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Target size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Taxa de Conclusão</span>
          </div>
          <div className={`text-2xl font-bold ${getScoreColor(metricas.taxaConclusao)}`}>
            {metricas.taxaConclusao.toFixed(1)}%
          </div>
        </div>

        {/* Tempo Médio */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock size={16} className="text-orange-600" />
            <span className="text-sm font-medium text-gray-700">Tempo Médio</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {metricas.tempoMedioExecucao.toFixed(1)}h
          </div>
        </div>

        {/* Qualidade */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Star size={16} className="text-yellow-600" />
            <span className="text-sm font-medium text-gray-700">Qualidade</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {metricas.qualidadeExecucao.toFixed(1)}/5
          </div>
        </div>

        {/* Volume Processado */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Users size={16} className="text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Volume</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {metricas.volumeProcessado}
          </div>
        </div>
      </div>

      {/* Métricas Adicionais */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Conformidade:</span>
            <span className="ml-1 font-medium">{metricas.conformidade.toFixed(1)}%</span>
          </div>
          <div>
            <span className="text-gray-600">Eficiência:</span>
            <span className="ml-1 font-medium">{metricas.eficienciaTemporal.toFixed(1)}</span>
          </div>
          <div>
            <span className="text-gray-600">Frequência:</span>
            <span className="ml-1 font-medium">{metricas.frequenciaExecucao}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface MetricasProjetoCardProps {
  metricas: MetricasProjeto
  titulo?: string
}

export const MetricasProjetoCard = ({ metricas, titulo = "Métricas de Projeto" }: MetricasProjetoCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200'
    if (score >= 60) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  return (
    <div className={`rounded-lg border p-4 ${getScoreBgColor(metricas.prazoCumprimento)}`}>
      <h4 className="font-semibold text-gray-900 mb-3">{titulo}</h4>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Prazo Cumprimento */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Target size={16} className="text-green-600" />
            <span className="text-sm font-medium text-gray-700">Prazo</span>
          </div>
          <div className={`text-2xl font-bold ${getScoreColor(metricas.prazoCumprimento)}`}>
            {metricas.prazoCumprimento.toFixed(1)}%
          </div>
        </div>

        {/* Escopo Completude */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Escopo</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {metricas.escopoCompletude.toFixed(1)}%
          </div>
        </div>

        {/* Qualidade Entregas */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Star size={16} className="text-yellow-600" />
            <span className="text-sm font-medium text-gray-700">Qualidade</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {metricas.qualidadeEntregas.toFixed(1)}/5
          </div>
        </div>

        {/* Utilização Recursos */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Users size={16} className="text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Recursos</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {metricas.utilizacaoRecursos.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Métricas Adicionais */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Atraso Médio:</span>
            <span className="ml-1 font-medium">{metricas.atrasoMedio} dias</span>
          </div>
          <div>
            <span className="text-gray-600">Variação Orçamento:</span>
            <span className={`ml-1 font-medium ${metricas.variacaoOrcamento >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {metricas.variacaoOrcamento >= 0 ? '+' : ''}{metricas.variacaoOrcamento.toFixed(1)}%
            </span>
          </div>
          <div>
            <span className="text-gray-600">Eficiência Financeira:</span>
            <span className="ml-1 font-medium">{metricas.eficienciaFinanceira.toFixed(1)}</span>
          </div>
          <div>
            <span className="text-gray-600">Satisfação Equipe:</span>
            <span className="ml-1 font-medium">{metricas.satisfacaoEquipe.toFixed(1)}/5</span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ComparativoTendenciaProps {
  valorAtual: number
  valorAnterior: number
  label: string
  formato?: 'percentual' | 'numero' | 'tempo'
}

export const ComparativoTendencia = ({ 
  valorAtual, 
  valorAnterior, 
  label, 
  formato = 'numero' 
}: ComparativoTendenciaProps) => {
  const variacao = valorAnterior > 0 ? ((valorAtual - valorAnterior) / valorAnterior) * 100 : 0
  
  const formatarValor = (valor: number) => {
    switch (formato) {
      case 'percentual':
        return `${valor.toFixed(1)}%`
      case 'tempo':
        return `${valor.toFixed(1)}h`
      default:
        return valor.toFixed(1)
    }
  }

  const getTendenciaIcon = () => {
    if (variacao > 5) return <TrendingUp size={16} className="text-green-600" />
    if (variacao < -5) return <TrendingDown size={16} className="text-red-600" />
    return <Minus size={16} className="text-gray-600" />
  }

  const getTendenciaColor = () => {
    if (variacao > 5) return 'text-green-600'
    if (variacao < -5) return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <div className="flex items-center gap-1">
          {getTendenciaIcon()}
          <span className={`text-sm font-medium ${getTendenciaColor()}`}>
            {Math.abs(variacao).toFixed(1)}%
          </span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-bold text-gray-900">
            {formatarValor(valorAtual)}
          </div>
          <div className="text-xs text-gray-500">Atual</div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-600">
            {formatarValor(valorAnterior)}
          </div>
          <div className="text-xs text-gray-500">Anterior</div>
        </div>
      </div>
    </div>
  )
}
