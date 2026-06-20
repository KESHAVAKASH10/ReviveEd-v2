import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Dashboard from './Dashboard'
import QuizEngine from './QuizEngine/index'
import DoubtRoom from './DoubtRoom'
import ErrorBoundary from '../common/ErrorBoundary'

export default function StudentApp() {
    const { user, logout } = useAuth()
    const [screen, setScreen] = useState('dashboard')
    const [selectedLevel, setSelectedLevel] = useState(1)

    function startQuiz(level) {
        setSelectedLevel(level)
        setScreen('quiz')
    }

    function goHome() {
        setScreen('dashboard')
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--color-bg)',
            color: 'var(--color-text)',
            fontFamily: 'var(--font-main)',
            position: 'relative',
        }}>
            <div className="grid-bg" />

            <header style={{
                position: 'sticky', top: 0, zIndex: 100,
                background: 'rgba(10,13,20,0.95)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--color-border)',
                padding: '0 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 56,
            }}>
                <div onClick={goHome} style={{
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.95rem', fontWeight: 700
                }}>
                    Revive<span style={{ color: 'var(--color-green)' }}>Ed</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {screen !== 'dashboard' && (
                        <button onClick={goHome} style={{
                            background: 'transparent',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text-muted)',
                            borderRadius: 8, padding: '0.3rem 0.8rem',
                            fontSize: '0.78rem', cursor: 'pointer',
                            fontFamily: 'var(--font-main)'
                        }}>← Home</button>
                    )}
                    <button onClick={() => setScreen('doubt')} style={{
                        background: screen === 'doubt' ? 'var(--color-blue-dim)' : 'transparent',
                        border: `1px solid ${screen === 'doubt' ? 'var(--color-blue)' : 'var(--color-border)'}`,
                        color: screen === 'doubt' ? 'var(--color-blue)' : 'var(--color-text-muted)',
                        borderRadius: 8, padding: '0.3rem 0.8rem',
                        fontSize: '0.78rem', cursor: 'pointer',
                        fontFamily: 'var(--font-main)'
                    }}>💬 Doubt Room</button>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        {user.name}
                    </span>
                    <button onClick={logout} style={{
                        background: 'var(--color-red-dim)',
                        border: '1px solid var(--color-red)',
                        color: 'var(--color-red)',
                        borderRadius: 8, padding: '0.3rem 0.8rem',
                        fontSize: '0.78rem', cursor: 'pointer',
                        fontFamily: 'var(--font-main)'
                    }}>Exit</button>
                </div>
            </header>

            <main style={{ position: 'relative', zIndex: 1 }}>
                <ErrorBoundary>
                    {screen === 'dashboard' && <Dashboard onStartQuiz={startQuiz} />}
                    {screen === 'quiz' && <QuizEngine level={selectedLevel} onFinish={goHome} />}
                    {screen === 'doubt' && <DoubtRoom />}
                </ErrorBoundary>
            </main>
        </div>
    )
}