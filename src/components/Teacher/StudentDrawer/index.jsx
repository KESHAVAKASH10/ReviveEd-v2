import { useState, useEffect } from 'react'
import { getStudentQuizHistory, getStudentEngagementTrend } from '../../../lib/db'
import { getStudentInsight } from '../../../lib/ai'
import InsightPanel from './InsightPanel'
import ExplainPanel from './ExplainPanel'
import NudgeButton from '../NudgeButton'
import LoadingSpinner from '../../common/LoadingSpinner'

function getInitials(name) {
    return name.split(' ').filter(w => w.length > 1)
        .slice(0, 2).map(w => w[0].toUpperCase()).join('')
}

const RISK_COLOR = {
    critical: 'var(--color-red)',
    warning: 'var(--color-yellow)',
    safe: 'var(--color-green)',
    unknown: 'var(--color-text-muted)',
}

export default function StudentDrawer({ student, section, teacherName, onClose }) {
    const [history, setHistory] = useState([])
    const [trend, setTrend] = useState([])
    const [insight, setInsight] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showExplain, setShowExplain] = useState(false)

    const rc = RISK_COLOR[student.risk] ?? RISK_COLOR.unknown
    const latestScore = student.scores[student.scores.length - 1] ?? 0

    useEffect(() => {
        async function load() {
            setLoading(true)
            try {
                const [hist, tr] = await Promise.all([
                    getStudentQuizHistory(student.id),
                    getStudentEngagementTrend(student.id)
                ])
                setHistory(hist)
                setTrend(tr)

                if (hist.length > 0) {
                    const ai = await getStudentInsight({
                        studentName: student.name,
                        classNumber: hist[0]?.classNumber ?? 8,
                        recentAttempts: hist.map(h => ({
                            level: h.level,
                            score: h.score,
                            total: h.total,
                            wrongTopics: h.wrongTopics,
                        })),
                        engagementTrend: tr,
                        streak: hist.length,
                    })
                    setInsight(ai)
                }
            } catch (err) {
                console.error('[StudentDrawer] load error:', err.message)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [student.id])

    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.6)',
                    zIndex: 200, animation: 'fadeIn 0.2s ease'
                }}
            />

            {/* Drawer */}
            <div style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: 'min(420px, 95vw)',
                background: 'var(--color-surface)',
                borderLeft: '1px solid var(--color-border)',
                zIndex: 201, overflowY: 'auto',
                padding: '1.5rem',
                animation: 'slideIn 0.25s ease',
                fontFamily: 'var(--font-main)',
            }}>

                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.5rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <div style={{
                            width: 46, height: 46, borderRadius: '50%',
                            background: `${rc}22`, border: `2px solid ${rc}`,
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800, fontSize: '0.95rem', color: rc
                        }}>
                            {getInitials(student.name)}
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>
                                {student.name}
                            </div>
                            <div style={{
                                fontSize: '0.72rem',
                                color: 'var(--color-text-muted)'
                            }}>
                                Class {section}
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} style={{
                        background: 'none',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-muted)',
                        borderRadius: 8, padding: '0.3rem 0.7rem',
                        cursor: 'pointer', fontFamily: 'var(--font-main)'
                    }}>✕</button>
                </div>

                {/* Risk badge */}
                <div style={{
                    padding: '0.6rem 1rem',
                    borderRadius: 8, marginBottom: '1.2rem',
                    background: `${rc}12`,
                    border: `1px solid ${rc}33`,
                    fontSize: '0.82rem', fontWeight: 700, color: rc
                }}>
                    {student.risk === 'critical' ? '🔴 Critical — Immediate Action Needed' :
                        student.risk === 'warning' ? '⚠️ Warning — Monitor Closely' :
                            '✅ Safe — Performing Well'}
                </div>

                {/* Score */}
                <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '2.5rem', fontWeight: 700,
                    color: rc, textAlign: 'center',
                    marginBottom: '1.2rem'
                }}>
                    {Math.round(latestScore * 100)}%
                    <div style={{
                        fontSize: '0.7rem', color: 'var(--color-text-muted)',
                        fontWeight: 400, marginTop: '0.2rem'
                    }}>
                        Latest Engagement Score
                    </div>
                </div>

                {loading ? (
                    <LoadingSpinner text="Analysing student data..." />
                ) : (
                    <>
                        {/* AI Insight */}
                        {insight && (
                            <>
                                <InsightPanel insight={insight} />
                                <button
                                    onClick={() => setShowExplain(e => !e)}
                                    style={{
                                        width: '100%', background: 'transparent',
                                        border: '1px solid var(--color-border)',
                                        color: 'var(--color-text-muted)',
                                        borderRadius: 8, padding: '0.4rem',
                                        fontSize: '0.75rem', cursor: 'pointer',
                                        fontFamily: 'var(--font-main)',
                                        marginBottom: '1rem'
                                    }}
                                >
                                    {showExplain ? '▲ Hide' : '▼ Why did AI say this?'}
                                </button>
                                {showExplain && (
                                    <ExplainPanel insight={insight} />
                                )}
                            </>
                        )}

                        {/* Quiz history */}
                        {history.length > 0 && (
                            <div style={{
                                background: 'var(--color-surface-2)',
                                borderRadius: 'var(--radius-md)',
                                padding: '1rem', marginBottom: '1.2rem'
                            }}>
                                <div style={{
                                    fontSize: '0.65rem', fontFamily: 'var(--font-mono)',
                                    color: 'var(--color-text-muted)',
                                    letterSpacing: '0.12em', textTransform: 'uppercase',
                                    marginBottom: '0.6rem'
                                }}>
                                    Recent Quiz Attempts
                                </div>
                                {history.slice(0, 3).map((h, i) => (
                                    <div key={i} style={{
                                        display: 'flex', justifyContent: 'space-between',
                                        alignItems: 'center', padding: '0.4rem 0',
                                        borderBottom: i < 2
                                            ? '1px solid var(--color-border)' : 'none',
                                        fontSize: '0.8rem'
                                    }}>
                                        <span style={{ color: 'var(--color-text-muted)' }}>
                                            Level {h.level}
                                        </span>
                                        <span style={{
                                            color: h.accuracy >= 0.6
                                                ? 'var(--color-green)' : 'var(--color-red)',
                                            fontWeight: 700,
                                            fontFamily: 'var(--font-mono)'
                                        }}>
                                            {h.score}/{h.total}
                                        </span>
                                        {h.wrongTopics.length > 0 && (
                                            <span style={{
                                                fontSize: '0.68rem',
                                                color: 'var(--color-red)',
                                                maxWidth: 120, textAlign: 'right'
                                            }}>
                                                {h.wrongTopics.slice(0, 2).join(', ')}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Nudge button */}
                        {student.risk !== 'safe' && insight && (
                            <NudgeButton
                                student={student}
                                teacherName={teacherName}
                                insight={insight}
                            />
                        )}
                    </>
                )}
            </div>
        </>
    )
}