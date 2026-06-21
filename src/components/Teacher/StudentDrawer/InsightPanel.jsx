const URGENCY_COLOR = {
    critical: 'var(--color-red)',
    warning: 'var(--color-yellow)',
    monitor: 'var(--color-blue)',
}

const CONFIDENCE_COLOR = {
    high: 'var(--color-green)',
    medium: 'var(--color-yellow)',
    low: 'var(--color-text-muted)',
}

export default function InsightPanel({ insight }) {
    const urgencyColor = URGENCY_COLOR[insight.urgency] ?? 'var(--color-text-muted)'
    const confidenceColor = CONFIDENCE_COLOR[insight.confidence] ?? 'var(--color-text-muted)'

    return (
        <div style={{ marginBottom: '1rem' }}>

            {/* Header */}
            <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.75rem'
            }}>
                <div style={{
                    fontSize: '0.65rem', fontFamily: 'var(--font-mono)',
                    color: 'var(--color-blue)',
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                }}>
                    🤖 AI Insight
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {/* Urgency badge */}
                    <span style={{
                        fontSize: '0.6rem', fontWeight: 700,
                        padding: '0.15rem 0.5rem',
                        borderRadius: 4,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        background: `${urgencyColor}18`,
                        color: urgencyColor,
                        border: `1px solid ${urgencyColor}44`,
                    }}>
                        {insight.urgency}
                    </span>
                    {/* Confidence badge */}
                    <span style={{
                        fontSize: '0.6rem', fontWeight: 700,
                        padding: '0.15rem 0.5rem',
                        borderRadius: 4,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        background: `${confidenceColor}18`,
                        color: confidenceColor,
                        border: `1px solid ${confidenceColor}44`,
                    }}>
                        {insight.confidence} confidence
                    </span>
                    {insight.isFallback && (
                        <span style={{
                            fontSize: '0.6rem', fontWeight: 700,
                            padding: '0.15rem 0.5rem',
                            borderRadius: 4,
                            background: 'var(--color-surface-2)',
                            color: 'var(--color-text-muted)',
                            border: '1px solid var(--color-border)',
                        }}>
                            Basic Analysis
                        </span>
                    )}
                </div>
            </div>

            {/* Root cause */}
            <div style={{
                background: 'rgba(91,140,255,0.08)',
                border: '1px solid rgba(91,140,255,0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                marginBottom: '0.75rem'
            }}>
                <div style={{
                    fontSize: '0.65rem', fontFamily: 'var(--font-mono)',
                    color: 'var(--color-blue)',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    marginBottom: '0.4rem'
                }}>
                    Root Cause
                </div>
                <p style={{
                    fontSize: '0.85rem', color: 'var(--color-text)',
                    lineHeight: 1.7, margin: 0
                }}>
                    {insight.root_cause}
                </p>
            </div>

            {/* Recommended action */}
            <div style={{
                background: 'var(--color-green-dim)',
                border: '1px solid var(--color-green)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                marginBottom: '0.75rem'
            }}>
                <div style={{
                    fontSize: '0.65rem', fontFamily: 'var(--font-mono)',
                    color: 'var(--color-green)',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    marginBottom: '0.4rem'
                }}>
                    Recommended Action
                </div>
                <p style={{
                    fontSize: '0.85rem', color: 'var(--color-text)',
                    lineHeight: 1.7, margin: 0
                }}>
                    {insight.recommended_action}
                </p>
            </div>

            {/* Message to student */}
            {insight.student_message && (
                <div style={{
                    background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    marginBottom: '0.75rem'
                }}>
                    <div style={{
                        fontSize: '0.65rem', fontFamily: 'var(--font-mono)',
                        color: 'var(--color-text-muted)',
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        marginBottom: '0.4rem'
                    }}>
                        Message to Student
                    </div>
                    <p style={{
                        fontSize: '0.85rem',
                        color: 'var(--color-text-muted)',
                        lineHeight: 1.7, margin: 0,
                        fontStyle: 'italic'
                    }}>
                        "{insight.student_message}"
                    </p>
                </div>
            )}
        </div>
    )
}