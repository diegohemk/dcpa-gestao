import { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: string
    isPositive: boolean
  }
  color?: string
  link?: string
}

const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = '#6366f1', link }: StatCardProps) => {
  const CardContent = () => (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div className="mt-2">
              <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
            </div>
          )}
        </div>
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
      </div>
    </div>
  )

  if (link) {
    return (
      <Link to={link} className="block hover:scale-105 transition-transform">
        <CardContent />
      </Link>
    )
  }

  return <CardContent />
}

export default StatCard

