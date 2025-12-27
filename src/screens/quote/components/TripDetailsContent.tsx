/**
 * TRIP DETAILS CONTENT - VOO DE IDA (Overview)
 * 
 * Exibe resumo do voo de ida com dados dinâmicos extraídos do PDF
 */

import { Plane, MapPin, Calendar, Briefcase, Backpack, ArrowLeft } from 'lucide-react'
import styles from './TripDetailsContent.module.css'
import type { FlightLeg, BaggageInfo } from '../../../types/extractedQuoteData'

interface TripDetailsContentProps {
    destination: string
    flight: FlightLeg
    baggage: BaggageInfo
    travelDate: string
    backgroundImage?: string
    onBack?: () => void
    onViewDetails: () => void
}

export default function TripDetailsContent({
    destination,
    flight,
    baggage,
    travelDate,
    backgroundImage = "https://www.melhoresdestinos.com.br/wp-content/uploads/2023/01/aviao-flap-capa.jpg",
    onBack,
    onViewDetails
}: TripDetailsContentProps) {
    // Pegar primeiro e último segmento para mostrar origem → destino
    const firstSegment = flight.segments[0]
    const lastSegment = flight.segments[flight.segments.length - 1]

    if (!firstSegment) {
        return null
    }

    // Formatar data curta (ex: "12 fev")
    const formatShortDate = (dateStr: string) => {
        // Tenta extrair dia e mês de formatos como "30 jan. 2026" ou "30 de janeiro de 2026"
        const match = dateStr.match(/(\d{1,2})\s*(?:de\s*)?(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)/i)
        if (match) {
            return `${match[1]} ${match[2].toLowerCase()}`
        }
        return dateStr
    }

    // Determinar tipo de voo
    const flightType = flight.stops === 0 ? 'Voo direto' : `${flight.stops} conexão`

    return (
        <div className={styles.container}>
            {/* Background Image */}
            <div
                className={styles.background}
                style={{ backgroundImage: `url(${backgroundImage})` }}
            />

            {/* Overlay */}
            <div className={styles.overlay} />

            {/* Botão voltar */}
            {onBack && (
                <button className={styles.backButton} onClick={onBack}>
                    <ArrowLeft size={20} />
                </button>
            )}

            {/* Content */}
            <div className={styles.content}>
                <div className={styles.spacer} />

                {/* Badges */}
                <div className={styles.badges}>
                    <div className={styles.badge}>
                        <MapPin className={styles.badgeIcon} />
                        <span className={styles.badgeText}>Voo incluído</span>
                    </div>
                    <div className={styles.badge}>
                        <Calendar className={styles.badgeIcon} />
                        <span className={styles.badgeText}>{formatShortDate(travelDate)}</span>
                    </div>
                </div>

                {/* Title */}
                <h1 className={styles.title}>
                    Sua aventura começa em {destination}
                </h1>

                {/* Subtitle */}
                <p className={styles.subtitle}>
                    {flightType} de {firstSegment.departureCity} às {firstSegment.departureTime}, chegada às {lastSegment.arrivalTime}
                </p>

                {/* Flight Card */}
                <div className={styles.flightCard}>
                    <div className={styles.flightRoute}>
                        {/* Departure */}
                        <div className={styles.flightPoint}>
                            <div className={styles.flightTime}>{firstSegment.departureTime}</div>
                            <div className={styles.flightCode}>{firstSegment.departureAirport}</div>
                            <div className={styles.flightCity}>{firstSegment.departureCity}</div>
                        </div>

                        {/* Duration */}
                        <div className={styles.flightMiddle}>
                            <span className={styles.flightDuration}>{flight.totalDuration}</span>
                            <div className={styles.flightLine}>
                                <div className={styles.flightLineBorder} />
                                <Plane className={styles.flightPlaneIcon} />
                                <div className={styles.flightLineBorder} />
                            </div>
                            <span className={styles.flightAirline}>{firstSegment.airline}</span>
                        </div>

                        {/* Arrival */}
                        <div className={`${styles.flightPoint} ${styles.flightPointRight}`}>
                            <div className={styles.flightTime}>{lastSegment.arrivalTime}</div>
                            <div className={styles.flightCode}>{lastSegment.arrivalAirport}</div>
                            <div className={styles.flightCity}>{lastSegment.arrivalCity}</div>
                        </div>
                    </div>

                    {/* Baggage */}
                    <div className={styles.baggageSection}>
                        {/* Item pessoal */}
                        <div className={styles.baggageItem}>
                            <Backpack className={`${styles.baggageIconSmall} ${baggage.personalItem.included ? styles.baggageIconIncluded : styles.baggageIconNotIncluded}`} />
                            <span className={baggage.personalItem.included ? styles.baggageText : styles.baggageTextDisabled}>
                                1 item
                            </span>
                        </div>

                        {/* Mala de mão */}
                        <div className={styles.baggageItem}>
                            <Briefcase className={`${styles.baggageIconMedium} ${baggage.carryOn.included ? styles.baggageIconIncluded : styles.baggageIconNotIncluded}`} />
                            <span className={baggage.carryOn.included ? styles.baggageText : styles.baggageTextDisabled}>
                                {baggage.carryOn.weight || '10kg'}
                            </span>
                        </div>

                        {/* Mala despachada */}
                        <div className={styles.baggageItem}>
                            <Briefcase className={`${styles.baggageIconLarge} ${baggage.checked.included ? styles.baggageIconIncluded : styles.baggageIconNotIncluded}`} />
                            <span className={baggage.checked.included ? styles.baggageText : styles.baggageTextDisabled}>
                                {baggage.checked.weight || '23kg'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* CTA Button */}
                <button onClick={onViewDetails} className={styles.button}>
                    <span>Ver detalhes do voo</span>
                    <span className={styles.buttonArrow}>→</span>
                </button>
            </div>
        </div>
    )
}