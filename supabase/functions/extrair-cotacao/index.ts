import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
}

type ArquivoEntrada = { tipo: string; conteudo: string }

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: corsHeaders,
        })
    }

    try {
        if (req.method !== "POST") {
            return new Response(JSON.stringify({ error: "Method not allowed" }), {
                status: 405,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders,
                },
            })
        }

        const openaiKey = Deno.env.get("OPENAI_API_KEY")
        if (!openaiKey) {
            return new Response(
                JSON.stringify({ error: "OPENAI_API_KEY ausente no servidor" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                }
            )
        }

        const rawBody = await req.text()

        let body: any
        try {
            body = JSON.parse(rawBody)
        } catch {
            return new Response(
                JSON.stringify({
                    error: "Body nao era JSON",
                    preview: rawBody.slice(0, 300),
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders,
                    },
                }
            )
        }

        const arquivos = (body?.arquivos ?? []) as ArquivoEntrada[]
        const instrucaoIA = String(body?.instrucaoIA ?? "")

        if (!Array.isArray(arquivos) || arquivos.length === 0) {
            return new Response(JSON.stringify({ error: "Envie ao menos 1 arquivo" }), {
                status: 400,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            })
        }

        const contents: any[] = []

        for (const arq of arquivos) {
            const mediaType = arq?.tipo
            const dataUrl = arq?.conteudo ?? ""
            const base64 = dataUrl.replace(/^data:.*?;base64,/, "")

            if (!mediaType || !base64) continue

            if (mediaType === "application/pdf") {
                const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
                const blob = new Blob([bytes], { type: "application/pdf" })

                const form = new FormData()
                form.append("purpose", "user_data")
                form.append("file", blob, "cotacao.pdf")

                const up = await fetch("https://api.openai.com/v1/files", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${openaiKey}` },
                    body: form,
                })

                const upRaw = await up.text()
                if (!up.ok) {
                    return new Response(
                        JSON.stringify({
                            error: "Falha upload PDF",
                            status: up.status,
                            raw: upRaw,
                        }),
                        {
                            status: 500,
                            headers: { "Content-Type": "application/json", ...corsHeaders },
                        }
                    )
                }

                const upData = JSON.parse(upRaw)
                const fileId = upData?.id
                if (!fileId) {
                    return new Response(
                        JSON.stringify({ error: "Upload PDF sem file id", raw: upData }),
                        {
                            status: 500,
                            headers: { "Content-Type": "application/json", ...corsHeaders },
                        }
                    )
                }

                contents.push({
                    type: "input_file",
                    file_id: fileId,
                })
            } else {
                contents.push({
                    type: "input_image",
                    image_url: `data:${mediaType};base64,${base64}`,
                })
            }
        }

        const texto = [
            "Extraia dados estruturados desta cotacao de viagem e retorne apenas JSON valido.",
            "Regras:",
            "datas YYYY-MM-DD",
            "horarios HH:MM",
            "codigos de aeroporto em maiusculo",
            "se nao encontrar um campo, omita",
            "inclua confianca de 0 a 100",
            instrucaoIA ? `Instrucao extra: ${instrucaoIA}` : "",
        ]
            .filter(Boolean)
            .join("\n")

        const payload = {
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            input: [
                {
                    role: "user",
                    content: [...contents, { type: "input_text", text: texto }],
                },
            ],
            max_output_tokens: 2000,
        }

        const r = await fetch("https://api.openai.com/v1/responses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${openaiKey}`,
            },
            body: JSON.stringify(payload),
        })

        const raw = await r.text()

        if (!r.ok) {
            return new Response(
                JSON.stringify({ error: "Falha ao chamar OpenAI", status: r.status, raw }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                }
            )
        }

        let data: any
        try {
            data = JSON.parse(raw)
        } catch {
            return new Response(JSON.stringify({ error: "Resposta nao era JSON", raw }), {
                status: 500,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            })
        }

        const text = data?.output_text ?? ""
        let json: any
        try {
            json = JSON.parse(text)
        } catch {
            return new Response(
                JSON.stringify({ error: "output_text nao era JSON", text }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                }
            )
        }

        return new Response(JSON.stringify(json), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                ...corsHeaders,
            },
        })
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e?.message ?? "Erro inesperado" }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
        })
    }
})
