import { useState } from 'react'
import { Star } from 'lucide-react'
import { useToast } from '../hooks/useToast'

interface FavoriteButtonProps {
  isFavorite: boolean
  onToggle: () => void
  projectName: string
}

export default function FavoriteButton({ isFavorite, onToggle, projectName }: FavoriteButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()

  const handleToggle = async () => {
    setIsLoading(true)
    try {
      await onToggle()
      showToast({
        type: 'success',
        title: 'Favorito Atualizado',
        message: `Projeto "${projectName}" ${isFavorite ? 'removido dos' : 'adicionado aos'} favoritos`,
      })
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao atualizar favorito',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`p-2 rounded-lg transition-all duration-200 ${
        isFavorite
          ? 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50'
          : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Star 
        size={20} 
        className={`transition-all duration-200 ${
          isFavorite ? 'fill-current' : ''
        } ${isLoading ? 'animate-pulse' : ''}`}
      />
    </button>
  )
}
