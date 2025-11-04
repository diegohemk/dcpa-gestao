import { supabase } from '../lib/supabase'
import { Projeto } from '../types'

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
      subetapas: [],
      prioridade: 'media' as const,
      tags: [],
      riscos: [],
      marcos: [],
      recursos: [],
      statusDetalhado: 'execucao' as const,
      documentos: [],
      updatedAt: new Date().toISOString()
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
      subetapas: [],
      prioridade: 'media' as const,
      tags: [],
      riscos: [],
      marcos: [],
      recursos: [],
      statusDetalhado: 'execucao' as const,
      documentos: [],
      updatedAt: new Date().toISOString()
    }))
  },

  async create(projeto: Omit<Projeto, 'id'>): Promise<Projeto> {
    const id = `p${Date.now()}`
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
        indicador: projeto.indicador,
        favorito: projeto.favorito || false
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
      subetapas: [],
      prioridade: 'media' as const,
      tags: [],
      riscos: [],
      marcos: [],
      recursos: [],
      statusDetalhado: 'execucao' as const,
      documentos: [],
      updatedAt: new Date().toISOString()
    }
  },

  async update(id: string, projeto: Partial<Projeto>): Promise<Projeto> {
    const updateData: any = {}
    if (projeto.nome) updateData.nome = projeto.nome
    if (projeto.objetivo) updateData.objetivo = projeto.objetivo
    if (projeto.responsavelId) updateData.responsavel_id = projeto.responsavelId
    if (projeto.gerenciaId) updateData.gerencia_id = projeto.gerenciaId
    if (projeto.equipe) updateData.equipe = projeto.equipe
    if (projeto.prazo) updateData.prazo = projeto.prazo
    if (projeto.andamento !== undefined) updateData.andamento = projeto.andamento
    if (projeto.indicador) updateData.indicador = projeto.indicador
    if (projeto.favorito !== undefined) updateData.favorito = projeto.favorito
    
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
      subetapas: [],
      prioridade: 'media' as const,
      tags: [],
      riscos: [],
      marcos: [],
      recursos: [],
      statusDetalhado: 'execucao' as const,
      documentos: [],
      updatedAt: new Date().toISOString()
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
      subetapas: [],
      prioridade: 'media' as const,
      tags: [],
      riscos: [],
      marcos: [],
      recursos: [],
      statusDetalhado: 'execucao' as const,
      documentos: [],
      updatedAt: new Date().toISOString()
    }
  }
}

