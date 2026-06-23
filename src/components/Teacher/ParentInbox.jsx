import { useState } from 'react'
import { formatDate } from '../../lib/utils'
import { saveTeacherReply } from '../../lib/db'
import EmptyState from '../common/EmptyState'
import toast from 'react-hot-toast'

const CATEGORY_COLOR = {
    General: 'var(--color-blue)',
    Academic: 'var(--color-green)',
    Behaviour: 'var(--color-yellow)',
    Absence: 'var(--color-red)',
}

function MessageCard({ message }) {
    const color = CATEGORY_COLOR[message.category] ?? 'var(--color-blue)'
    const isUnread = message.status === 'unread'
    const [showReply, setShowReply] = useState(false)
    const [replyText, setReplyText] = useState('')
    const [sending, setSending] = useState(false)
    const [replied, setReplied] = useState(!!message.teacher_reply)
    const [replyContent, setReplyContent] = useState(message.teacher_reply ?? '')

    async function handleSendReply() {
        if (!replyText.trim() || sending) return
        setSending(true)
        try {
            await saveTeacherReply(message.id, replyText.trim())
            setReplyContent(replyText.trim())
            setReplied(true)
            setShowReply(false)
            setReplyText('')
            toast.success('Reply sent to parent')
        } catch (err) {
            toast.error('Failed to send reply')
        } finally {
            setSending(false)
        }
    }

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
                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                    {message.sender_name}
                </div>
                <span style={{
                    fontSize: '0.65rem', fontWeight: 700,
                    padding: '0.15rem 0.5rem', borderRadius: 4,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    background: `${color}18`, color,
                    border: `1px solid ${color}44`,
                }}>
                    {message.category}
                </span>
            </div>

            {/* Student + date */}
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

            {/* Message content */}
            <div style={{
                fontSize: '0.85rem', color: 'var(--color-text)',
                lineHeight: 1.6,
                background: 'var(--color-surface)',
                padding: '0.75rem', borderRadius: 8,
                marginBottom: '0.75rem',
            }}>
                {message.content}
            </div>

            {/* Teacher reply — if exists */}
            {replied && replyContent && (
                <div style={{
                    background: 'var(--color-green-dim)',
                    border: '1px solid var(--color-green)',
                    borderRadius: 8, padding: '0.75rem',
                    marginBottom: '0.75rem',
                }}>
                    <div style={{
                        fontSize: '0.65rem', fontFamily: 'var(--font-mono)',
                        color: 'var(--color-green)',
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        marginBottom: '0.3rem'
                    }}>
                        ✓ Your Reply
                    </div>
                    <div style={{
                        fontSize: '0.82rem', color: 'var(--color-text)',
                        lineHeight: 1.5
                    }}>
                        {replyContent}
                    </div>
                </div>
            )}

            {/* Reply input */}
            {showReply && (
                <div style={{ marginBottom: '0.75rem' }}>
                    <textarea
                        placeholder="Type your reply to the parent..."
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        rows={3}
                        style={{
                            width: '100%', padding: '0.75rem',
                            borderRadius: 8,
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text)',
                            fontSize: '0.85rem',
                            fontFamily: 'var(--font-main)',
                            resize: 'none', outline: 'none',
                            boxSizing: 'border-box',
                            marginBottom: '0.5rem',
                        }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={handleSendReply} disabled={!replyText.trim() || sending} style={{
                            background: replyText.trim()
                                ? 'var(--color-green)' : 'var(--color-surface)',
                            border: `1px solid ${replyText.trim()
                                ? 'var(--color-green)' : 'var(--color-border)'}`,
                            color: replyText.trim() ? '#000' : 'var(--color-text-muted)',
                            borderRadius: 8, padding: '0.4rem 1rem',
                            fontSize: '0.8rem', fontWeight: 700,
                            cursor: replyText.trim() ? 'pointer' : 'not-allowed',
                            fontFamily: 'var(--font-main)',
                        }}>
                            {sending ? 'Sending...' : 'Send Reply →'}
                        </button>
                        <button onClick={() => setShowReply(false)} style={{
                            background: 'transparent',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text-muted)',
                            borderRadius: 8, padding: '0.4rem 1rem',
                            fontSize: '0.8rem', cursor: 'pointer',
                            fontFamily: 'var(--font-main)',
                        }}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Reply button */}
            {!showReply && (
                <button onClick={() => setShowReply(true)} style={{
                    background: 'transparent',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-muted)',
                    borderRadius: 8, padding: '0.35rem 0.9rem',
                    fontSize: '0.78rem', cursor: 'pointer',
                    fontFamily: 'var(--font-main)',
                }}>
                    {replied ? '↩ Edit Reply' : '↩ Reply'}
                </button>
            )}
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
                        padding: '0.15rem 0.5rem', borderRadius: 4,
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
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1rem',
            }}>
                {messages.map((m, i) => (
                    <MessageCard key={i} message={m} />
                ))}
            </div>
        </div>
    )
}