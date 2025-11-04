import { useState, useEffect } from 'react'
import { Gerencia } from '../types'
import { gerenciasService } from '../services/gerenciasService'

export const useGerencias = () => {
  const [gerencias, setGerencias] = useState<Gerencia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadGerencias()
  }, [])

  const loadGerencias = async () => {
    try {
      setLoading(true)
      const data = await gerenciasService.getAll()
      setGerencias(data)
      setError(null)
    } catch (err) {
      setError('Erro ao carregar gerências')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return { gerencias, loading, error, reload: loadGerencias }
}

