import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getDoubtAnswer } from '../../lib/ai'
import { saveDoubt, getRecentDoubts } from '../../lib/db'
import LoadingSpinner from '../common/LoadingSpinner'

export default function DoubtRoom() {
    const { user } = useAuth()
    const [question, setQuestion] = useState('')
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [history, setHistory] = useState([])
    const [histLoading, setHistLoading] = useState(true)
    const bottomRef = useRef(null)

    useEffect(() => {
        async function loadHistory() {
            setHistLoading(true)
            try {
                const data = await getRecentDoubts(user.id)
                setHistory(data)
            } catch (err) {
                console.error('[DoubtRoom] history error:', err.message)
            } finally {
                setHistLoading(false)
            }
        }
        loadHistory()
    }, [user.id])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    async function handleAsk() {
        if (!question.trim() || loading) return

        const q = question.trim()
        setQuestion('')
        setMessages(prev => [...prev, { role: 'student', text: q }])
        setLoading(true)

        try {
            const answer = await getDoubtAnswer({
                question: q,
                classNumber: user.class,
                topic: null,
            })

            setMessages(prev => [...prev, { role: 'ai', text: answer }])

            await saveDoubt({
                studentId: user.id,
                studentName: user.name,
                classNumber: user.class,
                topic: null,
                question: q,
                answer,
            })

        } catch (err) {
            console.error('[DoubtRoom] error:', err.message)
            setMessages(prev => [...prev, {
                role: 'ai',
                text: "I'm having trouble connecting right now. Please try again!"
            }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            maxWidth: 640, margin: '0 auto',
            padding: '1.5rem',
            display: 'flex', flexDirection: 'column',
            height: 'calc(100vh - 56px)',
            fontFamily: 'var(--font-main)',
        }}>

            {/* Header */}
            <div style={{
                marginBottom: '1rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--color-border)',
            }}>
                <h2 style={{
                    fontSize: '1.1rem', fontWeight: 800,
                    margin: 0, color: 'var(--color-blue)'
                }}>
                    💬 Doubt Room
                </h2>
                <p style={{
                    fontSize: '0.78rem',
                    color: 'var(--color-text-muted)',
                    margin: '0.3rem 0 0'
                }}>
                    Ask anything from your Class {user.class} syllabus
                </p>
            </div>

            {/* Messages */}
            <div style={{
                flex: 1, overflowY: 'auto',
                display: 'flex', flexDirection: 'column',
                gap: '0.75rem', paddingBottom: '1rem',
            }}>

                {/* Welcome message */}
                {messages.length === 0 && !histLoading && (
                    <div style={{
                        background: 'var(--color-blue-dim)',
                        border: '1px solid var(--color-blue)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1rem',
                        fontSize: '0.85rem',
                        color: 'var(--color-text)',
                        lineHeight: 1.6,
                    }}>
                        👋 Hi {user.name}! I'm your ReviveEd AI mentor.
                        Ask me anything from your Class {user.class} Mathematics syllabus
                        and I'll explain it in a simple way!
                    </div>
                )}

                {/* Chat messages */}
                {messages.map((msg, i) => (
                    <div key={i} style={{
                        display: 'flex',
                        justifyContent: msg.role === 'student' ? 'flex-end' : 'flex-start',
                    }}>
                        <div style={{
                            maxWidth: '80%',
                            padding: '0.75rem 1rem',
                            borderRadius: msg.role === 'student'
                                ? '14px 14px 4px 14px'
                                : '14px 14px 14px 4px',
                            background: msg.role === 'student'
                                ? 'var(--color-green-dim)'
                                : 'var(--color-surface)',
                            border: `1px solid ${msg.role === 'student'
                                ? 'var(--color-green)'
                                : 'var(--color-border)'}`,
                            fontSize: '0.88rem',
                            lineHeight: 1.6,
                            color: 'var(--color-text)',
                        }}>
                            {msg.role === 'ai' && (
                                <div style={{
                                    fontSize: '0.65rem',
                                    fontFamily: 'var(--font-mono)',
                                    color: 'var(--color-blue)',
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    marginBottom: '0.4rem',
                                }}>
                                    ReviveEd AI
                                </div>
                            )}
                            {msg.text}
                        </div>
                    </div>
                ))}

                {/* Loading indicator */}
                {loading && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <div style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '14px 14px 14px 4px',
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            fontSize: '0.88rem',
                            color: 'var(--color-text-muted)',
                        }}>
                            <div style={{
                                fontSize: '0.65rem',
                                fontFamily: 'var(--font-mono)',
                                color: 'var(--color-blue)',
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                marginBottom: '0.4rem',
                            }}>
                                ReviveEd AI
                            </div>
                            Thinking...
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Recent history */}
            {history.length > 0 && messages.length === 0 && (
                <div style={{
                    marginBottom: '1rem',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                }}>
                    <div style={{
                        fontSize: '0.65rem',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--color-text-muted)',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        marginBottom: '0.5rem',
                    }}>
                        Recent doubts
                    </div>
                    {history.slice(0, 3).map((d, i) => (
                        <div
                            key={i}
                            onClick={() => setQuestion(d.question)}
                            style={{
                                fontSize: '0.8rem',
                                color: 'var(--color-text-muted)',
                                padding: '0.3rem 0',
                                cursor: 'pointer',
                                borderBottom: i < 2
                                    ? '1px solid var(--color-border)'
                                    : 'none',
                            }}
                        >
                            💬 {d.question}
                        </div>
                    ))}
                </div>
            )}

            {/* Input */}
            <div style={{
                display: 'flex', gap: '0.75rem',
                alignItems: 'flex-end',
            }}>
                <textarea
                    placeholder="Type your question here..."
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleAsk()
                        }
                    }}
                    rows={2}
                    style={{
                        flex: 1, padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text)',
                        fontSize: '0.88rem',
                        fontFamily: 'var(--font-main)',
                        resize: 'none', outline: 'none',
                        lineHeight: 1.5,
                    }}
                />
                <button
                    onClick={handleAsk}
                    disabled={!question.trim() || loading}
                    style={{
                        background: question.trim() && !loading
                            ? 'var(--color-blue)'
                            : 'var(--color-surface)',
                        border: `1px solid ${question.trim() && !loading
                            ? 'var(--color-blue)'
                            : 'var(--color-border)'}`,
                        color: question.trim() && !loading
                            ? '#fff' : 'var(--color-text-muted)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.75rem 1.25rem',
                        fontSize: '0.88rem', fontWeight: 700,
                        cursor: question.trim() && !loading
                            ? 'pointer' : 'not-allowed',
                        fontFamily: 'var(--font-main)',
                        flexShrink: 0,
                        transition: 'all 0.2s',
                    }}
                >
                    {loading ? '...' : 'Ask →'}
                </button>
            </div>
        </div>
    )
}