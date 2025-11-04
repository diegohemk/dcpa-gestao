import { useState } from 'react'
import { History, Filter, Loader, Calendar } from 'lucide-react'
import { useHistorico } from '../hooks/useHistorico'
import AlteracaoItem from './AlteracaoItem'

interface HistoricoAlteracoesProps {
  entidadeTipo: 'atividade' | 'projeto' | 'servidor' | 'gerencia'
  entidadeId: string
}

const HistoricoAlteracoes = ({ entidadeTipo, entidadeId }: HistoricoAlteracoesProps) => {
  const [filtroAcao, setFiltroAcao] = useState<string>('todas')
  const [filtroPeriodo, setFiltroPeriodo] = useState<string>('todos')
  
  const { historico, loading, error, getByAction, getByPeriod } = useHistorico({
    entidadeTipo,
    entidadeId
  })

  const [historicoFiltrado, setHistoricoFiltrado] = useState(historico)

  // Aplicar filtros
  const aplicarFiltros = async () => {
    try {
      let dadosFiltrados = historico

      if (filtroAcao !== 'todas') {
        dadosFiltrados = await getByAction(filtroAcao as any)
      }

      if (filtroPeriodo !== 'todos') {
        const agora = new Date()
        let dataInicio: string

        switch (filtroPeriodo) {
          case 'hoje':
            dataInicio = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate()).toISOString()
            break
          case 'semana':
            dataInicio = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
            break
          case 'mes':
            dataInicio = new Date(agora.getFullYear(), agora.getMonth() - 1, agora.getDate()).toISOString()
            break
          default:
            dataInicio = new Date(0).toISOString()
        }

        dadosFiltrados = await getByPeriod(dataInicio, agora.toISOString())
      }

      setHistoricoFiltrado(dadosFiltrados)
    } catch (error) {
      console.error('Erro ao aplicar filtros:', error)
    }
  }

  // Aplicar filtros quando mudarem
  useState(() => {
    aplicarFiltros()
  }, [filtroAcao, filtroPeriodo])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="w-6 h-6 animate-spin text-primary-600" />
        <span className="ml-2 text-gray-600">Carregando histórico...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <History className="w-12 h-12 mx-auto mb-3 text-red-300" />
        <p className="text-sm">Erro ao carregar histórico</p>
        <p className="text-xs text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Histórico de Alterações
          </h3>
          <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
            {historicoFiltrado.length}
          </span>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex items-center space-x-2 mb-3">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filtros</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Filtro por ação */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Tipo de Ação
            </label>
            <select
              value={filtroAcao}
              onChange={(e) => setFiltroAcao(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="todas">Todas as ações</option>
              <option value="criou">Criou</option>
              <option value="atualizou">Atualizou</option>
              <option value="excluiu">Excluiu</option>
              <option value="comentou">Comentou</option>
            </select>
          </div>

          {/* Filtro por período */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Período
            </label>
            <select
              value={filtroPeriodo}
              onChange={(e) => setFiltroPeriodo(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="todos">Todos os períodos</option>
              <option value="hoje">Hoje</option>
              <option value="semana">Última semana</option>
              <option value="mes">Último mês</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de alterações */}
      <div className="space-y-3">
        {historicoFiltrado.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Nenhuma alteração encontrada</p>
            <p className="text-xs text-gray-400">
              {filtroAcao !== 'todas' || filtroPeriodo !== 'todos' 
                ? 'Tente ajustar os filtros' 
                : 'As alterações aparecerão aqui'
              }
            </p>
          </div>
        ) : (
          historicoFiltrado.map((alteracao) => (
            <AlteracaoItem
              key={alteracao.id}
              alteracao={alteracao}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default HistoricoAlteracoes
