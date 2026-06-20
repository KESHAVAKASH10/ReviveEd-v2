import { useAuth } from './context/AuthContext'
import Login from './components/Login/index'
import StudentApp from './components/Student/index'
import ErrorBoundary from './components/common/ErrorBoundary'

export default function App() {
  const { user } = useAuth()

  if (!user) return <Login />

  if (user.role === 'teacher') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', minHeight: '100vh',
        color: 'var(--color-blue)',
        fontFamily: 'var(--font-main)', fontSize: '1.1rem'
      }}>
        🛡️ Teacher Dashboard — coming Day 3
      </div>
    )
  }

  if (user.role === 'parent') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', minHeight: '100vh',
        color: 'var(--color-yellow)',
        fontFamily: 'var(--font-main)', fontSize: '1.1rem'
      }}>
        👨‍👩‍👧 Parent Dashboard — coming Day 4
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <StudentApp />
    </ErrorBoundary>
  )
}