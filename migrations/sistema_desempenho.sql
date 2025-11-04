-- Migração para Sistema de Desempenho
-- Adiciona campos para métricas de desempenho nas tabelas existentes

-- Adicionar campos para atividades
ALTER TABLE atividades 
ADD COLUMN IF NOT EXISTS fator_complexidade JSONB,
ADD COLUMN IF NOT EXISTS metricas JSONB,
ADD COLUMN IF NOT EXISTS historico_execucoes JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS eficiencia DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS consistencia DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS pontos_desempenho DECIMAL(5,2);

-- Adicionar campos para projetos
ALTER TABLE projetos 
ADD COLUMN IF NOT EXISTS fator_complexidade JSONB,
ADD COLUMN IF NOT EXISTS metricas JSONB,
ADD COLUMN IF NOT EXISTS score_performance DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS tendencia VARCHAR(20),
ADD COLUMN IF NOT EXISTS pontos_desempenho DECIMAL(5,2);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_atividades_pontos_desempenho ON atividades(pontos_desempenho);
CREATE INDEX IF NOT EXISTS idx_projetos_pontos_desempenho ON projetos(pontos_desempenho);
CREATE INDEX IF NOT EXISTS idx_atividades_eficiencia ON atividades(eficiencia);
CREATE INDEX IF NOT EXISTS idx_projetos_score_performance ON projetos(score_performance);

-- Comentários para documentação
COMMENT ON COLUMN atividades.fator_complexidade IS 'Fator de complexidade da atividade (nivelRotina, tempoEstimado, recursosNecessarios, criticidade)';
COMMENT ON COLUMN atividades.metricas IS 'Métricas de desempenho da atividade (taxaConclusao, tempoMedioExecucao, qualidadeExecucao, etc.)';
COMMENT ON COLUMN atividades.historico_execucoes IS 'Histórico de execuções da atividade com tempo gasto e qualidade';
COMMENT ON COLUMN atividades.eficiencia IS 'Eficiência calculada (tempoEstimado/tempoReal)';
COMMENT ON COLUMN atividades.consistencia IS 'Consistência na qualidade das execuções (0-100%)';
COMMENT ON COLUMN atividades.pontos_desempenho IS 'Pontos de desempenho calculados para a atividade';

COMMENT ON COLUMN projetos.fator_complexidade IS 'Fator de complexidade do projeto (tamanho, duracao, equipe, orcamento, risco)';
COMMENT ON COLUMN projetos.metricas IS 'Métricas de desempenho do projeto (prazoCumprimento, qualidadeEntregas, etc.)';
COMMENT ON COLUMN projetos.score_performance IS 'Score consolidado de performance do projeto (0-100)';
COMMENT ON COLUMN projetos.tendencia IS 'Tendência de performance (melhorando, estavel, piorando)';
COMMENT ON COLUMN projetos.pontos_desempenho IS 'Pontos de desempenho calculados para o projeto';

-- Função para calcular pontos de atividade
CREATE OR REPLACE FUNCTION calcular_pontos_atividade(
  p_tempo_estimado DECIMAL,
  p_recursos_necessarios INTEGER,
  p_criticidade VARCHAR,
  p_qualidade_execucao DECIMAL,
  p_frequencia VARCHAR
) RETURNS DECIMAL AS $$
DECLARE
  pontos_tempo INTEGER;
  pontos_recursos INTEGER;
  pontos_criticidade INTEGER;
  multiplicador_frequencia DECIMAL;
  pontos_base DECIMAL;
BEGIN
  -- Calcular pontos de tempo
  IF p_tempo_estimado <= 2 THEN
    pontos_tempo := 1;
  ELSIF p_tempo_estimado <= 8 THEN
    pontos_tempo := 2;
  ELSE
    pontos_tempo := 3;
  END IF;

  -- Calcular pontos de recursos
  IF p_recursos_necessarios = 1 THEN
    pontos_recursos := 1;
  ELSIF p_recursos_necessarios <= 3 THEN
    pontos_recursos := 2;
  ELSE
    pontos_recursos := 3;
  END IF;

  -- Calcular pontos de criticidade
  CASE p_criticidade
    WHEN 'baixa' THEN pontos_criticidade := 1;
    WHEN 'media' THEN pontos_criticidade := 2;
    WHEN 'alta' THEN pontos_criticidade := 3;
    WHEN 'critica' THEN pontos_criticidade := 4;
    ELSE pontos_criticidade := 1;
  END CASE;

  -- Calcular multiplicador de frequência
  CASE p_frequencia
    WHEN 'diária' THEN multiplicador_frequencia := 1.5;
    WHEN 'semanal' THEN multiplicador_frequencia := 1.2;
    WHEN 'mensal' THEN multiplicador_frequencia := 1.0;
    ELSE multiplicador_frequencia := 1.0;
  END CASE;

  -- Calcular pontos base
  pontos_base := (
    pontos_tempo * 0.3 +
    pontos_recursos * 0.2 +
    pontos_criticidade * 0.3 +
    COALESCE(p_qualidade_execucao, 3) * 0.2
  );

  RETURN ROUND(pontos_base * multiplicador_frequencia * 10) / 10;
END;
$$ LANGUAGE plpgsql;

-- Função para calcular pontos de projeto
CREATE OR REPLACE FUNCTION calcular_pontos_projeto(
  p_duracao INTEGER,
  p_equipe INTEGER,
  p_orcamento DECIMAL,
  p_risco VARCHAR,
  p_qualidade_entregas DECIMAL,
  p_tamanho VARCHAR
) RETURNS DECIMAL AS $$
DECLARE
  pontos_duracao INTEGER;
  pontos_equipe INTEGER;
  pontos_orcamento INTEGER;
  pontos_risco INTEGER;
  multiplicador_tamanho DECIMAL;
  pontos_base DECIMAL;
BEGIN
  -- Calcular pontos de duração
  IF p_duracao <= 30 THEN
    pontos_duracao := 1;
  ELSIF p_duracao <= 180 THEN
    pontos_duracao := 2;
  ELSIF p_duracao <= 365 THEN
    pontos_duracao := 3;
  ELSE
    pontos_duracao := 4;
  END IF;

  -- Calcular pontos de equipe
  IF p_equipe <= 3 THEN
    pontos_equipe := 1;
  ELSIF p_equipe <= 8 THEN
    pontos_equipe := 2;
  ELSIF p_equipe <= 15 THEN
    pontos_equipe := 3;
  ELSE
    pontos_equipe := 4;
  END IF;

  -- Calcular pontos de orçamento
  IF p_orcamento <= 10000 THEN
    pontos_orcamento := 1;
  ELSIF p_orcamento <= 100000 THEN
    pontos_orcamento := 2;
  ELSIF p_orcamento <= 1000000 THEN
    pontos_orcamento := 3;
  ELSE
    pontos_orcamento := 4;
  END IF;

  -- Calcular pontos de risco
  CASE p_risco
    WHEN 'baixo' THEN pontos_risco := 1;
    WHEN 'medio' THEN pontos_risco := 2;
    WHEN 'alto' THEN pontos_risco := 3;
    WHEN 'critico' THEN pontos_risco := 4;
    ELSE pontos_risco := 1;
  END CASE;

  -- Calcular multiplicador de tamanho
  CASE p_tamanho
    WHEN 'pequeno' THEN multiplicador_tamanho := 1.0;
    WHEN 'medio' THEN multiplicador_tamanho := 1.5;
    WHEN 'grande' THEN multiplicador_tamanho := 2.0;
    WHEN 'mega' THEN multiplicador_tamanho := 2.5;
    ELSE multiplicador_tamanho := 1.0;
  END CASE;

  -- Calcular pontos base
  pontos_base := (
    pontos_duracao * 0.2 +
    pontos_equipe * 0.15 +
    pontos_orcamento * 0.15 +
    pontos_risco * 0.25 +
    COALESCE(p_qualidade_entregas, 3) * 0.25
  );

  RETURN ROUND(pontos_base * multiplicador_tamanho * 10) / 10;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar pontos automaticamente quando fator de complexidade é alterado
CREATE OR REPLACE FUNCTION atualizar_pontos_atividade()
RETURNS TRIGGER AS $$
DECLARE
  fator_complexidade JSONB;
  pontos_calculados DECIMAL;
BEGIN
  fator_complexidade := NEW.fator_complexidade;
  
  IF fator_complexidade IS NOT NULL THEN
    pontos_calculados := calcular_pontos_atividade(
      (fator_complexidade->>'tempoEstimado')::DECIMAL,
      (fator_complexidade->>'recursosNecessarios')::INTEGER,
      fator_complexidade->>'criticidade',
      COALESCE((NEW.metricas->>'qualidadeExecucao')::DECIMAL, 3),
      NEW.frequencia
    );
    
    NEW.pontos_desempenho := pontos_calculados;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION atualizar_pontos_projeto()
RETURNS TRIGGER AS $$
DECLARE
  fator_complexidade JSONB;
  pontos_calculados DECIMAL;
BEGIN
  fator_complexidade := NEW.fator_complexidade;
  
  IF fator_complexidade IS NOT NULL THEN
    pontos_calculados := calcular_pontos_projeto(
      (fator_complexidade->>'duracao')::INTEGER,
      (fator_complexidade->>'equipe')::INTEGER,
      (fator_complexidade->>'orcamento')::DECIMAL,
      fator_complexidade->>'risco',
      COALESCE((NEW.metricas->>'qualidadeEntregas')::DECIMAL, 3),
      fator_complexidade->>'tamanho'
    );
    
    NEW.pontos_desempenho := pontos_calculados;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar triggers
DROP TRIGGER IF EXISTS trigger_atualizar_pontos_atividade ON atividades;
CREATE TRIGGER trigger_atualizar_pontos_atividade
  BEFORE INSERT OR UPDATE ON atividades
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_pontos_atividade();

DROP TRIGGER IF EXISTS trigger_atualizar_pontos_projeto ON projetos;
CREATE TRIGGER trigger_atualizar_pontos_projeto
  BEFORE INSERT OR UPDATE ON projetos
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_pontos_projeto();

-- Inserir dados de exemplo para teste
-- Exemplo de atividade com fator de complexidade
UPDATE atividades 
SET fator_complexidade = '{
  "nivelRotina": "moderada",
  "tempoEstimado": 4,
  "recursosNecessarios": 2,
  "criticidade": "media"
}'::jsonb
WHERE id = 'a1' AND fator_complexidade IS NULL;

-- Exemplo de projeto com fator de complexidade
UPDATE projetos 
SET fator_complexidade = '{
  "tamanho": "medio",
  "duracao": 90,
  "equipe": 5,
  "orcamento": 50000,
  "risco": "medio"
}'::jsonb
WHERE id = 'p1' AND fator_complexidade IS NULL;
