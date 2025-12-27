/**
 * RETURN FLIGHT OVERVIEW - VOO DE VOLTA (Overview)
 * 
 * Exibe resumo do voo de volta com dados dinâmicos
 */

import { Plane, MapPin, Calendar, Briefcase, Backpack, ArrowLeft } from 'lucide-react'
import styles from './ReturnFlightOverview.module.css'
import type { FlightLeg, BaggageInfo } from '../../../types/extractedQuoteData'

interface ReturnFlightOverviewProps {
    destination: string
    origin: string
    flight: FlightLeg
    baggage: BaggageInfo
    returnDate: string
    backgroundImage?: string
    onBack?: () => void
    onViewDetails: () => void
}

export default function ReturnFlightOverview({
    destination,
    origin,
    flight,
    baggage,
    returnDate,
    backgroundImage = "https://i.pinimg.com/736x/c4/3d/5f/c43d5f9ba78b6c2b140945915ea66c01.jpg",
    onBack,
    onViewDetails
}: ReturnFlightOverviewProps) {
    // Pegar primeiro e último segmento
    const firstSegment = flight.segments[0]
    const lastSegment = flight.segments[flight.segments.length - 1]

    if (!firstSegment) {
        return null
    }

    // Formatar data curta (ex: "23 fev")
    const formatShortDate = (dateStr: string) => {
        const match = dateStr.match(/(\d{1,2})\s*(?:de\s*)?(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)/i)
        if (match) {
            return `${match[1]} ${match[2].toLowerCase()}`
        }
        return dateStr
    }

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
                        <span className={styles.badgeText}>Voo de retorno</span>
                    </div>
                    <div className={styles.badge}>
                        <Calendar className={styles.badgeIcon} />
                        <span className={styles.badgeText}>{formatShortDate(returnDate)}</span>
                    </div>
                </div>

                {/* Title */}
                <h1 className={styles.title}>
                    Hora de voltar para casa
                </h1>

                {/* Subtitle */}
                <p className={styles.subtitle}>
                    Leve todas as lembranças de {destination} no coração. Partida às {firstSegment.departureTime}, chegada em {origin} às {lastSegment.arrivalTime}
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