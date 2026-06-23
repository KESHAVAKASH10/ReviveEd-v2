import { useAuth } from '../../../context/AuthContext'

const GROUP_COLORS = {
    Alpha: 'var(--color-green)',
    Beta: 'var(--color-blue)',
    Gamma: 'var(--color-yellow)',
    Delta: 'var(--color-purple)',
}

const GROUP_MEMBERS = {
    Alpha: [
        { name: 'Sneha A', xp: 500, isTop: true },
        { name: 'Arjun K', xp: 70, isTop: false },
        { name: 'Dinesh B', xp: 20, isTop: false },
        { name: 'Saranya V', xp: 290, isTop: false },
    ],
    Beta: [
        { name: 'Priya S', xp: 150, isTop: true },
        { name: 'Kiran J', xp: 30, isTop: false },
        { name: 'Ravi M', xp: 90, isTop: false },
        { name: 'Meena L', xp: 90, isTop: false },
    ],
    Gamma: [
        { name: 'Suresh P', xp: 200, isTop: true },
        { name: 'Anitha C', xp: 10, isTop: false },
        { name: 'Vignesh T', xp: 120, isTop: false },
        { name: 'Sneha A', xp: 500, isTop: false },
    ],
    Delta: [
        { name: 'Lakshmi N', xp: 400, isTop: true },
        { name: 'Arun V', xp: 10, isTop: false },
        { name: 'Vignesh T', xp: 120, isTop: false },
        { name: 'Priya S', xp: 150, isTop: false },
    ],
}

function getInitials(name) {
    return name.split(' ').filter(w => w.length > 1)
        .slice(0, 2).map(w => w[0].toUpperCase()).join('')
}

export default function StudyGroup() {
    const { user } = useAuth()
    const groupName = user.groupName ?? 'Alpha'
    const color = GROUP_COLORS[groupName] ?? 'var(--color-green)'
    const members = GROUP_MEMBERS[groupName] ?? []
    const topMember = members.find(m => m.isTop)

    return (
        <div style={{
            background: 'var(--color-surface)',
            border: `1px solid ${color}44`,
            borderRadius: 'var(--radius-lg)',
            padding: '1.2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
        }}>

            {/* Group header */}
            <div>
                <div style={{
                    fontSize: '0.65rem', fontFamily: 'var(--font-mono)',
                    color, letterSpacing: '0.15em',
                    textTransform: 'uppercase', marginBottom: '0.3rem'
                }}>
                    Study Group
                </div>
                <div style={{
                    fontWeight: 800, fontSize: '1.1rem', color
                }}>
                    Group {groupName}
                </div>
            </div>

            {/* Members */}
            <div style={{
                display: 'flex', flexDirection: 'column', gap: '0.5rem'
            }}>
                {members.map((m, i) => {
                    const isMe = m.name.split(' ')[0] === user.name
                    return (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center',
                            gap: '0.6rem', padding: '0.4rem 0.6rem',
                            borderRadius: 8,
                            background: isMe
                                ? `${color}18` : 'transparent',
                            border: isMe
                                ? `1px solid ${color}44`
                                : '1px solid transparent',
                        }}>
                            <div style={{
                                width: 28, height: 28, borderRadius: '50%',
                                background: m.isTop ? `${color}33` : 'var(--color-surface-2)',
                                border: `1px solid ${m.isTop ? color : 'var(--color-border)'}`,
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.65rem', fontWeight: 700,
                                color: m.isTop ? color : 'var(--color-text-muted)',
                                flexShrink: 0,
                            }}>
                                {m.isTop ? '👑' : getInitials(m.name)}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                    fontSize: '0.78rem', fontWeight: isMe ? 700 : 400,
                                    color: isMe ? color : 'var(--color-text)',
                                    whiteSpace: 'nowrap', overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {m.name.split(' ')[0]}
                                    {isMe && (
                                        <span style={{
                                            marginLeft: '0.3rem', fontSize: '0.6rem',
                                            color: 'var(--color-text-muted)'
                                        }}>
                                            (you)
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div style={{
                                fontSize: '0.68rem', fontFamily: 'var(--font-mono)',
                                color: 'var(--color-text-muted)', flexShrink: 0
                            }}>
                                {m.xp} XP
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* This week top */}
            {topMember && (
                <div style={{
                    background: `${color}12`,
                    border: `1px solid ${color}33`,
                    borderRadius: 8, padding: '0.6rem 0.8rem',
                }}>
                    <div style={{
                        fontSize: '0.62rem', fontFamily: 'var(--font-mono)',
                        color: 'var(--color-text-muted)',
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        marginBottom: '0.3rem'
                    }}>
                        🏆 This Week's Top
                    </div>
                    <div style={{
                        fontSize: '0.82rem', fontWeight: 700, color
                    }}>
                        {topMember.name.split(' ')[0]} — {topMember.xp} XP
                    </div>
                </div>
            )}
        </div>
    )
}