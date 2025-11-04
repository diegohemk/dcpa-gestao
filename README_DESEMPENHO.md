# Sistema de Desempenho - DCPA

## 📊 Visão Geral

O Sistema de Desempenho do DCPA foi desenvolvido para medir e acompanhar o desempenho organizacional de forma justa e objetiva, considerando as diferentes naturezas, durações e complexidades de atividades rotineiras e projetos especiais.

## 🎯 Funcionalidades Implementadas

### ✅ Sistema Completo de Medição
- **Cálculo de Pontos Diferenciado**: Fórmulas específicas para atividades e projetos
- **Fatores de Complexidade**: Consideração de múltiplos fatores para cálculo justo
- **Métricas Automáticas**: Cálculo automático de métricas de desempenho
- **Dashboard Interativo**: Visualização em tempo real do desempenho

### ✅ Interfaces e Componentes
- **Dashboard de Desempenho**: Visão geral com scores e tendências
- **Página de Desempenho**: Interface completa com filtros e relatórios
- **Modais de Configuração**: Para definir fatores de complexidade
- **Componentes de Métricas**: Exibição detalhada de indicadores

### ✅ Backend e Serviços
- **Calculadora de Desempenho**: Lógica de cálculo de pontos e métricas
- **Serviço de Desempenho**: Integração com Supabase
- **Hook Personalizado**: Gerenciamento de estado e operações
- **Migração de Banco**: Estrutura completa no Supabase

## 🚀 Como Usar

### 1. Acessar o Sistema
- Navegue para `/desempenho` no sistema
- Use o menu lateral para acessar "Desempenho"

### 2. Configurar Fatores de Complexidade

#### Para Atividades:
- Clique em "Configurar Complexidade" em uma atividade
- Defina:
  - **Nível de Rotina**: Simples, Moderada ou Complexa
  - **Tempo Estimado**: Em horas
  - **Recursos Necessários**: Número de pessoas
  - **Criticidade**: Baixa, Média, Alta ou Crítica

#### Para Projetos:
- Clique em "Configurar Complexidade" em um projeto
- Defina:
  - **Tamanho**: Pequeno, Médio, Grande ou Mega
  - **Duração**: Em dias
  - **Equipe**: Número de pessoas
  - **Orçamento**: Valor em R$
  - **Risco**: Baixo, Médio, Alto ou Crítico

### 3. Registrar Execuções (Atividades)
- Use o modal de execução para registrar:
  - Tempo gasto
  - Qualidade da execução (1-5)
  - Observações

### 4. Avaliar Qualidade
- Para atividades: Avalie a qualidade da execução
- Para projetos: Avalie a qualidade das entregas e satisfação da equipe

### 5. Visualizar Dashboard
- Acompanhe scores gerais e por tipo
- Veja tendências de melhoria
- Identifique alertas e problemas

### 6. Gerar Relatórios
- Configure período e gerência
- Gere relatórios mensais detalhados
- Exporte dados para análise

## 🧮 Sistema de Cálculo

### Pontos para Atividades
```
Pontos = (
  Tempo × 0.3 +
  Recursos × 0.2 +
  Criticidade × 0.3 +
  Qualidade × 0.2
) × Multiplicador Frequência
```

### Pontos para Projetos
```
Pontos = (
  Duração × 0.2 +
  Equipe × 0.15 +
  Orçamento × 0.15 +
  Risco × 0.25 +
  Qualidade × 0.25
) × Multiplicador Tamanho
```

### Score Geral
```
Score Geral = (Score Atividades × 0.4) + (Score Projetos × 0.6)
```

## 📈 Métricas Disponíveis

### Atividades
- **Taxa de Conclusão**: % de atividades concluídas no prazo
- **Tempo Médio**: Tempo médio de execução
- **Qualidade**: Avaliação média (1-5)
- **Conformidade**: % de conformidade com padrões
- **Volume Processado**: Quantidade de execuções
- **Eficiência Temporal**: Volume por tempo

### Projetos
- **Prazo Cumprimento**: % de projetos no prazo
- **Atraso Médio**: Dias de atraso médio
- **Variação Orçamento**: % de variação do orçamento
- **Eficiência Financeira**: Valor entregue por custo
- **Escopo Completude**: % do escopo entregue
- **Qualidade Entregas**: Avaliação das entregas
- **Utilização Recursos**: % de utilização da equipe
- **Satisfação Equipe**: Avaliação da equipe

## 🔧 Configuração Técnica

### Estrutura do Banco
- Campos adicionados nas tabelas `atividades` e `projetos`
- Funções SQL para cálculo automático de pontos
- Triggers para atualização automática
- Índices para performance

### Arquivos Principais
- `src/types/index.ts`: Interfaces TypeScript
- `src/utils/calculadoraDesempenho.ts`: Lógica de cálculo
- `src/services/desempenhoService.ts`: Integração com Supabase
- `src/hooks/useDesempenho.ts`: Hook personalizado
- `src/components/DashboardDesempenho.tsx`: Dashboard principal
- `src/pages/Desempenho.tsx`: Página principal

### Migração
Execute o arquivo `migrations/sistema_desempenho.sql` no Supabase para:
- Adicionar campos necessários
- Criar funções de cálculo
- Configurar triggers automáticos
- Inserir dados de exemplo

## 📊 Benefícios

### Para Gestores
- **Visão Holística**: Combina rotinas e projetos em métrica única
- **Tomada de Decisão**: Dados objetivos para decisões
- **Alocação de Recursos**: Otimização baseada em dados
- **Identificação de Gargalos**: Problemas claramente identificados

### Para Equipes
- **Justiça**: Considera complexidade e tamanho diferentes
- **Motivação**: Sistema de pontuação claro e objetivo
- **Desenvolvimento**: Identifica áreas de melhoria
- **Reconhecimento**: Performance reconhecida adequadamente

### Para Organização
- **Eficiência**: Melhoria contínua dos processos
- **Qualidade**: Padronização e melhoria da qualidade
- **Estratégia**: Alinhamento entre operação e estratégia
- **Competitividade**: Vantagem competitiva através de dados

## 🎯 Próximos Passos

### Fase 1: Implementação
- [x] Estruturação do sistema
- [x] Interfaces e componentes
- [x] Lógica de cálculo
- [x] Integração com banco

### Fase 2: Expansão
- [ ] Relatórios avançados
- [ ] Gráficos e visualizações
- [ ] Comparativos entre períodos
- [ ] Alertas automáticos

### Fase 3: Otimização
- [ ] Machine Learning para predições
- [ ] Integração com outros sistemas
- [ ] Mobile app
- [ ] API pública

## 📚 Documentação Adicional

- [Sistema de Desempenho Completo](./SISTEMA_DESEMPENHO.md)
- [Diferenças Atividades vs Projetos](./SISTEMA_DESEMPENHO.md#diferenças-conceituais)
- [Fatores de Complexidade](./SISTEMA_DESEMPENHO.md#fatores-de-complexidade)
- [Cálculo de Pontos](./SISTEMA_DESEMPENHO.md#cálculo-de-pontos)

---

*Sistema desenvolvido para DCPA - Diretoria de Controle, Passivos e Qualidade Ambiental*
