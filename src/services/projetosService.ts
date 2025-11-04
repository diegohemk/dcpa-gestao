import { supabase } from '../lib/supabase'
import { Projeto } from '../types'
import { calcularIndicadorProjeto } from '../utils/helpers'

export const projetosService = {
  async getAll(): Promise<Projeto[]> {
    const { data, error } = await supabase
      .from('projetos')
      .select('*')
      .order('prazo')
    
    if (error) throw error
    
    return (data || []).map(item => ({
      id: item.id,
      nome: item.nome,
      objetivo: item.objetivo,
      responsavelId: item.responsavel_id,
      gerenciaId: item.gerencia_id,
      equipe: item.equipe || [],
      prazo: item.prazo,
      andamento: item.andamento,
      indicador: item.indicador,
      favorito: item.favorito || false,
      subetapas: item.subetapas || [],
      orcamento: item.orcamento,
      custoReal: item.custo_real,
      prioridade: item.prioridade || 'media',
      categoria: item.categoria,
      tags: item.tags || [],
      riscos: item.riscos || [],
      marcos: item.marcos || [],
      recursos: item.recursos || [],
      observacoes: item.observacoes,
      dataInicio: item.data_inicio,
      dataConclusao: item.data_conclusao,
      statusDetalhado: item.status_detalhado || 'execucao',
      documentos: item.documentos || [],
      updatedAt: item.updated_at || new Date().toISOString(),
      wbs: item.wbs || [],
      evmResumo: item.evm_resumo,
      caminhoCritico: item.caminho_critico,
      baseline: item.baseline
    }))
  },

  async getByGerencia(gerenciaId: string): Promise<Projeto[]> {
    const { data, error } = await supabase
      .from('projetos')
      .select('*')
      .eq('gerencia_id', gerenciaId)
      .order('prazo')
    
    if (error) throw error
    
    return (data || []).map(item => ({
      id: item.id,
      nome: item.nome,
      objetivo: item.objetivo,
      responsavelId: item.responsavel_id,
      gerenciaId: item.gerencia_id,
      equipe: item.equipe || [],
      prazo: item.prazo,
      andamento: item.andamento,
      indicador: item.indicador,
      favorito: item.favorito || false,
      subetapas: item.subetapas || [],
      orcamento: item.orcamento,
      custoReal: item.custo_real,
      prioridade: item.prioridade || 'media',
      categoria: item.categoria,
      tags: item.tags || [],
      riscos: item.riscos || [],
      marcos: item.marcos || [],
      recursos: item.recursos || [],
      observacoes: item.observacoes,
      dataInicio: item.data_inicio,
      dataConclusao: item.data_conclusao,
      statusDetalhado: item.status_detalhado || 'execucao',
      documentos: item.documentos || [],
      updatedAt: item.updated_at || new Date().toISOString(),
      wbs: item.wbs || [],
      evmResumo: item.evm_resumo,
      caminhoCritico: item.caminho_critico,
      baseline: item.baseline
    }))
  },

  async create(projeto: Omit<Projeto, 'id'>): Promise<Projeto> {
    const id = `p${Date.now()}`
    
    // Calcula o indicador automaticamente
    const indicadorCalculado = calcularIndicadorProjeto({
      prazo: projeto.prazo,
      andamento: projeto.andamento,
      dataInicio: projeto.dataInicio,
      dataConclusao: projeto.dataConclusao,
      statusDetalhado: projeto.statusDetalhado,
      orcamento: projeto.orcamento,
      custoReal: projeto.custoReal
    })
    
    const { data, error } = await supabase
      .from('projetos')
      .insert({
        id,
        nome: projeto.nome,
        objetivo: projeto.objetivo,
        responsavel_id: projeto.responsavelId,
        gerencia_id: projeto.gerenciaId,
        equipe: projeto.equipe,
        prazo: projeto.prazo,
        andamento: projeto.andamento,
        indicador: indicadorCalculado,
        favorito: projeto.favorito || false,
        subetapas: projeto.subetapas || [],
        orcamento: projeto.orcamento,
        custo_real: projeto.custoReal,
        prioridade: projeto.prioridade || 'media',
        categoria: projeto.categoria,
        tags: projeto.tags || [],
        riscos: projeto.riscos || [],
        marcos: projeto.marcos || [],
        recursos: projeto.recursos || [],
        observacoes: projeto.observacoes,
        data_inicio: projeto.dataInicio,
        data_conclusao: projeto.dataConclusao,
        status_detalhado: projeto.statusDetalhado || 'planejamento',
        documentos: projeto.documentos || [],
        wbs: projeto.wbs || [],
        evm_resumo: projeto.evmResumo,
        caminho_critico: projeto.caminhoCritico,
        baseline: projeto.baseline
      })
      .select()
      .single()
    
    if (error) throw error
    
    return {
      id: data.id,
      nome: data.nome,
      objetivo: data.objetivo,
      responsavelId: data.responsavel_id,
      gerenciaId: data.gerencia_id,
      equipe: data.equipe || [],
      prazo: data.prazo,
      andamento: data.andamento,
      indicador: data.indicador,
      favorito: data.favorito || false,
      subetapas: data.subetapas || [],
      orcamento: data.orcamento,
      custoReal: data.custo_real,
      prioridade: data.prioridade || 'media',
      categoria: data.categoria,
      tags: data.tags || [],
      riscos: data.riscos || [],
      marcos: data.marcos || [],
      recursos: data.recursos || [],
      observacoes: data.observacoes,
      dataInicio: data.data_inicio,
      dataConclusao: data.data_conclusao,
      statusDetalhado: data.status_detalhado || 'execucao',
      documentos: data.documentos || [],
      updatedAt: data.updated_at || new Date().toISOString(),
      wbs: data.wbs || [],
      evmResumo: data.evm_resumo,
      caminhoCritico: data.caminho_critico,
      baseline: data.baseline
    }
  },

  async update(id: string, projeto: Partial<Projeto>): Promise<Projeto> {
    // Primeiro, busca o projeto atual para ter os dados completos
    const { data: projetoAtual, error: fetchError } = await supabase
      .from('projetos')
      .select('*')
      .eq('id', id)
      .single()
    
    if (fetchError) throw fetchError
    
    // Mescla os dados atuais com as atualizações
    const dadosAtualizados = {
      ...projetoAtual,
      ...projeto,
      // Garante que os campos que podem ter sido atualizados sejam considerados
      prazo: projeto.prazo || projetoAtual.prazo,
      andamento: projeto.andamento !== undefined ? projeto.andamento : projetoAtual.andamento,
      data_inicio: projeto.dataInicio || projetoAtual.data_inicio,
      data_conclusao: projeto.dataConclusao || projetoAtual.data_conclusao,
      status_detalhado: projeto.statusDetalhado || projetoAtual.status_detalhado,
      orcamento: projeto.orcamento !== undefined ? projeto.orcamento : projetoAtual.orcamento,
      custo_real: projeto.custoReal !== undefined ? projeto.custoReal : projetoAtual.custo_real
    }
    
    // Calcula o indicador automaticamente com os dados atualizados
    const indicadorCalculado = calcularIndicadorProjeto({
      prazo: dadosAtualizados.prazo,
      andamento: dadosAtualizados.andamento,
      dataInicio: dadosAtualizados.data_inicio,
      dataConclusao: dadosAtualizados.data_conclusao,
      statusDetalhado: dadosAtualizados.status_detalhado,
      orcamento: dadosAtualizados.orcamento,
      custoReal: dadosAtualizados.custo_real
    })
    
    const updateData: any = {}
    if (projeto.nome) updateData.nome = projeto.nome
    if (projeto.objetivo) updateData.objetivo = projeto.objetivo
    if (projeto.responsavelId) updateData.responsavel_id = projeto.responsavelId
    if (projeto.gerenciaId) updateData.gerencia_id = projeto.gerenciaId
    if (projeto.equipe) updateData.equipe = projeto.equipe
    if (projeto.prazo) updateData.prazo = projeto.prazo
    if (projeto.andamento !== undefined) updateData.andamento = projeto.andamento
    // Sempre atualiza o indicador calculado automaticamente
    updateData.indicador = indicadorCalculado
    if (projeto.favorito !== undefined) updateData.favorito = projeto.favorito
    
    // Novos campos
    if (projeto.subetapas !== undefined) updateData.subetapas = projeto.subetapas
    if (projeto.orcamento !== undefined) updateData.orcamento = projeto.orcamento
    if (projeto.custoReal !== undefined) updateData.custo_real = projeto.custoReal
    if (projeto.prioridade) updateData.prioridade = projeto.prioridade
    if (projeto.categoria) updateData.categoria = projeto.categoria
    if (projeto.tags !== undefined) updateData.tags = projeto.tags
    if (projeto.riscos !== undefined) updateData.riscos = projeto.riscos
    if (projeto.marcos !== undefined) updateData.marcos = projeto.marcos
    if (projeto.recursos !== undefined) updateData.recursos = projeto.recursos
    if (projeto.observacoes !== undefined) updateData.observacoes = projeto.observacoes
    if (projeto.dataInicio) updateData.data_inicio = projeto.dataInicio
    if (projeto.dataConclusao) updateData.data_conclusao = projeto.dataConclusao
    if (projeto.statusDetalhado) updateData.status_detalhado = projeto.statusDetalhado
    if (projeto.documentos !== undefined) updateData.documentos = projeto.documentos
    if (projeto.wbs !== undefined) updateData.wbs = projeto.wbs
    if (projeto.evmResumo !== undefined) updateData.evm_resumo = projeto.evmResumo
    if (projeto.caminhoCritico !== undefined) updateData.caminho_critico = projeto.caminhoCritico
    if (projeto.baseline !== undefined) updateData.baseline = projeto.baseline
    
    updateData.updated_at = new Date().toISOString()
    
    const { data, error } = await supabase
      .from('projetos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    return {
      id: data.id,
      nome: data.nome,
      objetivo: data.objetivo,
      responsavelId: data.responsavel_id,
      gerenciaId: data.gerencia_id,
      equipe: data.equipe || [],
      prazo: data.prazo,
      andamento: data.andamento,
      indicador: data.indicador,
      favorito: data.favorito || false,
      subetapas: data.subetapas || [],
      orcamento: data.orcamento,
      custoReal: data.custo_real,
      prioridade: data.prioridade || 'media',
      categoria: data.categoria,
      tags: data.tags || [],
      riscos: data.riscos || [],
      marcos: data.marcos || [],
      recursos: data.recursos || [],
      observacoes: data.observacoes,
      dataInicio: data.data_inicio,
      dataConclusao: data.data_conclusao,
      statusDetalhado: data.status_detalhado || 'execucao',
      documentos: data.documentos || [],
      updatedAt: data.updated_at || new Date().toISOString(),
      wbs: data.wbs || [],
      evmResumo: data.evm_resumo,
      caminhoCritico: data.caminho_critico,
      baseline: data.baseline
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('projetos')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async toggleFavorite(id: string): Promise<Projeto> {
    // Primeiro, vamos buscar o projeto atual para verificar o estado do favorito
    const { data: currentProject, error: fetchError } = await supabase
      .from('projetos')
      .select('favorito')
      .eq('id', id)
      .single()
    
    if (fetchError) throw fetchError
    
    const newFavoriteStatus = !currentProject.favorito
    
    // Agora vamos atualizar o status do favorito
    const { data, error } = await supabase
      .from('projetos')
      .update({ favorito: newFavoriteStatus })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    return {
      id: data.id,
      nome: data.nome,
      objetivo: data.objetivo,
      responsavelId: data.responsavel_id,
      gerenciaId: data.gerencia_id,
      equipe: data.equipe || [],
      prazo: data.prazo,
      andamento: data.andamento,
      indicador: data.indicador,
      favorito: data.favorito || false,
      subetapas: data.subetapas || [],
      orcamento: data.orcamento,
      custoReal: data.custo_real,
      prioridade: data.prioridade || 'media',
      categoria: data.categoria,
      tags: data.tags || [],
      riscos: data.riscos || [],
      marcos: data.marcos || [],
      recursos: data.recursos || [],
      observacoes: data.observacoes,
      dataInicio: data.data_inicio,
      dataConclusao: data.data_conclusao,
      statusDetalhado: data.status_detalhado || 'execucao',
      documentos: data.documentos || [],
      updatedAt: data.updated_at || new Date().toISOString(),
      wbs: data.wbs || [],
      evmResumo: data.evm_resumo,
      caminhoCritico: data.caminho_critico,
      baseline: data.baseline
    }
  }
}

