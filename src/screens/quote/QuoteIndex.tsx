import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import type { DestinationTemplate } from "../../types/destinationTemplate"
import { repositories } from "../../services/repositories"
import { applyHeadMeta } from "../../services/headMeta"
import { quoteRepository, type Quote } from "../../services/hybridQuoteRepository"
import { generateDynamicTemplate, hasExtractedData } from "../../services/dynamicTemplateGenerator"

/**
 * QUOTE INDEX - COM SUPABASE
 * 
 * Busca cotação do Supabase (funciona em qualquer dispositivo)
 */

export default function QuoteIndex() {
    const { publicId = "" } = useParams()
    const [quote, setQuote] = useState<Quote | null>(null)
    const [template, setTemplate] = useState<DestinationTemplate | null>(null)
    const [loading, setLoading] = useState(true)
    const [useDynamic, setUseDynamic] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        applyHeadMeta({
            title: "Cotação – DSC Travel",
            ogTitle: "Sua cotação personalizada",
            ogDescription: "Uma experiência criada sob medida para você",
            ogImage: "https://images.unsplash.com/photo-1612294037637-ec328d0e075e",
        })
    }, [])

    useEffect(() => {
        loadQuote()
    }, [publicId])

    async function loadQuote() {
        setLoading(true)
        setError("")

        try {
            console.log("🔍 Buscando cotação:", publicId)

            // Buscar do repositório híbrido (Supabase ou localStorage)
            const foundQuote = await quoteRepository.getByPublicId(publicId)

            if (foundQuote) {
                console.log("✅ Cotação encontrada:", foundQuote)
                setQuote(foundQuote)

                // Verificar se tem dados extraídos do PDF
                if (hasExtractedData(foundQuote)) {
                    console.log("✨ Gerando template dinâmico")
                    const dynamicTemplate = generateDynamicTemplate(
                        foundQuote.clientName,
                        (foundQuote as any).extractedData
                    )
                    setTemplate(dynamicTemplate)
                    setUseDynamic(true)
                } else {
                    // Fallback: usar template mock
                    console.log("📦 Usando template padrão")
                    const mockTemplate = await repositories.destinationTemplateRepository.getByDestinationKey(foundQuote.destinationKey)
                    setTemplate(mockTemplate)
                }
            } else {
                console.warn("❌ Cotação não encontrada")
                setError("Cotação não encontrada ou expirada.")
            }
        } catch (err) {
            console.error("Erro ao carregar cotação:", err)
            setError("Erro ao carregar cotação. Tente novamente.")
        }

        setLoading(false)
    }

    if (loading) {
        return (
            <div style={{ padding: 24, fontFamily: "system-ui", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                    display: "inline-block",
                    width: 16,
                    height: 16,
                    border: "2px solid #e5e7eb",
                    borderTopColor: "#111827",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                }}></span>
                Carregando sua cotação...
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        )
    }

    if (error) {
        return (
            <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 560 }}>
                <h1 style={{ margin: 0, fontSize: 24 }}>😕 Oops!</h1>
                <p style={{ marginTop: 12, color: "#6b7280" }}>{error}</p>
                <p style={{ marginTop: 8, fontSize: 14, color: "#9ca3af" }}>
                    Verifique se o link está correto ou entre em contato com a DSC Travel.
                </p>
            </div>
        )
    }

    if (!quote) {
        return (
            <div style={{ padding: 24, fontFamily: "system-ui" }}>
                <p>Cotação não encontrada.</p>
            </div>
        )
    }

    if (!template) {
        return (
            <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 560 }}>
                <h1 style={{ margin: 0 }}>Sua cotação</h1>
                <p style={{ marginTop: 8, color: "#6b7280" }}>
                    {quote.clientName} · {quote.destinationKey}
                </p>
                <p style={{ marginTop: 16 }}>Template do destino ainda não disponível.</p>
            </div>
        )
    }

    return (
        <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 560 }}>
            <h1 style={{ margin: 0 }}>Sua cotação</h1>
            <p style={{ marginTop: 8, color: "#6b7280" }}>
                {quote.clientName} · {template.destinationName}
            </p>

            <div style={{ marginTop: 14, fontSize: 13, color: "#6b7280" }}>
                {useDynamic ? (
                    <span style={{ color: "#059669" }}>
                        ✨ Personalizado para você · {template.screens.length} telas
                    </span>
                ) : (
                    <span>
                        {template.screens.length} telas · {template.experiences?.length || 0} experiências
                    </span>
                )}
            </div>

            <div style={{ marginTop: 16, padding: 16, borderRadius: 16, border: "1px solid #e5e7eb" }}>
                <div style={{ fontWeight: 600 }}>
                    {quote.versions.length > 1 ? "Escolha uma versão" : "Ver detalhes"}
                </div>

                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                    {quote.versions.slice(0, 3).map((v) => (
                        <Link
                            key={v.versionId}
                            to={`/q/${quote.publicId}/v/${v.versionId}`}
                            style={{ textDecoration: "none" }}
                        >
                            <div
                                style={{
                                    padding: "14px 14px",
                                    borderRadius: 18,
                                    border: "1px solid #e5e7eb",
                                    background: "#ffffff",
                                    color: "#111827",
                                }}
                            >
                                <div style={{ fontWeight: 800 }}>{v.label}</div>
                                {v.price && (
                                    <div style={{ marginTop: 4, fontSize: 14, color: "#059669", fontWeight: 700 }}>
                                        {v.price}
                                    </div>
                                )}
                                <div style={{ marginTop: 6, fontSize: 13, color: "#6b7280" }}>
                                    Toque para ver os detalhes
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {quote.versions.length > 1 && (
                <p style={{ marginTop: 14, color: "#6b7280", fontSize: 13 }}>
                    Dica: abra versões diferentes em abas separadas para comparar.
                </p>
            )}
        </div>
    )
}