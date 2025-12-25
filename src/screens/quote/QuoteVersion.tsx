import { useParams } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import type { DestinationTemplate } from "../../types/destinationTemplate"
import { repositories } from "../../services/repositories"
import { quoteRepository, type Quote } from "../../services/hybridQuoteRepository"
import { generateDynamicTemplateAsync, hasExtractedData } from "../../services/dynamicTemplateGenerator"
import { getAgencyProfile, type AgencyProfile } from "../../services/agencyService"
import styles from "./components/QuoteVersion.module.css"

import BriefScreen1 from "./components/BriefScreen1"
import BriefScreen2 from "./components/BriefScreen2"
import BriefScreen3 from "./components/BriefScreen3"
import HeroScreen from "./components/HeroScreen"
import ScreenView from "./components/ScreenView"

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
            const [agencyData, foundQuote] = await Promise.all([
                getAgencyProfile(),
                quoteRepository.getByPublicId(publicId)
            ])

            setAgency(agencyData)

            if (foundQuote) {
                setQuote(foundQuote)

                if (hasExtractedData(foundQuote)) {
                    const dynamicTemplate = await generateDynamicTemplateAsync(
                        foundQuote.clientName,
                        (foundQuote as any).extractedData
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

    const destinationScreens = template.screens
    const heroScreen = destinationScreens.find(s => s.type === "hero")
    const otherScreens = destinationScreens.filter(s => s.type !== "hero")
    const totalScreens = BRIEF_SCREENS_COUNT + destinationScreens.length

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

            {/* DESTINO: OUTRAS TELAS */}
            {otherScreens.map((screen, index) => (
                <ScreenView
                    key={screen.screenId}
                    screen={screen}
                    index={BRIEF_SCREENS_COUNT + 1 + index}
                    total={totalScreens}
                    isActive={currentIndex === BRIEF_SCREENS_COUNT + 1 + index}
                />
            ))}
        </div>
    )
}