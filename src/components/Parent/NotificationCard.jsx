import { formatDate } from '../../lib/utils'
import { markNotificationRead } from '../../lib/db'
import { useState } from 'react'

const URGENCY_COLOR = {
    critical: 'var(--color-red)',
    warning: 'var(--color-yellow)',
    monitor: 'var(--color-blue)',
}

export default function NotificationCard({ notification }) {
    const [read, setRead] = useState(notification.read)
    const color = URGENCY_COLOR[notification.urgency] ?? 'var(--color-blue)'

    async function handleRead() {
        if (read) return
        setRead(true)
        await markNotificationRead(notification.id)
    }

    return (
        <div
            onClick={handleRead}
            style={{
                background: 'var(--color-surface)',
                border: `1px solid ${read
                    ? 'var(--color-border)'
                    : color}`,
                borderRadius: 'var(--radius-lg)',
                padding: '1.2rem',
                cursor: read ? 'default' : 'pointer',
                transition: 'border 0.3s',
                position: 'relative',
            }}
        >
            {/* Unread dot */}
            {!read && (
                <div style={{
                    position: 'absolute', top: 12, right: 12,
                    width: 8, height: 8, borderRadius: '50%',
                    background: color,
                }} />
            )}

            {/* Header */}
            <div style={{
                display: 'flex', alignItems: 'center',
                gap: '0.5rem', marginBottom: '0.75rem'
            }}>
                <span style={{
                    fontSize: '0.65rem', fontWeight: 700,
                    padding: '0.15rem 0.5rem', borderRadius: 4,
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    background: `${color}18`, color,
                    border: `1px solid ${color}44`,
                }}>
                    {notification.urgency}
                </span>
                <span style={{
                    fontSize: '0.72rem',
                    color: 'var(--color-text-muted)'
                }}>
                    From {notification.triggered_by}
                    {notification.created_at && (
                        <> · {formatDate(notification.created_at)}</>
                    )}
                </span>
            </div>

            {/* AI Insight */}
            <div style={{
                fontSize: '0.85rem', fontWeight: 600,
                color: 'var(--color-text)',
                marginBottom: '0.6rem', lineHeight: 1.5,
            }}>
                {notification.ai_insight}
            </div>

            {/* Message to parent */}
            <div style={{
                fontSize: '0.82rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.6,
                background: 'var(--color-surface-2)',
                padding: '0.75rem', borderRadius: 8,
                marginBottom: '0.6rem',
            }}>
                {notification.ai_message}
            </div>

            {/* Recommended action */}
            {notification.ai_action && (
                <div style={{
                    fontSize: '0.78rem',
                    color: 'var(--color-green)',
                    fontWeight: 700,
                }}>
                    Action: {notification.ai_action}
                </div>
            )}

            {!read && (
                <div style={{
                    fontSize: '0.7rem',
                    color: 'var(--color-text-muted)',
                    marginTop: '0.6rem', textAlign: 'right',
                }}>
                    Tap to mark as read
                </div>
            )}
        </div>
    )
}