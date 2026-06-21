import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getSectionEngagementScores, getParentMessages } from '../../lib/db'
import { getRiskLevel } from '../../lib/utils'
import HeatmapGrid from './HeatmapGrid'
import AlertPanel from './AlertPanel'
import ParentInbox from './ParentInbox'
import StudentDrawer from './StudentDrawer/index'
import LoadingSpinner from '../common/LoadingSpinner'
import EmptyState from '../common/EmptyState'

export default function Dashboard({ section }) {
    const { user } = useAuth()
    const [students, setStudents] = useState([])
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('analytics')
    const [drawer, setDrawer] = useState(null)

    useEffect(() => {
        async function load() {
            setLoading(true)
            try {
                const [scores, msgs] = await Promise.all([
                    getSectionEngagementScores(section),
                    getParentMessages()
                ])
                const enriched = (scores ?? []).map(s => ({
                    ...s,
                    risk: getRiskLevel(s.scores[s.scores.length - 1] ?? 0)
                }))
                setStudents(enriched)
                setMessages(msgs)
            } catch (err) {
                console.error('[Dashboard] load error:', err.message)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [section])

    if (loading) return <LoadingSpinner text="Loading dashboard..." />

    const critical = students.filter(s => s.risk === 'critical')
    const warning = students.filter(s => s.risk === 'warning')
    const safe = students.filter(s => s.risk === 'safe')

    return (
        <div style={{
            padding: '1.5rem',
            maxWidth: 1200,
            margin: '0 auto',
        }}>

            {/* Stat cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1rem',
                marginBottom: '1.5rem'
            }}>
                {[
                    { num: students.length, label: 'Total Students', color: 'var(--color-blue)' },
                    { num: safe.length, label: 'Safe', color: 'var(--color-green)' },
                    { num: warning.length, label: 'Warning', color: 'var(--color-yellow)' },
                    { num: critical.length, label: 'Critical', color: 'var(--color-red)' },
                ].map((s, i) => (
                    <div key={i} style={{
                        background: 'var(--color-surface)',
                        border: `1px solid ${s.color}44`,
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.2rem',
                        textAlign: 'center',
                    }}>
                        <div style={{
                            fontSize: '2rem', fontWeight: 800,
                            color: s.color,
                            fontFamily: 'var(--font-mono)'
                        }}>
                            {s.num}
                        </div>
                        <div style={{
                            fontSize: '0.72rem',
                            color: 'var(--color-text-muted)',
                            marginTop: '0.3rem'
                        }}>
                            {s.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Tab switcher */}
            <div style={{
                display: 'flex',
                background: 'var(--color-surface)',
                borderRadius: 8, padding: 3,
                gap: 3, marginBottom: '1.5rem',
                width: 'fit-content'
            }}>
                {['analytics', 'inbox'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{
                        background: activeTab === tab
                            ? 'var(--color-surface-2)' : 'transparent',
                        color: activeTab === tab
                            ? 'var(--color-blue)' : 'var(--color-text-muted)',
                        border: 'none', padding: '6px 16px',
                        borderRadius: 6, fontSize: '0.78rem',
                        fontWeight: 700, cursor: 'pointer',
                        fontFamily: 'var(--font-main)',
                        textTransform: 'capitalize',
                        position: 'relative'
                    }}>
                        {tab}
                        {tab === 'inbox' && messages.filter(m => m.status === 'unread').length > 0 && (
                            <span style={{
                                position: 'absolute', top: 2, right: 2,
                                width: 6, height: 6, borderRadius: '50%',
                                background: 'var(--color-red)'
                            }} />
                        )}
                    </button>
                ))}
            </div>

            {activeTab === 'analytics' ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
                    gap: '1.5rem'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <HeatmapGrid
                            students={students}
                            onStudentClick={setDrawer}
                        />
                    </div>
                    <AlertPanel
                        critical={critical}
                        warning={warning}
                        onStudentClick={setDrawer}
                    />
                </div>
            ) : (
                <ParentInbox messages={messages} />
            )}

            {drawer && (
                <StudentDrawer
                    student={drawer}
                    section={section}
                    teacherName={user.name}
                    onClose={() => setDrawer(null)}
                />
            )}
        </div>
    )
}