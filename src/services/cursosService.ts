import { supabase } from '../lib/supabase'
import { Curso } from '../types'

export const cursosService = {
  // Buscar todos os cursos
  async getAll(): Promise<Curso[]> {
    const { data, error } = await supabase
      .from('cursos')
      .select(`
        *,
        instrutor:servidores!cursos_instrutor_id_fkey(*),
        gerencia:gerencias!cursos_gerencia_id_fkey(*)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Buscar curso por ID
  async getById(id: string): Promise<Curso> {
    const { data, error } = await supabase
      .from('cursos')
      .select(`
        *,
        instrutor:servidores!cursos_instrutor_id_fkey(*),
        gerencia:gerencias!cursos_gerencia_id_fkey(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Buscar cursos por status
  async getByStatus(status: string): Promise<Curso[]> {
    const { data, error } = await supabase
      .from('cursos')
      .select(`
        *,
        instrutor:servidores!cursos_instrutor_id_fkey(*),
        gerencia:gerencias!cursos_gerencia_id_fkey(*)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Buscar cursos por tipo
  async getByTipo(tipo: string): Promise<Curso[]> {
    const { data, error } = await supabase
      .from('cursos')
      .select(`
        *,
        instrutor:servidores!cursos_instrutor_id_fkey(*),
        gerencia:gerencias!cursos_gerencia_id_fkey(*)
      `)
      .eq('tipo', tipo)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Buscar cursos ministrados ou não
  async getByMinistrado(ministrado: boolean): Promise<Curso[]> {
    const { data, error } = await supabase
      .from('cursos')
      .select(`
        *,
        instrutor:servidores!cursos_instrutor_id_fkey(*),
        gerencia:gerencias!cursos_gerencia_id_fkey(*)
      `)
      .eq('ministrado', ministrado)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Criar novo curso
  async create(curso: {
    nome: string
    descricao?: string
    ministrado: boolean
    dataInicio?: string
    dataFim?: string
    cargaHoraria?: number
    instrutorId?: string
    gerenciaId?: string
    participantes: string[]
    status: 'planejado' | 'em_andamento' | 'concluido' | 'cancelado'
    tipo: 'interno' | 'externo' | 'online' | 'presencial'
    local?: string
    observacoes?: string
    documentos?: string[]
  }): Promise<Curso> {
    const { data, error } = await supabase
      .from('cursos')
      .insert({
        nome: curso.nome,
        descricao: curso.descricao,
        ministrado: curso.ministrado,
        data_inicio: curso.dataInicio,
        data_fim: curso.dataFim,
        carga_horaria: curso.cargaHoraria,
        instrutor_id: curso.instrutorId,
        gerencia_id: curso.gerenciaId,
        participantes: curso.participantes,
        status: curso.status,
        tipo: curso.tipo,
        local: curso.local,
        observacoes: curso.observacoes,
        documentos: curso.documentos || []
      })
      .select(`
        *,
        instrutor:servidores!cursos_instrutor_id_fkey(*),
        gerencia:gerencias!cursos_gerencia_id_fkey(*)
      `)
      .single()

    if (error) throw error
    return data
  },

  // Atualizar curso
  async update(id: string, updates: Partial<{
    nome: string
    descricao: string
    ministrado: boolean
    dataInicio: string
    dataFim: string
    cargaHoraria: number
    instrutorId: string
    gerenciaId: string
    participantes: string[]
    status: 'planejado' | 'em_andamento' | 'concluido' | 'cancelado'
    tipo: 'interno' | 'externo' | 'online' | 'presencial'
    local: string
    observacoes: string
    documentos: string[]
  }>): Promise<Curso> {
    const updateData: any = {}
    
    if (updates.nome !== undefined) updateData.nome = updates.nome
    if (updates.descricao !== undefined) updateData.descricao = updates.descricao
    if (updates.ministrado !== undefined) updateData.ministrado = updates.ministrado
    if (updates.dataInicio !== undefined) updateData.data_inicio = updates.dataInicio
    if (updates.dataFim !== undefined) updateData.data_fim = updates.dataFim
    if (updates.cargaHoraria !== undefined) updateData.carga_horaria = updates.cargaHoraria
    if (updates.instrutorId !== undefined) updateData.instrutor_id = updates.instrutorId
    if (updates.gerenciaId !== undefined) updateData.gerencia_id = updates.gerenciaId
    if (updates.participantes !== undefined) updateData.participantes = updates.participantes
    if (updates.status !== undefined) updateData.status = updates.status
    if (updates.tipo !== undefined) updateData.tipo = updates.tipo
    if (updates.local !== undefined) updateData.local = updates.local
    if (updates.observacoes !== undefined) updateData.observacoes = updates.observacoes
    if (updates.documentos !== undefined) updateData.documentos = updates.documentos

    const { data, error } = await supabase
      .from('cursos')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        instrutor:servidores!cursos_instrutor_id_fkey(*),
        gerencia:gerencias!cursos_gerencia_id_fkey(*)
      `)
      .single()

    if (error) throw error
    return data
  },

  // Excluir curso
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('cursos')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Contar cursos por status
  async countByStatus(): Promise<Record<string, number>> {
    const { data, error } = await supabase
      .from('cursos')
      .select('status')

    if (error) throw error

    const counts = data.reduce((acc, curso) => {
      acc[curso.status] = (acc[curso.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return counts
  },

  // Contar cursos ministrados vs não ministrados
  async countByMinistrado(): Promise<{ ministrados: number; naoMinistrados: number }> {
    const { data, error } = await supabase
      .from('cursos')
      .select('ministrado')

    if (error) throw error

    const counts = data.reduce((acc, curso) => {
      if (curso.ministrado) {
        acc.ministrados++
      } else {
        acc.naoMinistrados++
      }
      return acc
    }, { ministrados: 0, naoMinistrados: 0 })

    return counts
  }
}
