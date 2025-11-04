import { supabase } from '../lib/supabase'
import { HistoricoAlteracao } from '../types'

export const historicoService = {
  // Buscar histórico de uma entidade
  async getByEntity(
    entidadeTipo: 'atividade' | 'projeto' | 'servidor' | 'gerencia',
    entidadeId: string
  ): Promise<HistoricoAlteracao[]> {
    const { data, error } = await supabase
      .from('historico_alteracoes')
      .select(`
        *,
        usuario:servidores!historico_alteracoes_usuario_id_fkey(*)
      `)
      .eq('entidade_tipo', entidadeTipo)
      .eq('entidade_id', entidadeId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data?.map(h => ({
      id: h.id,
      entidadeTipo: h.entidade_tipo,
      entidadeId: h.entidade_id,
      acao: h.acao,
      usuarioId: h.usuario_id,
      campoAlterado: h.campo_alterado,
      valorAnterior: h.valor_anterior,
      valorNovo: h.valor_novo,
      createdAt: h.created_at,
      usuario: h.usuario ? {
        id: h.usuario.id,
        nome: h.usuario.nome,
        cargo: h.usuario.cargo,
        gerenciaId: h.usuario.gerencia_id,
        atribuicoes: h.usuario.atribuicoes || []
      } : undefined
    })) || []
  },

  // Registrar nova alteração
  async create(alteracao: {
    entidadeTipo: 'atividade' | 'projeto' | 'servidor' | 'gerencia'
    entidadeId: string
    acao: 'criou' | 'atualizou' | 'excluiu' | 'comentou'
    usuarioId: string
    campoAlterado?: string
    valorAnterior?: string
    valorNovo?: string
  }): Promise<HistoricoAlteracao> {
    const { data, error } = await supabase
      .from('historico_alteracoes')
      .insert({
        entidade_tipo: alteracao.entidadeTipo,
        entidade_id: alteracao.entidadeId,
        acao: alteracao.acao,
        usuario_id: alteracao.usuarioId,
        campo_alterado: alteracao.campoAlterado,
        valor_anterior: alteracao.valorAnterior,
        valor_novo: alteracao.valorNovo
      })
      .select(`
        *,
        usuario:servidores!historico_alteracoes_usuario_id_fkey(*)
      `)
      .single()

    if (error) throw error
    return {
      id: data.id,
      entidadeTipo: data.entidade_tipo,
      entidadeId: data.entidade_id,
      acao: data.acao,
      usuarioId: data.usuario_id,
      campoAlterado: data.campo_alterado,
      valorAnterior: data.valor_anterior,
      valorNovo: data.valor_novo,
      createdAt: data.created_at,
      usuario: data.usuario ? {
        id: data.usuario.id,
        nome: data.usuario.nome,
        cargo: data.usuario.cargo,
        gerenciaId: data.usuario.gerencia_id,
        atribuicoes: data.usuario.atribuicoes || []
      } : undefined
    }
  },

  // Buscar histórico por período
  async getByPeriod(
    entidadeTipo: 'atividade' | 'projeto' | 'servidor' | 'gerencia',
    entidadeId: string,
    startDate: string,
    endDate: string
  ): Promise<HistoricoAlteracao[]> {
    const { data, error } = await supabase
      .from('historico_alteracoes')
      .select(`
        *,
        usuario:servidores!historico_alteracoes_usuario_id_fkey(*)
      `)
      .eq('entidade_tipo', entidadeTipo)
      .eq('entidade_id', entidadeId)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data?.map(h => ({
      id: h.id,
      entidadeTipo: h.entidade_tipo,
      entidadeId: h.entidade_id,
      acao: h.acao,
      usuarioId: h.usuario_id,
      campoAlterado: h.campo_alterado,
      valorAnterior: h.valor_anterior,
      valorNovo: h.valor_novo,
      createdAt: h.created_at,
      usuario: h.usuario ? {
        id: h.usuario.id,
        nome: h.usuario.nome,
        cargo: h.usuario.cargo,
        gerenciaId: h.usuario.gerencia_id,
        atribuicoes: h.usuario.atribuicoes || []
      } : undefined
    })) || []
  },

  // Buscar histórico por ação
  async getByAction(
    entidadeTipo: 'atividade' | 'projeto' | 'servidor' | 'gerencia',
    entidadeId: string,
    acao: 'criou' | 'atualizou' | 'excluiu' | 'comentou'
  ): Promise<HistoricoAlteracao[]> {
    const { data, error } = await supabase
      .from('historico_alteracoes')
      .select(`
        *,
        usuario:servidores!historico_alteracoes_usuario_id_fkey(*)
      `)
      .eq('entidade_tipo', entidadeTipo)
      .eq('entidade_id', entidadeId)
      .eq('acao', acao)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data?.map(h => ({
      id: h.id,
      entidadeTipo: h.entidade_tipo,
      entidadeId: h.entidade_id,
      acao: h.acao,
      usuarioId: h.usuario_id,
      campoAlterado: h.campo_alterado,
      valorAnterior: h.valor_anterior,
      valorNovo: h.valor_novo,
      createdAt: h.created_at,
      usuario: h.usuario ? {
        id: h.usuario.id,
        nome: h.usuario.nome,
        cargo: h.usuario.cargo,
        gerenciaId: h.usuario.gerencia_id,
        atribuicoes: h.usuario.atribuicoes || []
      } : undefined
    })) || []
  },

  // Buscar histórico global (todas as entidades)
  async getGlobal(limit: number = 50): Promise<HistoricoAlteracao[]> {
    const { data, error } = await supabase
      .from('historico_alteracoes')
      .select(`
        *,
        usuario:servidores!historico_alteracoes_usuario_id_fkey(*)
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data?.map(h => ({
      id: h.id,
      entidadeTipo: h.entidade_tipo,
      entidadeId: h.entidade_id,
      acao: h.acao,
      usuarioId: h.usuario_id,
      campoAlterado: h.campo_alterado,
      valorAnterior: h.valor_anterior,
      valorNovo: h.valor_novo,
      createdAt: h.created_at,
      usuario: h.usuario ? {
        id: h.usuario.id,
        nome: h.usuario.nome,
        cargo: h.usuario.cargo,
        gerenciaId: h.usuario.gerencia_id,
        atribuicoes: h.usuario.atribuicoes || []
      } : undefined
    })) || []
  }
}
