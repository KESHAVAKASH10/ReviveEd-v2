export default function EmptyState({ icon = '📭', title, message, action = null }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem 2rem',
            textAlign: 'center',
            gap: '0.75rem'
        }}>
            <div style={{ fontSize: '2.5rem' }}>{icon}</div>
            <h3 style={{
                color: 'var(--color-text)',
                fontSize: '1rem',
                fontWeight: 700,
                margin: 0
            }}>
                {title}
            </h3>
            <p style={{
                color: 'var(--color-text-muted)',
                fontSize: '0.85rem',
                margin: 0,
                maxWidth: 280,
                lineHeight: 1.6
            }}>
                {message}
            </p>
            {action && (
                <button
                    onClick={action.onClick}
                    style={{
                        marginTop: '0.5rem',
                        background: 'var(--color-green-dim)',
                        border: '1px solid var(--color-green)',
                        color: 'var(--color-green)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.5rem 1.25rem',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontFamily: 'var(--font-main)'
                    }}
                >
                    {action.label}
                </button>
            )}
        </div>
    )
}