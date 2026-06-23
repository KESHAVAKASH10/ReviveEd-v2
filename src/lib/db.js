import { supabase } from './supabase'
import { todayLabel, clamp } from './utils'

// ════════════════════════════════════════════════════════
// PROFILES
// ════════════════════════════════════════════════════════

/**
 * Called on every login.
 * Creates or updates the user's profile in DB.
 * This is how real data gets into the profiles table.
 * No hardcoded arrays — DB is the source of truth.
 */
export async function upsertProfile({
    id, name, role, studentClass, section, groupName, parentOf
}) {
    const { error } = await supabase
        .from('profiles')
        .upsert({
            id,
            name,
            role,
            class: studentClass ?? null,
            section: section ?? null,
            group_name: groupName ?? null,
            parent_of: parentOf ?? null,
        }, { onConflict: 'id' })

    if (error) {
        console.error('[db] upsertProfile error:', error.message)
        throw error
    }

    console.log('[db] Profile upserted:', id, role)
}

// ════════════════════════════════════════════════════════
// QUESTIONS
// ════════════════════════════════════════════════════════

/**
 * Fetch questions for a specific class and level.
 * Called by QuizEngine when student starts a level.
 * Returns array of question objects from DB.
 */
export async function getQuestions(classNumber, level, examType) {
    let query = supabase
        .from('questions')
        .select('*')
        .eq('class_number', parseInt(classNumber))
        .eq('level', parseInt(level))

    if (examType) {
        query = query.eq('exam_type', examType)
    }

    const { data, error } = await query

    if (error) {
        console.error('[db] getQuestions error:', error.message)
        return []
    }

    if (!data || data.length === 0) {
        console.warn('[db] No questions found for class:', classNumber, 'level:', level)
        return []
    }

    // Shuffle randomly and return only 5
    const shuffled = [...data].sort(() => Math.random() - 0.5)
    const result = shuffled.slice(0, 5)

    console.log('[db] Returning', result.length, 'questions from', data.length, 'available')
    return result
}

/**
 * Fetch board prep questions for a class.
 * Called after student completes all 5 levels.
 */
export async function getBoardPrepQuestions(classNumber) {
    const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('class_number', parseInt(classNumber))
        .eq('exam_type', 'board_prep')
        .limit(20)

    if (error) {
        console.error('[db] getBoardPrepQuestions error:', error.message)
        return []
    }

    const shuffled = [...(data ?? [])].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 10)
}


// ════════════════════════════════════════════════════════
// STUDENT PROGRESS
// ════════════════════════════════════════════════════════

/**
 * Get student's current progress — which level they're on,
 * total XP, max level unlocked.
 * Called when student dashboard loads.
 */
export async function getStudentProgress(studentId, classNumber) {
    const { data, error } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', studentId)
        .eq('class_number', parseInt(classNumber))
        .single()

    if (error && error.code !== 'PGRST116') {
        console.error('[db] getStudentProgress error:', error.message)
        return null
    }

    return data ?? {
        student_id: studentId,
        class_number: classNumber,
        max_level_unlocked: 1,
        total_xp: 0
    }
}
/**
 * Update student progress after completing a level.
 * Unlocks next level if score >= 60%.
 * Called by QuizEngine after quiz submission.
 */
export async function updateStudentProgress({
    studentId, classNumber, completedLevel, score, total, xpEarned
}) {
    const accuracy = score / total
    const passed = accuracy >= 0.6
    const newMaxLevel = passed ? completedLevel + 1 : completedLevel

    const current = await getStudentProgress(studentId, classNumber)
    const currentMax = current?.max_level_unlocked ?? 1
    const currentXp = current?.total_xp ?? 0

    const { error } = await supabase
        .from('student_progress')
        .upsert({
            student_id: studentId,
            class_number: parseInt(classNumber),
            max_level_unlocked: Math.max(currentMax, newMaxLevel),
            total_xp: currentXp + xpEarned,
            updated_at: new Date().toISOString()
        }, { onConflict: 'student_id,class_number' })

    if (error) {
        console.error('[db] updateStudentProgress error:', error.message)
        throw error
    }

    console.log('[db] Progress updated — level:', completedLevel, 'passed:', passed, 'XP:', xpEarned)
    return { passed, newMaxLevel: Math.max(currentMax, newMaxLevel) }
}

// ════════════════════════════════════════════════════════
// QUIZ RESULTS
// ════════════════════════════════════════════════════════

/**
 * Save a completed quiz attempt.
 * CRITICAL: stores wrong_topics — this feeds the AI.
 * After saving, automatically recalculates engagement score.
 */
export async function saveQuizResult({
    studentId, studentName, section, groupName,
    classNumber, level, score, total, wrongTopics, xpEarned
}) {
    const { error } = await supabase
        .from('quiz_results')
        .insert({
            student_id: studentId,
            student_name: studentName,
            section: section ?? 'General',
            group_name: groupName ?? 'General',
            class_number: parseInt(classNumber),
            level: parseInt(level),
            score: parseInt(score),
            total: parseInt(total),
            wrong_topics: wrongTopics ?? [],
            xp_earned: xpEarned ?? 0,
        })

    if (error) {
        console.error('[db] saveQuizResult error:', error.message)
        throw error
    }

    console.log('[db] Quiz saved — student:', studentName, 'score:', score, '/', total, 'wrong:', wrongTopics)

    await recalcEngagementScore(studentId, studentName, section ?? 'General')
    return true
}

/**
 * Get a student's recent quiz history.
 * Called by getStudentInsight() to build Claude's context.
 * Returns last 5 attempts with wrong_topics.
 */
export async function getStudentQuizHistory(studentId, limit = 5) {
    const { data, error } = await supabase
        .from('quiz_results')
        .select('level, score, total, accuracy, wrong_topics, class_number, created_at')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) {
        console.error('[db] getStudentQuizHistory error:', error.message)
        return []
    }

    return (data ?? []).map(row => ({
        level: row.level,
        score: row.score,
        total: row.total,
        accuracy: row.accuracy ?? 0,
        wrongTopics: row.wrong_topics ?? [],
        classNumber: row.class_number,
        createdAt: row.created_at
    }))
}

/**
 * Get topic-wise weakness for a student.
 * Counts how many times each topic appeared in wrong_topics.
 * Returns sorted array: most wrong topic first.
 * Used in StudentDrawer and AI prompt building.
 */
export async function getTopicWeakness(studentId) {
    const history = await getStudentQuizHistory(studentId, 10)

    const topicCounts = {}
    history.forEach(attempt => {
        (attempt.wrongTopics ?? []).forEach(topic => {
            topicCounts[topic] = (topicCounts[topic] ?? 0) + 1
        })
    })

    return Object.entries(topicCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([topic, count]) => ({ topic, count }))
}

// ════════════════════════════════════════════════════════
// ENGAGEMENT SCORES
// ════════════════════════════════════════════════════════

/**
 * Recalculates engagement score for a student.
 * Called automatically after every quiz or study session.
 * Formula: 35% accuracy + 30% consistency + 20% streak + 15% momentum
 */
async function recalcEngagementScore(studentId, studentName, section) {
    const { data: quizzes } = await supabase
        .from('quiz_results')
        .select('accuracy, created_at')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .limit(7)

    const { data: sessions } = await supabase
        .from('study_sessions')
        .select('ended_at')
        .eq('student_id', studentId)
        .order('ended_at', { ascending: false })
        .limit(7)

    const accuracies = (quizzes ?? []).map(q => q.accuracy ?? 0)
    const recentAcc = accuracies.length
        ? accuracies.reduce((a, b) => a + b, 0) / accuracies.length
        : 0

    const activityDays = new Set()
        ; (quizzes ?? []).forEach(q => {
            if (q.created_at) activityDays.add(q.created_at.split('T')[0])
        })
        ; (sessions ?? []).forEach(s => {
            if (s.ended_at) activityDays.add(s.ended_at.split('T')[0])
        })

    const consistency = clamp(activityDays.size / 7, 0, 1)
    const streak = clamp(activityDays.size / 7, 0, 1)

    const recent = accuracies.slice(0, 2)
    const older = accuracies.slice(2)
    const avgRecent = recent.length
        ? recent.reduce((a, b) => a + b, 0) / recent.length
        : 0
    const avgOlder = older.length
        ? older.reduce((a, b) => a + b, 0) / older.length
        : avgRecent
    const momentum = clamp((avgRecent - avgOlder) + 0.5, 0, 1)

    const score = clamp(
        0.35 * recentAcc +
        0.30 * consistency +
        0.20 * streak +
        0.15 * momentum,
        0, 1
    )

    const day = todayLabel()

    const { error } = await supabase
        .from('engagement_scores')
        .upsert({
            student_id: studentId,
            student_name: studentName,
            section,
            score,
            day_label: day,
            scored_at: new Date().toISOString()
        }, { onConflict: 'student_id,day_label' })

    if (error) {
        console.error('[db] recalcEngagementScore error:', error.message)
        return
    }

    console.log('[db] Engagement recalculated:', studentName, score.toFixed(2))
}

/**
 * Get engagement scores for the teacher heatmap.
 * Returns all students in a section with their 6-day scores.
 */
export async function getSectionEngagementScores(section) {
    const { data, error } = await supabase
        .from('engagement_scores')
        .select('student_id, student_name, score, day_label')
        .eq('section', section)
        .order('scored_at', { ascending: true })

    if (error) {
        console.error('[db] getSectionEngagementScores error:', error.message)
        return []
    }

    if (!data || data.length === 0) return []

    const DAY_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const map = {}

    data.forEach(({ student_id, student_name, score, day_label }) => {
        if (!map[student_id]) {
            map[student_id] = { name: student_name, scoresByDay: {} }
        }
        map[student_id].scoresByDay[day_label] = score
    })

    return Object.entries(map).map(([id, { name, scoresByDay }]) => ({
        id,
        name,
        scores: DAY_ORDER.map(d => scoresByDay[d] ?? 0)
    }))
}

/**
 * Get a student's engagement score history.
 * Used to build the trend array for Claude's insight prompt.
 */
export async function getStudentEngagementTrend(studentId) {
    const DAY_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    const { data, error } = await supabase
        .from('engagement_scores')
        .select('score, day_label')
        .eq('student_id', studentId)
        .order('scored_at', { ascending: true })

    if (error) {
        console.error('[db] getStudentEngagementTrend error:', error.message)
        return [0, 0, 0, 0, 0, 0]
    }

    const byDay = {}
        ; (data ?? []).forEach(({ score, day_label }) => {
            byDay[day_label] = score
        })

    return DAY_ORDER.map(d => byDay[d] ?? 0)
}

// ════════════════════════════════════════════════════════
// STUDY SESSIONS
// ════════════════════════════════════════════════════════

/**
 * Save a completed study session.
 * Called when student finishes a timed study block.
 * Triggers engagement recalculation automatically.
 */
export async function saveStudySession({
    studentId, studentName, section, durationSecs
}) {
    const { error } = await supabase
        .from('study_sessions')
        .insert({
            student_id: studentId,
            student_name: studentName,
            section: section ?? 'General',
            duration_secs: parseInt(durationSecs),
            ended_at: new Date().toISOString()
        })

    if (error) {
        console.error('[db] saveStudySession error:', error.message)
        throw error
    }

    console.log('[db] Study session saved:', studentName, durationSecs, 'secs')
    await recalcEngagementScore(studentId, studentName, section ?? 'General')
    return true
}

// ════════════════════════════════════════════════════════
// DOUBTS
// ════════════════════════════════════════════════════════

/**
 * Save a student's doubt and Claude's answer.
 * Called by DoubtRoom after AI responds.
 */
export async function saveDoubt({
    studentId, studentName, classNumber, topic, question, answer
}) {
    const { data, error } = await supabase
        .from('doubts')
        .insert({
            student_id: studentId,
            student_name: studentName,
            class_number: parseInt(classNumber),
            topic: topic ?? null,
            question,
            answer,
            answered_by: 'AI',
            status: 'resolved'
        })
        .select()
        .single()

    if (error) {
        console.error('[db] saveDoubt error:', error.message)
        throw error
    }

    return data
}

/**
 * Get recent doubts for a student.
 * Shows doubt history in DoubtRoom.
 */
export async function getRecentDoubts(studentId, limit = 5) {
    const { data, error } = await supabase
        .from('doubts')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) {
        console.error('[db] getRecentDoubts error:', error.message)
        return []
    }

    return data ?? []
}

// ════════════════════════════════════════════════════════
// PARENT NOTIFICATIONS
// ════════════════════════════════════════════════════════

/**
 * Save a nudge notification for a parent.
 * Called by NudgeButton after Claude generates messages.
 * This is what closes the teacher → parent loop.
 */
export async function saveParentNotification({
    studentId, studentName, parentName,
    triggeredBy, aiInsight, aiAction,
    aiMessage, urgency
}) {
    const { data, error } = await supabase
        .from('parent_notifications')
        .insert({
            student_id: studentId,
            student_name: studentName,
            parent_name: parentName,
            triggered_by: triggeredBy,
            ai_insight: aiInsight,
            ai_action: aiAction,
            ai_message: aiMessage,
            urgency,
            read: false
        })
        .select()
        .single()

    if (error) {
        console.error('[db] saveParentNotification error:', error.message)
        throw error
    }

    console.log('[db] Parent notification saved for:', parentName, '| urgency:', urgency)
    return data
}

/**
 * Get notifications for a parent.
 * Called when parent dashboard loads.
 * Filtered by parent_name from their profile.
 */
export async function getParentNotifications(parentName) {
    const { data, error } = await supabase
        .from('parent_notifications')
        .select('*')
        .eq('parent_name', parentName)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('[db] getParentNotifications error:', error.message)
        return []
    }

    return data ?? []
}

/**
 * Mark a notification as read.
 * Called when parent opens a notification card.
 */
export async function markNotificationRead(notificationId) {
    const { error } = await supabase
        .from('parent_notifications')
        .update({ read: true })
        .eq('id', notificationId)

    if (error) {
        console.error('[db] markNotificationRead error:', error.message)
    }
}

// ════════════════════════════════════════════════════════
// PARENT MESSAGES
// ════════════════════════════════════════════════════════

/**
 * Parent sends a message to teacher.
 * Called by MessageTeacher component.
 */
export async function saveParentMessage({
    senderName, studentName, content, category
}) {
    const { data, error } = await supabase
        .from('parent_messages')
        .insert({
            sender_name: senderName,
            student_name: studentName,
            content,
            category: category ?? 'General',
            status: 'unread'
        })
        .select()
        .single()

    if (error) {
        console.error('[db] saveParentMessage error:', error.message)
        throw error
    }

    return data
}

/**
 * Get all parent messages for teacher inbox.
 * Called by Teacher/ParentInbox component.
 */
export async function getParentMessages() {
    const { data, error } = await supabase
        .from('parent_messages')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('[db] getParentMessages error:', error.message)
        return []
    }

    return data ?? []
}
export async function saveTeacherReply(messageId, reply) {
    const { error } = await supabase
        .from('parent_messages')
        .update({
            teacher_reply: reply,
            replied_at: new Date().toISOString(),
            status: 'read'
        })
        .eq('id', messageId)

    if (error) {
        console.error('[db] saveTeacherReply error:', error.message)
        throw error
    }
    return true
}