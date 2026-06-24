import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders })
    }

    try {
        const authHeader = req.headers.get("Authorization")

        const { provider, systemPrompt, userPrompt, maxTokens = 400 } = await req.json()

        if (provider !== "nvidia") {
            return new Response(
                JSON.stringify({ error: "Unsupported AI provider" }),
                {
                    status: 400,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json"
                    }
                }
            )
        }

        const apiKey = req.headers.get("x-nvidia-api-key") || Deno.env.get("AI_API_KEY")
        if (!apiKey) {
            return new Response(
                JSON.stringify({ error: "Missing API key" }),
                {
                    status: 401,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json"
                    }
                }
            )
        }

        const aiRes = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "meta/llama-3.1-70b-instruct",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                max_tokens: maxTokens,
                temperature: 0.7
            })
        })

        if (!aiRes.ok) {
            const err = await aiRes.text()
            return new Response(
                JSON.stringify({ error: err }),
                {
                    status: aiRes.status,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json"
                    }
                }
            )
        }

        const data = await aiRes.json()

        const text = data?.choices?.[0]?.message?.content || null

        return new Response(
            JSON.stringify({ text }),
            {
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json"
                }
            }
        )
    } catch (err) {
        return new Response(
            JSON.stringify({ error: err.message }),
            {
                status: 500,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json"
                }
            }
        )
    }
})