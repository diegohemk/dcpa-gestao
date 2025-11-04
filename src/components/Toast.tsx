import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { Toast as ToastType } from '../types'

interface ToastProps {
  toast: ToastType
  onClose: (id: string) => void
}

const Toast = ({ toast, onClose }: ToastProps) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />
      default:
        return <Info className="w-5 h-5 text-gray-500" />
    }
  }

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div
      className={`${getBackgroundColor()} border rounded-lg shadow-lg p-4 mb-3 transition-all duration-300 transform hover:scale-105`}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 mb-1">
            {toast.title}
          </h4>
          {toast.message && (
            <p className="text-sm text-gray-600">
              {toast.message}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 ml-3">
          <button
            onClick={() => onClose(toast.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Fechar notificação"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastType[]
  onClose: (id: string) => void
}

export const ToastContainer = ({ toasts, onClose }: ToastContainerProps) => {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 w-96 max-w-sm">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={onClose}
        />
      ))}
    </div>
  )
}

export default Toast
