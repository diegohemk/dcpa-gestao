import { supabase } from '../lib/supabase'
import { Gerencia } from '../types'

export const gerenciasService = {
  async getAll(): Promise<Gerencia[]> {
    const { data, error } = await supabase
      .from('gerencias')
      .select('*')
      .order('sigla')
    
    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Gerencia | null> {
    const { data, error } = await supabase
      .from('gerencias')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async create(gerencia: Omit<Gerencia, 'id'>): Promise<Gerencia> {
    const id = `g${Date.now()}${Math.random().toString(36).substr(2, 9)}`
    
    const { data, error } = await supabase
      .from('gerencias')
      .insert({
        id,
        nome: gerencia.nome,
        sigla: gerencia.sigla,
        cor: gerencia.cor
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, gerencia: Partial<Omit<Gerencia, 'id'>>): Promise<Gerencia> {
    const { data, error } = await supabase
      .from('gerencias')
      .update({
        nome: gerencia.nome,
        sigla: gerencia.sigla,
        cor: gerencia.cor,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('gerencias')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

