import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const SECTIONS = [
    '6A', '6B', '6C',
    '7A', '7B', '7C',
    '8A', '8B', '8C',
    '9A', '9B', '9C',
    '10A', '10B', '10C'
]

export default function SectionSelector({ onSelect }) {
    const { user } = useAuth()
    const [selected, setSelected] = useState(null)

    return (
        <div style={{
            minHeight: 'calc(100vh - 56px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
        }}>

            {/* Title */}
            <div style={{
                textAlign: 'center',
                marginBottom: '2.5rem',
                animation: 'fadeUp 0.4s ease both'
            }}>
                <div style={{
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--color-text-muted)',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    marginBottom: '0.6rem'
                }}>
                    Welcome back, {user.name}
                </div>
                <h1 style={{
                    fontSize: '1.8rem', fontWeight: 800,
                    margin: 0, color: 'var(--color-text)'
                }}>
                    Select a Section
                </h1>
                <p style={{
                    color: 'var(--color-text-muted)',
                    marginTop: '0.5rem', fontSize: '0.88rem'
                }}>
                    Choose the class section you want to monitor
                </p>
            </div>

            {/* Section grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '0.75rem',
                width: '100%',
                maxWidth: 600,
                marginBottom: '2rem'
            }}>
                {SECTIONS.map((sec, i) => (
                    <div
                        key={sec}
                        onClick={() => setSelected(sec)}
                        style={{
                            background: selected === sec
                                ? 'var(--color-blue-dim)'
                                : 'var(--color-surface)',
                            border: `1px solid ${selected === sec
                                ? 'var(--color-blue)'
                                : 'var(--color-border)'}`,
                            borderRadius: 'var(--radius-md)',
                            padding: '1rem 0.5rem',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.2s',
                            animation: `fadeUp 0.35s ease ${i * 0.03}s both`,
                            position: 'relative',
                        }}
                    >
                        {selected === sec && (
                            <div style={{
                                position: 'absolute', top: 4, right: 6,
                                fontSize: '0.6rem',
                                color: 'var(--color-blue)'
                            }}>✓</div>
                        )}
                        <div style={{
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 700, fontSize: '1rem',
                            color: selected === sec
                                ? 'var(--color-blue)'
                                : 'var(--color-text)'
                        }}>
                            {sec}
                        </div>
                    </div>
                ))}
            </div>

            {/* Confirm button */}
            {selected && (
                <div style={{ animation: 'fadeUp 0.3s ease both' }}>
                    <button
                        onClick={() => onSelect(selected)}
                        style={{
                            background: 'var(--color-blue)',
                            color: '#fff',
                            fontFamily: 'var(--font-main)',
                            fontWeight: 800, fontSize: '0.95rem',
                            border: 'none', borderRadius: 12,
                            padding: '0.9rem 2.5rem',
                            cursor: 'pointer',
                            letterSpacing: '0.04em',
                            transition: 'opacity 0.2s'
                        }}
                    >
                        View Dashboard for Class {selected} →
                    </button>
                </div>
            )}
        </div>
    )
}