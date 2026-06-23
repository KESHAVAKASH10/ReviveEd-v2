import { buildInsightPrompt, buildDoubtPrompt, buildNudgePrompt } from './prompts'

const AI_PROVIDER = import.meta.env.VITE_AI_PROVIDER || 'nvidia'
const AI_FUNCTION_URL = import.meta.env.VITE_AI_FUNCTION_URL || ''
const AI_KEY = import.meta.env.VITE_AI_API_KEY || ''

async function callAI(payload) {
    if (!AI_FUNCTION_URL) {
        console.error('[AI] Missing VITE_AI_FUNCTION_URL')
        return null
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 20000)

    try {
        const res = await fetch(AI_FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(AI_KEY ? { Authorization: `Bearer ${AI_KEY}` } : {})
            },
            body: JSON.stringify({
                provider: AI_PROVIDER,
                ...payload
            }),
            signal: controller.signal
        })

        clearTimeout(timeout)

        if (!res.ok) {
            const errText = await res.text().catch(() => '')
            console.error('[AI] API error:', res.status, res.statusText, errText)
            return null
        }

        const data = await res.json()
        return data?.text ?? null
    } catch (err) {
        clearTimeout(timeout)
        if (err?.name === 'AbortError') {
            console.error('[AI] Request timed out after 20 seconds')
        } else {
            console.error('[AI] Fetch failed:', err?.message || err)
        }
        return null
    }
}

function parseJSON(text) {
    if (!text) return null
    try {
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim()
        return JSON.parse(cleaned)
    } catch {
        console.error('[AI] Failed to parse JSON response')
        return null
    }
}

function fallbackInsight(studentName) {
    return {
        root_cause: `Engagement data shows a declining trend for ${studentName}. Detailed AI analysis unavailable — please check API connection.`,
        confidence: 'low',
        recommended_action: 'Review recent quiz results manually and check in with the student directly.',
        urgency: 'warning',
        student_message: `Keep going ${studentName}! Every attempt helps you improve.`,
        data_points_used: ['Fallback mode — AI API unavailable'],
        isFallback: true
    }
}

function fallbackNudge(studentName, teacherName) {
    return {
        parent_message: `${teacherName} has flagged ${studentName}'s recent progress for your attention. Please check in with your child about their studies this week.`,
        student_message: `Hey ${studentName}, your teacher cares about your progress. Keep trying!`,
        recommended_action: 'Review recent quiz results with your child tonight.',
        isFallback: true
    }
}

export async function getStudentInsight({ studentName, classNumber, recentAttempts, engagementTrend, streak }) {
    console.log('[AI] Getting insight for:', studentName)

    const prompt = buildInsightPrompt({
        studentName,
        classNumber,
        recentAttempts,
        engagementTrend,
        streak
    })

    const text = await callAI({
        type: 'insight',
        systemPrompt: 'You are an expert educational analyst. Return only valid JSON.',
        userPrompt: prompt,
        maxTokens: 600
    })

    const parsed = parseJSON(text)

    if (!parsed) {
        console.warn('[AI] Using fallback insight for:', studentName)
        return fallbackInsight(studentName)
    }

    console.log('[AI] Insight ready for:', studentName, '| urgency:', parsed.urgency)
    return parsed
}

export async function getDoubtAnswer({ question, classNumber, topic }) {
    console.log('[AI] Answering doubt:', question.slice(0, 40))

    const prompt = buildDoubtPrompt({ question, classNumber, topic })

    const text = await callAI({
        type: 'doubt',
        systemPrompt: 'You are ReviveEd AI, a friendly study mentor for Indian school students.',
        userPrompt: prompt,
        maxTokens: 300
    })

    if (!text) {
        return "I'm having trouble connecting right now. Please try again in a moment, or ask your teacher for help! 📚"
    }

    return text
}

export async function getNudgeMessages({ studentName, teacherName, rootCause, urgency, wrongTopics }) {
    console.log('[AI] Generating nudge for:', studentName)

    const prompt = buildNudgePrompt({
        studentName,
        teacherName,
        rootCause,
        urgency,
        wrongTopics
    })

    const text = await callAI({
        type: 'nudge',
        systemPrompt: 'You are helping a teacher communicate with a parent. Return only valid JSON.',
        userPrompt: prompt,
        maxTokens: 400
    })

    const parsed = parseJSON(text)

    if (!parsed) {
        console.warn('[AI] Using fallback nudge for:', studentName)
        return fallbackNudge(studentName, teacherName)
    }

    console.log('[AI] Nudge messages ready for:', studentName)
    return parsed
}