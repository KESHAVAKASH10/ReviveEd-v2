import { useAuth } from './context/AuthContext'
import Login from './components/Login/index'
import StudentApp from './components/Student/index'
import TeacherApp from './components/Teacher/index'
import ParentApp from './components/Parent/index'
import ErrorBoundary from './components/common/ErrorBoundary'

export default function App() {
  const { user } = useAuth()

  if (!user) return <Login />

  if (user.role === 'teacher') return (
    <ErrorBoundary><TeacherApp /></ErrorBoundary>
  )

  if (user.role === 'parent') return (
    <ErrorBoundary><ParentApp /></ErrorBoundary>
  )

  return (
    <ErrorBoundary><StudentApp /></ErrorBoundary>
  )
}