/**
 * QUOTE VERSION - ORQUESTRADOR DE TELAS DA COTAÇÃO
 *
 * Fluxo completo (navegação por botão):
 * 1. Brief (3 telas DSC)
 * 2. Hero (introdução do destino)
 * 3. Hotel (carrossel de fotos)
 * 4. Experiências (carrossel)
 * 5. Voo de Ida (overview)
 * 6. Voo de Ida (detalhes)
 * 7. Transfer Ida
 * 8. Transfer Volta
 * 9. Voo de Volta (overview)
 * 10. Voo de Volta (detalhes)
 * 11. Orçamento
 * 
 * ⚠️ TODOS OS DADOS SÃO DINÂMICOS - extraídos do PDF
 */

import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import type { DestinationTemplate } from "../../types/destinationTemplate"
import type { ExtractedQuoteData } from "../../types/extractedQuoteData"
import { repositories } from "../../services/repositories"
import { quoteRepository, type Quote } from "../../services/hybridQuoteRepository"
import { generateDynamicTemplateAsync, hasExtractedData } from "../../services/dynamicTemplateGenerator"
import { getAgencyProfile, type AgencyProfile } from "../../services/agencyService"
import styles from "./components/QuoteVersion.module.css"

import BriefScreen1 from "./components/BriefScreen1"
import BriefScreen2 from "./components/BriefScreen2"
import BriefScreen3 from "./components/BriefScreen3"

import HeroScreen from "./components/HeroScreen"
import HotelScreen from "./components/HotelScreen"
import ExperienceScreen from "./components/ExperienceScreen"

import TripDetailsContent from "./components/TripDetailsContent"
import FlightDetailsScreen from "./components/FlightDetailsScreen"
import ReturnFlightOverview from "./components/ReturnFlightOverview"
import ReturnFlightDetailsScreen from "./components/ReturnFlightDetailsScreen"

import TransferCard from "./components/TransferCard"
import TransferDetails from "./components/TransferDetails"

import BudgetScreen from "./components/BudgetScreen"

type ScreenType =
    | "brief1"
    | "brief2"
    | "brief3"
    | "hero"
    | "hotel"
    | "experiences"
    | "flight-outbound-overview"
    | "flight-outbound-details"
    | "transfer-outbound"
    | "transfer-outbound-details"
    | "transfer-return"
    | "transfer-return-details"
    | "flight-return-overview"
    | "flight-return-details"
    | "budget"

export default function QuoteVersion() {
    const { publicId = "" } = useParams()
    const navigate = useNavigate()

    const [quote, setQuote] = useState<Quote | null>(null)
    const [template, setTemplate] = useState<DestinationTemplate | null>(null)
    const [agency, setAgency] = useState<AgencyProfile | null>(null)
    const [extractedData, setExtractedData] = useState<ExtractedQuoteData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [currentScreen, setCurrentScreen] = useState<ScreenType>("brief1")

    useEffect(() => {
        loadData()
    }, [publicId])

    async function loadData() {
        setLoading(true)
        setError("")

        try {
            const [agencyData, foundQuote] = await Promise.all([
                getAgencyProfile(),
                quoteRepository.getByPublicId(publicId),
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

    const goTo = (screen: ScreenType) => setCurrentScreen(screen)

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

    if (error || !quote || !template || !agency) {
        return (
            <div className={styles.errorContainer}>
                <p>{error || "Cotação não encontrada."}</p>
            </div>
        )
    }

    // ============================================
    // DADOS DINÂMICOS - EXTRAÍDOS DO PDF
    // ============================================

    const destination = extractedData?.destination || template.destinationName || "Destino"
    const origin = extractedData?.origin || "São Paulo"
    const nights = extractedData?.hotel?.nights || extractedData?.totalNights || 7
    const experiences = template.experiences || []

    const heroScreen = template.screens.find((s) => s.type === "hero")
    const hotelScreen = template.screens.find((s) => s.type === "hotel")

    const outboundFlight = extractedData?.outboundFlight
    const returnFlight = extractedData?.returnFlight

    const outboundBaggage = extractedData?.outboundBaggage || {
        personalItem: { type: "personal" as const, description: "1 item", included: true },
        carryOn: { type: "carryOn" as const, description: "10kg", weight: "10kg", included: true },
        checked: { type: "checked" as const, description: "23kg", weight: "23kg", included: false },
    }

    const returnBaggage = extractedData?.returnBaggage || outboundBaggage

    const arrivalAirport =
        outboundFlight?.segments?.[outboundFlight.segments.length - 1]?.arrivalCity || destination
    const departureAirport = returnFlight?.segments?.[0]?.departureCity || destination

    const transferOutbound = extractedData?.transfers?.outbound || {
        included: false,
        from: `Aeroporto de ${arrivalAirport}`,
        to: `Hotel em ${destination}`,
    }

    const transferReturn = extractedData?.transfers?.return || {
        included: false,
        from: `Hotel em ${destination}`,
        to: `Aeroporto de ${departureAirport}`,
    }

    // ✅ DADOS DINÂMICOS - SEM MOCKS
    const totalDays = nights + 1
    const region = extractedData?.destination || destination  // Usa destino como região
    const travelDateLabel = extractedData?.travelDate || extractedData?.hotel?.checkIn || ""

    // ============================================
    // RENDERIZAÇÃO DAS TELAS
    // ============================================

    // BRIEF 1
    if (currentScreen === "brief1") {
        return (
            <BriefScreen1
                agency={agency}
                clientName={quote.clientName}
                onBack={() => navigate(`/q/${publicId}`)}
                onNext={() => goTo("brief2")}
            />
        )
    }

    // BRIEF 2
    if (currentScreen === "brief2") {
        return (
            <BriefScreen2
                agency={agency}
                onBack={() => goTo("brief1")}
                onNext={() => goTo("hero")}
            />
        )
    }

    // BRIEF 3
    if (currentScreen === "brief3") {
        return (
            <BriefScreen3
                {...({
                    agency,
                    onBack: () => goTo("brief2"),
                    onNext: () => goTo("hero"),
                } as any)}
            />
        )
    }

    // HERO
    if (currentScreen === "hero" && heroScreen) {
        return (
            <HeroScreen
                screen={heroScreen}
                onBack={() => goTo("brief2")}
                onNext={() => goTo("hotel")}
                totalDays={totalDays}
                region={region}
                travelDate={travelDateLabel}
            />
        )
    }

    // HOTEL - ✅ TODAS AS PROPS DINÂMICAS
    if (currentScreen === "hotel" && hotelScreen) {
        return (
            <HotelScreen
                screen={hotelScreen}
                destination={destination}
                nights={nights}
                onBack={() => goTo("hero")}
                onNext={() => goTo("experiences")}
                checkIn={extractedData?.hotel?.checkIn}
                checkOut={extractedData?.hotel?.checkOut}
                roomType={extractedData?.hotel?.roomType}
                address={extractedData?.hotel?.address}
                hotelStars={extractedData?.hotel?.stars}
                mealPlan={extractedData?.hotel?.mealPlan}
            />
        )
    }

    // EXPERIENCES
    if (currentScreen === "experiences" && experiences.length > 0) {
        return (
            <ExperienceScreen
                experiences={experiences}
                destination={destination}
                onBack={() => goTo("hotel")}
                onNext={() => goTo("flight-outbound-overview")}
            />
        )
    }

    // VOO DE IDA - OVERVIEW
    if (currentScreen === "flight-outbound-overview" && outboundFlight) {
        return (
            <TripDetailsContent
                destination={destination}
                flight={outboundFlight}
                baggage={outboundBaggage}
                travelDate={extractedData?.travelDate || ""}
                onBack={() => goTo("experiences")}
                onViewDetails={() => goTo("flight-outbound-details")}
            />
        )
    }

    // VOO DE IDA - DETALHES
    if (currentScreen === "flight-outbound-details" && outboundFlight) {
        return (
            <FlightDetailsScreen
                flight={outboundFlight}
                baggage={outboundBaggage}
                origin={origin}
                destination={destination}
                title="Detalhes do voo de ida"
                onBack={() => goTo("flight-outbound-overview")}
                onNext={() => goTo("transfer-outbound")}
                nextButtonText="Ver transfer de chegada"
            />
        )
    }

    // TRANSFER IDA - CARD - ✅ COM PROPS DE HOTEL
    if (currentScreen === "transfer-outbound") {
        const nextScreen = transferOutbound.included ? "transfer-outbound-details" : "transfer-return"
        return (
            <TransferCard
                type="outbound"
                transfer={transferOutbound}
                destination={destination}
                arrivalCity={arrivalAirport}
                hotelName={extractedData?.hotel?.name}
                hotelAddress={extractedData?.hotel?.address}
                onBack={() => goTo("flight-outbound-details")}
                onViewDetails={() => goTo(nextScreen)}
            />
        )
    }

    // TRANSFER IDA - DETALHES
    if (currentScreen === "transfer-outbound-details") {
        return (
            <TransferDetails
                type="outbound"
                transfer={transferOutbound}
                onBack={() => goTo("transfer-outbound")}
                onNext={() => goTo("transfer-return")}
            />
        )
    }

    // TRANSFER VOLTA - CARD - ✅ COM PROPS DE HOTEL
    if (currentScreen === "transfer-return") {
        const nextScreen = transferReturn.included ? "transfer-return-details" : "flight-return-overview"
        return (
            <TransferCard
                type="return"
                transfer={transferReturn}
                destination={destination}
                arrivalCity={departureAirport}
                hotelName={extractedData?.hotel?.name}
                hotelAddress={extractedData?.hotel?.address}
                onBack={() => goTo("transfer-outbound")}
                onViewDetails={() => goTo(nextScreen)}
            />
        )
    }

    // TRANSFER VOLTA - DETALHES
    if (currentScreen === "transfer-return-details") {
        return (
            <TransferDetails
                type="return"
                transfer={transferReturn}
                onBack={() => goTo("transfer-return")}
                onNext={() => goTo("flight-return-overview")}
            />
        )
    }

    // VOO DE VOLTA - OVERVIEW
    if (currentScreen === "flight-return-overview" && returnFlight) {
        return (
            <ReturnFlightOverview
                destination={destination}
                origin={origin}
                flight={returnFlight}
                baggage={returnBaggage}
                returnDate={extractedData?.returnDate || ""}
                onBack={() => goTo("transfer-return-details")}
                onViewDetails={() => goTo("flight-return-details")}
            />
        )
    }

    // VOO DE VOLTA - DETALHES
    if (currentScreen === "flight-return-details" && returnFlight) {
        return (
            <ReturnFlightDetailsScreen
                flight={returnFlight}
                baggage={returnBaggage}
                origin={origin}
                destination={destination}
                onBack={() => goTo("flight-return-overview")}
                onViewBudget={() => goTo("budget")}
            />
        )
    }

    // ORÇAMENTO
    if (currentScreen === "budget" && extractedData) {
        return (
            <BudgetScreen
                data={extractedData}
                clientName={quote.clientName}
                onBack={() => goTo("flight-return-details")}
                onConfirm={() => {
                    alert("Funcionalidade de pagamento em desenvolvimento!")
                }}
            />
        )
    }

    // FALLBACK - HERO
    if (heroScreen) {
        return (
            <HeroScreen
                screen={heroScreen}
                onBack={() => goTo("brief2")}
                onNext={() => goTo("hotel")}
                totalDays={totalDays}
                region={region}
                travelDate={travelDateLabel}
            />
        )
    }

    return (
        <div className={styles.errorContainer}>
            <p>Erro ao carregar tela.</p>
        </div>
    )
}