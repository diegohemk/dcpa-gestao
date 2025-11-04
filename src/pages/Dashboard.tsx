import { 
  TrendingUp, 
  Users, 
  ClipboardList, 
  FolderKanban,
  ArrowRight,
  Calendar,
  Target,
  Star
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import StatCard from '../components/StatCard'
import { useGerencias } from '../hooks/useGerencias'
import { useServidores } from '../hooks/useServidores'
import { useAtividades } from '../hooks/useAtividades'
import { useProjetos } from '../hooks/useProjetos'
import { getIndicadoresGerais } from '../utils/helpers'

const Dashboard = () => {
  const { gerencias, loading: loadingGerencias } = useGerencias()
  const { servidores, loading: loadingServidores } = useServidores()
  const { atividades, loading: loadingAtividades } = useAtividades()
  const { projetos, loading: loadingProjetos } = useProjetos()

  const loading = loadingGerencias || loadingServidores || loadingAtividades || loadingProjetos

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    )
  }

  const indicadores = getIndicadoresGerais(atividades, projetos, servidores)

  // Dados para gráfico de atividades por gerência
  const atividadesPorGerencia = gerencias.map(g => ({
    name: g.sigla,
    total: atividades.filter(a => a.gerenciaId === g.id).length,
    concluidas: atividades.filter(a => a.gerenciaId === g.id && a.status === 'concluída').length,
    emAndamento: atividades.filter(a => a.gerenciaId === g.id && a.status === 'em andamento').length,
  }))

  // Projetos favoritos (máximo 3)
  const projetosFavoritos = projetos
    .filter(p => p.favorito)
    .slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Bem-vindo ao DCPA Gestão</h1>
            <p className="text-blue-100">
              Acompanhe o progresso dos projetos e atividades da sua organização
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">{indicadores.conclusaoMedia}%</div>
              <div className="text-sm text-blue-100">Taxa de Conclusão</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Simplificados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Atividades Ativas"
          value={indicadores.atividadesEmAndamento}
          subtitle="Em andamento"
          icon={ClipboardList}
          color="#6366f1"
          link="/atividades"
        />
        <StatCard
          title="Projetos Ativos"
          value={indicadores.projetosAtivos}
          subtitle="Em desenvolvimento"
          icon={FolderKanban}
          color="#8b5cf6"
          link="/projetos"
        />
        <StatCard
          title="Equipe Total"
          value={indicadores.servidoresAtivos}
          subtitle="Servidores"
          icon={Users}
          color="#ec4899"
          link="/servidores"
        />
        <StatCard
          title="Gerências"
          value={gerencias.length}
          subtitle="Departamentos"
          icon={Target}
          color="#10b981"
          link="/organograma"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Atividades por Gerência - Gráfico Simplificado */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Atividades por Gerência</h3>
              <p className="text-sm text-gray-500 mt-1">Distribuição atual</p>
            </div>
            <Link 
              to="/atividades"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              Ver todas
              <ArrowRight size={14} />
            </Link>
          </div>
          
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={atividadesPorGerencia}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="concluidas" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="emAndamento" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">Concluídas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600">Em Andamento</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <Link
              to="/projetos"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-blue-300 transition-all group"
            >
              <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                <FolderKanban size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800">Gerenciar Projetos</div>
                <div className="text-sm text-gray-500">Criar e acompanhar projetos</div>
              </div>
              <ArrowRight size={16} className="text-gray-400" />
            </Link>

            <Link
              to="/atividades"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-green-300 transition-all group"
            >
              <div className="bg-green-100 p-2 rounded-lg group-hover:bg-green-200 transition-colors">
                <ClipboardList size={20} className="text-green-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800">Atividades</div>
                <div className="text-sm text-gray-500">Organizar tarefas</div>
              </div>
              <ArrowRight size={16} className="text-gray-400" />
            </Link>

            <Link
              to="/servidores"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-purple-300 transition-all group"
            >
              <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-200 transition-colors">
                <Users size={20} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800">Equipe</div>
                <div className="text-sm text-gray-500">Gerenciar servidores</div>
              </div>
              <ArrowRight size={16} className="text-gray-400" />
            </Link>

            <Link
              to="/desempenho"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-orange-300 transition-all group"
            >
              <div className="bg-orange-100 p-2 rounded-lg group-hover:bg-orange-200 transition-colors">
                <TrendingUp size={20} className="text-orange-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800">Desempenho</div>
                <div className="text-sm text-gray-500">Métricas e relatórios</div>
              </div>
              <ArrowRight size={16} className="text-gray-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Projetos Favoritos */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Projetos Favoritos</h3>
            <p className="text-sm text-gray-500 mt-1">Seus projetos em destaque</p>
          </div>
          <Link 
            to="/projetos"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            Ver todos
            <ArrowRight size={14} />
          </Link>
        </div>
        
        {projetosFavoritos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projetosFavoritos.map((projeto) => {
              const gerencia = gerencias.find(g => g.id === projeto.gerenciaId)
              const responsavel = servidores.find(s => s.id === projeto.responsavelId)
              
              return (
                <Link
                  key={projeto.id}
                  to={`/projeto/${projeto.id}`}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {projeto.nome}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-yellow-500 fill-current" />
                      <span 
                        className="px-2 py-1 rounded text-xs font-medium text-white"
                        style={{ backgroundColor: gerencia?.cor }}
                      >
                        {gerencia?.sigla}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{projeto.objetivo}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Responsável: {responsavel?.nome}</span>
                      <span>{projeto.andamento}%</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${projeto.andamento}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar size={12} />
                      <span>Prazo: {new Date(projeto.prazo).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <Star size={48} className="mx-auto" />
            </div>
            <h4 className="text-lg font-medium text-gray-600 mb-2">Nenhum projeto favorito</h4>
            <p className="text-sm text-gray-500 mb-4">
              Marque projetos como favoritos para vê-los aqui
            </p>
            <Link 
              to="/projetos"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ir para Projetos
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        )}
      </div>

      {/* Gerências Overview - Simplificado */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Visão Geral das Gerências</h3>
            <p className="text-sm text-gray-500 mt-1">Resumo por departamento</p>
          </div>
          <Link 
            to="/organograma"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            Ver organograma
            <ArrowRight size={14} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {gerencias.map((gerencia) => {
            const atividadesGerencia = atividades.filter(a => a.gerenciaId === gerencia.id)
            const projetosGerencia = projetos.filter(p => p.gerenciaId === gerencia.id)
            const servidoresGerencia = servidores.filter(s => s.gerenciaId === gerencia.id)

            return (
              <Link
                key={gerencia.id}
                to={`/gerencia/${gerencia.id}`}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all hover:border-primary-300 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: gerencia.cor }}
                  >
                    {gerencia.sigla.substring(0, 2)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
                      {gerencia.sigla}
                    </h4>
                    <p className="text-xs text-gray-500">{gerencia.nome}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-lg font-bold text-gray-800">{atividadesGerencia.length}</div>
                    <div className="text-xs text-gray-500">Atividades</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-lg font-bold text-gray-800">{projetosGerencia.length}</div>
                    <div className="text-xs text-gray-500">Projetos</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-lg font-bold text-gray-800">{servidoresGerencia.length}</div>
                    <div className="text-xs text-gray-500">Servidores</div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Dashboard