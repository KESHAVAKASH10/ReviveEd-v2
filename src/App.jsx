import { useAuth } from './context/AuthContext'
import Login from './components/Login/index'

function App() {
  const { user } = useAuth()

  if (!user) return <Login />

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      color: '#00e5a0',
      fontFamily: 'Sora, sans-serif',
      fontSize: '1.2rem'
    }}>
      ✅ Logged in as {user.name} ({user.role}) — dashboard coming next
    </div>
  )
}

export default App