import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import PandaMascot from './PandaMascot'
import RoleTabs from './RoleTabs'
import LoginForm from './LoginForm'
import DemoHint from './DemoHint'
import { ROLES, DEMO_HINTS } from './constants'
import { handleLoginLogic } from './loginHelpers'

export default function Login() {
    const { login } = useAuth()

    const [role, setRole] = useState('student')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [passwordFocused, setPasswordFocused] = useState(false)
    const [showHint, setShowHint] = useState(false)

    const activeRole = ROLES.find((r) => r.id === role)

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
    }

    async function handleLogin() {
        setLoading(true)
        await handleLoginLogic({ name, password, role, login })
        setLoading(false)
    }

    return (
        <>
            <PandaMascot hiding={passwordFocused} />
            <RoleTabs roles={ROLES} role={role} switchRole={switchRole} />
            <LoginForm
                role={role}
                name={name}
                setName={setName}
                password={password}
                setPassword={setPassword}
                error={error}
                loading={loading}
                passwordFocused={passwordFocused}
                setPasswordFocused={setPasswordFocused}
                handleLogin={handleLogin}
                activeRole={activeRole}
            />
            <DemoHint
                showHint={showHint}
                setShowHint={setShowHint}
                autoFill={autoFill}
                activeRole={activeRole}
                role={role}
                DEMO_HINTS={DEMO_HINTS}
            />
        </>
    )
}