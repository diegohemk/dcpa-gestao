import { useState } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Users,
  Target,
  BarChart3,
  Download,
  RefreshCw
} from 'lucide-react'
import { useDesempenho } from '../hooks/useDesempenho'
import { DashboardDesempenho } from '../types'

interface DashboardDesempenhoProps {
  gerenciaId?: string
}

const DashboardDesempenhoComponent = ({ gerenciaId }: DashboardDesempenhoProps) => {
  const { dashboard, loading, error, fetchDashboard } = useDesempenho(gerenciaId)
  const [activeTab, setActiveTab] = useState<'geral' | 'atividades' | 'projetos'>('geral')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard de desempenho...</p>
        </div>
      </div>
    )
  }

  if (error || !dashboard) {
    return (
      <div className="text-center py-8">
        <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
        <p className="text-red-600 font-medium">Erro ao carregar dashboard</p>
        <p className="text-gray-500 text-sm mt-1">{error}</p>
        <button 
          onClick={fetchDashboard}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <RefreshCw size={16} className="inline mr-2" />
          Tentar Novamente
        </button>
      </div>
    )
  }

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

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'melhorando':
        return <TrendingUp size={16} className="text-green-600" />
      case 'piorando':
        return <TrendingDown size={16} className="text-red-600" />
      default:
        return <Minus size={16} className="text-gray-600" />
    }
  }

  const getTendenciaColor = (tendencia: string) => {
    switch (tendencia) {
      case 'melhorando':
        return 'text-green-600'
      case 'piorando':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard de Desempenho</h2>
          <p className="text-gray-600 mt-1">Visão geral do desempenho organizacional</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchDashboard}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={16} className="mr-2" />
            Atualizar
          </button>
          <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
            <Download size={16} className="mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Score Geral */}
      <div className={`rounded-xl border-2 p-6 ${getScoreBgColor(dashboard.scoreGeral)}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Score Geral</h3>
            <p className="text-sm text-gray-600">Performance consolidada</p>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${getScoreColor(dashboard.scoreGeral)}`}>
              {dashboard.scoreGeral}
            </div>
            <div className="text-sm text-gray-500">de 100 pontos</div>
          </div>
        </div>
        
        {/* Barra de Progresso */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              dashboard.scoreGeral >= 80 ? 'bg-green-500' :
              dashboard.scoreGeral >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${dashboard.scoreGeral}%` }}
          ></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'geral', label: 'Visão Geral', icon: BarChart3 },
              { id: 'atividades', label: 'Atividades', icon: CheckCircle },
              { id: 'projetos', label: 'Projetos', icon: Target }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'geral' && (
            <div className="space-y-6">
              {/* Scores por Tipo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Score Atividades */}
                <div className={`rounded-lg border p-4 ${getScoreBgColor(dashboard.scoreAtividades)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={20} className="text-blue-600" />
                      <span className="font-semibold text-gray-900">Atividades</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {getTendenciaIcon(dashboard.tendenciaAtividades)}
                      <span className={`text-sm font-medium ${getTendenciaColor(dashboard.tendenciaAtividades)}`}>
                        {dashboard.tendenciaAtividades}
                      </span>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(dashboard.scoreAtividades)}`}>
                    {dashboard.scoreAtividades}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Performance em rotinas operacionais
                  </div>
                </div>

                {/* Score Projetos */}
                <div className={`rounded-lg border p-4 ${getScoreBgColor(dashboard.scoreProjetos)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Target size={20} className="text-purple-600" />
                      <span className="font-semibold text-gray-900">Projetos</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {getTendenciaIcon(dashboard.tendenciaProjetos)}
                      <span className={`text-sm font-medium ${getTendenciaColor(dashboard.tendenciaProjetos)}`}>
                        {dashboard.tendenciaProjetos}
                      </span>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(dashboard.scoreProjetos)}`}>
                    {dashboard.scoreProjetos}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Performance em iniciativas estratégicas
                  </div>
                </div>
              </div>

              {/* Comparativo Temporal */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Comparativo com Mês Anterior</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Atividades</span>
                    <div className="flex items-center gap-2">
                      {dashboard.comparativoMesAnterior.atividades > 0 ? (
                        <TrendingUp size={16} className="text-green-600" />
                      ) : (
                        <TrendingDown size={16} className="text-red-600" />
                      )}
                      <span className={`font-medium ${
                        dashboard.comparativoMesAnterior.atividades > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {Math.abs(dashboard.comparativoMesAnterior.atividades).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Projetos</span>
                    <div className="flex items-center gap-2">
                      {dashboard.comparativoMesAnterior.projetos > 0 ? (
                        <TrendingUp size={16} className="text-green-600" />
                      ) : (
                        <TrendingDown size={16} className="text-red-600" />
                      )}
                      <span className={`font-medium ${
                        dashboard.comparativoMesAnterior.projetos > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {Math.abs(dashboard.comparativoMesAnterior.projetos).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'atividades' && (
            <div className="space-y-4">
              <div className="text-center py-8 text-gray-500">
                <CheckCircle size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="font-medium">Métricas de Atividades</p>
                <p className="text-sm">Detalhes das atividades serão exibidos aqui</p>
              </div>
            </div>
          )}

          {activeTab === 'projetos' && (
            <div className="space-y-4">
              <div className="text-center py-8 text-gray-500">
                <Target size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="font-medium">Métricas de Projetos</p>
                <p className="text-sm">Detalhes dos projetos serão exibidos aqui</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alertas */}
      {(dashboard.alertas.atividadesAtrasadas > 0 || dashboard.alertas.projetosCriticos > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-yellow-800 mb-2">Alertas de Desempenho</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                {dashboard.alertas.atividadesAtrasadas > 0 && (
                  <li>• {dashboard.alertas.atividadesAtrasadas} atividades atrasadas</li>
                )}
                {dashboard.alertas.projetosCriticos > 0 && (
                  <li>• {dashboard.alertas.projetosCriticos} projetos críticos</li>
                )}
                {dashboard.alertas.recursosSobrecarregados.length > 0 && (
                  <li>• {dashboard.alertas.recursosSobrecarregados.length} recursos sobrecarregados</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardDesempenhoComponent
