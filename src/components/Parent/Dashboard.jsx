import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getParentNotifications, getStudentQuizHistory } from '../../lib/db'
import { calcShield } from '../../lib/utils'
import NotificationCard from './NotificationCard'
import MessageTeacher from './MessageTeacher'
import LoadingSpinner from '../common/LoadingSpinner'
import EmptyState from '../common/EmptyState'

export default function Dashboard() {
    const { user } = useAuth()
    const [notifications, setNotifications] = useState([])
    const [quizHistory, setQuizHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [showMessage, setShowMessage] = useState(false)

    const childName = user.childName ?? 'your child'
    const childId = `demo-student-${childName.toLowerCase()}`

    useEffect(() => {
        async function load() {
            setLoading(true)
            try {
                const [notifs, history] = await Promise.all([
                    getParentNotifications(user.name),
                    getStudentQuizHistory(childId),
                ])
                setNotifications(notifs)
                setQuizHistory(history)
            } catch (err) {
                console.error('[Parent Dashboard] error:', err.message)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [user.name, childId])

    if (loading) return <LoadingSpinner text="Loading your dashboard..." />

    const recentScores = quizHistory.map(q => q.accuracy ?? 0)
    const shield = recentScores.length > 0
        ? Math.round(recentScores.reduce((a, b) => a + b, 0) / recentScores.length * 100)
        : 0
    const shieldColor = shield >= 70
        ? 'var(--color-green)'
        : shield >= 40
            ? 'var(--color-yellow)'
            : 'var(--color-red)'

    const unreadCount = notifications.filter(n => !n.read).length

    return (
        <div style={{
            maxWidth: 680, margin: '0 auto',
            padding: '2rem 1.5rem',
            display: 'flex', flexDirection: 'column',
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
                    Parent Dashboard
                </div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
                    {childName}'s Progress
                </h1>
                <p style={{
                    color: 'var(--color-text-muted)',
                    fontSize: '0.85rem', marginTop: '0.3rem'
                }}>
                    Stay connected with your child's learning journey
                </p>
            </div>

            {/* Learning Shield */}
            <div style={{
                background: 'var(--color-surface)',
                border: `1px solid ${shieldColor}44`,
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                textAlign: 'center',
            }}>
                <div style={{
                    fontSize: '0.7rem', fontFamily: 'var(--font-mono)',
                    color: 'var(--color-text-muted)',
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    marginBottom: '1rem'
                }}>
                    Learning Shield
                </div>

                {/* Shield SVG */}
                <div style={{ margin: '0 auto 1rem', width: 120, height: 140 }}>
                    <svg viewBox="0 0 120 140" width="120" height="140">
                        <defs>
                            <clipPath id="shieldClip">
                                <path d="M60 8 L108 28 L108 72 Q108 110 60 132 Q12 110 12 72 L12 28 Z" />
                            </clipPath>
                        </defs>
                        <path
                            d="M60 8 L108 28 L108 72 Q108 110 60 132 Q12 110 12 72 L12 28 Z"
                            fill="var(--color-surface-2)"
                            stroke={shieldColor}
                            strokeWidth="2.5"
                        />
                        <rect
                            x="12"
                            y={132 - (shield / 100) * 124}
                            width="96"
                            height={(shield / 100) * 124}
                            fill={shieldColor}
                            opacity="0.35"
                            clipPath="url(#shieldClip)"
                        />
                        <path
                            d="M60 8 L108 28 L108 72 Q108 110 60 132 Q12 110 12 72 L12 28 Z"
                            fill="none"
                            stroke={shieldColor}
                            strokeWidth="2.5"
                        />
                        <text
                            x="60" y="76"
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill={shieldColor}
                            fontSize="22"
                            fontWeight="900"
                            fontFamily="monospace"
                        >
                            {shield}%
                        </text>
                        <text
                            x="60" y="48"
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize="18"
                        >
                            {shield >= 70 ? '🛡️' : shield >= 40 ? '⚠️' : '🔴'}
                        </text>
                    </svg>
                </div>

                <div style={{
                    display: 'inline-block',
                    padding: '0.3rem 1rem', borderRadius: 20,
                    fontSize: '0.78rem', fontWeight: 700,
                    background: `${shieldColor}18`, color: shieldColor,
                    border: `1px solid ${shieldColor}44`,
                    marginBottom: '0.75rem',
                }}>
                    {shield >= 70 ? '🛡️ Shield Strong'
                        : shield >= 40 ? '⚠️ Shield Weakening'
                            : '🔴 Shield Critical'}
                </div>

                <p style={{
                    fontSize: '0.82rem',
                    color: 'var(--color-text-muted)',
                    margin: 0, lineHeight: 1.6,
                }}>
                    {shield >= 70
                        ? `${childName} is doing great! Keep encouraging them.`
                        : shield >= 40
                            ? `${childName} needs some support. Check the alerts below.`
                            : `${childName} needs immediate attention. Please review the teacher's messages.`
                    }
                </p>
            </div>

            {/* Recent quiz performance */}
            {quizHistory.length > 0 && (
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
                        marginBottom: '1rem'
                    }}>
                        Recent Quiz Performance
                    </div>
                    {quizHistory.slice(0, 4).map((q, i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.6rem 0',
                            borderBottom: i < 3
                                ? '1px solid var(--color-border)' : 'none',
                        }}>
                            <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                                    Level {q.level}
                                </div>
                                {q.wrongTopics.length > 0 && (
                                    <div style={{
                                        fontSize: '0.7rem',
                                        color: 'var(--color-red)',
                                        marginTop: '0.1rem'
                                    }}>
                                        Needs work: {q.wrongTopics.slice(0, 2).join(', ')}
                                    </div>
                                )}
                            </div>
                            <div style={{
                                fontFamily: 'var(--font-mono)',
                                fontWeight: 700, fontSize: '0.9rem',
                                color: q.accuracy >= 0.6
                                    ? 'var(--color-green)'
                                    : 'var(--color-red)',
                            }}>
                                {q.score}/{q.total}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Notifications */}
            <div>
                <div style={{
                    display: 'flex', alignItems: 'center',
                    gap: '0.75rem', marginBottom: '1rem'
                }}>
                    <div style={{
                        fontSize: '0.7rem', fontFamily: 'var(--font-mono)',
                        color: 'var(--color-text-muted)',
                        letterSpacing: '0.15em', textTransform: 'uppercase',
                    }}>
                        Teacher Notifications
                    </div>
                    {unreadCount > 0 && (
                        <span style={{
                            fontSize: '0.65rem', fontWeight: 700,
                            padding: '0.15rem 0.5rem', borderRadius: 4,
                            background: 'var(--color-red-dim)',
                            color: 'var(--color-red)',
                            border: '1px solid var(--color-red)',
                        }}>
                            {unreadCount} new
                        </span>
                    )}
                </div>

                {notifications.length === 0 ? (
                    <EmptyState
                        icon="✅"
                        title="No notifications"
                        message="Your child's teacher will send updates here when needed."
                    />
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {notifications.map((n, i) => (
                            <NotificationCard key={i} notification={n} />
                        ))}
                    </div>
                )}
            </div>

            {/* Message teacher */}
            <div style={{ textAlign: 'center' }}>
                <button
                    onClick={() => setShowMessage(m => !m)}
                    style={{
                        background: 'var(--color-yellow-dim)',
                        border: '1px solid var(--color-yellow)',
                        color: 'var(--color-yellow)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.6rem 1.5rem',
                        fontSize: '0.85rem', fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'var(--font-main)',
                    }}
                >
                    {showMessage ? '▲ Close' : '✉️ Message Teacher'}
                </button>

                {showMessage && (
                    <div style={{ marginTop: '1rem' }}>
                        <MessageTeacher
                            childName={childName}
                            parentName={user.name}
                            onSent={() => setShowMessage(false)}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}