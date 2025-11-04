import { useState, useRef, useEffect } from 'react'
import { AtSign, User } from 'lucide-react'
import { Servidor } from '../types'

interface MentionInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  servidores: Servidor[]
  disabled?: boolean
  rows?: number
}

const MentionInput = ({ 
  value, 
  onChange, 
  placeholder = "Digite sua mensagem...", 
  servidores, 
  disabled = false,
  rows = 3
}: MentionInputProps) => {
  const [showMentions, setShowMentions] = useState(false)
  const [mentionQuery, setMentionQuery] = useState('')
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 })
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const mentionListRef = useRef<HTMLDivElement>(null)

  // Filtrar servidores baseado na query de menção
  const filteredServidores = servidores.filter(servidor =>
    servidor.nome.toLowerCase().includes(mentionQuery.toLowerCase())
  )

  // Detectar quando o usuário digita @
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    onChange(newValue)

    const cursorPosition = e.target.selectionStart
    const textBeforeCursor = newValue.substring(0, cursorPosition)
    const lastAtIndex = textBeforeCursor.lastIndexOf('@')

    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1)
      
      // Verificar se não há espaço após o @ (indicando uma menção ativa)
      if (!textAfterAt.includes(' ')) {
        setMentionQuery(textAfterAt)
        setShowMentions(true)
        updateMentionPosition(e.target)
        setSelectedMentionIndex(0)
      } else {
        setShowMentions(false)
      }
    } else {
      setShowMentions(false)
    }
  }

  // Atualizar posição da lista de menções
  const updateMentionPosition = (textarea: HTMLTextAreaElement) => {
    const rect = textarea.getBoundingClientRect()
    const scrollTop = textarea.scrollTop
    const lineHeight = 20 // Altura aproximada da linha
    
    setMentionPosition({
      top: rect.top + scrollTop + lineHeight,
      left: rect.left
    })
  }

  // Inserir menção selecionada
  const insertMention = (servidor: Servidor) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const cursorPosition = textarea.selectionStart
    const textBeforeCursor = value.substring(0, cursorPosition)
    const lastAtIndex = textBeforeCursor.lastIndexOf('@')
    
    if (lastAtIndex !== -1) {
      const textAfterCursor = value.substring(cursorPosition)
      const newValue = 
        value.substring(0, lastAtIndex) + 
        `@${servidor.nome} ` + 
        textAfterCursor
      
      onChange(newValue)
      
      // Reposicionar cursor após a menção
      setTimeout(() => {
        const newCursorPosition = lastAtIndex + servidor.nome.length + 2
        textarea.setSelectionRange(newCursorPosition, newCursorPosition)
        textarea.focus()
      }, 0)
    }
    
    setShowMentions(false)
  }

  // Navegação com teclado
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showMentions) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedMentionIndex(prev => 
          Math.min(prev + 1, filteredServidores.length - 1)
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedMentionIndex(prev => Math.max(prev - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (filteredServidores[selectedMentionIndex]) {
          insertMention(filteredServidores[selectedMentionIndex])
        }
        break
      case 'Escape':
        setShowMentions(false)
        break
    }
  }

  // Fechar menções ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mentionListRef.current && 
        !mentionListRef.current.contains(event.target as Node) &&
        !textareaRef.current?.contains(event.target as Node)
      ) {
        setShowMentions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm"
      />

      {/* Lista de menções */}
      {showMentions && filteredServidores.length > 0 && (
        <div
          ref={mentionListRef}
          className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto min-w-[200px]"
          style={{
            top: mentionPosition.top,
            left: mentionPosition.left
          }}
        >
          <div className="p-2 border-b border-gray-100">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <AtSign size={12} />
              <span>Mencionar usuário</span>
            </div>
          </div>
          
          {filteredServidores.map((servidor, index) => (
            <button
              key={servidor.id}
              onClick={() => insertMention(servidor)}
              className={`w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 ${
                index === selectedMentionIndex ? 'bg-primary-50' : ''
              }`}
            >
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                <User size={12} className="text-primary-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {servidor.nome}
                </div>
                <div className="text-xs text-gray-500">
                  {servidor.cargo}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Dica de uso */}
      <div className="mt-1 text-xs text-gray-500">
        Digite @ para mencionar alguém
      </div>
    </div>
  )
}

export default MentionInput
