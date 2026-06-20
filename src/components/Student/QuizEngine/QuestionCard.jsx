export default function QuestionCard({ question, current, total, level }) {
    return (
        <div>
            <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: '0.75rem', color: 'var(--color-text-muted)',
                marginBottom: '0.4rem'
            }}>
                <span>Level {level}</span>
                <span>{current + 1} / {total}</span>
            </div>

            <div style={{
                background: 'var(--color-surface)',
                borderRadius: 4, height: 6,
                overflow: 'hidden', marginBottom: '1.5rem'
            }}>
                <div style={{
                    height: '100%',
                    width: `${((current + 1) / total) * 100}%`,
                    background: 'var(--color-green)',
                    borderRadius: 4, transition: 'width 0.4s ease'
                }} />
            </div>

            <div style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem', marginBottom: '1rem'
            }}>
                <div style={{
                    fontSize: '0.65rem', fontFamily: 'var(--font-mono)',
                    color: 'var(--color-green)',
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    marginBottom: '0.75rem'
                }}>
                    {question.topic} · {question.subject}
                </div>
                <p style={{
                    fontSize: '1rem', fontWeight: 600,
                    lineHeight: 1.6, margin: 0,
                    color: 'var(--color-text)'
                }}>
                    {question.question_text}
                </p>
            </div>
        </div>
    )
}