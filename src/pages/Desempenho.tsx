import { useState } from 'react'
import { BarChart3, FileText, Download, Calendar, Filter } from 'lucide-react'
import DashboardDesempenhoComponent from '../components/DashboardDesempenho'
import { useDesempenho, useRelatorioDesempenho } from '../hooks/useDesempenho'
import { useGerencias } from '../hooks/useGerencias'

const Desempenho = () => {
  const [gerenciaFilter, setGerenciaFilter] = useState<string>('todas')
  const [activeView, setActiveView] = useState<'dashboard' | 'relatorios'>('dashboard')
  const [mesRelatorio, setMesRelatorio] = useState(new Date().getMonth() + 1)
  const [anoRelatorio, setAnoRelatorio] = useState(new Date().getFullYear())
  
  const { gerencias } = useGerencias()
  const { gerarRelatorioMensal, loading: loadingRelatorio } = useRelatorioDesempenho()

  const handleGerarRelatorio = async () => {
    try {
      const gerenciaId = gerenciaFilter === 'todas' ? undefined : gerenciaFilter
      const relatorio = await gerarRelatorioMensal(gerenciaId, mesRelatorio, anoRelatorio)
      
      // Aqui você pode implementar a lógica para exibir ou baixar o relatório
      console.log('Relatório gerado:', relatorio)
      
      // Simulação de download
      const dataStr = JSON.stringify(relatorio, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `relatorio-desempenho-${mesRelatorio}-${anoRelatorio}.json`
      link.click()
      URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sistema de Desempenho</h1>
          <p className="text-gray-600 mt-1">Acompanhamento e análise de performance organizacional</p>
        </div>
        
        {/* Filtros */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={gerenciaFilter}
              onChange={(e) => setGerenciaFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            >
              <option value="todas">Todas as Gerências</option>
              {gerencias.map((gerencia) => (
                <option key={gerencia.id} value={gerencia.id}>
                  {gerencia.sigla}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabs de Navegação */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeView === 'dashboard'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 size={16} />
              Dashboard
            </button>
            <button
              onClick={() => setActiveView('relatorios')}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeView === 'relatorios'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText size={16} />
              Relatórios
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeView === 'dashboard' && (
            <DashboardDesempenhoComponent 
              gerenciaId={gerenciaFilter === 'todas' ? undefined : gerenciaFilter} 
            />
          )}

          {activeView === 'relatorios' && (
            <div className="space-y-6">
              {/* Configurações do Relatório */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Configurações do Relatório</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gerência
                    </label>
                    <select
                      value={gerenciaFilter}
                      onChange={(e) => setGerenciaFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    >
                      <option value="todas">Todas as Gerências</option>
                      {gerencias.map((gerencia) => (
                        <option key={gerencia.id} value={gerencia.id}>
                          {gerencia.sigla}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mês
                    </label>
                    <select
                      value={mesRelatorio}
                      onChange={(e) => setMesRelatorio(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {new Date(0, i).toLocaleString('pt-BR', { month: 'long' })}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ano
                    </label>
                    <select
                      value={anoRelatorio}
                      onChange={(e) => setAnoRelatorio(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    >
                      {Array.from({ length: 5 }, (_, i) => {
                        const ano = new Date().getFullYear() - 2 + i
                        return (
                          <option key={ano} value={ano}>
                            {ano}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <button
                    onClick={handleGerarRelatorio}
                    disabled={loadingRelatorio}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loadingRelatorio ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Download size={16} className="mr-2" />
                        Gerar Relatório
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Informações sobre Relatórios */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <FileText size={20} className="text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">Sobre os Relatórios</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• <strong>Relatório Mensal:</strong> Análise detalhada do desempenho no período</li>
                      <li>• <strong>Métricas de Atividades:</strong> Taxa de conclusão, qualidade e eficiência</li>
                      <li>• <strong>Métricas de Projetos:</strong> Cumprimento de prazos, orçamento e qualidade</li>
                      <li>• <strong>Top Performers:</strong> Melhores atividades e projetos do período</li>
                      <li>• <strong>Comparativos:</strong> Análise de tendências e evolução</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Histórico de Relatórios */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Relatórios Recentes</h4>
                <div className="text-center py-8 text-gray-500">
                  <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="font-medium">Nenhum relatório gerado ainda</p>
                  <p className="text-sm">Gere seu primeiro relatório usando o formulário acima</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Desempenho
