import { buildInsightPrompt, buildDoubtPrompt, buildNudgePrompt } from './prompts'

const AI_KEY = import.meta.env.VITE_AI_API_KEY
const AI_PROVIDER = import.meta.env.VITE_AI_PROVIDER || 'anthropic'

// ── Which API URL to use based on provider ──────────────
const API_CONFIG = {
    anthropic: {
        url: 'https://api.anthropic.com/v1/messages',
        model: 'claude-haiku-20240307',
        headers: (key) => ({
            'Content-Type': 'application/json',
            'x-api-key': key,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
        }),
        buildBody: (systemPrompt, userPrompt, maxTokens) => ({
            model: 'claude-haiku-20240307',
            max_tokens: maxTokens,
            system: systemPrompt,
            messages: [{ role: 'user', content: userPrompt }]
        }),
        extractText: (data) => data?.content?.[0]?.text ?? null
    },
    openrouter: {
        url: 'https://openrouter.ai/api/v1/chat/completions',
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        headers: (key) => ({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'ReviveEd'
        }),
        buildBody: (systemPrompt, userPrompt, maxTokens) => ({
            model: 'meta-llama/llama-3.1-8b-instruct:free',
            max_tokens: maxTokens,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ]
        }),
        extractText: (data) => data?.choices?.[0]?.message?.content ?? null
    }
}

// ── Core API caller ─────────────────────────────────────
async function callAI(systemPrompt, userPrompt, maxTokens = 500) {
    const config = API_CONFIG[AI_PROVIDER] ?? API_CONFIG.openrouter

    if (!AI_KEY || AI_KEY.length < 10) {
        console.warn('[AI] No API key found — using fallback')
        return null
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    try {
        const res = await fetch(config.url, {
            method: 'POST',
            headers: config.headers(AI_KEY),
            body: JSON.stringify(config.buildBody(systemPrompt, userPrompt, maxTokens)),
            signal: controller.signal
        })

        clearTimeout(timeout)

        if (!res.ok) {
            console.error('[AI] API error:', res.status, res.statusText)
            return null
        }

        const data = await res.json()
        const text = config.extractText(data)

        console.log('[AI] Response received, length:', text?.length)
        return text

    } catch (err) {
        clearTimeout(timeout)
        if (err.name === 'AbortError') {
            console.error('[AI] Request timed out after 10 seconds')
        } else {
            console.error('[AI] Fetch failed:', err.message)
        }
        return null
    }
}

// ── Parse JSON safely ───────────────────────────────────
function parseJSON(text) {
    if (!text) return null
    try {
        const cleaned = text
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim()
        return JSON.parse(cleaned)
    } catch {
        console.error('[AI] Failed to parse JSON response')
        return null
    }
}

// ── Fallback insight when API is unavailable ────────────
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

// ── Fallback nudge when API is unavailable ──────────────
function fallbackNudge(studentName, teacherName) {
    return {
        parent_message: `${teacherName} has flagged ${studentName}'s recent progress for your attention. Please check in with your child about their studies this week.`,
        student_message: `Hey ${studentName}, your teacher cares about your progress. Keep trying!`,
        recommended_action: 'Review recent quiz results with your child tonight.',
        isFallback: true
    }
}

// ════════════════════════════════════════════════════════
// PUBLIC FUNCTIONS — used by components
// ════════════════════════════════════════════════════════

/**
 * Get AI insight for a student
 * Called by: Teacher/StudentDrawer.jsx
 *
 * @param {object} params
 * @param {string} params.studentName
 * @param {number} params.classNumber
 * @param {Array}  params.recentAttempts  — last 3-5 quiz results with wrongTopics
 * @param {Array}  params.engagementTrend — array of 6 floats Mon-Sat
 * @param {number} params.streak
 * @returns {object} insight — root_cause, confidence, recommended_action, urgency, student_message, data_points_used
 */
export async function getStudentInsight({ studentName, classNumber, recentAttempts, engagementTrend, streak }) {
    console.log('[AI] Getting insight for:', studentName)

    const prompt = buildInsightPrompt({
        studentName,
        classNumber,
        recentAttempts,
        engagementTrend,
        streak
    })

    const text = await callAI(
        'You are an expert educational analyst. Return only valid JSON.',
        prompt,
        600
    )

    const parsed = parseJSON(text)

    if (!parsed) {
        console.warn('[AI] Using fallback insight for:', studentName)
        return fallbackInsight(studentName)
    }

    console.log('[AI] Insight ready for:', studentName, '| urgency:', parsed.urgency)
    return parsed
}

/**
 * Get answer for student's doubt
 * Called by: Student/DoubtRoom.jsx
 *
 * @param {object} params
 * @param {string} params.question
 * @param {number} params.classNumber
 * @param {string} params.topic
 * @returns {string} answer text
 */
export async function getDoubtAnswer({ question, classNumber, topic }) {
    console.log('[AI] Answering doubt:', question.slice(0, 40))

    const prompt = buildDoubtPrompt({ question, classNumber, topic })

    const text = await callAI(
        'You are ReviveEd AI, a friendly study mentor for Indian school students.',
        prompt,
        300
    )

    if (!text) {
        return "I'm having trouble connecting right now. Please try again in a moment, or ask your teacher for help! 📚"
    }

    return text
}

/**
 * Generate nudge message for parent
 * Called by: Teacher/NudgeButton.jsx
 *
 * @param {object} params
 * @param {string} params.studentName
 * @param {string} params.teacherName
 * @param {string} params.rootCause
 * @param {string} params.urgency
 * @param {Array}  params.wrongTopics
 * @returns {object} — parent_message, student_message, recommended_action
 */
export async function getNudgeMessages({ studentName, teacherName, rootCause, urgency, wrongTopics }) {
    console.log('[AI] Generating nudge for:', studentName)

    const prompt = buildNudgePrompt({
        studentName,
        teacherName,
        rootCause,
        urgency,
        wrongTopics
    })

    const text = await callAI(
        'You are helping a teacher communicate with a parent. Return only valid JSON.',
        prompt,
        400
    )

    const parsed = parseJSON(text)

    if (!parsed) {
        console.warn('[AI] Using fallback nudge for:', studentName)
        return fallbackNudge(studentName, teacherName)
    }

    console.log('[AI] Nudge messages ready for:', studentName)
    return parsed
}