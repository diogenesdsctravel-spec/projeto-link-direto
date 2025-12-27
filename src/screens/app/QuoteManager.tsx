import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { quoteRepository, type Quote, type QuoteVersion } from "../../services/hybridQuoteRepository"
import { isSupabaseConfigured } from "../../services/supabaseClient"

/**
 * QUOTE MANAGER - COM LINK OPEN GRAPH
 * 
 * Gera link no formato /p/{publicId} para preview no WhatsApp
 */

// URL base do Netlify para produção
const PRODUCTION_URL = "https://dsc-travel.netlify.app"

export default function QuoteManager() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [quote, setQuote] = useState<Quote | null>(null)
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [label, setLabel] = useState("")
    const [price, setPrice] = useState("")
    const [error, setError] = useState("")
    const [copySuccess, setCopySuccess] = useState(false)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!id) {
            navigate("/app")
            return
        }

        loadQuote()
    }, [id])

    async function loadQuote() {
        if (!id) return

        setLoading(true)
        console.log("🔍 Buscando cotação:", id)

        const found = await quoteRepository.getById(id)

        if (!found) {
            console.error("❌ Cotação não encontrada:", id)
            navigate("/app")
            return
        }

        console.log("✅ Cotação encontrada:", found)
        setQuote(found)
        setLoading(false)
    }

    async function addVersion() {
        if (!quote) return

        if (!label.trim()) {
            setError("Digite um nome para a versão")
            return
        }

        if (!price.trim()) {
            setError("Digite o preço")
            return
        }

        setSaving(true)

        const newVersion: QuoteVersion = {
            versionId: `v${quote.versions.length + 1}`,
            label: label.trim(),
            price: price.trim(),
        }

        const updated = await quoteRepository.update(quote.id, {
            versions: [...quote.versions, newVersion]
        })

        if (updated) {
            setQuote(updated)
            setLabel("")
            setPrice("")
            setShowForm(false)
            setError("")
        } else {
            setError("Erro ao adicionar versão")
        }

        setSaving(false)
    }

    async function generateLink() {
        if (!quote) return

        setSaving(true)
        console.log("🔗 Gerando link...")

        let updatedVersions = quote.versions

        // Se não tem versões, criar uma padrão
        if (quote.versions.length === 0) {
            const extractedPrice = (quote as any).extractedData?.totalPrice || "A consultar"
            updatedVersions = [{
                versionId: "v1",
                label: "Pacote Completo",
                price: extractedPrice,
            }]
        }

        // Gerar publicId
        const publicId = `q-${Date.now()}`

        console.log("💾 Atualizando cotação com publicId:", publicId)

        const updated = await quoteRepository.update(quote.id, {
            publicId,
            versions: updatedVersions
        })

        if (updated) {
            console.log("✅ Cotação atualizada:", updated)
            setQuote(updated)

            // URL com Open Graph para WhatsApp (formato /p/)
            const url = `${PRODUCTION_URL}/p/${publicId}`
            await navigator.clipboard.writeText(url)

            console.log("📋 Link copiado:", url)

            setCopySuccess(true)
            setTimeout(() => setCopySuccess(false), 3000)
        } else {
            console.error("❌ Erro ao gerar link")
            setError("Erro ao gerar link")
        }

        setSaving(false)
    }

    async function copyLink() {
        if (!quote?.publicId) return

        const url = `${PRODUCTION_URL}/p/${quote.publicId}`
        await navigator.clipboard.writeText(url)

        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 3000)
    }

    if (loading) {
        return (
            <div style={{ padding: 24, fontFamily: "system-ui" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                        display: "inline-block",
                        width: 16,
                        height: 16,
                        border: "2px solid #e5e7eb",
                        borderTopColor: "#111827",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                    }}></span>
                    Carregando cotação...
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        )
    }

    if (!quote) {
        return <div style={{ padding: 24 }}>Cotação não encontrada.</div>
    }

    const extractedPrice = (quote as any).extractedData?.totalPrice || "A consultar"
    const canAddVersion = quote.versions.length < 3
    const hasExtractedData = !!(quote as any).extractedData
    const dbReady = isSupabaseConfigured()

    return (
        <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 900, margin: "0 auto" }}>
            {/* Header */}
            <div>
                <button
                    onClick={() => navigate("/app")}
                    style={{
                        padding: "8px 12px",
                        borderRadius: 10,
                        border: "1px solid #e5e7eb",
                        background: "#fff",
                        cursor: "pointer",
                        fontSize: 13,
                    }}
                >
                    ← Voltar
                </button>

                <div style={{ marginTop: 16, fontSize: 22, fontWeight: 900, color: "#111827" }}>
                    Cotação: {quote.clientName}
                </div>
                <div style={{ marginTop: 6, fontSize: 13, color: "#6b7280" }}>
                    Destino: {quote.destinationKey}
                    <span style={{ marginLeft: 12, color: dbReady ? "#059669" : "#d97706" }}>
                        {dbReady ? "☁️ Salvo na nuvem" : "💾 Salvo localmente"}
                    </span>
                </div>
            </div>

            {/* Dados extraídos do PDF */}
            {hasExtractedData && (
                <div style={{
                    marginTop: 16,
                    padding: 14,
                    borderRadius: 14,
                    background: "#ecfdf5",
                    border: "1px solid #a7f3d0"
                }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#065f46", marginBottom: 8 }}>
                        ✅ Dados extraídos do PDF
                    </div>
                    <div style={{ fontSize: 12, color: "#047857", display: "grid", gap: 4 }}>
                        <div><strong>Rota:</strong> {(quote as any).extractedData?.origin} → {(quote as any).extractedData?.destination}</div>
                        <div><strong>Ida:</strong> {(quote as any).extractedData?.travelDate}</div>
                        <div><strong>Volta:</strong> {(quote as any).extractedData?.returnDate}</div>
                        <div><strong>Hotel:</strong> {(quote as any).extractedData?.hotel?.name}</div>
                        <div><strong>Total:</strong> <span style={{ fontWeight: 700 }}>{extractedPrice}</span></div>
                    </div>
                </div>
            )}

            {/* Link público - COM OPEN GRAPH */}
            <div style={{ marginTop: 16, padding: 16, borderRadius: 18, border: "1px solid #111827", background: "#111827" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>📤 Link para WhatsApp</div>
                <div style={{ marginTop: 4, fontSize: 13, color: "#9ca3af" }}>
                    {quote.publicId
                        ? "Link com preview de imagem no WhatsApp"
                        : quote.versions.length === 0
                            ? "Link será gerado com o pacote completo"
                            : `Link com ${quote.versions.length} versão(ões)`
                    }
                </div>

                {/* Se já tem link, mostrar e permitir copiar */}
                {quote.publicId ? (
                    <>
                        <div style={{
                            marginTop: 12,
                            padding: 12,
                            background: "rgba(255,255,255,0.1)",
                            borderRadius: 8,
                            fontFamily: "monospace",
                            fontSize: 12,
                            color: "#d1d5db",
                            wordBreak: "break-all"
                        }}>
                            {PRODUCTION_URL}/p/{quote.publicId}
                        </div>

                        <button
                            onClick={copyLink}
                            style={{
                                marginTop: 12,
                                padding: "12px 14px",
                                borderRadius: 12,
                                border: "none",
                                background: copySuccess ? "#10b981" : "#fff",
                                color: copySuccess ? "#fff" : "#111827",
                                fontWeight: 900,
                                cursor: "pointer",
                                width: "100%",
                                fontSize: 14,
                                transition: "all 0.2s"
                            }}
                        >
                            {copySuccess ? "✓ Copiado!" : "📋 Copiar Link"}
                        </button>

                        <button
                            onClick={generateLink}
                            disabled={saving}
                            style={{
                                marginTop: 8,
                                padding: "10px 14px",
                                borderRadius: 10,
                                border: "1px solid rgba(255,255,255,0.3)",
                                background: "transparent",
                                color: "#9ca3af",
                                fontWeight: 600,
                                cursor: saving ? "not-allowed" : "pointer",
                                width: "100%",
                                fontSize: 12,
                            }}
                        >
                            {saving ? "Gerando..." : "🔄 Gerar novo link"}
                        </button>
                    </>
                ) : (
                    <button
                        onClick={generateLink}
                        disabled={saving}
                        style={{
                            marginTop: 12,
                            padding: "12px 14px",
                            borderRadius: 12,
                            border: "none",
                            background: saving ? "#9ca3af" : "#fff",
                            color: "#111827",
                            fontWeight: 900,
                            cursor: saving ? "not-allowed" : "pointer",
                            width: "100%",
                            fontSize: 14,
                        }}
                    >
                        {saving ? "Gerando..." : "📋 Gerar e Copiar Link"}
                    </button>
                )}

                {/* Dica sobre Open Graph */}
                <div style={{
                    marginTop: 12,
                    fontSize: 11,
                    color: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                }}>
                    <span>💡</span>
                    <span>O link mostra prévia com foto do destino e nome do cliente no WhatsApp</span>
                </div>
            </div>

            {/* Versões - OPCIONAL */}
            <div style={{ marginTop: 16, padding: 16, borderRadius: 18, border: "1px solid #e5e7eb", background: "#ffffff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>
                            Versões para comparação ({quote.versions.length}/3)
                        </div>
                        <div style={{ marginTop: 4, fontSize: 13, color: "#6b7280" }}>
                            <em>Opcional:</em> crie versões diferentes para o cliente escolher
                        </div>
                    </div>

                    {canAddVersion && !showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            style={{
                                padding: "10px 14px",
                                borderRadius: 12,
                                border: "1px solid #e5e7eb",
                                background: "#fff",
                                color: "#111827",
                                fontWeight: 700,
                                cursor: "pointer",
                                fontSize: 13,
                            }}
                        >
                            + Nova Versão
                        </button>
                    )}
                </div>

                {/* Lista de versões */}
                {quote.versions.length > 0 && (
                    <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                        {quote.versions.map((v) => (
                            <div
                                key={v.versionId}
                                style={{
                                    padding: 12,
                                    borderRadius: 12,
                                    border: "1px solid #e5e7eb",
                                    background: "#f9fafb",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 14 }}>{v.label}</div>
                                    <div style={{ fontSize: 13, color: "#6b7280" }}>ID: {v.versionId}</div>
                                </div>
                                <div style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>{v.price}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Form nova versão */}
                {showForm && (
                    <div style={{ marginTop: 16, padding: 14, borderRadius: 12, background: "#f9fafb", border: "1px solid #e5e7eb" }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#111827", marginBottom: 12 }}>
                            Nova Versão
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <input
                                type="text"
                                placeholder="Ex: Opção Econômica"
                                value={label}
                                onChange={(e) => {
                                    setLabel(e.target.value)
                                    setError("")
                                }}
                                style={{
                                    padding: "10px 12px",
                                    borderRadius: 10,
                                    border: "1px solid #e5e7eb",
                                    fontSize: 13,
                                }}
                            />

                            <input
                                type="text"
                                placeholder={`Ex: ${extractedPrice}`}
                                value={price}
                                onChange={(e) => {
                                    setPrice(e.target.value)
                                    setError("")
                                }}
                                style={{
                                    padding: "10px 12px",
                                    borderRadius: 10,
                                    border: "1px solid #e5e7eb",
                                    fontSize: 13,
                                }}
                            />

                            <div style={{ display: "flex", gap: 8 }}>
                                <button
                                    onClick={addVersion}
                                    disabled={saving}
                                    style={{
                                        padding: "10px 14px",
                                        borderRadius: 10,
                                        border: "1px solid #111827",
                                        background: "#111827",
                                        color: "#fff",
                                        fontWeight: 700,
                                        cursor: saving ? "not-allowed" : "pointer",
                                        fontSize: 13,
                                    }}
                                >
                                    {saving ? "Salvando..." : "Adicionar"}
                                </button>

                                <button
                                    onClick={() => {
                                        setShowForm(false)
                                        setLabel("")
                                        setPrice("")
                                        setError("")
                                    }}
                                    style={{
                                        padding: "10px 14px",
                                        borderRadius: 10,
                                        border: "1px solid #e5e7eb",
                                        background: "#fff",
                                        cursor: "pointer",
                                        fontSize: 13,
                                    }}
                                >
                                    Cancelar
                                </button>
                            </div>

                            {error && <div style={{ fontSize: 13, color: "#b91c1c" }}>{error}</div>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}