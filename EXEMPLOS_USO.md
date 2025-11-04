# Exemplos de Uso - CRUD com Supabase

## 📝 Como Adicionar o Modal de Nova Atividade em uma Página

### Passo 1: Importar o Modal

```typescript
import { useState } from 'react'
import ModalNovaAtividade from '../components/ModalNovaAtividade'
```

### Passo 2: Adicionar Estado para Controlar o Modal

```typescript
const [isModalOpen, setIsModalOpen] = useState(false)
```

### Passo 3: Adicionar o Modal e Botão na Página

```tsx
function MinhaPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { reload } = useAtividades() // Para recarregar após criar

  return (
    <div>
      {/* Botão para abrir modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
      >
        + Nova Atividade
      </button>

      {/* Modal */}
      <ModalNovaAtividade
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          reload() // Recarregar lista após criar
        }}
      />

      {/* Resto do conteúdo da página */}
    </div>
  )
}
```

## 🔧 Exemplo Completo: Página de Atividades com CRUD

```typescript
import { useState } from 'react'
import { Search, Plus, Edit, Trash2 } from 'lucide-react'
import { useAtividades } from '../hooks/useAtividades'
import { useServidores } from '../hooks/useServidores'
import { useGerencias } from '../hooks/useGerencias'
import ModalNovaAtividade from '../components/ModalNovaAtividade'

const AtividadesPage = () => {
  const { atividades, loading, updateAtividade, deleteAtividade } = useAtividades()
  const { servidores } = useServidores()
  const { gerencias } = useGerencias()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Filtrar atividades
  const filteredAtividades = atividades.filter(a =>
    a.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Atualizar status
  const handleUpdateStatus = async (id: string, novoStatus: string) => {
    try {
      await updateAtividade(id, { 
        status: novoStatus as any,
        ultimaAtualizacao: new Date().toISOString().split('T')[0]
      })
      alert('Status atualizado!')
    } catch (error) {
      alert('Erro ao atualizar status')
    }
  }

  // Deletar atividade
  const handleDelete = async (id: string, titulo: string) => {
    if (!confirm(`Deseja realmente excluir "${titulo}"?`)) return
    
    try {
      await deleteAtividade(id)
      alert('Atividade excluída!')
    } catch (error) {
      alert('Erro ao excluir atividade')
    }
  }

  if (loading) {
    return <div className="flex justify-center p-12">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header com Busca e Botão Adicionar */}
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar atividades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg"
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          <Plus size={20} />
          Nova Atividade
        </button>
      </div>

      {/* Lista de Atividades */}
      <div className="grid gap-4">
        {filteredAtividades.map(atividade => {
          const responsavel = servidores.find(s => s.id === atividade.responsavelId)
          const gerencia = gerencias.find(g => g.id === atividade.gerenciaId)

          return (
            <div key={atividade.id} className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold">{atividade.titulo}</h3>
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: gerencia?.cor }}
                    >
                      {gerencia?.sigla}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{atividade.descricao}</p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>👤 {responsavel?.nome}</span>
                    <span>📅 {atividade.frequencia}</span>
                    <span>🕒 {atividade.ultimaAtualizacao}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-4">
                  {/* Dropdown de Status */}
                  <select
                    value={atividade.status}
                    onChange={(e) => handleUpdateStatus(atividade.id, e.target.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border-2 ${
                      atividade.status === 'concluída' ? 'border-green-500 text-green-700' :
                      atividade.status === 'em andamento' ? 'border-blue-500 text-blue-700' :
                      'border-yellow-500 text-yellow-700'
                    }`}
                  >
                    <option value="pendente">Pendente</option>
                    <option value="em andamento">Em Andamento</option>
                    <option value="concluída">Concluída</option>
                  </select>

                  {/* Botão Deletar */}
                  <button
                    onClick={() => handleDelete(atividade.id, atividade.titulo)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Excluir"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal */}
      <ModalNovaAtividade
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  )
}

export default AtividadesPage
```

## 🎨 Outros Exemplos de CRUD

### Atualizar Andamento de Projeto

```typescript
const { updateProjeto } = useProjetos()

const handleUpdateAndamento = async (projetoId: string, novoAndamento: number) => {
  try {
    await updateProjeto(projetoId, { andamento: novoAndamento })
    alert('Andamento atualizado!')
  } catch (error) {
    console.error(error)
    alert('Erro ao atualizar')
  }
}

// Uso no componente:
<input
  type="range"
  min="0"
  max="100"
  value={projeto.andamento}
  onChange={(e) => handleUpdateAndamento(projeto.id, parseInt(e.target.value))}
/>
```

### Criar Novo Servidor

```typescript
const { createServidor } = useServidores()

const handleAddServidor = async () => {
  try {
    await createServidor({
      nome: 'José Silva',
      cargo: 'Analista Ambiental',
      gerenciaId: 'geaud',
      atribuicoes: ['Análise técnica', 'Pareceres']
    })
    alert('Servidor adicionado!')
  } catch (error) {
    alert('Erro ao adicionar servidor')
  }
}
```

### Atualizar Indicador de Projeto

```typescript
const { updateProjeto } = useProjetos()

const handleUpdateIndicador = async (projetoId: string, indicador: 'verde' | 'amarelo' | 'vermelho') => {
  try {
    await updateProjeto(projetoId, { indicador })
    alert('Indicador atualizado!')
  } catch (error) {
    alert('Erro ao atualizar')
  }
}
```

### Excluir Servidor com Confirmação

```typescript
const { deleteServidor } = useServidores()

const handleDeleteServidor = async (servidor: Servidor) => {
  const confirmacao = window.confirm(
    `Tem certeza que deseja excluir ${servidor.nome}? ` +
    `Esta ação não pode ser desfeita e irá remover todas as atividades e projetos associados.`
  )
  
  if (!confirmacao) return
  
  try {
    await deleteServidor(servidor.id)
    alert('Servidor excluído com sucesso!')
  } catch (error) {
    console.error(error)
    alert('Erro ao excluir servidor')
  }
}
```

## 🔄 Recarregar Dados Após Operações

```typescript
const { atividades, reload } = useAtividades()

// Após criar/atualizar/deletar
await createAtividade(...)
await reload() // Recarrega a lista

// Ou usar onSuccess callback
<ModalNovaAtividade
  onSuccess={() => reload()}
/>
```

## 📊 Filtros e Buscas

### Filtrar por Múltiplos Critérios

```typescript
const filteredData = atividades.filter(atividade => {
  const matchSearch = atividade.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  const matchStatus = statusFilter === 'todas' || atividade.status === statusFilter
  const matchGerencia = gerenciaFilter === 'todas' || atividade.gerenciaId === gerenciaFilter
  
  return matchSearch && matchStatus && matchGerencia
})
```

### Ordenar Resultados

```typescript
const sortedAtividades = [...atividades].sort((a, b) => {
  // Por data (mais recente primeiro)
  return new Date(b.ultimaAtualizacao).getTime() - new Date(a.ultimaAtualizacao).getTime()
})

// Por nome
const sortedByName = [...servidores].sort((a, b) => 
  a.nome.localeCompare(b.nome)
)
```

## 🎯 Dicas Importantes

1. **Sempre use try/catch** ao fazer operações CRUD
2. **Dê feedback visual** ao usuário (loading, sucesso, erro)
3. **Confirme ações destrutivas** (deletar) antes de executar
4. **Recarregue dados** após operações para manter sincronia
5. **Valide dados** antes de enviar ao banco
6. **Use os hooks existentes** ao invés de chamar serviços diretamente

## 📱 Responsividade

Todos os componentes devem ser responsivos. Exemplo de grid adaptativo:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards aqui */}
</div>
```

---

Com esses exemplos, você pode implementar qualquer funcionalidade CRUD no sistema DCPA! 🚀

