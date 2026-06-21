import { useState } from 'react'

function getInitials(name) {
    return name
        .split(' ')
        .filter(w => w.length > 1)
        .slice(0, 2)
        .map(w => w[0].toUpperCase())
        .join('')
}

function StudentRow({ student, color, onStudentClick }) {
    const score = student.scores[student.scores.length - 1] ?? 0
    return (
        <div
            onClick={() => onStudentClick(student)}
            style={{
                display: 'flex', alignItems: 'center',
                gap: '0.75rem', padding: '0.65rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                borderLeft: `3px solid ${color}`,
                background: 'var(--color-surface-2)',
                cursor: 'pointer',
                transition: 'background 0.15s',
                marginBottom: '0.4rem',
            }}
        >
            <div style={{
                width: 32, height: 32, borderRadius: '50%',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
                background: `${color}22`,
                color, fontWeight: 700, fontSize: '0.72rem',
                flexShrink: 0,
            }}>
                {getInitials(student.name)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                    fontWeight: 600, fontSize: '0.85rem',
                    color: 'var(--color-text)',
                    whiteSpace: 'nowrap', overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {student.name}
                </div>
                <div style={{
                    fontSize: '0.7rem',
                    color: 'var(--color-text-muted)',
                    marginTop: '0.1rem'
                }}>
                    Engagement dropping
                </div>
            </div>
            <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                fontWeight: 700, color, flexShrink: 0,
            }}>
                {Math.round(score * 100)}%
            </div>
        </div>
    )
}

function Tier({ label, color, icon, students, defaultOpen, onStudentClick }) {
    const [open, setOpen] = useState(defaultOpen)
    return (
        <div style={{
            border: `1px solid ${color}33`,
            borderRadius: 10, overflow: 'hidden',
            marginBottom: '0.5rem'
        }}>
            <div
                onClick={() => setOpen(o => !o)}
                style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.9rem',
                    background: `${color}0f`,
                    cursor: 'pointer',
                }}
            >
                <span style={{
                    fontWeight: 700, fontSize: '0.82rem', color
                }}>
                    {icon} {label}
                    <span style={{
                        opacity: 0.55, fontWeight: 400,
                        marginLeft: '0.3rem'
                    }}>
                        ({students.length})
                    </span>
                </span>
                <span style={{ color, fontSize: '0.8rem' }}>
                    {open ? '▲' : '▼'}
                </span>
            </div>
            {open && (
                <div style={{ padding: '0.6rem 0.75rem' }}>
                    {students.length === 0 ? (
                        <div style={{
                            fontSize: '0.8rem',
                            color: 'var(--color-text-muted)',
                            padding: '0.3rem 0'
                        }}>
                            No students in this tier.
                        </div>
                    ) : (
                        students.map((s, i) => (
                            <StudentRow
                                key={i}
                                student={s}
                                color={color}
                                onStudentClick={onStudentClick}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

export default function AlertPanel({ critical, warning, onStudentClick }) {
    return (
        <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.4rem',
        }}>
            <div style={{
                fontSize: '0.7rem', fontFamily: 'var(--font-mono)',
                color: 'var(--color-red)',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                marginBottom: '1rem'
            }}>
                Risk Alerts
            </div>

            <Tier
                label="Critical"
                color="var(--color-red)"
                icon="🔴"
                students={critical}
                defaultOpen={true}
                onStudentClick={onStudentClick}
            />
            <Tier
                label="Warning"
                color="var(--color-yellow)"
                icon="⚠️"
                students={warning}
                defaultOpen={false}
                onStudentClick={onStudentClick}
            />
        </div>
    )
}