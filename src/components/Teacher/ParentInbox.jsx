import { formatDate } from '../../lib/utils'
import EmptyState from '../common/EmptyState'

const CATEGORY_COLOR = {
    General: 'var(--color-blue)',
    Academic: 'var(--color-green)',
    Behaviour: 'var(--color-yellow)',
    Absence: 'var(--color-red)',
}

function MessageCard({ message }) {
    const color = CATEGORY_COLOR[message.category] ?? 'var(--color-blue)'
    const isUnread = message.status === 'unread'

    return (
        <div style={{
            background: 'var(--color-surface-2)',
            border: `1px solid ${isUnread
                ? 'var(--color-blue)'
                : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            position: 'relative',
        }}>
            {isUnread && (
                <div style={{
                    position: 'absolute', top: 10, right: 10,
                    width: 7, height: 7, borderRadius: '50%',
                    background: 'var(--color-blue)',
                }} />
            )}

            {/* Header */}
            <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
            }}>
                <div style={{
                    fontWeight: 700, fontSize: '0.88rem',
                    color: 'var(--color-text)',
                }}>
                    {message.sender_name}
                </div>
                <span style={{
                    fontSize: '0.65rem', fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: 4, textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    background: `${color}18`,
                    color, border: `1px solid ${color}44`,
                }}>
                    {message.category}
                </span>
            </div>

            {/* Student name */}
            <div style={{
                fontSize: '0.72rem',
                color: 'var(--color-text-muted)',
                marginBottom: '0.6rem',
            }}>
                Re: {message.student_name}
                {message.created_at && (
                    <span style={{ marginLeft: '0.5rem' }}>
                        · {formatDate(message.created_at)}
                    </span>
                )}
            </div>

            {/* Content */}
            <div style={{
                fontSize: '0.85rem',
                color: 'var(--color-text)',
                lineHeight: 1.6,
                background: 'var(--color-surface)',
                padding: '0.75rem',
                borderRadius: 8,
            }}>
                {message.content}
            </div>
        </div>
    )
}

export default function ParentInbox({ messages }) {
    const unread = messages.filter(m => m.status === 'unread').length

    if (messages.length === 0) return (
        <EmptyState
            icon="📭"
            title="No messages yet"
            message="Parents will appear here when they send you a message."
        />
    )

    return (
        <div>
            <div style={{
                display: 'flex', alignItems: 'center',
                gap: '0.75rem', marginBottom: '1rem',
            }}>
                <div style={{
                    fontSize: '0.7rem', fontFamily: 'var(--font-mono)',
                    color: 'var(--color-text-muted)',
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                }}>
                    Parent Enquiries
                </div>
                {unread > 0 && (
                    <span style={{
                        fontSize: '0.65rem', fontWeight: 700,
                        padding: '0.15rem 0.5rem',
                        borderRadius: 4,
                        background: 'var(--color-blue-dim)',
                        color: 'var(--color-blue)',
                        border: '1px solid var(--color-blue)',
                    }}>
                        {unread} unread
                    </span>
                )}
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1rem',
            }}>
                {messages.map((m, i) => (
                    <MessageCard key={i} message={m} />
                ))}
            </div>
        </div>
    )
}