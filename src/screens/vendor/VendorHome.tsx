import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { extractQuoteFromFiles, isAIConfigured, loadPDFJS } from "../../services/aiExtractionService"
import { quoteRepository } from "../../services/hybridQuoteRepository"
import { isSupabaseConfigured } from "../../services/supabaseClient"
import { checkTemplateExists } from "../../services/destinationService"
import type { ExtractedQuoteData } from "../../types/extractedQuoteData"

/**
 * VENDOR HOME - COM SUPORTE A MÚLTIPLOS ARQUIVOS
 * 
 * MUDANÇA: 
 * - Aceita múltiplos PDFs e imagens
 * - Destino extraído automaticamente pela IA
 * - Consolida dados de várias fontes
 */

export default function VendorHome() {
    const navigate = useNavigate()

    const [files, setFiles] = useState<File[]>([])
    const [clientName, setClientName] = useState("")
    const [destinationKey, setDestinationKey] = useState("")
    const [status, setStatus] = useState<"idle" | "loading" | "extracting" | "extracted" | "checking" | "saving" | "error">("idle")
    const [error, setError] = useState("")
    const [extractedData, setExtractedData] = useState<ExtractedQuoteData | null>(null)
    const [pdfReady, setPdfReady] = useState(false)

    useEffect(() => {
        loadPDFJS()
            .then(() => setPdfReady(true))
            .catch((err) => console.error("Erro ao carregar PDF.js:", err))
    }, [])

    async function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedFiles = e.target.files ? Array.from(e.target.files) : []

        if (selectedFiles.length === 0) {
            setFiles([])
            setStatus("idle")
            setError("")
            setExtractedData(null)
            setDestinationKey("")
            return
        }

        setFiles(selectedFiles)
        setStatus("idle")
        setError("")
        setExtractedData(null)
        setDestinationKey("")

        // Verificar se tem PDF e se PDF.js está pronto
        const hasPDF = selectedFiles.some(f => f.type === "application/pdf")
        if (hasPDF && !pdfReady) {
            setStatus("loading")
            setError("Aguarde, carregando suporte a PDF...")

            try {
                await loadPDFJS()
                setPdfReady(true)
            } catch {
                setStatus("error")
                setError("Falha ao carregar suporte a PDF. Tente com imagens.")
                return
            }
        }

        if (isAIConfigured()) {
            setStatus("extracting")

            try {
                const result = await extractQuoteFromFiles(selectedFiles)

                if (result.success && result.data) {
                    setExtractedData(result.data)
                    setStatus("extracted")

                    // Gerar destinationKey automaticamente do destino extraído
                    if (result.data.destination) {
                        const key = result.data.destination
                            .toLowerCase()
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .replace(/\s+/g, "-")
                        setDestinationKey(key)
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

    function removeFile(index: number) {
        const newFiles = files.filter((_, i) => i !== index)
        setFiles(newFiles)

        if (newFiles.length === 0) {
            setStatus("idle")
            setExtractedData(null)
            setDestinationKey("")
        }
    }

    async function reextract() {
        if (files.length === 0) return

        setStatus("extracting")
        setError("")

        try {
            const result = await extractQuoteFromFiles(files)

            if (result.success && result.data) {
                setExtractedData(result.data)
                setStatus("extracted")

                if (result.data.destination) {
                    const key = result.data.destination
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/\s+/g, "-")
                    setDestinationKey(key)
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

    async function createQuote() {
        if (!clientName.trim()) {
            setError("Digite o nome do cliente")
            return
        }

        if (!destinationKey) {
            setError("Destino não foi extraído. Tente novamente.")
            return
        }

        setStatus("checking")
        setError("")

        try {
            // Verificar se template existe
            const hotelName = extractedData?.hotel?.name || ""
            const templateCheck = await checkTemplateExists(destinationKey, hotelName)

            console.log("📋 Verificação de template:", templateCheck)

            // Se falta algo, redirecionar para cadastro
            if (!templateCheck.destinationExists || !templateCheck.hotelExists) {
                console.log("🆕 Template incompleto, redirecionando para cadastro...")
                navigate("/app/template-setup", {
                    state: {
                        extractedData,
                        clientName: clientName.trim(),
                        destinationKey,
                        templateCheck
                    }
                })
                return
            }

            // Template existe, criar cotação diretamente
            setStatus("saving")
            console.log("💾 Criando cotação...")

            const quote = await quoteRepository.create({
                clientName: clientName.trim(),
                destinationKey,
                extractedData: extractedData || undefined
            })

            console.log("✅ Cotação criada:", quote)
            navigate(`/app/cotacao/${quote.id}`)

        } catch (err) {
            console.error("❌ Erro:", err)
            setStatus("error")
            setError("Erro ao processar. Tente novamente.")
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
                    Anexe o PDF da cotação + prints das conexões. A IA consolida tudo automaticamente.
                </div>

                <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>

                    {/* Upload múltiplo */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ fontSize: 13, color: "#111827", fontWeight: 800 }}>
                            PDFs e Imagens da cotação
                        </div>
                        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
                            💡 Adicione o PDF principal + prints com detalhes das conexões/escalas
                        </div>
                        <input
                            type="file"
                            accept="application/pdf,image/*"
                            multiple
                            onChange={handleFilesChange}
                            disabled={status === "extracting" || status === "saving"}
                            style={{
                                padding: "10px 12px",
                                borderRadius: 10,
                                border: "1px solid #e5e7eb",
                                fontSize: 13,
                            }}
                        />

                        {/* Lista de arquivos selecionados */}
                        {files.length > 0 && (
                            <div style={{
                                marginTop: 8,
                                padding: 12,
                                background: "#f9fafb",
                                borderRadius: 10,
                                border: "1px solid #e5e7eb"
                            }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                                    📎 {files.length} arquivo(s) selecionado(s):
                                </div>
                                {files.map((file, idx) => (
                                    <div key={idx} style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "6px 8px",
                                        background: "#fff",
                                        borderRadius: 6,
                                        marginBottom: 4,
                                        border: "1px solid #e5e7eb"
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <span style={{ fontSize: 16 }}>
                                                {file.type === "application/pdf" ? "📄" : "🖼️"}
                                            </span>
                                            <span style={{ fontSize: 12, color: "#374151" }}>
                                                {file.name}
                                            </span>
                                            <span style={{ fontSize: 11, color: "#9ca3af" }}>
                                                ({(file.size / 1024).toFixed(0)} KB)
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => removeFile(idx)}
                                            disabled={status === "extracting"}
                                            style={{
                                                padding: "2px 6px",
                                                borderRadius: 4,
                                                border: "none",
                                                background: "#fee2e2",
                                                color: "#dc2626",
                                                fontSize: 11,
                                                cursor: status === "extracting" ? "not-allowed" : "pointer"
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}

                                {status === "extracted" && (
                                    <button
                                        onClick={reextract}
                                        style={{
                                            marginTop: 8,
                                            padding: "6px 12px",
                                            borderRadius: 6,
                                            border: "1px solid #d1d5db",
                                            background: "#fff",
                                            color: "#374151",
                                            fontSize: 12,
                                            cursor: "pointer"
                                        }}
                                    >
                                        🔄 Re-extrair dados
                                    </button>
                                )}
                            </div>
                        )}

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
                                Extraindo dados de {files.length} arquivo(s) com IA... (15-45s)
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
                                ✅ Dados extraídos e consolidados com sucesso!
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

                    {/* Destino extraído automaticamente */}
                    {extractedData?.destination && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <div style={{ fontSize: 13, color: "#111827", fontWeight: 800 }}>Destino</div>
                            <div
                                style={{
                                    width: "100%",
                                    padding: "12px 12px",
                                    borderRadius: 14,
                                    border: "1px solid #d1d5db",
                                    fontSize: 14,
                                    background: "#f3f4f6",
                                    color: "#111827",
                                    fontWeight: 600,
                                }}
                            >
                                📍 {extractedData.destination}
                            </div>
                        </div>
                    )}

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

                                {/* Detalhes dos voos */}
                                {extractedData.outboundFlight && (
                                    <div style={{ marginTop: 8, padding: 8, background: "#fff", borderRadius: 8 }}>
                                        <strong>✈️ Voo de ida:</strong> {extractedData.outboundFlight.stops} escala(s) - {extractedData.outboundFlight.totalDuration}
                                        {extractedData.outboundFlight.segments && (
                                            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>
                                                {extractedData.outboundFlight.segments.map((seg: any, i: number) => (
                                                    <div key={i}>
                                                        {seg.departureAirport} → {seg.arrivalAirport} ({seg.flightNumber || "N/A"})
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {extractedData.returnFlight && (
                                    <div style={{ marginTop: 4, padding: 8, background: "#fff", borderRadius: 8 }}>
                                        <strong>✈️ Voo de volta:</strong> {extractedData.returnFlight.stops} escala(s) - {extractedData.returnFlight.totalDuration}
                                        {extractedData.returnFlight.segments && (
                                            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>
                                                {extractedData.returnFlight.segments.map((seg: any, i: number) => (
                                                    <div key={i}>
                                                        {seg.departureAirport} → {seg.arrivalAirport} ({seg.flightNumber || "N/A"})
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

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
                            disabled={status === "extracting" || status === "saving" || status === "checking"}
                            style={{
                                padding: "12px 14px",
                                borderRadius: 14,
                                border: "1px solid #111827",
                                background: (status === "extracting" || status === "saving" || status === "checking") ? "#9ca3af" : "#111827",
                                color: "#ffffff",
                                fontWeight: 900,
                                cursor: (status === "extracting" || status === "saving" || status === "checking") ? "not-allowed" : "pointer",
                            }}
                        >
                            {status === "saving" ? "Salvando..." : status === "checking" ? "Verificando..." : "Criar Cotação"}
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