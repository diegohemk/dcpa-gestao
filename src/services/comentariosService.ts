import { supabase } from '../lib/supabase'
import { Comentario } from '../types'

export const comentariosService = {
  // Buscar comentários de uma atividade
  async getByAtividade(atividadeId: string): Promise<Comentario[]> {
    const { data, error } = await supabase
      .from('comentarios')
      .select(`
        *,
        autor:servidores!comentarios_autor_id_fkey(*)
      `)
      .eq('atividade_id', atividadeId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data?.map(c => ({
      id: c.id,
      conteudo: c.conteudo,
      autorId: c.autor_id,
      atividadeId: c.atividade_id,
      projetoId: c.projeto_id,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
      autor: c.autor ? {
        id: c.autor.id,
        nome: c.autor.nome,
        cargo: c.autor.cargo,
        gerenciaId: c.autor.gerencia_id,
        atribuicoes: c.autor.atribuicoes || []
      } : undefined
    })) || []
  },

  // Buscar comentários de um projeto
  async getByProjeto(projetoId: string): Promise<Comentario[]> {
    const { data, error } = await supabase
      .from('comentarios')
      .select(`
        *,
        autor:servidores!comentarios_autor_id_fkey(*)
      `)
      .eq('projeto_id', projetoId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data?.map(c => ({
      id: c.id,
      conteudo: c.conteudo,
      autorId: c.autor_id,
      atividadeId: c.atividade_id,
      projetoId: c.projeto_id,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
      autor: c.autor ? {
        id: c.autor.id,
        nome: c.autor.nome,
        cargo: c.autor.cargo,
        gerenciaId: c.autor.gerencia_id,
        atribuicoes: c.autor.atribuicoes || []
      } : undefined
    })) || []
  },

  // Criar novo comentário
  async create(comentario: {
    conteudo: string
    autorId: string
    atividadeId?: string
    projetoId?: string
  }): Promise<Comentario> {
    const { data, error } = await supabase
      .from('comentarios')
      .insert({
        conteudo: comentario.conteudo,
        autor_id: comentario.autorId,
        atividade_id: comentario.atividadeId,
        projeto_id: comentario.projetoId
      })
      .select(`
        *,
        autor:servidores!comentarios_autor_id_fkey(*)
      `)
      .single()

    if (error) throw error
    return {
      id: data.id,
      conteudo: data.conteudo,
      autorId: data.autor_id,
      atividadeId: data.atividade_id,
      projetoId: data.projeto_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      autor: data.autor ? {
        id: data.autor.id,
        nome: data.autor.nome,
        cargo: data.autor.cargo,
        gerenciaId: data.autor.gerencia_id,
        atribuicoes: data.autor.atribuicoes || []
      } : undefined
    }
  },

  // Atualizar comentário
  async update(id: string, conteudo: string): Promise<Comentario> {
    const { data, error } = await supabase
      .from('comentarios')
      .update({ conteudo })
      .eq('id', id)
      .select(`
        *,
        autor:servidores!comentarios_autor_id_fkey(*)
      `)
      .single()

    if (error) throw error
    return {
      id: data.id,
      conteudo: data.conteudo,
      autorId: data.autor_id,
      atividadeId: data.atividade_id,
      projetoId: data.projeto_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      autor: data.autor ? {
        id: data.autor.id,
        nome: data.autor.nome,
        cargo: data.autor.cargo,
        gerenciaId: data.autor.gerencia_id,
        atribuicoes: data.autor.atribuicoes || []
      } : undefined
    }
  },

  // Excluir comentário
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('comentarios')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Contar comentários de uma entidade
  async countByEntity(atividadeId?: string, projetoId?: string): Promise<number> {
    let query = supabase
      .from('comentarios')
      .select('id', { count: 'exact', head: true })

    if (atividadeId) {
      query = query.eq('atividade_id', atividadeId)
    } else if (projetoId) {
      query = query.eq('projeto_id', projetoId)
    }

    const { count, error } = await query

    if (error) throw error
    return count || 0
  }
}
