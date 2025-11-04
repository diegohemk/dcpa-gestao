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
  }
}

