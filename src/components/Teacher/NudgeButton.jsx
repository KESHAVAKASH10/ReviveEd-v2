import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getNudgeMessages } from '../../lib/ai'
import { saveParentNotification } from '../../lib/db'
import toast from 'react-hot-toast'

export default function NudgeButton({ student, teacherName, insight }) {
    const { user } = useAuth()
    const [sent, setSent] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleNudge() {
        if (sent || loading) return
        setLoading(true)

        try {
            const wrongTopics = insight.data_points_used ?? []

            const messages = await getNudgeMessages({
                studentName: student.name,
                teacherName: teacherName ?? user.name,
                rootCause: insight.root_cause,
                urgency: insight.urgency,
                wrongTopics,
            })

            await saveParentNotification({
                studentId: student.id,
                studentName: student.name,
                parentName: `Parent-${student.name}`,
                triggeredBy: teacherName ?? user.name,
                aiInsight: insight.root_cause,
                aiAction: insight.recommended_action,
                aiMessage: messages.parent_message,
                urgency: insight.urgency,
            })

            setSent(true)
            toast.success(`✓ Parent notified about ${student.name}`)

        } catch (err) {
            console.error('[NudgeButton] error:', err.message)
            toast.error('Failed to send nudge. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (sent) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-green-dim)',
                border: '1px solid var(--color-green)',
                color: 'var(--color-green)',
                fontSize: '0.85rem', fontWeight: 700,
            }}>
                ✓ Parent notified successfully
            </div>
        )
    }

    return (
        <button
            onClick={handleNudge}
            disabled={loading}
            style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                background: loading
                    ? 'var(--color-surface-2)'
                    : 'var(--color-yellow)',
                border: `1px solid ${loading
                    ? 'var(--color-border)'
                    : 'var(--color-yellow)'}`,
                color: loading ? 'var(--color-text-muted)' : '#000',
                fontSize: '0.9rem', fontWeight: 800,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-main)',
                transition: 'all 0.2s',
            }}
        >
            {loading ? 'Generating message...' : '🔔 Nudge Parent'}
        </button>
    )
}