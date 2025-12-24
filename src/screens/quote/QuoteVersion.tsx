import { useParams } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import type { DestinationTemplate, ScreenTemplate } from "../../types/destinationTemplate"
import { repositories } from "../../services/repositories"
import { quoteRepository, type Quote } from "../../services/hybridQuoteRepository"
import { generateDynamicTemplateAsync, hasExtractedData } from "../../services/dynamicTemplateGenerator"
import { getAgencyProfile, type AgencyProfile } from "../../services/agencyService"
import IncludedBadge from "../../components/IncludedBadge"
import HotelCarousel from "../../components/HotelCarousel"

/**
 * QUOTE VERSION - COM AGENCY BRIEF
 * 
 * Estrutura:
 * - 3 telas do brief da DSC (conexão, estrutura, confiança)
 * - N telas do destino (hero, hotel, experiências, voos, resumo)
 */

// Número de telas do brief
const BRIEF_SCREENS_COUNT = 3

export default function QuoteVersion() {
    const { publicId = "", versionId = "" } = useParams()

    const [quote, setQuote] = useState<Quote | null>(null)
    const [template, setTemplate] = useState<DestinationTemplate | null>(null)
    const [agency, setAgency] = useState<AgencyProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [error, setError] = useState("")

    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        loadData()
    }, [publicId])

    async function loadData() {
        setLoading(true)
        setError("")

        try {
            // Carregar agência e cotação em paralelo
            const [agencyData, foundQuote] = await Promise.all([
                getAgencyProfile(),
                quoteRepository.getByPublicId(publicId)
            ])

            setAgency(agencyData)

            if (foundQuote) {
                console.log("✅ Cotação encontrada:", foundQuote)
                setQuote(foundQuote)

                // Verificar se tem dados extraídos
                if (hasExtractedData(foundQuote)) {
                    console.log("✨ Gerando template dinâmico")
                    const dynamicTemplate = await generateDynamicTemplateAsync(
                        foundQuote.clientName,
                        (foundQuote as any).extractedData
                    )
                    setTemplate(dynamicTemplate)
                } else {
                    console.log("📦 Usando template padrão")
                    const mockTemplate = await repositories.destinationTemplateRepository.getByDestinationKey(foundQuote.destinationKey)
                    setTemplate(mockTemplate)
                }
            } else {
                console.warn("❌ Cotação não encontrada")
                setError("Cotação não encontrada")
            }
        } catch (err) {
            console.error("Erro:", err)
            setError("Erro ao carregar cotação")
        }

        setLoading(false)
    }

    // Scroll snap handler
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const handleScroll = () => {
            const scrollTop = container.scrollTop
            const screenHeight = container.clientHeight
            const newIndex = Math.round(scrollTop / screenHeight)
            setCurrentIndex(newIndex)
        }

        container.addEventListener("scroll", handleScroll)
        return () => container.removeEventListener("scroll", handleScroll)
    }, [])

    if (loading) {
        return (
            <div style={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "system-ui",
                background: "#09077d"
            }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{
                        width: 40,
                        height: 40,
                        border: "3px solid rgba(255,255,255,0.2)",
                        borderTopColor: "#50cfad",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                        margin: "0 auto"
                    }}></div>
                    <p style={{ marginTop: 16, color: "rgba(255,255,255,0.7)" }}>
                        Preparando sua experiência...
                    </p>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        )
    }

    if (error || !quote || !template || !agency) {
        return (
            <div style={{ padding: 24, fontFamily: "system-ui" }}>
                <p>{error || "Cotação não encontrada."}</p>
            </div>
        )
    }

    const destinationScreens = template.screens
    const totalScreens = BRIEF_SCREENS_COUNT + destinationScreens.length

    return (
        <div
            ref={containerRef}
            style={{
                height: "100vh",
                overflowY: "scroll",
                scrollSnapType: "y mandatory",
                scrollBehavior: "smooth",
            }}
        >
            {/* BRIEF: 3 TELAS DA DSC */}
            <BriefScreen1
                agency={agency}
                clientName={quote.clientName}
                index={0}
                total={totalScreens}
            />
            <BriefScreen2
                agency={agency}
                index={1}
                total={totalScreens}
            />
            <BriefScreen3
                agency={agency}
                index={2}
                total={totalScreens}
            />

            {/* DESTINO: N TELAS */}
            {destinationScreens.map((screen, index) => (
                <ScreenView
                    key={screen.screenId}
                    screen={screen}
                    index={BRIEF_SCREENS_COUNT + index}
                    total={totalScreens}
                    isActive={currentIndex === BRIEF_SCREENS_COUNT + index}
                />
            ))}
        </div>
    )
}

/**
 * BRIEF TELA 1: CONEXÃO PESSOAL
 */
function BriefScreen1({
    agency,
    clientName,
    index,
    total
}: {
    agency: AgencyProfile
    clientName: string
    index: number
    total: number
}) {
    return (
        <div
            style={{
                height: "100vh",
                scrollSnapAlign: "start",
                position: "relative",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Background */}
            {agency.ownerPhotoUrl ? (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url(${agency.ownerPhotoUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center top",
                        zIndex: 0,
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `linear-gradient(to bottom, 
                                rgba(9, 7, 125, 0.2) 0%, 
                                rgba(9, 7, 125, 0.6) 50%,
                                rgba(9, 7, 125, 0.95) 100%)`,
                        }}
                    />
                </div>
            ) : (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: agency.colorPrimary,
                        zIndex: 0,
                    }}
                />
            )}

            {/* Pagination */}
            <Pagination index={index} total={total} />

            {/* Conteúdo */}
            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: 24,
                    paddingBottom: 80,
                }}
            >
                <h1
                    style={{
                        margin: 0,
                        fontSize: 38,
                        fontWeight: 900,
                        color: "#ffffff",
                        lineHeight: 1.1,
                    }}
                >
                    Olá, {clientName}!
                </h1>

                <p
                    style={{
                        margin: 0,
                        marginTop: 20,
                        fontSize: 19,
                        color: "rgba(255,255,255,0.95)",
                        lineHeight: 1.5,
                    }}
                >
                    Sou {agency.ownerName}, da {agency.agencyName}.
                </p>

                <p
                    style={{
                        margin: 0,
                        marginTop: 8,
                        fontSize: 19,
                        color: "rgba(255,255,255,0.9)",
                        lineHeight: 1.5,
                    }}
                >
                    {agency.welcomeText}
                </p>

                <div
                    style={{
                        marginTop: 28,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    <span style={{ fontSize: 16 }}>📍</span>
                    <span style={{
                        fontSize: 15,
                        color: "rgba(255,255,255,0.7)",
                        fontWeight: 500,
                    }}>
                        {agency.city}
                    </span>
                </div>
            </div>

            <ScrollHint />
        </div>
    )
}

/**
 * BRIEF TELA 2: ESTRUTURA
 */
function BriefScreen2({
    agency,
    index,
    total
}: {
    agency: AgencyProfile
    index: number
    total: number
}) {
    const backgroundUrl = agency.storeFacadeUrl || agency.storeInteriorUrl

    return (
        <div
            style={{
                height: "100vh",
                scrollSnapAlign: "start",
                position: "relative",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Background */}
            {backgroundUrl ? (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url(${backgroundUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        zIndex: 0,
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `linear-gradient(to bottom, 
                                rgba(9, 7, 125, 0.3) 0%, 
                                rgba(9, 7, 125, 0.7) 50%,
                                rgba(9, 7, 125, 0.98) 100%)`,
                        }}
                    />
                </div>
            ) : (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: agency.colorPrimary,
                        zIndex: 0,
                    }}
                />
            )}

            {/* Pagination */}
            <Pagination index={index} total={total} />

            {/* Conteúdo */}
            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: 24,
                    paddingBottom: 80,
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        fontSize: 28,
                        fontWeight: 900,
                        color: "#ffffff",
                        lineHeight: 1.2,
                    }}
                >
                    Uma agência de verdade.
                </h2>

                <p
                    style={{
                        margin: 0,
                        marginTop: 8,
                        fontSize: 18,
                        color: "rgba(255,255,255,0.85)",
                        lineHeight: 1.4,
                    }}
                >
                    Com estrutura para cuidar da sua viagem.
                </p>

                <div
                    style={{
                        marginTop: 28,
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                    }}
                >
                    <CredentialItem
                        icon="🏢"
                        text="Loja física em Vitória da Conquista"
                        accent={agency.colorAccent}
                    />
                    <CredentialItem
                        icon="📅"
                        text={`${agency.yearsInBusiness} anos de mercado`}
                        accent={agency.colorAccent}
                    />
                    <CredentialItem
                        icon="💬"
                        text="Atendimento presencial ou online"
                        accent={agency.colorAccent}
                    />
                </div>
            </div>

            <ScrollHint />
        </div>
    )
}

/**
 * BRIEF TELA 3: PROVA SOCIAL
 */
function BriefScreen3({
    agency,
    index,
    total
}: {
    agency: AgencyProfile
    index: number
    total: number
}) {
    return (
        <div
            style={{
                height: "100vh",
                scrollSnapAlign: "start",
                position: "relative",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Background */}
            {agency.ownerServingPhotoUrl ? (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url(${agency.ownerServingPhotoUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        zIndex: 0,
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `linear-gradient(to bottom, 
                                rgba(9, 7, 125, 0.3) 0%, 
                                rgba(9, 7, 125, 0.75) 50%,
                                rgba(9, 7, 125, 0.98) 100%)`,
                        }}
                    />
                </div>
            ) : (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: agency.colorPrimary,
                        zIndex: 0,
                    }}
                />
            )}

            {/* Pagination */}
            <Pagination index={index} total={total} />

            {/* Conteúdo */}
            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: 24,
                    paddingBottom: 80,
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        fontSize: 26,
                        fontWeight: 900,
                        color: "#ffffff",
                        lineHeight: 1.2,
                    }}
                >
                    {agency.tagline}
                </h2>

                <div
                    style={{
                        marginTop: 24,
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                    }}
                >
                    {agency.differentials.map((diff, i) => (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                padding: "12px 16px",
                                borderRadius: 12,
                                background: "rgba(255,255,255,0.1)",
                                backdropFilter: "blur(10px)",
                            }}
                        >
                            <span style={{ fontSize: 20 }}>{diff.icon}</span>
                            <span style={{
                                fontSize: 15,
                                color: "#ffffff",
                                fontWeight: 500,
                            }}>
                                {diff.text}
                            </span>
                        </div>
                    ))}
                </div>

                <div
                    style={{
                        marginTop: 28,
                        padding: "16px 20px",
                        borderRadius: 16,
                        background: agency.colorAccent,
                        textAlign: "center",
                    }}
                >
                    <span style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#ffffff",
                    }}>
                        Veja a viagem que preparei para você ↓
                    </span>
                </div>
            </div>
        </div>
    )
}

/**
 * Renderiza uma tela do destino
 */
function ScreenView({
    screen,
    index,
    total,
    isActive
}: {
    screen: ScreenTemplate
    index: number
    total: number
    isActive: boolean
}) {
    const isHero = screen.type === "hero"
    const isHotel = screen.type === "hotel"
    const isExperiences = screen.type === "experiences"
    const isFlight = screen.type === "flight"
    const isSummary = screen.type === "summary"

    return (
        <div
            style={{
                height: "100vh",
                scrollSnapAlign: "start",
                position: "relative",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Background Image */}
            {screen.imageUrl && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url(${screen.imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        zIndex: 0,
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: isHero
                                ? "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)"
                                : "linear-gradient(to bottom, rgba(255,255,255,0.9) 50%, rgba(255,255,255,1) 100%)",
                        }}
                    />
                </div>
            )}

            {/* Pagination */}
            <Pagination index={index} total={total} light={isHero} />

            {/* Content */}
            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: isHero ? "flex-end" : "flex-start",
                    padding: 24,
                    paddingTop: isHero ? 24 : 60,
                    paddingBottom: 40,
                    overflowY: "auto",
                }}
            >
                {/* Badge */}
                {screen.includedStatus && !isHero && !isSummary && (
                    <div style={{ marginBottom: 12 }}>
                        <IncludedBadge status={screen.includedStatus} />
                    </div>
                )}

                {/* Title */}
                <h1
                    style={{
                        margin: 0,
                        fontSize: isHero ? 32 : 24,
                        fontWeight: 900,
                        color: isHero ? "#fff" : "#111827",
                        lineHeight: 1.2,
                    }}
                >
                    {screen.title}
                </h1>

                {/* Subtitle */}
                {screen.subtitle && (
                    <p
                        style={{
                            margin: 0,
                            marginTop: 8,
                            fontSize: isHero ? 18 : 16,
                            color: isHero ? "rgba(255,255,255,0.9)" : "#6b7280",
                            lineHeight: 1.4,
                        }}
                    >
                        {screen.subtitle}
                    </p>
                )}

                {/* Body */}
                {screen.body && (
                    <p
                        style={{
                            margin: 0,
                            marginTop: 16,
                            fontSize: 15,
                            color: isHero ? "rgba(255,255,255,0.85)" : "#374151",
                            lineHeight: 1.6,
                            whiteSpace: "pre-line",
                        }}
                    >
                        {screen.body}
                    </p>
                )}

                {/* Hotel Carousel */}
                {isHotel && screen.hotelCarouselImageUrls && (
                    <div style={{ marginTop: 20 }}>
                        <HotelCarousel imageUrls={screen.hotelCarouselImageUrls || []} />
                    </div>
                )}

                {/* Experiences Grid */}
                {isExperiences && (screen as any).experienceItems && (
                    <div
                        style={{
                            marginTop: 20,
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 12,
                        }}
                    >
                        {(screen as any).experienceItems.map((exp: any, i: number) => (
                            <div
                                key={i}
                                style={{
                                    padding: 14,
                                    borderRadius: 14,
                                    background: "#f9fafb",
                                    border: "1px solid #e5e7eb",
                                }}
                            >
                                <div style={{ fontSize: 24 }}>{exp.icon}</div>
                                <div style={{ marginTop: 8, fontWeight: 700, fontSize: 14 }}>{exp.title}</div>
                                <div style={{ marginTop: 4, fontSize: 12, color: "#6b7280" }}>{exp.subtitle}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Flight Card */}
                {isFlight && (screen as any).flightData && (
                    <FlightCard data={(screen as any).flightData} />
                )}

                {/* Summary Price */}
                {isSummary && (screen as any).totalPrice && (
                    <div
                        style={{
                            marginTop: 24,
                            padding: 20,
                            borderRadius: 16,
                            background: "#111827",
                            color: "#fff",
                            textAlign: "center",
                        }}
                    >
                        <div style={{ fontSize: 14, color: "#9ca3af" }}>Valor total</div>
                        <div style={{ marginTop: 8, fontSize: 32, fontWeight: 900 }}>
                            {(screen as any).totalPrice}
                        </div>
                        <div style={{ marginTop: 8, fontSize: 13, color: "#9ca3af" }}>
                            Parcelamos em até 10x sem juros
                        </div>
                    </div>
                )}
            </div>

            {/* Scroll hint */}
            {index < total - 1 && (
                <ScrollHint light={isHero} />
            )}
        </div>
    )
}

/**
 * Card de voo
 */
function FlightCard({ data }: { data: any }) {
    return (
        <div
            style={{
                marginTop: 20,
                padding: 16,
                borderRadius: 16,
                background: "#fff",
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
        >
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>
                {data.airline} · {data.flightNumber}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 28, fontWeight: 900, color: "#111827" }}>{data.departureTime}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{data.departureAirport}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{data.departureCity}</div>
                </div>

                <div style={{ flex: 1, padding: "0 16px", textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: "#6b7280" }}>{data.duration}</div>
                    <div style={{
                        height: 2,
                        background: "#e5e7eb",
                        margin: "8px 0",
                        position: "relative"
                    }}>
                        <div style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            fontSize: 16,
                        }}>
                            ✈️
                        </div>
                    </div>
                    {data.stops > 0 && (
                        <div style={{ fontSize: 11, color: "#f59e0b" }}>
                            {data.stops} parada{data.stops > 1 ? "s" : ""}
                        </div>
                    )}
                </div>

                <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 28, fontWeight: 900, color: "#111827" }}>{data.arrivalTime}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{data.arrivalAirport}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{data.arrivalCity}</div>
                </div>
            </div>

            <div style={{ marginTop: 12, fontSize: 13, color: "#6b7280", textAlign: "center" }}>
                {data.date}
            </div>
        </div>
    )
}

/**
 * Item de credencial
 */
function CredentialItem({
    icon,
    text,
    accent
}: {
    icon: string
    text: string
    accent: string
}) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
                style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                }}
            >
                {icon}
            </div>
            <span style={{ fontSize: 16, color: "#ffffff", fontWeight: 500 }}>
                {text}
            </span>
        </div>
    )
}

/**
 * Paginação
 */
function Pagination({
    index,
    total,
    light = false
}: {
    index: number
    total: number
    light?: boolean
}) {
    return (
        <div
            style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: light ? "rgba(0,0,0,0.5)" : "rgba(9,7,125,0.8)",
                color: "#fff",
                padding: "4px 10px",
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 600,
                zIndex: 10,
            }}
        >
            {index + 1}/{total}
        </div>
    )
}

/**
 * Indicador de scroll
 */
function ScrollHint({ light = false }: { light?: boolean }) {
    return (
        <div
            style={{
                position: "absolute",
                bottom: 24,
                left: "50%",
                transform: "translateX(-50%)",
                color: light ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.5)",
                fontSize: 12,
                textAlign: "center",
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
            }}
        >
            <span>Deslize para continuar</span>
            <span style={{ fontSize: 16 }}>↓</span>
        </div>
    )
}
