export default function ResultScreen({ result, level, onFinish }) {
    const pct = Math.round((result.score / result.total) * 100)
    const uniqueTopics = [...new Set(result.wrongTopics)]

    return (
        <div style={{
            maxWidth: 480, margin: '3rem auto',
            padding: '0 1.5rem',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '1.5rem',
            textAlign: 'center',
            fontFamily: 'var(--font-main)'
        }}>
            <div style={{ fontSize: '3rem' }}>
                {result.passed ? '🎉' : '💪'}
            </div>

            <div>
                <div style={{
                    fontSize: '3rem', fontWeight: 900,
                    color: result.passed
                        ? 'var(--color-green)'
                        : 'var(--color-yellow)',
                    fontFamily: 'var(--font-mono)'
                }}>
                    {pct}%
                </div>
                <div style={{
                    color: 'var(--color-text-muted)',
                    fontSize: '0.85rem', marginTop: '0.3rem'
                }}>
                    {result.score} out of {result.total} correct
                </div>
            </div>

            <div style={{
                background: result.passed
                    ? 'var(--color-green-dim)'
                    : 'var(--color-yellow-dim)',
                border: `1px solid ${result.passed
                    ? 'var(--color-green)'
                    : 'var(--color-yellow)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1.25rem',
                color: result.passed
                    ? 'var(--color-green)'
                    : 'var(--color-yellow)',
                fontSize: '0.85rem', fontWeight: 700,
            }}>
                {result.passed
                    ? `✅ Level ${level} complete — next level unlocked!`
                    : `Need 60% to unlock next level. You got ${pct}%.`
                }
            </div>

            {uniqueTopics.length > 0 && (
                <div style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem', width: '100%'
                }}>
                    <div style={{
                        fontSize: '0.7rem', fontFamily: 'var(--font-mono)',
                        color: 'var(--color-text-muted)',
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        marginBottom: '0.6rem'
                    }}>
                        Topics to review
                    </div>
                    <div style={{
                        display: 'flex', flexWrap: 'wrap',
                        gap: '0.4rem', justifyContent: 'center'
                    }}>
                        {uniqueTopics.map((topic, i) => (
                            <span key={i} style={{
                                padding: '0.25rem 0.7rem',
                                borderRadius: 6, fontSize: '0.78rem', fontWeight: 700,
                                background: 'var(--color-red-dim)',
                                color: 'var(--color-red)',
                                border: '1px solid var(--color-red)',
                            }}>
                                {topic}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div style={{
                fontSize: '0.82rem',
                color: 'var(--color-blue)', fontWeight: 700
            }}>
                +{result.xpEarned} XP earned
            </div>

            <button onClick={onFinish} style={{
                background: 'var(--color-green)',
                border: 'none', color: '#000',
                borderRadius: 10, padding: '0.7rem 1.5rem',
                fontSize: '0.9rem', fontWeight: 800,
                cursor: 'pointer', fontFamily: 'var(--font-main)'
            }}>
                Back to Dashboard →
            </button>
        </div>
    )
}