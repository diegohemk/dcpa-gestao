import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Badge = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '' 
}: BadgeProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-100 text-primary-800'
      case 'secondary':
        return 'bg-gray-100 text-gray-800'
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      case 'info':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-primary-100 text-primary-800'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-1.5 py-0.5 text-xs'
      case 'md':
        return 'px-2 py-1 text-sm'
      case 'lg':
        return 'px-3 py-1.5 text-base'
      default:
        return 'px-2 py-1 text-sm'
    }
  }

  return (
    <span 
      className={`inline-flex items-center font-medium rounded-full ${getVariantClasses()} ${getSizeClasses()} ${className}`}
    >
      {children}
    </span>
  )
}

// Badge específico para contadores
interface CounterBadgeProps {
  count: number
  max?: number
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  showZero?: boolean
}

export const CounterBadge = ({ 
  count, 
  max = 99, 
  variant = 'error',
  showZero = false 
}: CounterBadgeProps) => {
  if (count === 0 && !showZero) return null

  const displayCount = count > max ? `${max}+` : count.toString()

  return (
    <Badge variant={variant} size="sm">
      {displayCount}
    </Badge>
  )
}

// Badge para status
interface StatusBadgeProps {
  status: string
  className?: string
}

export const StatusBadge = ({ status, className = '' }: StatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendente':
        return { variant: 'warning' as const, text: 'Pendente' }
      case 'em andamento':
        return { variant: 'info' as const, text: 'Em Andamento' }
      case 'concluída':
      case 'concluido':
        return { variant: 'success' as const, text: 'Concluída' }
      case 'verde':
        return { variant: 'success' as const, text: 'No Prazo' }
      case 'amarelo':
        return { variant: 'warning' as const, text: 'Atenção' }
      case 'vermelho':
        return { variant: 'error' as const, text: 'Atrasado' }
      default:
        return { variant: 'secondary' as const, text: status }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Badge variant={config.variant} className={className}>
      {config.text}
    </Badge>
  )
}

// Badge para indicadores de novidade
interface NewBadgeProps {
  isNew?: boolean
  className?: string
}

export const NewBadge = ({ isNew = false, className = '' }: NewBadgeProps) => {
  if (!isNew) return null

  return (
    <Badge variant="error" size="sm" className={`animate-pulse ${className}`}>
      Novo
    </Badge>
  )
}

export default Badge
