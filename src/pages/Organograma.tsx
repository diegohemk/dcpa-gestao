import { useState } from 'react'
import { ChevronDown, ChevronRight, User, Building2 } from 'lucide-react'
import { useGerencias } from '../hooks/useGerencias'
import { useServidores } from '../hooks/useServidores'

const Organograma = () => {
  const { gerencias, loading: loadingGerencias } = useGerencias()
  const { servidores, loading: loadingServidores } = useServidores()
  const [expandedGerencias, setExpandedGerencias] = useState<string[]>([])

  const loading = loadingGerencias || loadingServidores

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando organograma...</p>
        </div>
      </div>
    )
  }

  const toggleGerencia = (id: string) => {
    if (expandedGerencias.includes(id)) {
      setExpandedGerencias(expandedGerencias.filter(gId => gId !== id))
    } else {
      setExpandedGerencias([...expandedGerencias, id])
    }
  }

  const expandAll = () => {
    setExpandedGerencias(gerencias.map(g => g.id))
  }

  const collapseAll = () => {
    setExpandedGerencias([])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Organograma Institucional</h2>
            <p className="text-gray-600 mt-1">Estrutura hierárquica da DCPA</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={expandAll}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
            >
              Expandir Tudo
            </button>
            <button
              onClick={collapseAll}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
            >
              Recolher Tudo
            </button>
          </div>
        </div>
      </div>

      {/* Organograma */}
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        {/* Diretoria (Topo) */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-xl p-6 shadow-lg w-full max-w-md">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Building2 size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold">DCPA</h3>
                <p className="text-sm opacity-90 mt-1">
                  Diretoria de Controle, Passivos e Qualidade Ambiental
                </p>
                <p className="text-xs opacity-75 mt-2">
                  {gerencias.length} Gerências | {servidores.length} Servidores
                </p>
              </div>
            </div>
          </div>
          
          {/* Linha vertical */}
          <div className="w-0.5 h-12 bg-gray-300"></div>
        </div>

        {/* Gerências */}
        <div className="space-y-6">
          {gerencias.map((gerencia, index) => {
            const servidoresGerencia = servidores.filter(s => s.gerenciaId === gerencia.id)
            const isExpanded = expandedGerencias.includes(gerencia.id)
            const isLast = index === gerencias.length - 1

            return (
              <div key={gerencia.id} className="relative">
                {/* Linha horizontal da diretoria para gerência */}
                {index === 0 && (
                  <div className="absolute left-1/2 -top-6 w-0.5 h-6 bg-gray-300"></div>
                )}
                
                <div className="flex flex-col items-center">
                  {/* Card da Gerência */}
                  <div 
                    className="w-full max-w-4xl border-2 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all"
                    style={{ borderColor: gerencia.cor }}
                    onClick={() => toggleGerencia(gerencia.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-14 h-14 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                          style={{ backgroundColor: gerencia.cor }}
                        >
                          {gerencia.sigla.substring(0, 2)}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-800">{gerencia.sigla}</h4>
                          <p className="text-sm text-gray-600 mt-1">{gerencia.nome}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {servidoresGerencia.length} servidor{servidoresGerencia.length !== 1 ? 'es' : ''}
                          </p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        {isExpanded ? (
                          <ChevronDown size={24} className="text-gray-600" />
                        ) : (
                          <ChevronRight size={24} className="text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Servidores da Gerência */}
                  {isExpanded && (
                    <>
                      {/* Linha vertical */}
                      <div className="w-0.5 h-8 bg-gray-300"></div>
                      
                      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-8">
                        {servidoresGerencia.map((servidor) => (
                          <div 
                            key={servidor.id}
                            className="relative"
                          >
                            {/* Linha conectora */}
                            <div className="absolute left-1/2 -top-8 w-0.5 h-8 bg-gray-300"></div>
                            
                            <div 
                              className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                                  style={{ backgroundColor: gerencia.cor }}
                                >
                                  {servidor.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-semibold text-gray-800 text-sm truncate">
                                    {servidor.nome}
                                  </h5>
                                  <p className="text-xs text-gray-600 mt-1">{servidor.cargo}</p>
                                </div>
                              </div>
                              
                              {servidor.atribuicoes.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  <p className="text-xs font-medium text-gray-700 mb-2">Atribuições:</p>
                                  <ul className="space-y-1">
                                    {servidor.atribuicoes.slice(0, 2).map((atribuicao, idx) => (
                                      <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                                        <span className="text-primary-500 mt-0.5">•</span>
                                        <span className="flex-1">{atribuicao}</span>
                                      </li>
                                    ))}
                                    {servidor.atribuicoes.length > 2 && (
                                      <li className="text-xs text-gray-500 italic">
                                        +{servidor.atribuicoes.length - 2} mais...
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Linha vertical para próxima gerência */}
                  {!isLast && (
                    <div className="w-0.5 h-6 bg-gray-300 my-4"></div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legenda */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Legenda</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gerencias.map((gerencia) => (
            <div key={gerencia.id} className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: gerencia.cor }}
              ></div>
              <span className="text-sm text-gray-700">{gerencia.sigla}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Organograma

