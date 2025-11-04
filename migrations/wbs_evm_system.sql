-- Migração para Sistema WBS e EVM
-- Criar tabelas para Work Breakdown Structure e Earned Value Management

-- Tabela para templates de WBS
CREATE TABLE IF NOT EXISTS wbs_templates (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  categoria TEXT NOT NULL,
  estrutura JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para dados EVM (Earned Value Management)
CREATE TABLE IF NOT EXISTS evm_data (
  id TEXT PRIMARY KEY,
  projeto_id TEXT NOT NULL REFERENCES projetos(id) ON DELETE CASCADE,
  data_medicao DATE NOT NULL,
  pv DECIMAL(15,2) NOT NULL DEFAULT 0, -- Planned Value
  ev DECIMAL(15,2) NOT NULL DEFAULT 0, -- Earned Value
  ac DECIMAL(15,2) NOT NULL DEFAULT 0, -- Actual Cost
  spi DECIMAL(5,3) NOT NULL DEFAULT 0, -- Schedule Performance Index
  cpi DECIMAL(5,3) NOT NULL DEFAULT 0, -- Cost Performance Index
  sv DECIMAL(15,2) NOT NULL DEFAULT 0, -- Schedule Variance
  cv DECIMAL(15,2) NOT NULL DEFAULT 0, -- Cost Variance
  eac DECIMAL(15,2) NOT NULL DEFAULT 0, -- Estimate at Completion
  etc DECIMAL(15,2) NOT NULL DEFAULT 0, -- Estimate to Complete
  vac DECIMAL(15,2) NOT NULL DEFAULT 0, -- Variance at Completion
  bac DECIMAL(15,2) NOT NULL DEFAULT 0, -- Budget at Completion
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para alocações de recursos
CREATE TABLE IF NOT EXISTS alocacoes_recursos (
  id TEXT PRIMARY KEY,
  projeto_id TEXT NOT NULL REFERENCES projetos(id) ON DELETE CASCADE,
  servidor_id TEXT NOT NULL REFERENCES servidores(id) ON DELETE CASCADE,
  wbs_item_id TEXT NOT NULL,
  percentual_alocacao INTEGER NOT NULL CHECK (percentual_alocacao >= 0 AND percentual_alocacao <= 100),
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  horas_estimadas DECIMAL(8,2) NOT NULL DEFAULT 0,
  horas_reais DECIMAL(8,2),
  custo_hora DECIMAL(8,2) NOT NULL DEFAULT 0,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar colunas WBS e EVM à tabela projetos
ALTER TABLE projetos 
ADD COLUMN IF NOT EXISTS wbs JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS evm_resumo JSONB,
ADD COLUMN IF NOT EXISTS caminho_critico JSONB,
ADD COLUMN IF NOT EXISTS baseline JSONB;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_evm_data_projeto_id ON evm_data(projeto_id);
CREATE INDEX IF NOT EXISTS idx_evm_data_data_medicao ON evm_data(data_medicao);
CREATE INDEX IF NOT EXISTS idx_alocacoes_projeto_id ON alocacoes_recursos(projeto_id);
CREATE INDEX IF NOT EXISTS idx_alocacoes_servidor_id ON alocacoes_recursos(servidor_id);
CREATE INDEX IF NOT EXISTS idx_alocacoes_periodo ON alocacoes_recursos(data_inicio, data_fim);

-- Função para calcular EVM automaticamente
CREATE OR REPLACE FUNCTION calcular_evm_projeto(p_projeto_id TEXT, p_data_medicao DATE DEFAULT CURRENT_DATE)
RETURNS JSONB AS $$
DECLARE
  v_projeto RECORD;
  v_wbs JSONB;
  v_pv DECIMAL(15,2) := 0;
  v_ev DECIMAL(15,2) := 0;
  v_ac DECIMAL(15,2) := 0;
  v_spi DECIMAL(5,3);
  v_cpi DECIMAL(5,3);
  v_sv DECIMAL(15,2);
  v_cv DECIMAL(15,2);
  v_eac DECIMAL(15,2);
  v_etc DECIMAL(15,2);
  v_vac DECIMAL(15,2);
  v_bac DECIMAL(15,2);
  v_resultado JSONB;
BEGIN
  -- Buscar dados do projeto
  SELECT * INTO v_projeto FROM projetos WHERE id = p_projeto_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Projeto não encontrado: %', p_projeto_id;
  END IF;
  
  v_wbs := COALESCE(v_projeto.wbs, '[]'::JSONB);
  v_bac := COALESCE(v_projeto.orcamento, 0);
  
  -- Calcular PV (Planned Value) - valor planejado até a data de medição
  SELECT COALESCE(SUM(
    CASE 
      WHEN (item->>'dataInicio')::DATE <= p_data_medicao 
       AND (item->>'dataFim')::DATE >= p_data_medicao THEN
        (item->>'estimativaCusto')::DECIMAL * 
        GREATEST(0, LEAST(1, 
          EXTRACT(EPOCH FROM (p_data_medicao - (item->>'dataInicio')::DATE)) / 
          EXTRACT(EPOCH FROM ((item->>'dataFim')::DATE - (item->>'dataInicio')::DATE))
        ))
      WHEN (item->>'dataFim')::DATE < p_data_medicao THEN
        (item->>'estimativaCusto')::DECIMAL
      ELSE 0
    END
  ), 0) INTO v_pv
  FROM jsonb_array_elements(v_wbs) AS item;
  
  -- Calcular EV (Earned Value) - valor ganho baseado no percentual completo
  SELECT COALESCE(SUM(
    (item->>'estimativaCusto')::DECIMAL * 
    ((item->>'percentualCompleto')::DECIMAL / 100)
  ), 0) INTO v_ev
  FROM jsonb_array_elements(v_wbs) AS item;
  
  -- Calcular AC (Actual Cost) - custo real
  SELECT COALESCE(SUM(
    COALESCE((item->>'custoReal')::DECIMAL, 0)
  ), 0) INTO v_ac
  FROM jsonb_array_elements(v_wbs) AS item;
  
  -- Calcular índices
  v_spi := CASE WHEN v_pv > 0 THEN v_ev / v_pv ELSE 0 END;
  v_cpi := CASE WHEN v_ac > 0 THEN v_ev / v_ac ELSE 0 END;
  v_sv := v_ev - v_pv;
  v_cv := v_ev - v_ac;
  v_eac := CASE WHEN v_cpi > 0 THEN v_bac / v_cpi ELSE v_bac END;
  v_etc := v_eac - v_ac;
  v_vac := v_bac - v_eac;
  
  -- Montar resultado
  v_resultado := jsonb_build_object(
    'projeto_id', p_projeto_id,
    'data_medicao', p_data_medicao,
    'pv', v_pv,
    'ev', v_ev,
    'ac', v_ac,
    'spi', v_spi,
    'cpi', v_cpi,
    'sv', v_sv,
    'cv', v_cv,
    'eac', v_eac,
    'etc', v_etc,
    'vac', v_vac,
    'bac', v_bac,
    'status_geral', CASE 
      WHEN v_spi >= 1.0 AND v_cpi >= 1.0 THEN 'excelente'
      WHEN v_spi >= 0.95 AND v_cpi >= 0.95 THEN 'bom'
      WHEN v_spi >= 0.85 AND v_cpi >= 0.85 THEN 'atencao'
      ELSE 'critico'
    END
  );
  
  RETURN v_resultado;
END;
$$ LANGUAGE plpgsql;

-- Função para calcular caminho crítico
CREATE OR REPLACE FUNCTION calcular_caminho_critico(p_projeto_id TEXT)
RETURNS JSONB AS $$
DECLARE
  v_wbs JSONB;
  v_tarefas_criticas TEXT[] := '{}';
  v_duracao_total INTEGER := 0;
  v_margem_total INTEGER := 0;
  v_resultado JSONB;
BEGIN
  -- Buscar WBS do projeto
  SELECT wbs INTO v_wbs FROM projetos WHERE id = p_projeto_id;
  
  IF v_wbs IS NULL OR jsonb_array_length(v_wbs) = 0 THEN
    RETURN jsonb_build_object(
      'projeto_id', p_projeto_id,
      'tarefas_criticas', '[]'::JSONB,
      'duracao_total', 0,
      'margem_total', 0,
      'atualizado_em', NOW()
    );
  END IF;
  
  -- Algoritmo simplificado para caminho crítico
  -- Em uma implementação real, seria necessário implementar o algoritmo de Dijkstra
  -- ou similar para calcular o caminho mais longo
  
  v_resultado := jsonb_build_object(
    'projeto_id', p_projeto_id,
    'tarefas_criticas', to_jsonb(v_tarefas_criticas),
    'duracao_total', v_duracao_total,
    'margem_total', v_margem_total,
    'atualizado_em', NOW()
  );
  
  RETURN v_resultado;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar EVM quando WBS é modificada
CREATE OR REPLACE FUNCTION trigger_atualizar_evm()
RETURNS TRIGGER AS $$
BEGIN
  -- Recalcular EVM quando WBS é atualizada
  PERFORM calcular_evm_projeto(NEW.id, CURRENT_DATE);
  
  -- Atualizar caminho crítico
  UPDATE projetos 
  SET caminho_critico = calcular_caminho_critico(NEW.id)
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger
DROP TRIGGER IF EXISTS trigger_projetos_wbs_evm ON projetos;
CREATE TRIGGER trigger_projetos_wbs_evm
  AFTER UPDATE OF wbs ON projetos
  FOR EACH ROW
  EXECUTE FUNCTION trigger_atualizar_evm();

-- Inserir templates WBS básicos
INSERT INTO wbs_templates (id, nome, descricao, categoria, estrutura) VALUES
(
  'template_projeto_software',
  'Projeto de Software',
  'Template padrão para projetos de desenvolvimento de software',
  'Software',
  '[
    {
      "id": "root",
      "codigo": "1",
      "nome": "Projeto de Software",
      "descricao": "Projeto principal de desenvolvimento",
      "nivel": 0,
      "filhos": [
        {
          "id": "fase1",
          "codigo": "1.1",
          "nome": "Fase 1: Planejamento",
          "descricao": "Planejamento e análise do projeto",
          "nivel": 1,
          "paiId": "root",
          "filhos": [
            {
              "id": "req",
              "codigo": "1.1.1",
              "nome": "Levantamento de Requisitos",
              "descricao": "Coleta e análise de requisitos",
              "nivel": 2,
              "paiId": "fase1",
              "filhos": [],
              "responsavelId": "",
              "estimativaHoras": 40,
              "estimativaCusto": 2000,
              "status": "nao_iniciado",
              "percentualCompleto": 0,
              "dependencias": [],
              "riscos": [],
              "createdAt": "2025-01-01T00:00:00Z",
              "updatedAt": "2025-01-01T00:00:00Z"
            }
          ],
          "responsavelId": "",
          "estimativaHoras": 80,
          "estimativaCusto": 4000,
          "status": "nao_iniciado",
          "percentualCompleto": 0,
          "dependencias": [],
          "riscos": [],
          "createdAt": "2025-01-01T00:00:00Z",
          "updatedAt": "2025-01-01T00:00:00Z"
        }
      ],
      "responsavelId": "",
      "estimativaHoras": 200,
      "estimativaCusto": 10000,
      "status": "nao_iniciado",
      "percentualCompleto": 0,
      "dependencias": [],
      "riscos": [],
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  ]'::JSONB
),
(
  'template_projeto_infraestrutura',
  'Projeto de Infraestrutura',
  'Template para projetos de infraestrutura e TI',
  'Infraestrutura',
  '[
    {
      "id": "root",
      "codigo": "1",
      "nome": "Projeto de Infraestrutura",
      "descricao": "Projeto principal de infraestrutura",
      "nivel": 0,
      "filhos": [
        {
          "id": "fase1",
          "codigo": "1.1",
          "nome": "Fase 1: Análise",
          "descricao": "Análise de requisitos de infraestrutura",
          "nivel": 1,
          "paiId": "root",
          "filhos": [],
          "responsavelId": "",
          "estimativaHoras": 60,
          "estimativaCusto": 3000,
          "status": "nao_iniciado",
          "percentualCompleto": 0,
          "dependencias": [],
          "riscos": [],
          "createdAt": "2025-01-01T00:00:00Z",
          "updatedAt": "2025-01-01T00:00:00Z"
        }
      ],
      "responsavelId": "",
      "estimativaHoras": 150,
      "estimativaCusto": 7500,
      "status": "nao_iniciado",
      "percentualCompleto": 0,
      "dependencias": [],
      "riscos": [],
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  ]'::JSONB
);

-- Comentários para documentação
COMMENT ON TABLE wbs_templates IS 'Templates de Work Breakdown Structure para diferentes tipos de projetos';
COMMENT ON TABLE evm_data IS 'Dados históricos de Earned Value Management por projeto';
COMMENT ON TABLE alocacoes_recursos IS 'Alocações de recursos humanos por projeto e período';

COMMENT ON FUNCTION calcular_evm_projeto IS 'Calcula métricas EVM para um projeto em uma data específica';
COMMENT ON FUNCTION calcular_caminho_critico IS 'Calcula o caminho crítico de um projeto baseado na WBS';
COMMENT ON FUNCTION trigger_atualizar_evm IS 'Trigger que recalcula EVM automaticamente quando WBS é atualizada';
