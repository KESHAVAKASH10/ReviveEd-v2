export default function ChoiceList({ question, selected, onSelect, onFillChange }) {
    if (question.type === 'fill') {
        return (
            <div style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    placeholder="Type your answer..."
                    value={selected ?? ''}
                    onChange={e => onFillChange(e.target.value)}
                    style={{
                        width: '100%', padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text)', fontSize: '0.9rem',
                        fontFamily: 'var(--font-main)',
                        boxSizing: 'border-box', outline: 'none'
                    }}
                />
            </div>
        )
    }

    const choices = typeof question.choices === 'string'
        ? JSON.parse(question.choices)
        : question.choices ?? []

    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            gap: '0.6rem', marginBottom: '1rem'
        }}>
            {choices.map((choice, i) => {
                const idx = String(i)
                const isSelected = selected === idx
                const isCorrect = selected !== null && idx === question.answer
                const isWrong = isSelected && idx !== question.answer

                return (
                    <button key={i} onClick={() => onSelect(idx)} style={{
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: `1px solid ${isCorrect ? 'var(--color-green)' :
                            isWrong ? 'var(--color-red)' :
                                isSelected ? 'var(--color-blue)' :
                                    'var(--color-border)'
                            }`,
                        background: isCorrect ? 'var(--color-green-dim)' :
                            isWrong ? 'var(--color-red-dim)' :
                                isSelected ? 'var(--color-blue-dim)' :
                                    'var(--color-surface)',
                        color: isCorrect ? 'var(--color-green)' :
                            isWrong ? 'var(--color-red)' :
                                'var(--color-text)',
                        textAlign: 'left', fontSize: '0.88rem',
                        cursor: selected !== null ? 'default' : 'pointer',
                        fontFamily: 'var(--font-main)',
                        fontWeight: isSelected ? 700 : 400,
                        transition: 'all 0.15s', width: '100%',
                    }}>
                        <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.75rem', marginRight: '0.75rem',
                            color: 'var(--color-text-muted)'
                        }}>
                            {String.fromCharCode(65 + i)}.
                        </span>
                        {choice}
                        {isCorrect && ' ✓'}
                        {isWrong && ' ✗'}
                    </button>
                )
            })}
        </div>
    )
}