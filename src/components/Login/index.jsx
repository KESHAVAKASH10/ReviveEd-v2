import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import PandaMascot from './PandaMascot'

const ROLES = [
    { id: 'student', label: '🎓 Student', color: '#00e5a0', rgb: '0,229,160' },
    { id: 'teacher', label: '🛡️ Teacher', color: '#5b8cff', rgb: '91,140,255' },
    { id: 'parent', label: '👨‍👩‍👧 Parent', color: '#ffb830', rgb: '255,184,48' },
]

const DEMO_HINTS = {
    student: { name: 'Arjun', password: '8', hint: 'name: Arjun  ·  password: 8' },
    teacher: { name: 'Teacher01', password: 'teach01', hint: 'name: Teacher01  ·  password: teach01' },
    parent: { name: 'Parent01', password: 'par01', hint: 'name: Parent01  ·  password: par01' },
}

export default function Login() {
    const { login } = useAuth()
    const [role, setRole] = useState('student')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [passwordFocused, setPasswordFocused] = useState(false)
    const [showHint, setShowHint] = useState(false)

    const activeRole = ROLES.find(r => r.id === role)

    function switchRole(r) {
        setRole(r)
        setName('')
        setPassword('')
        setError('')
        setShowHint(false)
    }

    function autoFill() {
        const hint = DEMO_HINTS[role]
        setName(hint.name)
        setPassword(hint.password)
        setError('')
        setShowHint(true)
    }

    async function handleLogin() {
        if (!name.trim() || !password.trim()) {
            setError('Please enter your name and password.')
            return
        }
        setLoading(true)
        setError('')
        try {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('name', name.trim())
                .eq('role', role)
                .single()

            const demoId = `demo-${role}-${name.trim().toLowerCase().replace(/\s+/g, '-')}`

            const userData = data ? {
                id: data.id,
                name: data.name,
                role: data.role,
                class: data.class,
                section: data.section,
                groupName: data.group_name,
                childName: data.parent_of,
            } : {
                id: demoId,
                name: name.trim(),
                role,
                class: role === 'student' ? parseInt(password) : null,
                section: role === 'student' ? `${parseInt(password)}A` : null,
                groupName: role === 'student' ? 'Alpha' : null,
                childName: role === 'parent' ? 'Arjun' : null,
            }

            await login(userData)

        } catch (err) {
            console.error('[login]', err.message)
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            background: '#0a0d14',
            fontFamily: 'var(--font-main)',
            position: 'relative',
            overflow: 'hidden',
        }}>

            {/* Grid background */}
            <div className="grid-bg" />

            {/* Ambient glow behind everything */}
            <div style={{
                position: 'fixed',
                top: '20%', left: '50%',
                transform: 'translateX(-50%)',
                width: 500, height: 500,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${activeRole.color}22, transparent 70%)`,
                pointerEvents: 'none',
                transition: 'background 0.4s',
                zIndex: 0,
            }} />

            {/* All content centered */}
            <div style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                maxWidth: 380,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
            }}>

                {/* Mascot */}
                <PandaMascot hiding={passwordFocused} />

                {/* Logo */}
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{
                        fontSize: 30, fontWeight: 900,
                        letterSpacing: '0.06em',
                        color: activeRole.color,
                        transition: 'color 0.4s',
                        margin: 0,
                    }}>
                        ReviveEd
                    </h1>
                    <p style={{
                        color: '#4b5563', fontSize: 11,
                        marginTop: 4, letterSpacing: '0.2em',
                        textTransform: 'uppercase'
                    }}>
                        Detect · Adapt · Connect
                    </p>
                    <div style={{
                        margin: '8px auto 0', height: 2, width: 60,
                        borderRadius: 1,
                        background: `linear-gradient(to right, transparent, ${activeRole.color}, transparent)`,
                        transition: 'background 0.4s'
                    }} />
                </div>

                {/* Role tabs */}
                <div style={{
                    width: '100%',
                    display: 'flex',
                    borderRadius: 14,
                    overflow: 'hidden',
                    padding: 4, gap: 4,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)'
                }}>
                    {ROLES.map(r => (
                        <button key={r.id} onClick={() => switchRole(r.id)} style={{
                            flex: 1, padding: '8px 4px',
                            fontSize: 11, fontWeight: 700,
                            borderRadius: 10, cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontFamily: 'var(--font-main)',
                            background: role === r.id
                                ? `rgba(${r.rgb},.15)` : 'transparent',
                            color: role === r.id ? r.color : '#6b7a9e',
                            border: role === r.id
                                ? `1px solid ${r.color}44`
                                : '1px solid transparent',
                        }}>
                            {r.label}
                        </button>
                    ))}
                </div>

                {/* Form card */}
                <div style={{
                    width: '100%',
                    borderRadius: 18, padding: '20px',
                    display: 'flex', flexDirection: 'column', gap: 12,
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${activeRole.color}33`,
                    backdropFilter: 'blur(12px)',
                    transition: 'border 0.4s'
                }}>

                    <input
                        type="text"
                        placeholder={
                            role === 'student' ? 'Your name (e.g. Arjun)' :
                                role === 'teacher' ? 'Teacher ID (e.g. Teacher01)' :
                                    'Parent ID (e.g. Parent01)'
                        }
                        value={name}
                        onChange={e => { setName(e.target.value); setError('') }}
                        style={{
                            borderRadius: 10, padding: '11px 14px',
                            color: 'white', fontSize: 14,
                            fontFamily: 'var(--font-main)',
                            background: 'rgba(255,255,255,0.06)',
                            border: `1px solid ${activeRole.color}33`,
                            outline: 'none', width: '100%',
                            boxSizing: 'border-box'
                        }}
                    />

                    <div style={{ position: 'relative' }}>
                        <input
                            type="password"
                            placeholder={
                                role === 'student' ? 'Password (your class number)' : 'Password'
                            }
                            value={password}
                            onChange={e => { setPassword(e.target.value); setError('') }}
                            onFocus={() => setPasswordFocused(true)}
                            onBlur={() => setPasswordFocused(false)}
                            onKeyDown={e => e.key === 'Enter' && handleLogin()}
                            style={{
                                width: '100%', borderRadius: 10,
                                padding: '11px 14px', color: 'white',
                                fontSize: 14, fontFamily: 'var(--font-main)',
                                boxSizing: 'border-box',
                                background: passwordFocused
                                    ? 'rgba(37,99,235,0.08)'
                                    : 'rgba(255,255,255,0.06)',
                                border: passwordFocused
                                    ? '1px solid rgba(37,99,235,0.5)'
                                    : `1px solid ${activeRole.color}33`,
                                outline: 'none',
                                transition: 'all 0.3s'
                            }}
                        />
                        {passwordFocused && (
                            <span style={{
                                position: 'absolute', right: 12,
                                top: '50%', transform: 'translateY(-50%)',
                                fontSize: 16, pointerEvents: 'none'
                            }}>🙈</span>
                        )}
                    </div>

                    {error && (
                        <p style={{
                            color: '#f87171', fontSize: 12,
                            textAlign: 'center', margin: 0
                        }}>
                            {error}
                        </p>
                    )}

                    <button
                        onClick={handleLogin}
                        disabled={loading || !name || !password}
                        style={{
                            fontWeight: 900, padding: '12px',
                            borderRadius: 10, border: 'none',
                            cursor: loading || !name || !password
                                ? 'not-allowed' : 'pointer',
                            color: '#000', fontSize: 14,
                            letterSpacing: '0.04em',
                            fontFamily: 'var(--font-main)',
                            transition: 'all 0.3s',
                            background: loading || !name || !password
                                ? `${activeRole.color}44`
                                : activeRole.color,
                        }}
                    >
                        {loading ? '...' : `Enter as ${role.charAt(0).toUpperCase() + role.slice(1)} →`}
                    </button>
                </div>

                {/* Demo hint */}
                <div style={{ width: '100%', textAlign: 'center' }}>
                    <button
                        onClick={autoFill}
                        style={{
                            fontSize: 11, background: 'none',
                            border: 'none', cursor: 'pointer',
                            color: showHint ? activeRole.color : '#4b5563',
                            fontFamily: 'var(--font-main)',
                            padding: '4px 0'
                        }}
                    >
                        {showHint
                            ? `✓ Auto-filled — click login`
                            : `▼ Show demo credentials`
                        }
                    </button>
                    {showHint && (
                        <p style={{
                            fontSize: 11, color: '#6b7a9e',
                            marginTop: 4,
                            fontFamily: 'var(--font-mono)'
                        }}>
                            {DEMO_HINTS[role].hint}
                        </p>
                    )}
                </div>

                <p style={{
                    fontSize: 10, color: '#2a3a5c',
                    letterSpacing: '0.15em', marginTop: 8
                }}>
                    REVIVEED · TAMIL NADU · EDTECH 3.0
                </p>

            </div>

            <style>{`
        input::placeholder { color: #374151; }
      `}</style>
        </div>
    )
}