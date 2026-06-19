import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error(
        '[supabase] Missing environment variables. ' +
        'Check your .env.local file has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
    )
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)