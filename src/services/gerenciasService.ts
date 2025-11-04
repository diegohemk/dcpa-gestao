import { supabase } from '../lib/supabase'
import { Gerencia } from '../types'

export const gerenciasService = {
  async getAll(): Promise<Gerencia[]> {
    const { data, error } = await supabase
      .from('gerencias')
      .select('*')
      .order('sigla')
    
    if (error) throw error
    return (data || []).map(item => ({
      ...item,
      listarNoOrganograma: item.listar_no_organograma !== false
    }))
  },

  async getById(id: string): Promise<Gerencia | null> {
    const { data, error } = await supabase
      .from('gerencias')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    if (!data) return null
    return {
      ...data,
      listarNoOrganograma: data.listar_no_organograma !== false
    }
  },

  async create(gerencia: Omit<Gerencia, 'id'>): Promise<Gerencia> {
    const id = `g${Date.now()}${Math.random().toString(36).substr(2, 9)}`
    
    const { data, error } = await supabase
      .from('gerencias')
      .insert({
        id,
        nome: gerencia.nome,
        sigla: gerencia.sigla,
        cor: gerencia.cor,
        listar_no_organograma: gerencia.listarNoOrganograma !== false // Padrão true
      })
      .select()
      .single()
    
    if (error) throw error
    return {
      ...data,
      listarNoOrganograma: data.listar_no_organograma !== false
    }
  },

  async update(id: string, gerencia: Partial<Omit<Gerencia, 'id'>>): Promise<Gerencia> {
    const updateData: any = {
      nome: gerencia.nome,
      sigla: gerencia.sigla,
      cor: gerencia.cor,
      updated_at: new Date().toISOString()
    }
    
    if (gerencia.listarNoOrganograma !== undefined) {
      updateData.listar_no_organograma = gerencia.listarNoOrganograma
    }
    
    const { data, error } = await supabase
      .from('gerencias')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return {
      ...data,
      listarNoOrganograma: data.listar_no_organograma !== false
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('gerencias')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

