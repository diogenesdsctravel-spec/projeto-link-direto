import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
    saveDestination,
    saveHotel,
    getDestinationByKey,
    getHotelByName,
    type Experience
} from "../../services/destinationService"
import { quoteRepository } from "../../services/hybridQuoteRepository"
import type { ExtractedQuoteData } from "../../types/extractedQuoteData"

type TemplateExperience = Experience & {
    imageUrl?: string
    searchTerm?: string
    description?: string  // ADICIONADO
}

/**
 * TEMPLATE SETUP
 *
 * Tela para cadastrar template quando destino/hotel não existe.
 * Vendedor cadastra fotos e textos, IA sugere experiências específicas do destino.
 */

const DEFAULT_EXPERIENCES: TemplateExperience[] = [
    { icon: "📸", title: "Pontos turísticos", subtitle: "Os mais famosos", imageUrl: "", description: "" },
    { icon: "🍽️", title: "Gastronomia local", subtitle: "Sabores típicos", imageUrl: "", description: "" },
    { icon: "🏛️", title: "Cultura e história", subtitle: "Patrimônio local", imageUrl: "", description: "" },
    { icon: "🌅", title: "Paisagens", subtitle: "Vistas incríveis", imageUrl: "", description: "" },
]

export default function TemplateSetup() {
    const navigate = useNavigate()
    const location = useLocation()

    const { extractedData, clientName, destinationKey } = (location.state || {}) as {
        extractedData?: ExtractedQuoteData
        clientName?: string
        destinationKey?: string
    }

    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const [step, setStep] = useState<"destination" | "hotel" | "review">("destination")

    const [heroImageUrl, setHeroImageUrl] = useState("")
    const [heroHeadline, setHeroHeadline] = useState("")
    const [heroSubtext, setHeroSubtext] = useState("")
    const [experiences, setExperiences] = useState<TemplateExperience[]>([])

    const [hotelDescription, setHotelDescription] = useState("")
    const [hotelImageUrls, setHotelImageUrls] = useState<string[]>(["", "", ""])

    const [destinationExists, setDestinationExists] = useState(false)
    const [hotelExists, setHotelExists] = useState(false)

    useEffect(() => {
        if (!extractedData) {
            navigate("/projeto-link-direto/app")
            return
        }

        checkExisting()
        generateSuggestions()
    }, [])

    async function checkExisting() {
        if (destinationKey) {
            const dest = await getDestinationByKey(destinationKey)
            if (dest && dest.heroImageUrl) {
                setDestinationExists(true)
                setHeroImageUrl(dest.heroImageUrl)
                setHeroHeadline(dest.heroHeadline || "")
                setHeroSubtext(dest.heroSubtext || "")
                setExperiences((dest.experiences || []) as TemplateExperience[])
                setStep("hotel")
            }
        }

        if (extractedData?.hotel?.name) {
            const hotel = await getHotelByName(extractedData.hotel.name)
            if (hotel && hotel.imageUrls.length > 0) {
                setHotelExists(true)
                setHotelDescription(hotel.description || "")
                setHotelImageUrls(hotel.imageUrls.slice(0, 3))
            }
        }
    }

    function generateSuggestions() {
        const destination = extractedData?.destination || ""

        if (extractedData?.suggestedExperiences && extractedData.suggestedExperiences.length > 0) {
            console.log("✅ Usando experiências da IA:", extractedData.suggestedExperiences)
            setExperiences(
                extractedData.suggestedExperiences.map((exp: any) => ({
                    icon: exp.icon || "📍",
                    title: exp.title,
                    subtitle: exp.subtitle,
                    description: exp.description || "",  // ✅ CORREÇÃO: Agora inclui description
                    imageUrl: "",
                    searchTerm: exp.searchTerm
                }))
            )
        } else {
            console.log("⚠️ Usando experiências fallback (IA não extraiu)")
            setExperiences(DEFAULT_EXPERIENCES)
        }

        setHeroHeadline(`${clientName}, ${destination} te espera com experiências incríveis.`)

        const nights = extractedData?.totalNights || extractedData?.hotel?.nights || 7
        setHeroSubtext(`${nights} dias onde tudo está resolvido.\nVocê só precisa estar presente.`)
    }

    function updateExperience(index: number, field: keyof TemplateExperience, value: string) {
        const updated = [...experiences]
        updated[index] = { ...updated[index], [field]: value }
        setExperiences(updated)
    }

    function updateHotelImageUrl(index: number, value: string) {
        const updated = [...hotelImageUrls]
        updated[index] = value
        setHotelImageUrls(updated)
    }

    async function handleSaveDestination() {
        if (!heroImageUrl.trim()) {
            setError("Cole a URL da foto principal do destino")
            return
        }

        setSaving(true)
        setError("")

        try {
            await saveDestination({
                destinationKey,
                destinationName: extractedData?.destination || destinationKey,
                heroImageUrl,
                heroHeadline,
                heroSubtext,
                experiences: experiences
                    .filter((e) => e.title)
                    .map(({ searchTerm, ...rest }) => rest as Experience)  // ✅ description já está incluído via spread
            })

            setStep("hotel")
        } catch (err) {
            setError("Erro ao salvar destino")
        }

        setSaving(false)
    }

    async function handleSaveHotel() {
        const validUrls = hotelImageUrls.filter((url) => url.trim())

        if (validUrls.length === 0) {
            setError("Cole pelo menos uma URL de foto do hotel")
            return
        }

        setSaving(true)
        setError("")

        try {
            await saveHotel({
                hotelName: extractedData?.hotel?.name || "Hotel",
                stars: extractedData?.hotel?.stars,
                address: extractedData?.hotel?.address,
                description: hotelDescription,
                shortDescription: `Seu refúgio em ${extractedData?.destination}`,
                imageUrls: validUrls
            })

            setStep("review")
        } catch (err) {
            setError("Erro ao salvar hotel")
        }

        setSaving(false)
    }

    async function handleFinish() {
        setSaving(true)

        try {
            const quote = await quoteRepository.create({
                clientName,
                destinationKey,
                extractedData
            })

            navigate(`/app/cotacao/${quote.id}`)
        } catch (err) {
            setError("Erro ao criar cotação")
            setSaving(false)
        }
    }

    if (!extractedData) {
        return <div style={{ padding: 24 }}>Carregando...</div>
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f9fafb",
                fontFamily: "system-ui",
                overflow: "auto"
            }}
        >
            <div
                style={{
                    padding: "20px 24px",
                    borderBottom: "1px solid #e5e7eb",
                    background: "#fff"
                }}
            >
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Configurar Template</h1>
                <p style={{ margin: 0, marginTop: 4, fontSize: 14, color: "#6b7280" }}>
                    {step === "destination" && "Passo 1: Cadastre as fotos e textos do destino"}
                    {step === "hotel" && "Passo 2: Cadastre as fotos do hotel"}
                    {step === "review" && "Passo 3: Revise e finalize"}
                </p>

                <div
                    style={{
                        marginTop: 16,
                        display: "flex",
                        gap: 8
                    }}
                >
                    <div
                        style={{
                            flex: 1,
                            height: 4,
                            borderRadius: 2,
                            background: "#09077d"
                        }}
                    />
                    <div
                        style={{
                            flex: 1,
                            height: 4,
                            borderRadius: 2,
                            background: step === "hotel" || step === "review" ? "#09077d" : "#e5e7eb"
                        }}
                    />
                    <div
                        style={{
                            flex: 1,
                            height: 4,
                            borderRadius: 2,
                            background: step === "review" ? "#09077d" : "#e5e7eb"
                        }}
                    />
                </div>
            </div>

            <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
                <div
                    style={{
                        padding: 16,
                        background: "#ecfdf5",
                        borderRadius: 12,
                        marginBottom: 20,
                        border: "1px solid #a7f3d0"
                    }}
                >
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#065f46" }}>
                        📋 Cotação para: {clientName}
                    </div>
                    <div style={{ fontSize: 13, color: "#065f46", marginTop: 4 }}>
                        📍 {extractedData?.destination} · 🏨 {extractedData?.hotel?.name} · 💰{" "}
                        {extractedData?.totalPrice}
                    </div>
                </div>

                {step === "destination" && (
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 16,
                            padding: 24,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                        }}
                    >
                        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                            📍 {extractedData?.destination}
                        </h2>

                        {destinationExists && (
                            <div
                                style={{
                                    marginTop: 12,
                                    padding: 12,
                                    background: "#fef3c7",
                                    borderRadius: 8,
                                    fontSize: 13,
                                    color: "#92400e"
                                }}
                            >
                                ✅ Destino já cadastrado! Você pode editar ou pular.
                            </div>
                        )}

                        <div style={{ marginTop: 20 }}>
                            <label
                                style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    display: "block",
                                    marginBottom: 6
                                }}
                            >
                                Foto principal do destino *
                            </label>
                            <input
                                type="text"
                                value={heroImageUrl}
                                onChange={(e) => setHeroImageUrl(e.target.value)}
                                placeholder="Cole a URL da foto (ex: https://images.unsplash.com/...)"
                                style={{
                                    width: "100%",
                                    padding: "10px 12px",
                                    borderRadius: 8,
                                    border: "1px solid #d1d5db",
                                    fontSize: 14,
                                    boxSizing: "border-box"
                                }}
                            />
                            {heroImageUrl && (
                                <img
                                    src={heroImageUrl}
                                    alt="Preview"
                                    style={{
                                        marginTop: 8,
                                        width: "100%",
                                        height: 150,
                                        objectFit: "cover",
                                        borderRadius: 8
                                    }}
                                    onError={(e) => (e.currentTarget.style.display = "none")}
                                />
                            )}
                        </div>

                        <div style={{ marginTop: 16 }}>
                            <label
                                style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    display: "block",
                                    marginBottom: 6
                                }}
                            >
                                Texto principal (headline)
                            </label>
                            <textarea
                                value={heroHeadline}
                                onChange={(e) => setHeroHeadline(e.target.value)}
                                rows={2}
                                style={{
                                    width: "100%",
                                    padding: "10px 12px",
                                    borderRadius: 8,
                                    border: "1px solid #d1d5db",
                                    fontSize: 14,
                                    resize: "none",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>

                        <div style={{ marginTop: 16 }}>
                            <label
                                style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    display: "block",
                                    marginBottom: 6
                                }}
                            >
                                Texto secundário
                            </label>
                            <textarea
                                value={heroSubtext}
                                onChange={(e) => setHeroSubtext(e.target.value)}
                                rows={2}
                                style={{
                                    width: "100%",
                                    padding: "10px 12px",
                                    borderRadius: 8,
                                    border: "1px solid #d1d5db",
                                    fontSize: 14,
                                    resize: "none",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>

                        {/* Experiências */}
                        <div style={{ marginTop: 20 }}>
                            <label
                                style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    display: "block",
                                    marginBottom: 10
                                }}
                            >
                                Experiências do destino (URLs das fotos)
                            </label>
                            <p style={{ margin: 0, marginBottom: 12, fontSize: 12, color: "#6b7280" }}>
                                💡 Dica: busque no Google Imagens pelo termo sugerido
                            </p>

                            {experiences.map((exp, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        marginBottom: 12,
                                        padding: 12,
                                        background: "#f9fafb",
                                        borderRadius: 8,
                                        border: "1px solid #e5e7eb"
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                        <input
                                            type="text"
                                            value={exp.icon}
                                            onChange={(e) => updateExperience(idx, "icon", e.target.value)}
                                            style={{
                                                width: 40,
                                                padding: "6px",
                                                borderRadius: 6,
                                                border: "1px solid #d1d5db",
                                                fontSize: 18,
                                                textAlign: "center"
                                            }}
                                        />
                                        <input
                                            type="text"
                                            value={exp.title}
                                            onChange={(e) => updateExperience(idx, "title", e.target.value)}
                                            placeholder="Nome da experiência"
                                            style={{
                                                flex: 1,
                                                padding: "8px 10px",
                                                borderRadius: 6,
                                                border: "1px solid #d1d5db",
                                                fontSize: 14,
                                                fontWeight: 600
                                            }}
                                        />
                                        <button
                                            onClick={() => {
                                                const updated = experiences.filter((_, i) => i !== idx)
                                                setExperiences(updated)
                                            }}
                                            style={{
                                                padding: "6px 10px",
                                                borderRadius: 6,
                                                border: "1px solid #fca5a5",
                                                background: "#fef2f2",
                                                color: "#dc2626",
                                                fontSize: 12,
                                                cursor: "pointer"
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <input
                                        type="text"
                                        value={exp.subtitle}
                                        onChange={(e) => updateExperience(idx, "subtitle", e.target.value)}
                                        placeholder="Frase de impacto (gancho emocional)"
                                        style={{
                                            width: "100%",
                                            padding: "8px 10px",
                                            borderRadius: 6,
                                            border: "1px solid #d1d5db",
                                            fontSize: 13,
                                            marginBottom: 8,
                                            boxSizing: "border-box"
                                        }}
                                    />

                                    {/* ✅ NOVO: Campo de descrição */}
                                    <textarea
                                        value={exp.description || ""}
                                        onChange={(e) => updateExperience(idx, "description", e.target.value)}
                                        placeholder="Descrição (2-3 frases convidativas sobre a experiência)"
                                        rows={2}
                                        style={{
                                            width: "100%",
                                            padding: "8px 10px",
                                            borderRadius: 6,
                                            border: "1px solid #d1d5db",
                                            fontSize: 12,
                                            marginBottom: 8,
                                            boxSizing: "border-box",
                                            resize: "none"
                                        }}
                                    />

                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <input
                                            type="text"
                                            value={exp.imageUrl || ""}
                                            onChange={(e) => updateExperience(idx, "imageUrl", e.target.value)}
                                            placeholder="URL da foto"
                                            style={{
                                                flex: 1,
                                                padding: "8px 10px",
                                                borderRadius: 6,
                                                border: "1px solid #d1d5db",
                                                fontSize: 12
                                            }}
                                        />
                                        {exp.imageUrl && (
                                            <img
                                                src={exp.imageUrl}
                                                alt="Preview"
                                                style={{
                                                    width: 50,
                                                    height: 50,
                                                    objectFit: "cover",
                                                    borderRadius: 6
                                                }}
                                                onError={(e) => (e.currentTarget.style.display = "none")}
                                            />
                                        )}
                                    </div>

                                    {exp.searchTerm && (
                                        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>
                                            🔍 Buscar: "{exp.searchTerm}"
                                        </div>
                                    )}
                                </div>
                            ))}

                            <button
                                onClick={() => {
                                    setExperiences([
                                        ...experiences,
                                        {
                                            icon: "📍",
                                            title: "",
                                            subtitle: "",
                                            description: "",
                                            imageUrl: ""
                                        }
                                    ])
                                }}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    borderRadius: 8,
                                    border: "2px dashed #d1d5db",
                                    background: "#fff",
                                    color: "#6b7280",
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    marginTop: 8
                                }}
                            >
                                + Adicionar experiência
                            </button>
                        </div>

                        {error && (
                            <div
                                style={{
                                    marginTop: 16,
                                    padding: 12,
                                    background: "#fee2e2",
                                    borderRadius: 8,
                                    fontSize: 13,
                                    color: "#dc2626"
                                }}
                            >
                                {error}
                            </div>
                        )}

                        <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
                            {destinationExists && (
                                <button
                                    onClick={() => setStep("hotel")}
                                    style={{
                                        padding: "12px 20px",
                                        borderRadius: 10,
                                        border: "1px solid #d1d5db",
                                        background: "#fff",
                                        fontSize: 14,
                                        fontWeight: 600,
                                        cursor: "pointer"
                                    }}
                                >
                                    Pular
                                </button>
                            )}
                            <button
                                onClick={handleSaveDestination}
                                disabled={saving}
                                style={{
                                    flex: 1,
                                    padding: "12px 20px",
                                    borderRadius: 10,
                                    border: "none",
                                    background: saving ? "#9ca3af" : "#09077d",
                                    color: "#fff",
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: saving ? "not-allowed" : "pointer"
                                }}
                            >
                                {saving ? "Salvando..." : "Salvar e Continuar"}
                            </button>
                        </div>
                    </div>
                )}

                {step === "hotel" && (
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 16,
                            padding: 24,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                        }}
                    >
                        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                            🏨 {extractedData?.hotel?.name}
                        </h2>
                        <p style={{ margin: 0, marginTop: 4, fontSize: 13, color: "#6b7280" }}>
                            {extractedData?.hotel?.stars && "★".repeat(extractedData.hotel.stars)} ·{" "}
                            {extractedData?.hotel?.address}
                        </p>

                        {hotelExists && (
                            <div
                                style={{
                                    marginTop: 12,
                                    padding: 12,
                                    background: "#fef3c7",
                                    borderRadius: 8,
                                    fontSize: 13,
                                    color: "#92400e"
                                }}
                            >
                                ✅ Hotel já cadastrado! Você pode editar ou pular.
                            </div>
                        )}

                        <div style={{ marginTop: 20 }}>
                            <label
                                style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    display: "block",
                                    marginBottom: 6
                                }}
                            >
                                Descrição do hotel (cole do Booking/TripAdvisor)
                            </label>
                            <textarea
                                value={hotelDescription}
                                onChange={(e) => setHotelDescription(e.target.value)}
                                rows={4}
                                placeholder="Cole aqui a descrição do hotel..."
                                style={{
                                    width: "100%",
                                    padding: "10px 12px",
                                    borderRadius: 8,
                                    border: "1px solid #d1d5db",
                                    fontSize: 14,
                                    resize: "none",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>

                        <div style={{ marginTop: 16 }}>
                            <label
                                style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    display: "block",
                                    marginBottom: 10
                                }}
                            >
                                Fotos do hotel (URLs) *
                            </label>

                            {hotelImageUrls.map((url, idx) => (
                                <div key={idx} style={{ marginBottom: 8 }}>
                                    <input
                                        type="text"
                                        value={url}
                                        onChange={(e) => updateHotelImageUrl(idx, e.target.value)}
                                        placeholder={`URL da foto ${idx + 1}`}
                                        style={{
                                            width: "100%",
                                            padding: "10px 12px",
                                            borderRadius: 8,
                                            border: "1px solid #d1d5db",
                                            fontSize: 14,
                                            boxSizing: "border-box"
                                        }}
                                    />
                                    {url && (
                                        <img
                                            src={url}
                                            alt={`Preview ${idx + 1}`}
                                            style={{
                                                marginTop: 4,
                                                width: 100,
                                                height: 60,
                                                objectFit: "cover",
                                                borderRadius: 4
                                            }}
                                            onError={(e) => (e.currentTarget.style.display = "none")}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {error && (
                            <div
                                style={{
                                    marginTop: 16,
                                    padding: 12,
                                    background: "#fee2e2",
                                    borderRadius: 8,
                                    fontSize: 13,
                                    color: "#dc2626"
                                }}
                            >
                                {error}
                            </div>
                        )}

                        <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
                            <button
                                onClick={() => setStep("destination")}
                                style={{
                                    padding: "12px 20px",
                                    borderRadius: 10,
                                    border: "1px solid #d1d5db",
                                    background: "#fff",
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: "pointer"
                                }}
                            >
                                Voltar
                            </button>
                            {hotelExists && (
                                <button
                                    onClick={() => setStep("review")}
                                    style={{
                                        padding: "12px 20px",
                                        borderRadius: 10,
                                        border: "1px solid #d1d5db",
                                        background: "#fff",
                                        fontSize: 14,
                                        fontWeight: 600,
                                        cursor: "pointer"
                                    }}
                                >
                                    Pular
                                </button>
                            )}
                            <button
                                onClick={handleSaveHotel}
                                disabled={saving}
                                style={{
                                    flex: 1,
                                    padding: "12px 20px",
                                    borderRadius: 10,
                                    border: "none",
                                    background: saving ? "#9ca3af" : "#09077d",
                                    color: "#fff",
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: saving ? "not-allowed" : "pointer"
                                }}
                            >
                                {saving ? "Salvando..." : "Salvar e Continuar"}
                            </button>
                        </div>
                    </div>
                )}

                {step === "review" && (
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 16,
                            padding: 24,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                        }}
                    >
                        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>✅ Template configurado!</h2>
                        <p style={{ margin: 0, marginTop: 8, fontSize: 14, color: "#6b7280" }}>
                            Agora você pode criar a cotação para {clientName}.
                        </p>

                        <div
                            style={{
                                marginTop: 20,
                                padding: 16,
                                background: "#f9fafb",
                                borderRadius: 12
                            }}
                        >
                            <div style={{ fontSize: 14, lineHeight: 1.8 }}>
                                <div>
                                    📍 <strong>Destino:</strong> {extractedData?.destination}
                                </div>
                                <div>
                                    🏨 <strong>Hotel:</strong> {extractedData?.hotel?.name}
                                </div>
                                <div>
                                    📅 <strong>Período:</strong> {extractedData?.travelDate} -{" "}
                                    {extractedData?.returnDate}
                                </div>
                                <div>
                                    👥 <strong>Passageiros:</strong> {extractedData?.passengers}
                                </div>
                                <div style={{ marginTop: 8 }}>
                                    💰 <strong>Total:</strong>{" "}
                                    <span style={{ color: "#059669", fontWeight: 700, fontSize: 18 }}>
                                        {extractedData?.totalPrice}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div
                                style={{
                                    marginTop: 16,
                                    padding: 12,
                                    background: "#fee2e2",
                                    borderRadius: 8,
                                    fontSize: 13,
                                    color: "#dc2626"
                                }}
                            >
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleFinish}
                            disabled={saving}
                            style={{
                                marginTop: 24,
                                width: "100%",
                                padding: "14px 20px",
                                borderRadius: 12,
                                border: "none",
                                background: saving ? "#9ca3af" : "#50cfad",
                                color: "#fff",
                                fontSize: 16,
                                fontWeight: 700,
                                cursor: saving ? "not-allowed" : "pointer"
                            }}
                        >
                            {saving ? "Criando..." : "Criar Cotação e Gerar Link"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}