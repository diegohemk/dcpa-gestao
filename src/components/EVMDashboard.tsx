import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign,
  Calendar,
  Target,
  BarChart3,
  RefreshCw,
  Download,
  Eye
} from 'lucide-react'
import { EVMData, EVMResumo } from '../types'
import { useEVM } from '../hooks/useWBS'

interface EVMDashboardProps {
  projetoId: string
}

const EVMDashboard = ({ projetoId }: EVMDashboardProps) => {
  const { evmData, evmResumo, historicoEVM, loading, error, calcularEVM } = useEVM(projetoId)
  const [activeTab, setActiveTab] = useState<'resumo' | 'historico' | 'graficos'>('resumo')
  const [dataMedicao, setDataMedicao] = useState(new Date().toISOString().split('T')[0])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excelente':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'bom':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'atencao':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'critico':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excelente':
        return <CheckCircle size={20} className="text-green-600" />
      case 'bom':
        return <CheckCircle size={20} className="text-blue-600" />
      case 'atencao':
        return <AlertTriangle size={20} className="text-yellow-600" />
      case 'critico':
        return <AlertTriangle size={20} className="text-red-600" />
      default:
        return <Minus size={20} className="text-gray-600" />
    }
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
  }

  const handleCalcularEVM = async () => {
    try {
      await calcularEVM(dataMedicao)
    } catch (error) {
      console.error('Erro ao calcular EVM:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando métricas EVM...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
        <p className="text-red-600 font-medium">Erro ao carregar EVM</p>
        <p className="text-gray-500 text-sm mt-1">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Earned Value Management (EVM)</h3>
          <p className="text-sm text-gray-600">Métricas de performance do projeto</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Data de Medição:</label>
            <input
              type="date"
              value={dataMedicao}
              onChange={(e) => setDataMedicao(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>
          <button
            onClick={handleCalcularEVM}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <RefreshCw size={16} />
            Calcular EVM
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            <Download size={16} />
            Exportar
          </button>
        </div>
      </div>

      {/* Status Geral */}
      {evmResumo && (
        <div className={`rounded-xl border-2 p-6 ${getStatusColor(evmResumo.statusGeral)}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {getStatusIcon(evmResumo.statusGeral)}
              <div>
                <h4 className="text-lg font-semibold">Status Geral do Projeto</h4>
                <p className="text-sm opacity-75">
                  {evmResumo.statusGeral === 'excelente' && 'Projeto executando perfeitamente'}
                  {evmResumo.statusGeral === 'bom' && 'Projeto dentro dos parâmetros aceitáveis'}
                  {evmResumo.statusGeral === 'atencao' && 'Projeto requer atenção'}
                  {evmResumo.statusGeral === 'critico' && 'Projeto em situação crítica'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {getTendenciaIcon(evmResumo.tendencia)}
              <span className="text-sm font-medium">
                {evmResumo.tendencia === 'melhorando' && 'Melhorando'}
                {evmResumo.tendencia === 'estavel' && 'Estável'}
                {evmResumo.tendencia === 'piorando' && 'Piorando'}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {evmResumo.spiAtual.toFixed(2)}
              </div>
              <div className="text-sm opacity-75">SPI (Schedule)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {evmResumo.cpiAtual.toFixed(2)}
              </div>
              <div className="text-sm opacity-75">CPI (Cost)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {formatCurrency(evmResumo.eacProjetado)}
              </div>
              <div className="text-sm opacity-75">EAC Projetado</div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'resumo', label: 'Resumo', icon: BarChart3 },
              { id: 'historico', label: 'Histórico', icon: Calendar },
              { id: 'graficos', label: 'Gráficos', icon: TrendingUp }
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
          {activeTab === 'resumo' && evmResumo && (
            <div className="space-y-6">
              {/* Métricas Principais */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Planned Value */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={20} className="text-blue-600" />
                    <span className="font-semibold text-blue-800">Planned Value (PV)</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">
                    {formatCurrency(evmResumo.pvAtual)}
                  </div>
                  <div className="text-sm text-blue-700 mt-1">
                    Valor planejado até hoje
                  </div>
                </div>

                {/* Earned Value */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={20} className="text-green-600" />
                    <span className="font-semibold text-green-800">Earned Value (EV)</span>
                  </div>
                  <div className="text-2xl font-bold text-green-900">
                    {formatCurrency(evmResumo.evAtual)}
                  </div>
                  <div className="text-sm text-green-700 mt-1">
                    Valor ganho até hoje
                  </div>
                </div>

                {/* Actual Cost */}
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign size={20} className="text-red-600" />
                    <span className="font-semibold text-red-800">Actual Cost (AC)</span>
                  </div>
                  <div className="text-2xl font-bold text-red-900">
                    {formatCurrency(evmResumo.acAtual)}
                  </div>
                  <div className="text-sm text-red-700 mt-1">
                    Custo real até hoje
                  </div>
                </div>
              </div>

              {/* Índices de Performance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Schedule Performance */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Performance de Cronograma</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">SPI (Schedule Performance Index)</span>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${
                          evmResumo.spiAtual >= 1.0 ? 'text-green-600' : 
                          evmResumo.spiAtual >= 0.9 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {evmResumo.spiAtual.toFixed(3)}
                        </span>
                        {evmResumo.spiAtual >= 1.0 ? (
                          <CheckCircle size={16} className="text-green-600" />
                        ) : (
                          <AlertTriangle size={16} className="text-yellow-600" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">SV (Schedule Variance)</span>
                      <span className={`font-bold ${
                        evmResumo.svAtual >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(evmResumo.svAtual)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cost Performance */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Performance de Custo</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">CPI (Cost Performance Index)</span>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${
                          evmResumo.cpiAtual >= 1.0 ? 'text-green-600' : 
                          evmResumo.cpiAtual >= 0.9 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {evmResumo.cpiAtual.toFixed(3)}
                        </span>
                        {evmResumo.cpiAtual >= 1.0 ? (
                          <CheckCircle size={16} className="text-green-600" />
                        ) : (
                          <AlertTriangle size={16} className="text-yellow-600" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">CV (Cost Variance)</span>
                      <span className={`font-bold ${
                        evmResumo.cvAtual >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(evmResumo.cvAtual)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Projeções */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4">Projeções do Projeto</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(evmResumo.eacProjetado)}
                    </div>
                    <div className="text-sm text-gray-600">EAC (Estimate at Completion)</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(evmResumo.etcProjetado)}
                    </div>
                    <div className="text-sm text-gray-600">ETC (Estimate to Complete)</div>
                  </div>
                  
                  <div className="text-center">
                    <div className={`text-lg font-bold ${
                      evmResumo.vacProjetado >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(evmResumo.vacProjetado)}
                    </div>
                    <div className="text-sm text-gray-600">VAC (Variance at Completion)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'historico' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Histórico de Medições EVM</h4>
              
              {historicoEVM.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Data</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">PV</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">EV</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">AC</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">SPI</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">CPI</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">EAC</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {historicoEVM.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {new Date(item.dataMedicao).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {formatCurrency(item.pv)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {formatCurrency(item.ev)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {formatCurrency(item.ac)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`font-medium ${
                              item.spi >= 1.0 ? 'text-green-600' : 
                              item.spi >= 0.9 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {item.spi.toFixed(3)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`font-medium ${
                              item.cpi >= 1.0 ? 'text-green-600' : 
                              item.cpi >= 0.9 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {item.cpi.toFixed(3)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {formatCurrency(item.eac)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600 font-medium">Nenhuma medição encontrada</p>
                  <p className="text-sm text-gray-500 mt-1">Execute uma medição EVM para ver o histórico</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'graficos' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Gráficos de Performance</h4>
              
              <div className="text-center py-12">
                <BarChart3 size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 font-medium">Gráficos em desenvolvimento</p>
                <p className="text-sm text-gray-500 mt-1">S-Curve e gráficos de tendência serão implementados em breve</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EVMDashboard
