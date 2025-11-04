import { ReactNode, useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  FolderKanban, 
  GitBranch,
  ChevronDown,
  Bell,
  UserCircle,
  BookOpen,
  BarChart3,
  LogOut,
  Key,
  Building2
} from 'lucide-react'
import { useGerencias } from '../hooks/useGerencias'
import { useToast } from '../hooks/useToast'
import { useAuth } from '../hooks/useAuth'
import { ToastContainer } from './Toast'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()
  const [isGerenciasOpen, setIsGerenciasOpen] = useState(false)
  const [isSidebarHovered, setIsSidebarHovered] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { gerencias } = useGerencias()
  const { toasts, hideToast } = useToast()
  const { user, signOut } = useAuth()
  const userMenuRef = useRef<HTMLDivElement>(null)

  const isActive = (path: string) => location.pathname === path

  // Fechar menu do usuário ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Sidebar sempre colapsada, expande apenas no hover (sobreposição)
  const handleSidebarHover = () => {
    setIsSidebarHovered(true)
  }

  const handleSidebarLeave = () => {
    setIsSidebarHovered(false)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Sempre colapsada, expande no hover */}
      <aside 
        className={`fixed left-0 top-0 h-full z-50 ${isSidebarHovered ? 'w-64' : 'w-16'} bg-white shadow-lg flex flex-col transition-all duration-300`}
        onMouseEnter={handleSidebarHover}
        onMouseLeave={handleSidebarLeave}
      >
        {/* Logo */}
        <div className={`${isSidebarHovered ? 'p-4' : 'p-2'} border-b border-gray-200 transition-all`}>
          <div className={`flex items-center ${isSidebarHovered ? 'gap-2' : 'justify-center'}`}>
            <div className={`${isSidebarHovered ? 'w-8 h-8' : 'w-8 h-8'} bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center transition-all`}>
              <span className="text-white font-bold text-sm">DC</span>
            </div>
            {isSidebarHovered && (
              <div>
                <h1 className="text-xs font-bold text-gray-800">DCPA</h1>
                <p className="text-xs text-gray-500">Sistema de Gestão</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto scrollbar-hide">
          <Link
            to="/"
            className={`flex items-center ${isSidebarHovered ? 'gap-2' : 'justify-center'} px-3 py-2 rounded-lg mb-1 transition-colors ${
              isActive('/') 
                ? 'bg-primary-500 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title={!isSidebarHovered ? 'Dashboard' : ''}
          >
            <LayoutDashboard size={16} />
            {isSidebarHovered && <span className="font-medium text-sm">Dashboard</span>}
          </Link>

          {isSidebarHovered ? (
            <div className="mb-1">
              <button
                onClick={() => setIsGerenciasOpen(!isGerenciasOpen)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <GitBranch size={16} />
                  <span className="font-medium text-sm">Setores</span>
                </div>
                <ChevronDown 
                  size={14} 
                  className={`transition-transform ${isGerenciasOpen ? 'rotate-180' : ''}`}
                />
              </button>
              
              {isGerenciasOpen && (
                <div className="ml-3 mt-1 space-y-1">
                  <Link
                    to="/setores"
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                      location.pathname === '/setores'
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Building2 size={14} />
                    <span>Gerenciar Setores</span>
                  </Link>
                  {gerencias.map((gerencia) => (
                    <Link
                      key={gerencia.id}
                      to={`/gerencia/${gerencia.id}`}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        location.pathname === `/gerencia/${gerencia.id}`
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div 
                        className="w-1.5 h-1.5 rounded-full" 
                        style={{ backgroundColor: gerencia.cor }}
                      />
                      <span>{gerencia.sigla}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/gerencia/geaud"
              className="flex items-center justify-center px-3 py-2 rounded-lg mb-1 text-gray-700 hover:bg-gray-100 transition-colors"
              title="Setores"
            >
              <GitBranch size={16} />
            </Link>
          )}

          <Link
            to="/organograma"
            className={`flex items-center ${isSidebarHovered ? 'gap-2' : 'justify-center'} px-3 py-2 rounded-lg mb-1 transition-colors ${
              isActive('/organograma') 
                ? 'bg-primary-500 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title={!isSidebarHovered ? 'Organograma' : ''}
          >
            <GitBranch size={16} />
            {isSidebarHovered && <span className="font-medium text-sm">Organograma</span>}
          </Link>

          <Link
            to="/atividades"
            className={`flex items-center ${isSidebarHovered ? 'gap-2' : 'justify-center'} px-3 py-2 rounded-lg mb-1 transition-colors ${
              isActive('/atividades') 
                ? 'bg-primary-500 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title={!isSidebarHovered ? 'Atividades' : ''}
          >
            <ClipboardList size={16} />
            {isSidebarHovered && <span className="font-medium text-sm">Atividades</span>}
          </Link>

          <Link
            to="/projetos"
            className={`flex items-center ${isSidebarHovered ? 'gap-2' : 'justify-center'} px-3 py-2 rounded-lg mb-1 transition-colors ${
              isActive('/projetos') 
                ? 'bg-primary-500 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title={!isSidebarHovered ? 'Projetos' : ''}
          >
            <FolderKanban size={16} />
            {isSidebarHovered && <span className="font-medium text-sm">Projetos</span>}
          </Link>

          <Link
            to="/servidores"
            className={`flex items-center ${isSidebarHovered ? 'gap-2' : 'justify-center'} px-3 py-2 rounded-lg mb-1 transition-colors ${
              isActive('/servidores') 
                ? 'bg-primary-500 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title={!isSidebarHovered ? 'Servidores' : ''}
          >
            <Users size={16} />
            {isSidebarHovered && <span className="font-medium text-sm">Servidores</span>}
          </Link>

          <Link
            to="/cursos"
            className={`flex items-center ${isSidebarHovered ? 'gap-2' : 'justify-center'} px-3 py-2 rounded-lg mb-1 transition-colors ${
              isActive('/cursos') 
                ? 'bg-primary-500 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title={!isSidebarHovered ? 'Cursos' : ''}
          >
            <BookOpen size={16} />
            {isSidebarHovered && <span className="font-medium text-sm">Cursos</span>}
          </Link>

          <Link
            to="/desempenho"
            className={`flex items-center ${isSidebarHovered ? 'gap-2' : 'justify-center'} px-3 py-2 rounded-lg mb-1 transition-colors ${
              isActive('/desempenho') 
                ? 'bg-primary-500 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title={!isSidebarHovered ? 'Desempenho' : ''}
          >
            <BarChart3 size={16} />
            {isSidebarHovered && <span className="font-medium text-sm">Desempenho</span>}
          </Link>
        </nav>

        {/* Footer */}
        {isSidebarHovered && (
          <div className="p-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              <p>DCPA © 2025</p>
              <p className="mt-1">v1.0.0</p>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden ml-16">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {location.pathname === '/' && 'Dashboard Geral'}
                {location.pathname === '/organograma' && 'Organograma'}
                {location.pathname === '/atividades' && 'Gestão de Atividades'}
                {location.pathname === '/projetos' && 'Gestão de Projetos'}
                {location.pathname === '/servidores' && 'Gestão de Servidores'}
                {location.pathname === '/cursos' && 'Gestão de Cursos'}
                {location.pathname === '/desempenho' && 'Sistema de Desempenho'}
                {location.pathname === '/setores' && 'Gestão de Setores'}
                {location.pathname.startsWith('/gerencia/') && 
                  gerencias.find(g => location.pathname.includes(g.id))?.sigla
                }
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Diretoria de Controle, Passivos e Qualidade Ambiental
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={16} />
                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Menu do Usuário */}
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <UserCircle size={16} />
                  <span className="text-sm font-medium">{user?.email?.split('@')[0] || 'Usuário'}</span>
                </button>
                
                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      to="/alterar-senha"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Key size={16} />
                      Alterar Senha
                    </Link>
                    <button 
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        signOut()
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left"
                    >
                      <LogOut size={16} />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={hideToast} />
    </div>
  )
}

export default Layout
