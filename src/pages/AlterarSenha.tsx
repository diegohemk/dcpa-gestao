import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useToast } from '../hooks/useToast'
import { useAuth } from '../hooks/useAuth'
import { Eye, EyeOff, Lock, Shield, CheckCircle, AlertCircle } from 'lucide-react'

export default function AlterarSenha() {
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [showNovaSenha, setShowNovaSenha] = useState(false)
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()
  const { user } = useAuth()

  const validatePassword = (password: string) => {
    const minLength = password.length >= 6
    const hasNumber = /\d/.test(password)
    const hasLetter = /[a-zA-Z]/.test(password)
    
    return {
      minLength,
      hasNumber,
      hasLetter,
      isValid: minLength && hasNumber && hasLetter
    }
  }

  const passwordValidation = validatePassword(novaSenha)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Verificar se as senhas coincidem
      if (novaSenha !== confirmarSenha) {
        showToast({
          type: 'error',
          title: 'Erro',
          message: 'As senhas não coincidem',
        })
        return
      }

      // Verificar se a nova senha atende aos critérios
      if (!passwordValidation.isValid) {
        showToast({
          type: 'error',
          title: 'Senha Inválida',
          message: 'A senha deve ter pelo menos 6 caracteres, incluindo letras e números',
        })
        return
      }

      // Atualizar a senha no Supabase
      const { error } = await supabase.auth.updateUser({
        password: novaSenha
      })

      if (error) {
        showToast({
          type: 'error',
          title: 'Erro',
          message: error.message || 'Erro ao alterar senha',
        })
        return
      }

      showToast({
        type: 'success',
        title: 'Sucesso',
        message: 'Senha alterada com sucesso!',
      })

      // Limpar formulário
      setNovaSenha('')
      setConfirmarSenha('')
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro inesperado ao alterar senha',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Alterar Senha
            </h1>
            <p className="text-gray-600 mt-1">
              Mantenha sua conta segura com uma senha forte
            </p>
          </div>
        </div>
        
        {/* Informações do usuário */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Logado como: {user?.email}
            </span>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nova Senha */}
          <div>
            <label htmlFor="novaSenha" className="block text-sm font-medium text-gray-700 mb-2">
              Nova Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="novaSenha"
                type={showNovaSenha ? 'text' : 'password'}
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Digite sua nova senha"
                required
              />
              <button
                type="button"
                onClick={() => setShowNovaSenha(!showNovaSenha)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showNovaSenha ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            
            {/* Validação da senha */}
            {novaSenha && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  {passwordValidation.minLength ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${passwordValidation.minLength ? 'text-green-600' : 'text-red-600'}`}>
                    Mínimo 6 caracteres
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordValidation.hasLetter ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${passwordValidation.hasLetter ? 'text-green-600' : 'text-red-600'}`}>
                    Pelo menos uma letra
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordValidation.hasNumber ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                    Pelo menos um número
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirmar Nova Senha */}
          <div>
            <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Nova Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmarSenha"
                type={showConfirmarSenha ? 'text' : 'password'}
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Confirme sua nova senha"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmarSenha ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            
            {/* Verificação de coincidência */}
            {confirmarSenha && (
              <div className="mt-2">
                {novaSenha === confirmarSenha ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">Senhas coincidem</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-600">Senhas não coincidem</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Botão de Submit */}
          <button
            type="submit"
            disabled={isLoading || !passwordValidation.isValid || novaSenha !== confirmarSenha}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Alterando...
              </div>
            ) : (
              'Alterar Senha'
            )}
          </button>
        </form>

        {/* Dicas de Segurança */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Dicas de Segurança</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
              <span>Use uma combinação de letras, números e símbolos</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
              <span>Evite informações pessoais óbvias</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
              <span>Não compartilhe sua senha com outras pessoas</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
              <span>Considere usar um gerenciador de senhas</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
