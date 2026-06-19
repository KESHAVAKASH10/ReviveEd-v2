import { createContext, useContext, useState, useCallback } from 'react'
import { upsertProfile } from '../lib/db'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const login = useCallback(async (userData) => {
        setLoading(true)
        setError(null)

        try {
            await upsertProfile({
                id: userData.id,
                name: userData.name,
                role: userData.role,
                studentClass: userData.class ?? null,
                section: userData.section ?? null,
                groupName: userData.groupName ?? null,
                parentOf: userData.childName ?? null,
            })

            setUser(userData)
            console.log('[auth] Logged in:', userData.name, userData.role)

        } catch (err) {
            console.error('[auth] Login error:', err.message)
            setError('Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }, [])

    const logout = useCallback(() => {
        setUser(null)
        setError(null)
        console.log('[auth] Logged out')
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading, error, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
    return ctx
}