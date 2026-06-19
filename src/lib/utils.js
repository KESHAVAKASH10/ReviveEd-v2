/**
 * Returns the current day label: Mon, Tue, Wed, Thu, Fri, Sat, Sun
 * Used when saving engagement scores to know which day it is
 */
export function todayLabel() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return days[new Date().getDay()]
}

/**
 * Gets initials from a full name
 * "Arjun Kumar" → "AK"
 * "Mrs. Kavitha Rajan" → "KR"
 * Used in the heatmap and student avatars
 */
export function getInitials(fullName) {
    if (!fullName) return '?'
    return fullName
        .split(' ')
        .filter(word => word.length > 1 && !word.includes('.'))
        .slice(0, 2)
        .map(word => word[0].toUpperCase())
        .join('')
}

/**
 * Formats a timestamp to a readable date
 * "2026-06-18T10:30:00Z" → "18 Jun 2026"
 */
export function formatDate(timestamp) {
    if (!timestamp) return ''
    return new Date(timestamp).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}

/**
 * Converts accuracy (0 to 1) to a risk level
 * 0.0 - 0.39 → critical
 * 0.4 - 0.69 → warning
 * 0.7 - 1.0  → safe
 * Used everywhere — teacher dashboard, parent shield, alerts
 */
export function getRiskLevel(accuracy) {
    if (accuracy === null || accuracy === undefined) return 'unknown'
    if (accuracy < 0.4) return 'critical'
    if (accuracy < 0.7) return 'warning'
    return 'safe'
}

/**
 * Returns a colour for each risk level
 * Used in heatmap cells, alert panels, student drawers
 */
export function getRiskColor(riskLevel) {
    const colors = {
        critical: '#ff4a6e',
        warning: '#ffb830',
        safe: '#00e5a0',
        unknown: '#6b7a9e'
    }
    return colors[riskLevel] ?? colors.unknown
}

/**
 * Clamps a number between min and max
 * clamp(1.5, 0, 1) → 1
 * clamp(-0.2, 0, 1) → 0
 * Used when calculating engagement scores
 */
export function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value))
}

/**
 * Calculates the learning shield score (0-100)
 * from a student's recent engagement scores array
 * Shield = average of last 6 engagement scores × 100
 */
export function calcShield(scores = []) {
    if (!scores.length) return 0
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length
    return Math.round(clamp(avg, 0, 1) * 100)
}