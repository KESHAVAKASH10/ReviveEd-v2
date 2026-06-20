import { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { getQuestions, getBoardPrepQuestions, saveQuizResult, updateStudentProgress } from '../../../lib/db'
import LoadingSpinner from '../../common/LoadingSpinner'
import EmptyState from '../../common/EmptyState'
import QuestionCard from './QuestionCard'
import ChoiceList from './ChoiceList'
import ResultScreen from './ResultScreen'
import toast from 'react-hot-toast'

export default function QuizEngine({ level, onFinish }) {
    const { user } = useAuth()
    const [questions, setQuestions] = useState([])
    const [current, setCurrent] = useState(0)
    const [selected, setSelected] = useState(null)
    const [answers, setAnswers] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [result, setResult] = useState(null)

    useEffect(() => {
        async function load() {
            setLoading(true)
            try {
                const qs = level === 'board'
                    ? await getBoardPrepQuestions(user.class)
                    : await getQuestions(user.class, level)
                setQuestions(qs)
            } catch (err) {
                console.error('[QuizEngine]', err.message)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [user.class, level])
    if (loading) return <LoadingSpinner text="Loading questions..." />

    if (questions.length === 0) return (
        <EmptyState
            icon="📭"
            title="No questions found"
            message={`No questions for Class ${user.class} Level ${level} yet.`}
            action={{ label: '← Go Back', onClick: onFinish }}
        />
    )

    if (result) return (
        <ResultScreen result={result} level={level} onFinish={onFinish} />
    )

    const q = questions[current]
    const isLast = current === questions.length - 1

    function handleSelect(choice) {
        if (selected !== null) return
        setSelected(choice)
    }

    async function handleNext() {
        const isCorrect = selected === q.answer
        const newAnswers = [...answers, { topic: q.topic, correct: isCorrect }]
        setAnswers(newAnswers)
        setSelected(null)

        if (!isLast) { setCurrent(c => c + 1); return }

        setSubmitting(true)
        try {
            const score = newAnswers.filter(a => a.correct).length
            const total = newAnswers.length
            const wrongTopics = newAnswers
                .filter(a => !a.correct)
                .map(a => a.topic)
                .filter(Boolean)
            const xpEarned = score * 10

            await saveQuizResult({
                studentId: user.id,
                studentName: user.name,
                section: user.section ?? 'General',
                groupName: user.groupName ?? 'General',
                classNumber: user.class,
                level, score, total, wrongTopics, xpEarned,
            })

            const { passed } = await updateStudentProgress({
                studentId: user.id,
                classNumber: user.class,
                completedLevel: level,
                score, total, xpEarned,
            })

            setResult({ score, total, wrongTopics, passed, xpEarned })
            toast[passed ? 'success' : 'error'](
                passed
                    ? `Level ${level} complete! +${xpEarned} XP`
                    : `${Math.round(score / total * 100)}% — need 60% to pass`
            )
        } catch (err) {
            console.error('[QuizEngine] submit:', err.message)
            toast.error('Failed to save. Try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div style={{
            maxWidth: 560, margin: '2rem auto',
            padding: '0 1.5rem',
            fontFamily: 'var(--font-main)'
        }}>
            <QuestionCard
                question={q}
                current={current}
                total={questions.length}
                level={level}
            />
            <ChoiceList
                question={q}
                selected={selected}
                onSelect={handleSelect}
                onFillChange={setSelected}
            />
            <button
                onClick={handleNext}
                disabled={selected === null || submitting}
                style={{
                    width: '100%', padding: '0.9rem',
                    borderRadius: 'var(--radius-md)',
                    background: selected !== null
                        ? 'var(--color-green)' : 'var(--color-surface)',
                    border: `1px solid ${selected !== null
                        ? 'var(--color-green)' : 'var(--color-border)'}`,
                    color: selected !== null ? '#000' : 'var(--color-text-muted)',
                    fontSize: '0.9rem', fontWeight: 800,
                    cursor: selected !== null ? 'pointer' : 'not-allowed',
                    fontFamily: 'var(--font-main)',
                    transition: 'all 0.2s'
                }}
            >
                {submitting ? 'Saving...' : isLast ? 'Submit Quiz →' : 'Next →'}
            </button>
        </div>
    )
}