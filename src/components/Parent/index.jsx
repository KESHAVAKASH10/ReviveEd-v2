import { useAuth } from '../../context/AuthContext'
import Dashboard from './Dashboard'
import ErrorBoundary from '../common/ErrorBoundary'

export default function ParentApp() {
    const { user, logout } = useAuth()

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
                <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.95rem', fontWeight: 700
                }}>
                    Revive<span style={{ color: 'var(--color-yellow)' }}>Ed</span>
                    <span style={{
                        color: 'var(--color-text-muted)',
                        fontWeight: 400,
                        marginLeft: '0.5rem',
                        fontSize: '0.82rem'
                    }}>
                        / Parent View
                    </span>
                </div>

                <div style={{
                    display: 'flex', alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    <span style={{
                        fontSize: '0.78rem',
                        color: 'var(--color-text-muted)',
                        fontFamily: 'var(--font-mono)',
                        background: 'var(--color-yellow-dim)',
                        border: '1px solid var(--color-yellow)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: 4,
                        letterSpacing: '0.08em'
                    }}>
                        PARENT
                    </span>
                    <span style={{
                        fontSize: '0.82rem',
                        color: 'var(--color-text-muted)'
                    }}>
                        {user.name}
                    </span>
                    <button onClick={logout} style={{
                        background: 'var(--color-red-dim)',
                        border: '1px solid var(--color-red)',
                        color: 'var(--color-red)',
                        borderRadius: 8, padding: '0.3rem 0.8rem',
                        fontSize: '0.78rem', cursor: 'pointer',
                        fontFamily: 'var(--font-main)'
                    }}>
                        Exit
                    </button>
                </div>
            </header>

            <main style={{ position: 'relative', zIndex: 1 }}>
                <ErrorBoundary>
                    <Dashboard />
                </ErrorBoundary>
            </main>
        </div>
    )
}