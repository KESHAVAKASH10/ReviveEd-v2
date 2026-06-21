export default function ExplainPanel({ insight }) {
    if (!insight.data_points_used || insight.data_points_used.length === 0) {
        return null
    }

    return (
        <div style={{
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1rem',
            animation: 'fadeIn 0.2s ease'
        }}>
            <div style={{
                fontSize: '0.65rem', fontFamily: 'var(--font-mono)',
                color: 'var(--color-text-muted)',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                marginBottom: '0.75rem'
            }}>
                📊 Data Points Used by AI
            </div>

            <div style={{
                display: 'flex', flexDirection: 'column', gap: '0.4rem'
            }}>
                {insight.data_points_used.map((point, i) => (
                    <div key={i} style={{
                        display: 'flex', alignItems: 'flex-start',
                        gap: '0.5rem', fontSize: '0.8rem',
                        color: 'var(--color-text-muted)',
                        lineHeight: 1.5,
                    }}>
                        <span style={{
                            color: 'var(--color-green)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.7rem', flexShrink: 0,
                            marginTop: '0.1rem'
                        }}>
                            →
                        </span>
                        {point}
                    </div>
                ))}
            </div>

            <div style={{
                marginTop: '0.75rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--color-border)',
                fontSize: '0.72rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.5,
            }}>
                This insight was generated using real quiz attempt data
                stored in the database. No assumptions were made beyond
                what the data shows.
            </div>
        </div>
    )
}