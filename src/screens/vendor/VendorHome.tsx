import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { extractQuoteFromFile, isAIConfigured, loadPDFJS } from "../../services/aiExtractionService"
import { quoteRepository } from "../../services/hybridQuoteRepository"
import { isSupabaseConfigured } from "../../services/supabaseClient"
import type { ExtractedQuoteData } from "../../types/extractedQuoteData"

/**
 * VENDOR HOME - COM SUPABASE
 */

export default function VendorHome() {
    const navigate = useNavigate()

    const [file, setFile] = useState<File | null>(null)
    const [clientName, setClientName] = useState("")
    const [destinationKey, setDestinationKey] = useState("")
    const [status, setStatus] = useState<"idle" | "loading" | "extracting" | "extracted" | "saving" | "error">("idle")
    const [error, setError] = useState("")
    const [extractedData, setExtractedData] = useState<ExtractedQuoteData | null>(null)
    const [pdfReady, setPdfReady] = useState(false)

    useEffect(() => {
        loadPDFJS()
            .then(() => setPdfReady(true))
            .catch((err) => console.error("Erro ao carregar PDF.js:", err))
    }, [])

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = e.target.files?.[0] ?? null
        setFile(selectedFile)
        setStatus("idle")
        setError("")
        setExtractedData(null)

        if (!selectedFile) return

        const fileName = selectedFile.name.toLowerCase()
        if (fileName.includes("buenos")) setDestinationKey("buenos-aires")
        else if (fileName.includes("santiago")) setDestinationKey("santiago")
        else if (fileName.includes("bariloche")) setDestinationKey("bariloche")

        if (selectedFile.type === "application/pdf" && !pdfReady) {
            setStatus("loading")
            setError("Aguarde, carregando suporte a PDF...")

            try {
                await loadPDFJS()
                setPdfReady(true)
            } catch {
                setStatus("error")
                setError("Falha ao carregar suporte a PDF. Tente com uma imagem.")
                return
            }
        }

        if (isAIConfigured()) {
            setStatus("extracting")

            try {
                const result = await extractQuoteFromFile(selectedFile)

                if (result.success && result.data) {
                    setExtractedData(result.data)
                    setStatus("extracted")

                    if (result.data.destination) {
                        const dest = result.data.destination.toLowerCase()
                        if (dest.includes("buenos")) setDestinationKey("buenos-aires")
                        else if (dest.includes("santiago")) setDestinationKey("santiago")
                        else if (dest.includes("bariloche")) setDestinationKey("bariloche")
                    }
                } else {
                    setStatus("error")
                    setError(result.error || "Erro ao extrair dados")
                }
            } catch (err) {
                setStatus("error")
                setError(err instanceof Error ? err.message : "Erro desconhecido")
            }
        }
    }

    async function createQuote() {
        if (!clientName.trim()) {
            setError("Digite o nome do cliente")
            return
        }

        if (!destinationKey) {
            setError("Selecione o destino")
            return
        }

        setStatus("saving")
        setError("")

        try {
            console.log("💾 Criando cotação...")
            console.log("Supabase configurado?", isSupabaseConfigured())

            // Usar repositório híbrido (Supabase ou localStorage)
            const quote = await quoteRepository.create({
                clientName: clientName.trim(),
                destinationKey,
                extractedData: extractedData || undefined
            })

            console.log("✅ Cotação criada:", quote)

            // Navegar para gerenciar
            navigate(`/app/cotacao/${quote.id}`)

        } catch (err) {
            console.error("❌ Erro ao criar cotação:", err)
            setStatus("error")
            setError("Erro ao salvar cotação. Tente novamente.")
        }
    }

    const aiReady = isAIConfigured()
    const dbReady = isSupabaseConfigured()

    return (
        <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 900, margin: "0 auto" }}>
            <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#111827" }}>Área do vendedor</div>
                <div style={{ marginTop: 6, fontSize: 13, color: "#6b7280", display: "flex", gap: 12 }}>
                    <span>{aiReady ? "✨ IA ativa" : "⚠️ IA não configurada"}</span>
                    <span>{pdfReady ? "📄 PDF pronto" : "⏳ Carregando PDF..."}</span>
                    <span style={{ color: dbReady ? "#059669" : "#d97706" }}>
                        {dbReady ? "☁️ Supabase conectado" : "💾 Modo local"}
                    </span>
                </div>
            </div>

            <div style={{ marginTop: 18, padding: 16, borderRadius: 18, border: "1px solid #e5e7eb", background: "#ffffff" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>Nova cotação</div>
                <div style={{ marginTop: 6, fontSize: 13, color: "#6b7280" }}>
                    Anexe o PDF ou imagem da cotação e a IA extrairá os dados automaticamente.
                </div>

                <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>

                    {/* Upload */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ fontSize: 13, color: "#111827", fontWeight: 800 }}>
                            PDF ou Imagem da cotação
                        </div>
                        <input
                            type="file"
                            accept="application/pdf,image/*"
                            onChange={handleFileChange}
                            disabled={status === "extracting" || status === "saving"}
                            style={{
                                padding: "10px 12px",
                                borderRadius: 10,
                                border: "1px solid #e5e7eb",
                                fontSize: 13,
                            }}
                        />

                        {status === "extracting" && (
                            <div style={{
                                fontSize: 13,
                                color: "#6b7280",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                padding: 12,
                                background: "#f3f4f6",
                                borderRadius: 10
                            }}>
                                <span style={{
                                    display: "inline-block",
                                    width: 16,
                                    height: 16,
                                    border: "2px solid #e5e7eb",
                                    borderTopColor: "#111827",
                                    borderRadius: "50%",
                                    animation: "spin 1s linear infinite"
                                }}></span>
                                Extraindo dados com IA... (10-30s)
                            </div>
                        )}

                        {status === "extracted" && extractedData && (
                            <div style={{
                                fontSize: 13,
                                color: "#059669",
                                padding: 12,
                                background: "#ecfdf5",
                                borderRadius: 10,
                                border: "1px solid #a7f3d0"
                            }}>
                                ✅ Dados extraídos com sucesso!
                            </div>
                        )}
                    </div>

                    {/* Nome do cliente */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ fontSize: 13, color: "#111827", fontWeight: 800 }}>Nome do cliente</div>
                        <input
                            type="text"
                            value={clientName}
                            onChange={(e) => {
                                setClientName(e.target.value)
                                setError("")
                            }}
                            placeholder="Ex: João Silva"
                            style={{
                                width: "100%",
                                padding: "12px 12px",
                                borderRadius: 14,
                                border: "1px solid #e5e7eb",
                                fontSize: 14,
                                background: "#fff",
                            }}
                        />
                    </div>

                    {/* Destino */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ fontSize: 13, color: "#111827", fontWeight: 800 }}>Destino</div>
                        <select
                            value={destinationKey}
                            onChange={(e) => {
                                setDestinationKey(e.target.value)
                                setError("")
                            }}
                            style={{
                                width: "100%",
                                padding: "12px 12px",
                                borderRadius: 14,
                                border: "1px solid #e5e7eb",
                                fontSize: 14,
                                background: "#fff",
                            }}
                        >
                            <option value="">Selecione…</option>
                            <option value="buenos-aires">Buenos Aires</option>
                            <option value="santiago">Santiago</option>
                            <option value="bariloche">Bariloche</option>
                            <option value="rio-de-janeiro">Rio de Janeiro</option>
                        </select>
                    </div>

                    {/* Preview dos dados extraídos */}
                    {extractedData && (
                        <div style={{
                            padding: 14,
                            background: "#f9fafb",
                            borderRadius: 12,
                            border: "1px solid #e5e7eb"
                        }}>
                            <div style={{ fontSize: 13, fontWeight: 800, color: "#111827", marginBottom: 10 }}>
                                📋 Dados extraídos
                            </div>

                            <div style={{ fontSize: 12, color: "#374151", display: "grid", gap: 4 }}>
                                <div><strong>Rota:</strong> {extractedData.origin} → {extractedData.destination}</div>
                                <div><strong>Ida:</strong> {extractedData.travelDate}</div>
                                <div><strong>Volta:</strong> {extractedData.returnDate}</div>
                                {extractedData.hotel && (
                                    <div><strong>Hotel:</strong> {extractedData.hotel.name} ({extractedData.hotel.nights} noites)</div>
                                )}
                                <div><strong>Passageiros:</strong> {extractedData.passengers}</div>
                                <div style={{ marginTop: 4 }}>
                                    <strong>Total:</strong>{" "}
                                    <span style={{ fontWeight: 700, color: "#059669", fontSize: 14 }}>
                                        {extractedData.totalPrice}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Botão e erro */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <button
                            onClick={createQuote}
                            disabled={status === "extracting" || status === "saving"}
                            style={{
                                padding: "12px 14px",
                                borderRadius: 14,
                                border: "1px solid #111827",
                                background: (status === "extracting" || status === "saving") ? "#9ca3af" : "#111827",
                                color: "#ffffff",
                                fontWeight: 900,
                                cursor: (status === "extracting" || status === "saving") ? "not-allowed" : "pointer",
                            }}
                        >
                            {status === "saving" ? "Salvando..." : "Criar Cotação"}
                        </button>

                        {error && <div style={{ fontSize: 13, color: "#b91c1c" }}>{error}</div>}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}