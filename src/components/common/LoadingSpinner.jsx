export default function LoadingSpinner({ size = 32, color = '#00e5a0', text = '' }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            padding: '2rem'
        }}>
            <div style={{
                width: size,
                height: size,
                border: `3px solid rgba(0,229,160,0.15)`,
                borderTop: `3px solid ${color}`,
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
            }} />
            {text && (
                <p style={{
                    color: 'var(--color-text-muted)',
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-main)',
                    margin: 0
                }}>
                    {text}
                </p>
            )}
        </div>
    )
}