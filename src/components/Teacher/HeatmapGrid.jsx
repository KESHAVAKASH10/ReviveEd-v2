import { useState } from 'react'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getInitials(name) {
    return name
        .split(' ')
        .filter(w => w.length > 1)
        .slice(0, 2)
        .map(w => w[0].toUpperCase())
        .join('')
}

function cellColor(score, risk) {
    if (score === 0) return 'var(--color-surface-2)'
    if (risk === 'critical') return 'rgba(255,74,110,0.5)'
    if (risk === 'warning') return 'rgba(255,184,48,0.5)'
    const intensity = Math.min(score, 1)
    return `rgba(0,229,160,${0.15 + intensity * 0.75})`
}

function HeatCell({ score, risk, onHover, onLeave, onClick }) {
    const [hov, setHov] = useState(false)
    return (
        <div
            onClick={onClick}
            onMouseEnter={e => { setHov(true); onHover(e, score) }}
            onMouseLeave={() => { setHov(false); onLeave() }}
            style={{
                width: 26, height: 26,
                borderRadius: 4,
                background: cellColor(score, risk),
                cursor: 'pointer',
                transform: hov ? 'scale(1.3)' : 'scale(1)',
                transition: 'transform 0.12s',
                border: risk === 'critical'
                    ? '1px solid var(--color-red)'
                    : '1px solid transparent',
            }}
        />
    )
}

export default function HeatmapGrid({ students, onStudentClick }) {
    const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, text: '' })

    if (students.length === 0) return (
        <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem', textAlign: 'center',
            color: 'var(--color-text-muted)',
            fontSize: '0.85rem'
        }}>
            No engagement data yet. Students need to complete quizzes first.
        </div>
    )

    return (
        <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.4rem',
            position: 'relative',
        }}>
            <div style={{
                fontSize: '0.7rem', fontFamily: 'var(--font-mono)',
                color: 'var(--color-text-muted)',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                marginBottom: '1rem'
            }}>
                Engagement Heatmap
            </div>

            {/* Day labels */}
            <div style={{
                display: 'flex', alignItems: 'center',
                gap: 4, marginBottom: '0.5rem',
                paddingLeft: 48
            }}>
                {DAYS.map(d => (
                    <div key={d} style={{
                        width: 26, fontSize: '0.6rem',
                        color: 'var(--color-text-muted)',
                        textAlign: 'center'
                    }}>
                        {d}
                    </div>
                ))}
            </div>

            {/* Student rows */}
            {students.map((s, i) => (
                <div key={i} style={{
                    display: 'flex', alignItems: 'center',
                    gap: 4, marginBottom: 4
                }}>
                    <div
                        onClick={() => onStudentClick(s)}
                        style={{
                            width: 44, fontSize: '0.6rem',
                            color: s.risk === 'critical'
                                ? 'var(--color-red)'
                                : 'var(--color-text-muted)',
                            cursor: 'pointer', flexShrink: 0,
                            fontWeight: s.risk === 'critical' ? 700 : 400,
                        }}
                    >
                        {getInitials(s.name)}
                    </div>
                    {s.scores.map((score, di) => (
                        <HeatCell
                            key={di}
                            score={score}
                            risk={s.risk}
                            onClick={() => onStudentClick(s)}
                            onHover={(e, sc) => setTooltip({
                                show: true, x: e.clientX, y: e.clientY,
                                text: `${s.name} — ${DAYS[di]}: ${Math.round(sc * 100)}%`
                            })}
                            onLeave={() => setTooltip(t => ({ ...t, show: false }))}
                        />
                    ))}
                </div>
            ))}

            {/* Tooltip */}
            {tooltip.show && (
                <div style={{
                    position: 'fixed',
                    left: tooltip.x + 12,
                    top: tooltip.y - 36,
                    background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 8, padding: '0.4rem 0.8rem',
                    fontSize: '0.75rem', zIndex: 999,
                    pointerEvents: 'none',
                    color: 'var(--color-text)',
                    whiteSpace: 'nowrap',
                }}>
                    {tooltip.text}
                </div>
            )}
        </div>
    )
}