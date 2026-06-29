import { AuthProvider } from './AuthProvider'
import { useAuth } from './useAuth'
import Login from './components/Login'
import TodoList from './components/TodoList'
import './App.css'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) return <div className="loading-screen">Loading...</div>

  return user ? <TodoList /> : <Login />
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
