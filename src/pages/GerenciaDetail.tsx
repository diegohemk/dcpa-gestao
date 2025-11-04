import { useParams } from 'react-router-dom'
import { 
  Users, 
  ClipboardList, 
  FolderKanban,
  TrendingUp,
  Activity
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import StatCard from '../components/StatCard'
import { useGerencias } from '../hooks/useGerencias'
import { useServidores } from '../hooks/useServidores'
import { useAtividades } from '../hooks/useAtividades'
import { useProjetos } from '../hooks/useProjetos'
import { getIndicadoresByGerencia, getStatusColor, getIndicadorColor, formatDate } from '../utils/helpers'

const GerenciaDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { gerencias, loading: loadingGerencias } = useGerencias()
  const { servidores, loading: loadingServidores } = useServidores()
  const { atividades, loading: loadingAtividades } = useAtividades()
  const { projetos, loading: loadingProjetos } = useProjetos()

  const loading = loadingGerencias || loadingServidores || loadingAtividades || loadingProjetos

  const gerencia = gerencias.find(g => g.id === id)
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados da gerência...</p>
        </div>
      </div>
    )
  }

  if (!gerencia) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Gerência não encontrada</h2>
      </div>
    )
  }

  const atividadesGerencia = atividades.filter(a => a.gerenciaId === gerencia.id)
  const projetosGerencia = projetos.filter(p => p.gerenciaId === gerencia.id)
  const servidoresGerencia = servidores.filter(s => s.gerenciaId === gerencia.id)
  const indicadores = getIndicadoresByGerencia(gerencia.id, atividades, projetos, servidores)

  // Dados para gráfico (atividades por status)
  const atividadesPorStatus = [
    { name: 'Pendente', value: atividadesGerencia.filter(a => a.status === 'pendente').length },
    { name: 'Em Andamento', value: atividadesGerencia.filter(a => a.status === 'em andamento').length },
    { name: 'Concluída', value: atividadesGerencia.filter(a => a.status === 'concluída').length }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div 
        className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-6 border-l-4"
        style={{ borderColor: gerencia.cor }}
      >
        <div className="flex items-center gap-4">
          <div 
            className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg"
            style={{ backgroundColor: gerencia.cor }}
          >
            {gerencia.sigla.substring(0, 2)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{gerencia.sigla}</h2>
            <p className="text-gray-600 mt-1">{gerencia.nome}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Atividades em Andamento"
          value={indicadores.atividadesEmAndamento}
          icon={Activity}
          color={gerencia.cor}
        />
        <StatCard
          title="Projetos Ativos"
          value={indicadores.projetosAtivos}
          icon={FolderKanban}
          color={gerencia.cor}
        />
        <StatCard
          title="Servidores"
          value={indicadores.servidoresAtivos}
          icon={Users}
          color={gerencia.cor}
        />
        <StatCard
          title="Taxa de Conclusão"
          value={`${indicadores.conclusaoMedia}%`}
          icon={TrendingUp}
          color={gerencia.cor}
        />
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Atividades */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Atividades por Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={atividadesPorStatus} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis type="category" dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} width={100} />
              <Tooltip />
              <Bar dataKey="value" fill={gerencia.cor} radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lista de Servidores */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Equipe</h3>
          <div className="space-y-3">
            {servidoresGerencia.map((servidor) => (
              <div 
                key={servidor.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: gerencia.cor }}
                  >
                    {servidor.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{servidor.nome}</h4>
                    <p className="text-sm text-gray-600">{servidor.cargo}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-800">
                    {atividades.filter(a => 
                      a.responsaveis?.includes(servidor.id) || a.responsavelId === servidor.id
                    ).length}
                  </div>
                  <div className="text-xs text-gray-500">Atividades</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Atividades Recentes */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Atividades Recentes</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Atividade</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Responsável</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Frequência</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Última Atualização</th>
              </tr>
            </thead>
            <tbody>
              {atividadesGerencia.map((atividade) => {
                const responsaveis = atividade.responsaveis?.map(id => servidores.find(s => s.id === id)).filter(Boolean) ||
                                    (atividade.responsavelId ? [servidores.find(s => s.id === atividade.responsavelId)].filter(Boolean) : [])
                return (
                  <tr key={atividade.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-800">{atividade.titulo}</p>
                        <p className="text-sm text-gray-600">{atividade.descricao}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {responsaveis.length > 0 
                        ? responsaveis.map(s => s?.nome).filter(Boolean).join(', ')
                        : 'Não definido'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 capitalize">{atividade.frequencia}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(atividade.status)}`}>
                        {atividade.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{formatDate(atividade.ultimaAtualizacao)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Projetos da Gerência */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Projetos</h3>
        <div className="space-y-4">
          {projetosGerencia.map((projeto) => {
            // Para projetos, ainda usa responsavelId único (não múltiplos responsáveis)
            const responsavel = servidores.find(s => s.id === projeto.responsavelId)
            
            return (
              <div 
                key={projeto.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{projeto.nome}</h4>
                    <p className="text-sm text-gray-600 mb-2">{projeto.objetivo}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>Responsável: {responsavel?.nome}</span>
                      <span>•</span>
                      <span>Prazo: {formatDate(projeto.prazo)}</span>
                      <span>•</span>
                      <span>Equipe: {projeto.equipe.length} membros</span>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ml-4 ${getIndicadorColor(projeto.indicador)}`}></div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Andamento</span>
                    <span className="font-semibold text-gray-800">{projeto.andamento}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all"
                      style={{ 
                        width: `${projeto.andamento}%`,
                        backgroundColor: gerencia.cor
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default GerenciaDetail

