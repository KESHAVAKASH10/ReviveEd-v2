import { useState } from 'react'
import { saveParentMessage } from '../../lib/db'
import toast from 'react-hot-toast'

const CATEGORIES = ['General', 'Academic', 'Behaviour', 'Absence']

export default function MessageTeacher({ childName, parentName, onSent }) {
    const [content, setContent] = useState('')
    const [category, setCategory] = useState('General')
    const [sending, setSending] = useState(false)

    async function handleSend() {
        if (!content.trim() || sending) return
        setSending(true)
        try {
            await saveParentMessage({
                senderName: parentName,
                studentName: childName,
                content: content.trim(),
                category,
            })
            toast.success('Message sent to teacher')
            setContent('')
            onSent()
        } catch (err) {
            console.error('[MessageTeacher] error:', err.message)
            toast.error('Failed to send. Please try again.')
        } finally {
            setSending(false)
        }
    }

    return (
        <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.2rem',
            textAlign: 'left',
        }}>
            <div style={{
                fontSize: '0.7rem', fontFamily: 'var(--font-mono)',
                color: 'var(--color-text-muted)',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                marginBottom: '1rem'
            }}>
                Message Teacher — Re: {childName}
            </div>

            {/* Category selector */}
            <div style={{
                display: 'flex', gap: '0.4rem',
                flexWrap: 'wrap', marginBottom: '0.75rem'
            }}>
                {CATEGORIES.map(c => (
                    <button key={c} onClick={() => setCategory(c)} style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: 6, fontSize: '0.75rem',
                        fontWeight: 700, cursor: 'pointer',
                        fontFamily: 'var(--font-main)',
                        background: category === c
                            ? 'var(--color-yellow-dim)'
                            : 'var(--color-surface-2)',
                        border: `1px solid ${category === c
                            ? 'var(--color-yellow)'
                            : 'var(--color-border)'}`,
                        color: category === c
                            ? 'var(--color-yellow)'
                            : 'var(--color-text-muted)',
                    }}>
                        {c}
                    </button>
                ))}
            </div>

            {/* Message input */}
            <textarea
                placeholder={`Write your message about ${childName}...`}
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={3}
                style={{
                    width: '100%', padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                    fontSize: '0.88rem',
                    fontFamily: 'var(--font-main)',
                    resize: 'none', outline: 'none',
                    lineHeight: 1.5,
                    boxSizing: 'border-box',
                    marginBottom: '0.75rem',
                }}
            />

            <button
                onClick={handleSend}
                disabled={!content.trim() || sending}
                style={{
                    width: '100%', padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: content.trim() && !sending
                        ? 'var(--color-yellow)'
                        : 'var(--color-surface-2)',
                    border: `1px solid ${content.trim() && !sending
                        ? 'var(--color-yellow)'
                        : 'var(--color-border)'}`,
                    color: content.trim() && !sending
                        ? '#000' : 'var(--color-text-muted)',
                    fontSize: '0.88rem', fontWeight: 800,
                    cursor: content.trim() && !sending
                        ? 'pointer' : 'not-allowed',
                    fontFamily: 'var(--font-main)',
                    transition: 'all 0.2s',
                }}
            >
                {sending ? 'Sending...' : 'Send Message →'}
            </button>
        </div>
    )
}