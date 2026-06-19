/**
 * All Claude prompts live here and nowhere else.
 * This keeps AI behaviour consistent and easy to improve.
 * No prompt strings anywhere else in the codebase.
 */

/**
 * PROMPT 1: Student insight for teacher
 * Called when teacher opens a student's drawer
 * Returns structured JSON — not prose
 */
export function buildInsightPrompt({ studentName, classNumber, recentAttempts, engagementTrend, streak }) {
    const attemptsText = recentAttempts.map((a, i) =>
        `Attempt ${i + 1}: Level ${a.level}, Score ${a.score}/${a.total}, Wrong topics: [${a.wrongTopics.join(', ')}]`
    ).join('\n')

    const trendText = engagementTrend.join(', ')

    return `You are an expert educational analyst for Tamil Nadu NCERT curriculum students.

Analyze this student's performance data and return ONLY a JSON object. No explanation. No markdown. Just the JSON.

Student: ${studentName}
Class: ${classNumber} (Tamil Nadu State Board / NCERT)
Streak: ${streak} days
Engagement trend (Mon to Sat, 0=low 1=high): ${trendText}

Recent quiz attempts:
${attemptsText}

Return this exact JSON structure:
{
  "root_cause": "One clear sentence explaining the specific learning gap",
  "confidence": "high or medium or low",
  "recommended_action": "One specific actionable step the teacher can take today",
  "urgency": "critical or warning or monitor",
  "student_message": "An encouraging message to the student, max 2 sentences, friendly tone",
  "data_points_used": ["list", "of", "specific", "data", "points", "you", "used"]
}

Rules:
- root_cause must mention specific topic names from the wrong topics data
- recommended_action must be specific, not generic
- student_message must be warm and encouraging, not alarming
- data_points_used must reference actual numbers from the data
- Return ONLY the JSON. Nothing before it. Nothing after it.`
}

/**
 * PROMPT 2: Doubt Room answer
 * Called when student asks a question in the Doubt Room
 * Returns plain text — friendly, age-appropriate
 */
export function buildDoubtPrompt({ question, classNumber, topic }) {
    return `You are ReviveEd AI — a friendly study mentor for Tamil Nadu school students.

The student is in Class ${classNumber} studying ${topic || 'Mathematics'} (Tamil Nadu State Board / NCERT curriculum).

Their question: "${question}"

Answer rules:
- Use simple language a Class ${classNumber} student can understand
- Keep answer under 80 words
- Use one real-life Indian example if helpful
- Be encouraging and warm
- Do not use complex jargon
- If it is a math problem, show the steps clearly
- End with one short encouraging line`
}

/**
 * PROMPT 3: Nudge message for parent
 * Called when teacher clicks Nudge button
 * Returns structured JSON with messages for parent and student
 */
export function buildNudgePrompt({ studentName, teacherName, rootCause, urgency, wrongTopics }) {
    const topicsText = wrongTopics.join(', ')

    return `You are helping a teacher communicate with a parent about their child's learning.

Context:
- Student: ${studentName}
- Teacher: ${teacherName}
- AI identified issue: ${rootCause}
- Urgency: ${urgency}
- Weak topics: ${topicsText}

Return ONLY this JSON structure. No explanation. No markdown. Just the JSON.

{
  "parent_message": "A warm, non-alarming message to the parent. Max 3 sentences. Mention the specific topic. Suggest one simple action the parent can take at home.",
  "student_message": "A short encouraging message to the student. Max 2 sentences. Warm and motivating. Do not make them feel bad.",
  "recommended_action": "One specific thing the parent can do tonight to help"
}

Rules:
- parent_message must not be alarming or scary
- Mention ${studentName} by name
- Keep language simple — parents may not be educators
- Return ONLY the JSON. Nothing else.`
}