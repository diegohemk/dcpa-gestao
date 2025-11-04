import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Layout from './components/Layout'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import GerenciaDetail from './pages/GerenciaDetail'
import Organograma from './pages/Organograma'
import Atividades from './pages/Atividades'
import AtividadeDetail from './pages/AtividadeDetail'
import Projetos from './pages/Projetos'
import ProjetoDetail from './pages/ProjetoDetail'
import Servidores from './pages/Servidores'
import Cursos from './pages/Cursos'
import Desempenho from './pages/Desempenho'
import AlterarSenha from './pages/AlterarSenha'
import Gerencias from './pages/Gerencias'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            user ? <Navigate to="/" replace /> : <Login onLoginSuccess={() => window.location.reload()} />
          } 
        />
        <Route
          path="/"
          element={
            user ? (
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/gerencia/:id" element={<GerenciaDetail />} />
                  <Route path="/organograma" element={<Organograma />} />
                  <Route path="/atividades" element={<Atividades />} />
                  <Route path="/atividade/:id" element={<AtividadeDetail />} />
                  <Route path="/projetos" element={<Projetos />} />
                  <Route path="/projeto/:id" element={<ProjetoDetail />} />
                  <Route path="/servidores" element={<Servidores />} />
                  <Route path="/cursos" element={<Cursos />} />
                  <Route path="/desempenho" element={<Desempenho />} />
                  <Route path="/setores" element={<Gerencias />} />
                  <Route path="/alterar-senha" element={<AlterarSenha />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App

