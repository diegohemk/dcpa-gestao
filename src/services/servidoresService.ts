import { supabase } from '../lib/supabase'
import { Servidor } from '../types'

export const servidoresService = {
  async getAll(): Promise<Servidor[]> {
    const { data, error } = await supabase
      .from('servidores')
      .select('*')
      .order('nome')
    
    if (error) throw error
    
    return (data || []).map(item => ({
      id: item.id,
      nome: item.nome,
      cargo: item.cargo,
      gerenciaId: item.gerencia_id,
      atribuicoes: item.atribuicoes || []
    }))
  },

  async getByGerencia(gerenciaId: string): Promise<Servidor[]> {
    const { data, error } = await supabase
      .from('servidores')
      .select('*')
      .eq('gerencia_id', gerenciaId)
      .order('nome')
    
    if (error) throw error
    
    return (data || []).map(item => ({
      id: item.id,
      nome: item.nome,
      cargo: item.cargo,
      gerenciaId: item.gerencia_id,
      atribuicoes: item.atribuicoes || []
    }))
  },

  async create(servidor: Omit<Servidor, 'id'>): Promise<Servidor> {
    const id = `s${Date.now()}`
    const { data, error } = await supabase
      .from('servidores')
      .insert({
        id,
        nome: servidor.nome,
        cargo: servidor.cargo,
        gerencia_id: servidor.gerenciaId,
        atribuicoes: servidor.atribuicoes
      })
      .select()
      .single()
    
    if (error) throw error
    
    return {
      id: data.id,
      nome: data.nome,
      cargo: data.cargo,
      gerenciaId: data.gerencia_id,
      atribuicoes: data.atribuicoes || []
    }
  },

  async update(id: string, servidor: Partial<Servidor>): Promise<Servidor> {
    const updateData: any = {}
    if (servidor.nome) updateData.nome = servidor.nome
    if (servidor.cargo) updateData.cargo = servidor.cargo
    if (servidor.gerenciaId) updateData.gerencia_id = servidor.gerenciaId
    if (servidor.atribuicoes) updateData.atribuicoes = servidor.atribuicoes
    
    const { data, error } = await supabase
      .from('servidores')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    return {
      id: data.id,
      nome: data.nome,
      cargo: data.cargo,
      gerenciaId: data.gerencia_id,
      atribuicoes: data.atribuicoes || []
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('servidores')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

