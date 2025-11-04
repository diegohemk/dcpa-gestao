import { supabase } from '../lib/supabase'
import { Atividade } from '../types'

export const atividadesService = {
  async getAll(): Promise<Atividade[]> {
    const { data, error } = await supabase
      .from('atividades')
      .select('*')
      .order('ultima_atualizacao', { ascending: false })
    
    if (error) throw error
    
    return (data || []).map(item => ({
      id: item.id,
      titulo: item.titulo,
      descricao: item.descricao,
      frequencia: item.frequencia,
      responsaveis: item.responsaveis || (item.responsavel_id ? [item.responsavel_id] : []),
      responsavelId: item.responsavel_id, // Mantido para compatibilidade
      gerenciaId: item.gerencia_id,
      status: item.status,
      ultimaAtualizacao: item.ultima_atualizacao,
      documentos: item.documentos || []
    }))
  },

  async getByGerencia(gerenciaId: string): Promise<Atividade[]> {
    const { data, error } = await supabase
      .from('atividades')
      .select('*')
      .eq('gerencia_id', gerenciaId)
      .order('ultima_atualizacao', { ascending: false })
    
    if (error) throw error
    
    return (data || []).map(item => ({
      id: item.id,
      titulo: item.titulo,
      descricao: item.descricao,
      frequencia: item.frequencia,
      responsaveis: item.responsaveis || (item.responsavel_id ? [item.responsavel_id] : []),
      responsavelId: item.responsavel_id, // Mantido para compatibilidade
      gerenciaId: item.gerencia_id,
      status: item.status,
      ultimaAtualizacao: item.ultima_atualizacao,
      documentos: item.documentos || []
    }))
  },

  async create(atividade: Omit<Atividade, 'id'>): Promise<Atividade> {
    const id = `a${Date.now()}`
    // Usa responsaveis se disponível, senão usa responsavelId (compatibilidade)
    const responsaveisArray = atividade.responsaveis || (atividade.responsavelId ? [atividade.responsavelId] : [])
    const primeiroResponsavel = responsaveisArray.length > 0 ? responsaveisArray[0] : null
    
    const { data, error } = await supabase
      .from('atividades')
      .insert({
        id,
        titulo: atividade.titulo,
        descricao: atividade.descricao,
        frequencia: atividade.frequencia,
        responsaveis: responsaveisArray,
        responsavel_id: primeiroResponsavel, // Mantido para compatibilidade
        gerencia_id: atividade.gerenciaId,
        status: atividade.status,
        ultima_atualizacao: atividade.ultimaAtualizacao,
        documentos: atividade.documentos
      })
      .select()
      .single()
    
    if (error) throw error
    
    return {
      id: data.id,
      titulo: data.titulo,
      descricao: data.descricao,
      frequencia: data.frequencia,
      responsaveis: data.responsaveis || (data.responsavel_id ? [data.responsavel_id] : []),
      responsavelId: data.responsavel_id,
      gerenciaId: data.gerencia_id,
      status: data.status,
      ultimaAtualizacao: data.ultima_atualizacao,
      documentos: data.documentos || []
    }
  },

  async update(id: string, atividade: Partial<Atividade>): Promise<Atividade> {
    const updateData: any = {}
    if (atividade.titulo) updateData.titulo = atividade.titulo
    if (atividade.descricao) updateData.descricao = atividade.descricao
    if (atividade.frequencia) updateData.frequencia = atividade.frequencia
    if (atividade.gerenciaId) updateData.gerencia_id = atividade.gerenciaId
    if (atividade.status) updateData.status = atividade.status
    if (atividade.ultimaAtualizacao) updateData.ultima_atualizacao = atividade.ultimaAtualizacao
    if (atividade.documentos) updateData.documentos = atividade.documentos
    
    // Atualiza responsaveis se fornecido
    if (atividade.responsaveis !== undefined) {
      updateData.responsaveis = atividade.responsaveis
      updateData.responsavel_id = atividade.responsaveis.length > 0 ? atividade.responsaveis[0] : null
    } else if (atividade.responsavelId !== undefined) {
      // Compatibilidade: se responsavelId for fornecido, converte para array
      updateData.responsaveis = atividade.responsavelId ? [atividade.responsavelId] : []
      updateData.responsavel_id = atividade.responsavelId
    }
    
    const { data, error } = await supabase
      .from('atividades')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    return {
      id: data.id,
      titulo: data.titulo,
      descricao: data.descricao,
      frequencia: data.frequencia,
      responsaveis: data.responsaveis || (data.responsavel_id ? [data.responsavel_id] : []),
      responsavelId: data.responsavel_id,
      gerenciaId: data.gerencia_id,
      status: data.status,
      ultimaAtualizacao: data.ultima_atualizacao,
      documentos: data.documentos || []
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('atividades')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

