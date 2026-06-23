import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getStudentProgress, getStudentEngagementTrend, getStudentQuizHistory } from '../../lib/db'
import { getRiskColor } from '../../lib/utils'
import LoadingSpinner from '../common/LoadingSpinner'
import StudyGroup from './StudyGroup/index'

const LEVELS = [1, 2, 3, 4, 5]
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function Dashboard({ onStartQuiz }) {
    const { user } = useAuth()
    const [progress, setProgress] = useState(null)
    const [trend, setTrend] = useState([])
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            setLoading(true)
            try {
                const [prog, tr, hist] = await Promise.all([
                    getStudentProgress(user.id, user.class),
                    getStudentEngagementTrend(user.id),
                    getStudentQuizHistory(user.id)
                ])
                setProgress(prog)
                setTrend(tr)
                setHistory(hist)
            } catch (err) {
                console.error('[Dashboard] load error:', err.message)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [user.id, user.class])

    if (loading) return <LoadingSpinner text="Loading your dashboard..." />

    const maxLevel = progress?.max_level_unlocked ?? 1
    const totalXp = progress?.total_xp ?? 0

    const trendShield = trend.some(s => s > 0)
        ? Math.round(trend.reduce((a, b) => a + b, 0) / trend.length * 100)
        : 0
    const quizShield = history.length > 0
        ? Math.round(history.reduce((a, b) => a + (b.accuracy ?? 0), 0) / history.length * 100)
        : 0
    const shield = trendShield > 0 ? trendShield : quizShield

    const shieldColor = shield >= 70
        ? 'var(--color-green)'
        : shield >= 40
            ? 'var(--color-yellow)'
            : shield > 0
                ? 'var(--color-red)'
                : 'var(--color-text-muted)'

    return (
        <div style={{
            padding: '2rem',
            maxWidth: 1100,
            margin: '0 auto',
        }}>

            {/* Welcome */}
            <div className="fade-up" style={{ marginBottom: '1.5rem' }}>
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
                <p style={{
                    color: 'var(--color-text-muted)',
                    fontSize: '0.85rem', marginTop: '0.3rem'
                }}>
                    Keep learning. Every level counts.
                </p>
            </div>

            {/* 2 column layout */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '240px 1fr',
                gap: '1.5rem',
                alignItems: 'start',
            }}>

                {/* LEFT — Study Group */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <StudyGroup />
                </div>

                {/* RIGHT — Main content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Stats row */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1rem',
                    }}>

                        {/* Shield card */}
                        <div style={{
                            background: 'var(--color-surface)',
                            border: `1px solid ${shieldColor}44`,
                            borderRadius: 'var(--radius-lg)',
                            padding: '1.2rem',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.3rem',
                        }}>
                            <svg viewBox="0 0 80 90" width="60" height="68">
                                <defs>
                                    <clipPath id="studentShieldClip">
                                        <path d="M40 5 L72 18 L72 48 Q72 72 40 85 Q8 72 8 48 L8 18 Z" />
                                    </clipPath>
                                </defs>
                                <path
                                    d="M40 5 L72 18 L72 48 Q72 72 40 85 Q8 72 8 48 L8 18 Z"
                                    fill="var(--color-surface-2)"
                                    stroke={shieldColor} strokeWidth="2"
                                />
                                <rect
                                    x="8"
                                    y={85 - (shield / 100) * 80}
                                    width="64"
                                    height={(shield / 100) * 80}
                                    fill={shieldColor}
                                    opacity="0.35"
                                    clipPath="url(#studentShieldClip)"
                                />
                                <path
                                    d="M40 5 L72 18 L72 48 Q72 72 40 85 Q8 72 8 48 L8 18 Z"
                                    fill="none" stroke={shieldColor} strokeWidth="2"
                                />
                                <text
                                    x="40" y="52"
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    fill={shieldColor}
                                    fontSize="14" fontWeight="900"
                                    fontFamily="monospace"
                                >
                                    {shield}%
                                </text>
                            </svg>
                            <div style={{
                                fontSize: '0.72rem', color: 'var(--color-text-muted)'
                            }}>
                                Learning Shield
                            </div>
                            <div style={{
                                fontSize: '0.65rem', fontWeight: 700, color: shieldColor
                            }}>
                                {shield >= 70 ? 'Strong'
                                    : shield >= 40 ? 'Weakening'
                                        : shield > 0 ? 'Critical'
                                            : 'No data yet'}
                            </div>
                        </div>

                        {/* XP card */}
                        <div style={{
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '1.2rem', textAlign: 'center',
                        }}>
                            <div style={{
                                fontSize: '1.8rem', fontWeight: 800,
                                color: 'var(--color-blue)', fontFamily: 'var(--font-mono)'
                            }}>
                                {totalXp}
                            </div>
                            <div style={{
                                fontSize: '0.72rem',
                                color: 'var(--color-text-muted)', marginTop: '0.3rem'
                            }}>
                                Total XP
                            </div>
                        </div>

                        {/* Level card */}
                        <div style={{
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '1.2rem', textAlign: 'center',
                        }}>
                            <div style={{
                                fontSize: '1.8rem', fontWeight: 800,
                                color: 'var(--color-yellow)', fontFamily: 'var(--font-mono)'
                            }}>
                                {maxLevel} / 5
                            </div>
                            <div style={{
                                fontSize: '0.72rem',
                                color: 'var(--color-text-muted)', marginTop: '0.3rem'
                            }}>
                                Level Reached
                            </div>
                        </div>
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

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {LEVELS.map(level => {
                                const unlocked = level <= maxLevel
                                const completed = level < maxLevel
                                const current = level === maxLevel

                                return (
                                    <div key={level} style={{
                                        display: 'flex', alignItems: 'center', gap: '1rem',
                                        padding: '0.9rem 1rem',
                                        borderRadius: 'var(--radius-md)',
                                        background: current
                                            ? 'var(--color-green-dim)'
                                            : 'var(--color-surface-2)',
                                        border: `1px solid ${current
                                            ? 'var(--color-green)'
                                            : 'var(--color-border)'}`,
                                        opacity: unlocked ? 1 : 0.4,
                                        transition: 'all 0.2s',
                                    }}>
                                        <div style={{
                                            width: 36, height: 36, borderRadius: '50%',
                                            display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', fontSize: '1rem',
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

                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                fontWeight: 700, fontSize: '0.9rem',
                                                color: current ? 'var(--color-green)' : 'var(--color-text)'
                                            }}>
                                                Level {level}
                                                {current && (
                                                    <span style={{
                                                        marginLeft: '0.5rem', fontSize: '0.65rem',
                                                        background: 'var(--color-green)', color: '#000',
                                                        padding: '0.1rem 0.4rem', borderRadius: 4,
                                                        fontWeight: 800,
                                                    }}>
                                                        CURRENT
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{
                                                fontSize: '0.72rem',
                                                color: 'var(--color-text-muted)', marginTop: '0.1rem'
                                            }}>
                                                {level === 1 ? 'Basic concepts' :
                                                    level === 2 ? 'Medium problems' :
                                                        level === 3 ? 'Hard problems' :
                                                            level === 4 ? 'Advanced problems' :
                                                                'Chapter test'}
                                            </div>
                                        </div>

                                        {unlocked && (
                                            <button onClick={() => onStartQuiz(level)} style={{
                                                background: current
                                                    ? 'var(--color-green)' : 'transparent',
                                                border: `1px solid ${current
                                                    ? 'var(--color-green)' : 'var(--color-border)'}`,
                                                color: current ? '#000' : 'var(--color-text-muted)',
                                                borderRadius: 8, padding: '0.4rem 1rem',
                                                fontSize: '0.78rem', fontWeight: 700,
                                                cursor: 'pointer', fontFamily: 'var(--font-main)',
                                                flexShrink: 0,
                                            }}>
                                                {completed ? 'Replay' : 'Start →'}
                                            </button>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        {maxLevel > 5 && (
                            <div style={{
                                marginTop: '1rem', padding: '1rem',
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
                                <button onClick={() => onStartQuiz('board')} style={{
                                    marginTop: '0.75rem',
                                    background: 'var(--color-yellow)',
                                    border: 'none', color: '#000',
                                    borderRadius: 8, padding: '0.5rem 1.2rem',
                                    fontSize: '0.82rem', fontWeight: 800,
                                    cursor: 'pointer', fontFamily: 'var(--font-main)'
                                }}>
                                    Start Board Prep →
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Activity Heatmap — LeetCode style */}
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
                            This Week's Activity
                        </div>

                        <div style={{
                            display: 'flex', gap: '0.5rem',
                            alignItems: 'flex-end',
                            marginBottom: '0.4rem'
                        }}>
                            {DAYS.map((day, i) => {
                                const score = trend[i] ?? 0
                                const hasActivity = score > 0
                                const bgColor = !hasActivity
                                    ? 'var(--color-surface-2)'
                                    : score >= 0.7
                                        ? 'rgba(0,229,160,0.9)'
                                        : score >= 0.4
                                            ? 'rgba(0,229,160,0.45)'
                                            : 'rgba(0,229,160,0.15)'

                                return (
                                    <div key={day} style={{
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '0.3rem',
                                    }}>
                                        <div style={{
                                            width: '100%',
                                            height: 36,
                                            borderRadius: 6,
                                            background: bgColor,
                                            border: `1px solid ${hasActivity
                                                ? 'rgba(0,229,160,0.3)'
                                                : 'var(--color-border)'}`,
                                            transition: 'background 0.3s',
                                            position: 'relative',
                                        }}>
                                            {hasActivity && (
                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: 4, right: 4,
                                                    fontSize: '0.55rem',
                                                    color: 'rgba(0,229,160,0.9)',
                                                    fontFamily: 'var(--font-mono)',
                                                    fontWeight: 700,
                                                }}>
                                                    {Math.round(score * 100)}%
                                                </div>
                                            )}
                                        </div>
                                        <div style={{
                                            fontSize: '0.6rem',
                                            color: 'var(--color-text-muted)'
                                        }}>
                                            {day}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div style={{
                            display: 'flex', alignItems: 'center',
                            gap: '0.5rem', marginTop: '0.5rem',
                            justifyContent: 'flex-end',
                        }}>
                            <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>
                                Less
                            </span>
                            {[0, 0.15, 0.45, 0.9].map((op, i) => (
                                <div key={i} style={{
                                    width: 12, height: 12, borderRadius: 3,
                                    background: op === 0
                                        ? 'var(--color-surface-2)'
                                        : `rgba(0,229,160,${op})`,
                                    border: '1px solid var(--color-border)',
                                }} />
                            ))}
                            <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>
                                More
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}