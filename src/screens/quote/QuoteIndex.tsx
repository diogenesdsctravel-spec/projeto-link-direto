import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { applyHeadMeta } from "../../services/headMeta"
import { quoteRepository, type Quote } from "../../services/hybridQuoteRepository"
import { getDestinationByKey, type Destination } from "../../services/destinationService"
import { hasExtractedData } from "../../services/dynamicTemplateGenerator"
import logo from "../../assets/logo_dsc_travel.png"

/**
 * QUOTE INDEX - TELA HERO IMERSIVA
 * 
 * Primeira tela que o cliente vê ao abrir o link da cotação.
 * Layout full-screen com foto do destino e CTA para ver o roteiro.
 * 
 * 🎬 ANIMAÇÕES:
 * - Background: zoom sutil de entrada
 * - Logo: fade in de cima
 * - Chips: fade in com stagger
 * - Título: fade in de baixo
 * - Subtítulo: fade in de baixo (delay)
 * - Botão: fade in de baixo (delay maior) + hover/tap effects
 */

// Variantes de animação - SUAVES E LENTAS (estilo Figma/Apple)
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.6
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1] // cubic-bezier suave
        }
    }
}

const logoVariants = {
    hidden: { opacity: 0, y: -15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 1,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0.2
        }
    }
}

const chipVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.7,
            ease: [0.25, 0.1, 0.25, 1]
        }
    }
}

export default function QuoteIndex() {
    const { publicId = "" } = useParams()
    const navigate = useNavigate()

    const [quote, setQuote] = useState<Quote | null>(null)
    const [destination, setDestination] = useState<Destination | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        loadData()
    }, [publicId])

    async function loadData() {
        setLoading(true)
        setError("")

        try {
            console.log("🔍 Buscando cotação:", publicId)

            // Buscar cotação
            const foundQuote = await quoteRepository.getByPublicId(publicId)

            if (!foundQuote) {
                console.warn("❌ Cotação não encontrada")
                setError("Cotação não encontrada ou expirada.")
                setLoading(false)
                return
            }

            console.log("✅ Cotação encontrada:", foundQuote)
            setQuote(foundQuote)

            // Atualizar meta tags
            applyHeadMeta({
                title: `Cotação para ${foundQuote.clientName} – DSC Travel`,
                ogTitle: "Sua viagem dos sonhos te espera",
                ogDescription: "Uma experiência criada sob medida para você",
                ogImage: "https://images.unsplash.com/photo-1612294037637-ec328d0e075e",
            })

            // Buscar destino do banco para pegar coverImageUrl
            if (hasExtractedData(foundQuote)) {
                const extractedData = (foundQuote as any).extractedData
                const destinationKey = extractedData.destination
                    ?.toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/\s+/g, "-")

                if (destinationKey) {
                    console.log("🔍 Buscando destino:", destinationKey)
                    const foundDestination = await getDestinationByKey(destinationKey)
                    if (foundDestination) {
                        console.log("✅ Destino encontrado:", foundDestination)
                        setDestination(foundDestination)

                        // Atualizar og:image com a foto de capa
                        if (foundDestination.coverImageUrl) {
                            applyHeadMeta({
                                title: `Cotação para ${foundQuote.clientName} – DSC Travel`,
                                ogTitle: `Sua viagem dos sonhos em ${extractedData.destination}`,
                                ogDescription: foundDestination.coverSubtitle || "Uma experiência criada sob medida para você",
                                ogImage: foundDestination.coverImageUrl,
                            })
                        }
                    }
                }
            }

        } catch (err) {
            console.error("Erro ao carregar cotação:", err)
            setError("Erro ao carregar cotação. Tente novamente.")
        }

        setLoading(false)
    }

    function handleViewItinerary() {
        if (!quote || quote.versions.length === 0) return

        const firstVersion = quote.versions[0]
        navigate(`/q/${quote.publicId}/v/${firstVersion.versionId}`)
    }

    // Loading state
    if (loading) {
        return (
            <div
                style={{
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "system-ui",
                    background: "#09077d",
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <motion.div
                        style={{
                            width: 40,
                            height: 40,
                            border: "3px solid rgba(255,255,255,0.2)",
                            borderTopColor: "#50cfad",
                            borderRadius: "50%",
                            margin: "0 auto",
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <p style={{ marginTop: 16, color: "rgba(255,255,255,0.7)" }}>
                        Preparando sua experiência...
                    </p>
                </div>
            </div>
        )
    }

    // Error state
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

    // No quote state
    if (!quote) {
        return (
            <div style={{ padding: 24, fontFamily: "system-ui" }}>
                <p>Cotação não encontrada.</p>
            </div>
        )
    }

    // Extrair dados
    const extractedData = (quote as any).extractedData
    const clientName = quote.clientName
    const destinationName = extractedData?.destination || quote.destinationKey
    const totalNights = extractedData?.totalNights || extractedData?.hotel?.nights || 5
    const totalDays = totalNights + 1

    // Foto de capa: prioriza do banco, fallback para hero, fallback para genérica
    const coverImage = destination?.coverImageUrl
        || destination?.heroImageUrl
        || "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=1200"

    // Subtítulo: prioriza do banco, fallback genérico
    const coverSubtitle = destination?.coverSubtitle
        || `Experiências incríveis em ${destinationName}, com cada detalhe pensado para você`

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Inter', system-ui, sans-serif",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Background Image com zoom sutil */}
            <motion.div
                initial={{ scale: 1.05, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${coverImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    zIndex: 0,
                }}
            >
                {/* Gradiente para legibilidade */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "linear-gradient(to bottom, rgba(9, 7, 125, 0.4) 0%, transparent 30%, rgba(9, 7, 125, 0.95) 100%)",
                    }}
                />
            </motion.div>

            {/* Logo no topo */}
            <motion.div
                variants={logoVariants}
                initial="hidden"
                animate="visible"
                style={{
                    position: "relative",
                    zIndex: 10,
                    paddingTop: 16,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <img
                    src={logo}
                    alt="DSC Travel"
                    style={{
                        height: 110,
                        objectFit: "contain",
                    }}
                />
            </motion.div>

            {/* Conteúdo principal */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{
                    position: "relative",
                    zIndex: 10,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: 24,
                    paddingBottom: 32,
                }}
            >
                {/* Chips */}
                <motion.div
                    variants={itemVariants}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 16,
                    }}
                >
                    {/* Chip: Roteiro exclusivo */}
                    <motion.div
                        variants={chipVariants}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "10px 16px",
                            borderRadius: 50,
                            background: "rgba(255, 255, 255, 0.2)",
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#50cfad"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span style={{ color: "#ffffff", fontSize: 14, fontWeight: 500 }}>
                            Roteiro exclusivo
                        </span>
                    </motion.div>

                    {/* Chip: X dias */}
                    <motion.div
                        variants={chipVariants}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "10px 16px",
                            borderRadius: 50,
                            background: "rgba(255, 255, 255, 0.2)",
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#50cfad"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span style={{ color: "#ffffff", fontSize: 14, fontWeight: 500 }}>
                            {totalDays} dias
                        </span>
                    </motion.div>
                </motion.div>

                {/* 1️⃣ Nome do cliente - 48px, Semibold, branco */}
                <motion.h1
                    variants={itemVariants}
                    style={{
                        margin: 0,
                        fontSize: 48,
                        fontWeight: 600,
                        color: "#ffffff",
                        lineHeight: 1.1,
                    }}
                >
                    {clientName},
                </motion.h1>

                {/* 2️⃣ Texto secundário - 28px, Regular, branco suavizado */}
                <motion.p
                    variants={itemVariants}
                    style={{
                        margin: 0,
                        marginTop: 12,
                        fontSize: 28,
                        fontWeight: 400,
                        color: "rgba(255, 255, 255, 0.85)",
                        lineHeight: 1.4,
                    }}
                >
                    sua viagem para <span style={{ fontWeight: 500, color: "rgba(255, 255, 255, 0.95)" }}>{destinationName}</span> começa aqui
                </motion.p>

                {/* 3️⃣ Subtítulo/descrição */}
                <motion.p
                    variants={itemVariants}
                    style={{
                        margin: 0,
                        marginTop: 16,
                        fontSize: 16,
                        color: "rgba(255, 255, 255, 0.8)",
                        lineHeight: 1.5,
                    }}
                >
                    {coverSubtitle}
                </motion.p>

                {/* Botão CTA */}
                <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
                    whileTap={{ scale: 0.99, transition: { duration: 0.1 } }}
                    onClick={handleViewItinerary}
                    disabled={quote.versions.length === 0}
                    style={{
                        marginTop: 24,
                        width: "100%",
                        padding: "18px 24px",
                        borderRadius: 16,
                        border: "none",
                        background: "#50cfad",
                        color: "#09077d",
                        fontSize: 16,
                        fontWeight: 600,
                        cursor: quote.versions.length === 0 ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        boxShadow: "0 4px 20px rgba(80, 207, 173, 0.3)",
                    }}
                >
                    <span>Ver roteiro completo</span>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </motion.button>
            </motion.div>
        </div>
    )
}