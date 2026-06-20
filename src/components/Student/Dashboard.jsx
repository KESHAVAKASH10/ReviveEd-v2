import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getStudentProgress, getStudentEngagementTrend } from '../../lib/db'
import { calcShield, getRiskColor } from '../../lib/utils'
import LoadingSpinner from '../common/LoadingSpinner'
import EmptyState from '../common/EmptyState'

const LEVELS = [1, 2, 3, 4, 5]

export default function Dashboard({ onStartQuiz }) {
    const { user } = useAuth()
    const [progress, setProgress] = useState(null)
    const [trend, setTrend] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            setLoading(true)
            try {
                const [prog, tr] = await Promise.all([
                    getStudentProgress(user.id, user.class),
                    getStudentEngagementTrend(user.id)
                ])
                setProgress(prog)
                setTrend(tr)
            } catch (err) {
                console.error('[Dashboard] load error:', err.message)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [user.id, user.class])

    if (loading) return <LoadingSpinner text="Loading your dashboard..." />

    const shield = calcShield(trend)
    const maxLevel = progress?.max_level_unlocked ?? 1
    const totalXp = progress?.total_xp ?? 0
    const shieldColor = getRiskColor(shield / 100)

    return (
        <div style={{
            padding: '2rem 1.5rem',
            maxWidth: 680,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
        }}>

            {/* Welcome */}
            <div className="fade-up">
                <div style={{
                    fontSize: '0.7rem', fontFamily: 'var(--font-mono)',
                    color: 'var(--color-text-muted)',
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    marginBottom: '0.4rem'
                }}>
                    Class {user.class} · {user.section ?? 'General'}
                </div>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>
                    Welcome back, {user.name} 👋
                </h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                    Keep learning. Every level counts.
                </p>
            </div>

            {/* Stats row */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
            }}>
                {[
                    { label: 'Learning Shield', value: `${shield}%`, color: shieldColor },
                    { label: 'Total XP', value: totalXp, color: 'var(--color-blue)' },
                    { label: 'Level Reached', value: `${maxLevel} / 5`, color: 'var(--color-yellow)' },
                ].map((stat, i) => (
                    <div key={i} style={{
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.2rem',
                        textAlign: 'center',
                    }}>
                        <div style={{
                            fontSize: '1.8rem', fontWeight: 800,
                            color: stat.color, fontFamily: 'var(--font-mono)'
                        }}>
                            {stat.value}
                        </div>
                        <div style={{
                            fontSize: '0.72rem', color: 'var(--color-text-muted)',
                            marginTop: '0.3rem'
                        }}>
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Level map */}
            <div style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.4rem',
            }}>
                <div style={{
                    fontSize: '0.7rem', fontFamily: 'var(--font-mono)',
                    color: 'var(--color-green)',
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    marginBottom: '1rem'
                }}>
                    Your Level Map — Class {user.class}
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                }}>
                    {LEVELS.map(level => {
                        const unlocked = level <= maxLevel
                        const completed = level < maxLevel
                        const current = level === maxLevel

                        return (
                            <div key={level} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.9rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                background: current
                                    ? 'var(--color-green-dim)'
                                    : 'var(--color-surface-2)',
                                border: `1px solid ${current
                                    ? 'var(--color-green)'
                                    : completed
                                        ? 'var(--color-border)'
                                        : 'var(--color-border)'}`,
                                opacity: unlocked ? 1 : 0.4,
                                transition: 'all 0.2s',
                            }}>
                                {/* Status icon */}
                                <div style={{
                                    width: 36, height: 36,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1rem',
                                    background: completed
                                        ? 'var(--color-green-dim)'
                                        : current
                                            ? 'var(--color-green)'
                                            : 'var(--color-surface)',
                                    border: `1px solid ${completed || current
                                        ? 'var(--color-green)'
                                        : 'var(--color-border)'}`,
                                    flexShrink: 0,
                                }}>
                                    {completed ? '✅' : current ? '▶' : '🔒'}
                                </div>

                                {/* Level info */}
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontWeight: 700, fontSize: '0.9rem',
                                        color: current
                                            ? 'var(--color-green)'
                                            : 'var(--color-text)'
                                    }}>
                                        Level {level}
                                        {current && (
                                            <span style={{
                                                marginLeft: '0.5rem',
                                                fontSize: '0.65rem',
                                                background: 'var(--color-green)',
                                                color: '#000',
                                                padding: '0.1rem 0.4rem',
                                                borderRadius: 4,
                                                fontWeight: 800,
                                            }}>
                                                CURRENT
                                            </span>
                                        )}
                                    </div>
                                    <div style={{
                                        fontSize: '0.72rem',
                                        color: 'var(--color-text-muted)',
                                        marginTop: '0.1rem'
                                    }}>
                                        {level === 1 ? 'Basic concepts' :
                                            level === 2 ? 'Medium problems' :
                                                level === 3 ? 'Hard problems' :
                                                    level === 4 ? 'Advanced problems' :
                                                        'Chapter test'}
                                    </div>
                                </div>

                                {/* Start button */}
                                {unlocked && (
                                    <button
                                        onClick={() => onStartQuiz(level)}
                                        style={{
                                            background: current
                                                ? 'var(--color-green)'
                                                : 'transparent',
                                            border: `1px solid ${current
                                                ? 'var(--color-green)'
                                                : 'var(--color-border)'}`,
                                            color: current ? '#000' : 'var(--color-text-muted)',
                                            borderRadius: 8,
                                            padding: '0.4rem 1rem',
                                            fontSize: '0.78rem',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            fontFamily: 'var(--font-main)',
                                            flexShrink: 0,
                                        }}
                                    >
                                        {completed ? 'Replay' : 'Start →'}
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Board prep unlock */}
                {maxLevel > 5 && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-yellow-dim)',
                        border: '1px solid var(--color-yellow)',
                        textAlign: 'center',
                    }}>
                        <div style={{ fontSize: '1.2rem' }}>🏆</div>
                        <div style={{
                            fontWeight: 800, color: 'var(--color-yellow)',
                            fontSize: '0.9rem', marginTop: '0.3rem'
                        }}>
                            Board Exam Prep Unlocked!
                        </div>
                        <div style={{
                            fontSize: '0.75rem',
                            color: 'var(--color-text-muted)',
                            marginTop: '0.2rem'
                        }}>
                            Practice with real Tamil Nadu board questions
                        </div>
                        <button
                            onClick={() => onStartQuiz('board')}
                            style={{
                                marginTop: '0.75rem',
                                background: 'var(--color-yellow)',
                                border: 'none', color: '#000',
                                borderRadius: 8, padding: '0.5rem 1.2rem',
                                fontSize: '0.82rem', fontWeight: 800,
                                cursor: 'pointer',
                                fontFamily: 'var(--font-main)'
                            }}
                        >
                            Start Board Prep →
                        </button>
                    </div>
                )}
            </div>

            {/* Engagement trend */}
            {trend.some(s => s > 0) && (
                <div style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.4rem',
                }}>
                    <div style={{
                        fontSize: '0.7rem', fontFamily: 'var(--font-mono)',
                        color: 'var(--color-text-muted)',
                        letterSpacing: '0.15em', textTransform: 'uppercase',
                        marginBottom: '0.8rem'
                    }}>
                        This Week's Engagement
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: '0.5rem',
                        height: 60,
                    }}>
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                            <div key={day} style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.3rem',
                            }}>
                                <div style={{
                                    width: '100%',
                                    height: `${Math.max(4, (trend[i] ?? 0) * 50)}px`,
                                    background: (trend[i] ?? 0) >= 0.7
                                        ? 'var(--color-green)'
                                        : (trend[i] ?? 0) >= 0.4
                                            ? 'var(--color-yellow)'
                                            : 'var(--color-red)',
                                    borderRadius: '3px 3px 0 0',
                                    transition: 'height 0.5s ease',
                                    opacity: (trend[i] ?? 0) === 0 ? 0.2 : 1,
                                }} />
                                <div style={{
                                    fontSize: '0.6rem',
                                    color: 'var(--color-text-muted)'
                                }}>
                                    {day}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}