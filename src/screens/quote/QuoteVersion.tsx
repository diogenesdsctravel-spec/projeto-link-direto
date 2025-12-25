/**
 * QUOTE VERSION - ORQUESTRADOR DE TELAS DA COTAÇÃO
 * 
 * Fluxo completo:
 * 1. Brief (3 telas DSC)
 * 2. Hero (introdução do destino)
 * 3. Hotel (carrossel de fotos)
 * 4. Experiências (carrossel)
 * 5. Voo de Ida (overview + detalhes)
 * 6. Transfer Ida (se houver)
 * 7. Transfer Volta (se houver)
 * 8. Voo de Volta (overview + detalhes)
 * 9. Orçamento (resumo e pagamento)
 */

import { useParams } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import type { DestinationTemplate } from "../../types/destinationTemplate"
import type { ExtractedQuoteData } from "../../types/extractedQuoteData"
import { repositories } from "../../services/repositories"
import { quoteRepository, type Quote } from "../../services/hybridQuoteRepository"
import { generateDynamicTemplateAsync, hasExtractedData } from "../../services/dynamicTemplateGenerator"
import { getAgencyProfile, type AgencyProfile } from "../../services/agencyService"
import styles from "./components/QuoteVersion.module.css"

// Componentes de Brief
import BriefScreen1 from "./components/BriefScreen1"
import BriefScreen2 from "./components/BriefScreen2"
import BriefScreen3 from "./components/BriefScreen3"

// Componentes de Destino
import HeroScreen from "./components/HeroScreen"
import HotelScreen from "./components/HotelScreen"
import ExperienceScreen from "./components/ExperienceScreen"

// Componentes de Voo (novos - dinâmicos)
import { TripDetailsContent } from "./components/TripDetailsContent"
import { FlightDetailsScreen } from "./components/FlightDetailsScreen"
import { ReturnFlightOverview } from "./components/ReturnFlightOverview"
import { ReturnFlightDetailsScreen } from "./components/ReturnFlightDetailsScreen"

// Componentes de Transfer (novos - dinâmicos)
import { TransferCard } from "./components/TransferCard"
import { TransferDetails } from "./components/TransferDetails"

// Componente de Orçamento (novo - dinâmico)
import { BudgetScreen } from "./components/BudgetScreen"

// Tipos de tela para navegação
type ScreenType =
    | 'brief1' | 'brief2' | 'brief3'
    | 'hero' | 'hotel' | 'experiences'
    | 'flight-outbound-overview' | 'flight-outbound-details'
    | 'transfer-outbound-card' | 'transfer-outbound-details'
    | 'transfer-return-card' | 'transfer-return-details'
    | 'flight-return-overview' | 'flight-return-details'
    | 'budget'

export default function QuoteVersion() {
    const { publicId = "", versionId = "" } = useParams()

    const [quote, setQuote] = useState<Quote | null>(null)
    const [template, setTemplate] = useState<DestinationTemplate | null>(null)
    const [agency, setAgency] = useState<AgencyProfile | null>(null)
    const [extractedData, setExtractedData] = useState<ExtractedQuoteData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // Estado para navegação entre telas de detalhes (modais/overlays)
    const [activeScreen, setActiveScreen] = useState<ScreenType | null>(null)

    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        loadData()
    }, [publicId])

    async function loadData() {
        setLoading(true)
        setError("")

        try {
            const [agencyData, foundQuote] = await Promise.all([
                getAgencyProfile(),
                quoteRepository.getByPublicId(publicId)
            ])

            setAgency(agencyData)

            if (foundQuote) {
                setQuote(foundQuote)

                if (hasExtractedData(foundQuote)) {
                    const quoteExtractedData = (foundQuote as any).extractedData as ExtractedQuoteData
                    setExtractedData(quoteExtractedData)

                    const dynamicTemplate = await generateDynamicTemplateAsync(
                        foundQuote.clientName,
                        quoteExtractedData
                    )
                    setTemplate(dynamicTemplate)
                } else {
                    const mockTemplate = await repositories.destinationTemplateRepository.getByDestinationKey(
                        foundQuote.destinationKey
                    )
                    setTemplate(mockTemplate)
                }
            } else {
                setError("Cotação não encontrada")
            }
        } catch (err) {
            console.error("Erro:", err)
            setError("Erro ao carregar cotação")
        }

        setLoading(false)
    }

    // Funções de navegação
    const goToScreen = (screen: ScreenType) => setActiveScreen(screen)
    const goBack = () => setActiveScreen(null)

    // Loading state
    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingContent}>
                    <div className={styles.spinner}></div>
                    <p className={styles.loadingText}>Preparando sua experiência...</p>
                </div>
            </div>
        )
    }

    // Error state
    if (error || !quote || !template || !agency) {
        return (
            <div className={styles.errorContainer}>
                <p>{error || "Cotação não encontrada."}</p>
            </div>
        )
    }

    // Extrair dados
    const destination = extractedData?.destination || template.destinationName || "Destino"
    const origin = extractedData?.origin || "São Paulo"
    const nights = extractedData?.hotel?.nights || extractedData?.totalNights || 7
    const experiences = template.experiences || []

    // Telas do template
    const heroScreen = template.screens.find(s => s.type === "hero")
    const hotelScreen = template.screens.find(s => s.type === "hotel")

    // Dados de voo e bagagem (com fallbacks)
    const outboundFlight = extractedData?.outboundFlight
    const returnFlight = extractedData?.returnFlight
    const outboundBaggage = extractedData?.outboundBaggage || {
        personalItem: { type: "personal" as const, description: "1 item", included: true },
        carryOn: { type: "carryOn" as const, description: "10kg", weight: "10kg", included: true },
        checked: { type: "checked" as const, description: "23kg", weight: "23kg", included: false }
    }
    const returnBaggage = extractedData?.returnBaggage || outboundBaggage

    // Dados de transfer (com fallbacks)
    const transferOutbound = extractedData?.transfers?.outbound || {
        included: false,
        from: `Aeroporto de ${destination}`,
        to: "Hotel"
    }
    const transferReturn = extractedData?.transfers?.return || {
        included: false,
        from: "Hotel",
        to: `Aeroporto de ${destination}`
    }

    // ========================================
    // RENDERIZAÇÃO DE TELAS DE DETALHE (OVERLAY)
    // ========================================

    // Tela de detalhes do voo de ida
    if (activeScreen === 'flight-outbound-details' && outboundFlight) {
        return (
            <FlightDetailsScreen
                flight={outboundFlight}
                baggage={outboundBaggage}
                origin={origin}
                destination={destination}
                onBack={goBack}
                onViewReturn={() => goToScreen('flight-return-overview')}
            />
        )
    }

    // Tela de detalhes do transfer de ida
    if (activeScreen === 'transfer-outbound-details') {
        return (
            <TransferDetails
                type="outbound"
                transfer={transferOutbound}
                onBack={goBack}
            />
        )
    }

    // Tela de detalhes do transfer de volta
    if (activeScreen === 'transfer-return-details') {
        return (
            <TransferDetails
                type="return"
                transfer={transferReturn}
                onBack={goBack}
            />
        )
    }

    // Tela de overview do voo de volta
    if (activeScreen === 'flight-return-overview' && returnFlight) {
        return (
            <ReturnFlightOverview
                destination={destination}
                origin={origin}
                flight={returnFlight}
                baggage={returnBaggage}
                returnDate={extractedData?.returnDate || ""}
                onViewDetails={() => goToScreen('flight-return-details')}
                onBack={goBack}
            />
        )
    }

    // Tela de detalhes do voo de volta
    if (activeScreen === 'flight-return-details' && returnFlight) {
        return (
            <ReturnFlightDetailsScreen
                flight={returnFlight}
                baggage={returnBaggage}
                origin={origin}
                destination={destination}
                onBack={() => goToScreen('flight-return-overview')}
                onViewBudget={() => goToScreen('budget')}
            />
        )
    }

    // Tela de orçamento
    if (activeScreen === 'budget' && extractedData) {
        return (
            <BudgetScreen
                data={extractedData}
                clientName={quote.clientName}
                onBack={goBack}
                onConfirm={() => {
                    // TODO: Implementar ação de confirmação
                    alert("Funcionalidade de pagamento em desenvolvimento!")
                }}
            />
        )
    }

    // ========================================
    // RENDERIZAÇÃO PRINCIPAL (SCROLL SNAP)
    // ========================================

    return (
        <div ref={containerRef} id="quote-container" className={styles.container}>
            {/* BRIEF: 3 TELAS DA DSC */}
            <BriefScreen1 agency={agency} clientName={quote.clientName} />
            <BriefScreen2 agency={agency} />
            <BriefScreen3 agency={agency} />

            {/* HERO: TELA DE INTRODUÇÃO DO DESTINO */}
            {heroScreen && (
                <HeroScreen screen={heroScreen} />
            )}

            {/* HOTEL: TELA DO HOTEL COM CARROSSEL */}
            {hotelScreen && (
                <HotelScreen
                    screen={hotelScreen}
                    destination={destination}
                    nights={nights}
                />
            )}

            {/* EXPERIÊNCIAS: CARROSSEL DE EXPERIÊNCIAS */}
            {experiences.length > 0 && (
                <ExperienceScreen
                    experiences={experiences}
                    destination={destination}
                />
            )}

            {/* VOO DE IDA: OVERVIEW */}
            {outboundFlight && (
                <div className={styles.screenSnap}>
                    <TripDetailsContent
                        destination={destination}
                        flight={outboundFlight}
                        baggage={outboundBaggage}
                        travelDate={extractedData?.travelDate || ""}
                        onViewDetails={() => goToScreen('flight-outbound-details')}
                    />
                </div>
            )}

            {/* TRANSFER DE IDA: CARD */}
            <div className={styles.screenSnap}>
                <TransferCard
                    type="outbound"
                    transfer={transferOutbound}
                    destination={destination}
                    onViewDetails={() => goToScreen('transfer-outbound-details')}
                />
            </div>

            {/* TRANSFER DE VOLTA: CARD */}
            <div className={styles.screenSnap}>
                <TransferCard
                    type="return"
                    transfer={transferReturn}
                    destination={destination}
                    onViewDetails={() => goToScreen('transfer-return-details')}
                />
            </div>

            {/* VOO DE VOLTA: OVERVIEW */}
            {returnFlight && (
                <div className={styles.screenSnap}>
                    <ReturnFlightOverview
                        destination={destination}
                        origin={origin}
                        flight={returnFlight}
                        baggage={returnBaggage}
                        returnDate={extractedData?.returnDate || ""}
                        onViewDetails={() => goToScreen('flight-return-details')}
                        onBack={() => { }}
                    />
                </div>
            )}

            {/* ORÇAMENTO: RESUMO E PAGAMENTO */}
            {extractedData && (
                <div className={styles.screenSnap}>
                    <BudgetScreen
                        data={extractedData}
                        clientName={quote.clientName}
                        onBack={() => { }}
                        onConfirm={() => {
                            alert("Funcionalidade de pagamento em desenvolvimento!")
                        }}
                    />
                </div>
            )}
        </div>
    )
}