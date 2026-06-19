import { supabase } from '../../lib/supabase'

export async function handleLoginLogic({
    name,
    password,
    role,
    login,
}) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('name', name.trim())
        .eq('role', role)
        .single()

    if (error || !data) {
        const demoId = `demo-${role}-${name.trim().toLowerCase().replace(/\s+/g, '-')}`

        await login({
            id: demoId,
            name: name.trim(),
            role,
        })

        return
    }

    await login(data)
}