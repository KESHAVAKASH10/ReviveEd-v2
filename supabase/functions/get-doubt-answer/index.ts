import { corsHeaders } from '../_shared/cors.ts'

const NVIDIA_KEY = Deno.env.get('NVIDIA_API_KEY') ?? ''
const NVIDIA_URL = 'https://integrate.api.nvidia.com/v1/chat/completions'
const MODEL = 'nvidia/nemotron-ultra-253b-v1'

Deno.serve(async (req: Request): Promise<Response> => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { systemPrompt, userPrompt, maxTokens } = await req.json()

        const res = await fetch(NVIDIA_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${NVIDIA_KEY}`,
            },
            body: JSON.stringify({
                model: MODEL,
                max_tokens: maxTokens ?? 300,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
            }),
        })

        if (!res.ok) {
            const errText = await res.text()
            return new Response(JSON.stringify({ error: errText }), {
                status: res.status,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        const data = await res.json()
        const text = data?.choices?.[0]?.message?.content ?? null

        return new Response(JSON.stringify({ text }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})