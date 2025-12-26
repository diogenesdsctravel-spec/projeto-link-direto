/**
 * RETURN FLIGHT DETAILS SCREEN - DETALHES DO VOO DE VOLTA
 * 
 * Exibe todos os segmentos do voo de volta com:
 * - Informações da companhia aérea
 * - Bagagem por trecho
 * - Tempo de conexão
 * - Resumo da viagem
 */

import { ArrowLeft, Clock, ChevronDown, Briefcase, Check, X, Backpack } from 'lucide-react'
import { useState } from 'react'
import styles from './FlightDetailsScreen.module.css'
import type { FlightLeg, BaggageInfo } from '../../../types/extractedQuoteData'

interface ReturnFlightDetailsScreenProps {
    flight: FlightLeg
    baggage: BaggageInfo
    origin: string
    destination: string
    onBack: () => void
    onViewBudget: () => void
}

export default function ReturnFlightDetailsScreen({
    flight,
    baggage,
    origin,
    destination,
    onBack,
    onViewBudget
}: ReturnFlightDetailsScreenProps) {
    const [expandedFlight, setExpandedFlight] = useState<number | null>(null)

    // Calcular distância aproximada
    const estimatedDistance = "~4.200 km"

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <button onClick={onBack} className={styles.backButton}>
                    <ArrowLeft className={styles.backIcon} />
                    <span>Voltar</span>
                </button>

                <h1 className={styles.headerTitle}>Voo de volta</h1>
                <p className={styles.headerSubtitle}>{destination} → {origin}</p>
            </div>

            {/* Content */}
            <div className={styles.content}>
                {flight.segments.map((segment, index) => (
                    <div key={index}>
                        {/* Flight Segment Card */}
                        <div className={styles.segmentCard}>
                            {/* Airline Header */}
                            <div className={styles.airlineHeader}>
                                <div className={styles.airlineInfo}>
                                    <div className={styles.airlineLogo}>
                                        <span className={styles.airlineCode}>
                                            {segment.airlineCode || segment.airline?.substring(0, 2).toUpperCase() || 'XX'}
                                        </span>
                                    </div>
                                    <span className={styles.airlineName}>{segment.airline}</span>
                                </div>
                                <div className={styles.flightInfo}>
                                    <p className={styles.flightInfoText}>Voo Nº {segment.flightNumber}</p>
                                    {segment.aircraft && (
                                        <p className={styles.flightInfoText}>{segment.aircraft}</p>
                                    )}
                                    <p className={styles.flightInfoText}>Classe: {segment.class || 'Econômica'}</p>
                                </div>
                            </div>

                            {/* Baggage Section */}
                            <div className={styles.baggageSection}>
                                {/* Item pessoal */}
                                <div className={styles.baggageItem}>
                                    <Backpack className={`${styles.baggageIconSmall} ${baggage.personalItem.included ? styles.baggageIconIncluded : styles.baggageIconNotIncluded}`} />
                                    <span className={baggage.personalItem.included ? styles.baggageText : styles.baggageTextDisabled}>1 item</span>
                                    {baggage.personalItem.included ? (
                                        <Check className={styles.checkIcon} />
                                    ) : (
                                        <X className={styles.xIcon} />
                                    )}
                                </div>

                                <div className={styles.baggageDivider} />

                                {/* Mala de mão */}
                                <div className={styles.baggageItem}>
                                    <Briefcase className={`${styles.baggageIconMedium} ${baggage.carryOn.included ? styles.baggageIconIncluded : styles.baggageIconNotIncluded}`} />
                                    <span className={baggage.carryOn.included ? styles.baggageText : styles.baggageTextDisabled}>
                                        {baggage.carryOn.weight || '10kg'}
                                    </span>
                                    {baggage.carryOn.included ? (
                                        <Check className={styles.checkIcon} />
                                    ) : (
                                        <X className={styles.xIcon} />
                                    )}
                                </div>

                                <div className={styles.baggageDivider} />

                                {/* Mala despachada */}
                                <div className={styles.baggageItem}>
                                    <Briefcase className={`${styles.baggageIconLarge} ${baggage.checked.included ? styles.baggageIconIncluded : styles.baggageIconNotIncluded}`} />
                                    <span className={baggage.checked.included ? styles.baggageText : styles.baggageTextDisabled}>
                                        {baggage.checked.weight || '23kg'}
                                    </span>
                                    {baggage.checked.included ? (
                                        <Check className={styles.checkIcon} />
                                    ) : (
                                        <X className={styles.xIcon} />
                                    )}
                                </div>
                            </div>

                            {/* Flight Times */}
                            <div className={styles.flightTimes}>
                                {/* Departure */}
                                <div className={styles.flightPoint}>
                                    <p className={styles.flightDate}>{segment.date}</p>
                                    <p className={styles.flightTime}>{segment.departureTime}</p>
                                    <p className={styles.flightAirport}>{segment.departureAirport}</p>
                                    <p className={styles.flightCity}>{segment.departureCity}</p>
                                    {segment.departureAirportName && (
                                        <p className={styles.flightAirportName}>{segment.departureAirportName}</p>
                                    )}
                                </div>

                                {/* Duration */}
                                <div className={styles.durationCenter}>
                                    <p className={styles.durationLabel}>Duração</p>
                                    <p className={styles.durationValue}>{segment.duration}</p>
                                    <p className={styles.durationNote}>Horários em hora local</p>
                                </div>

                                {/* Arrival */}
                                <div className={`${styles.flightPoint} ${styles.flightPointRight}`}>
                                    <p className={styles.flightDate}>{segment.date}</p>
                                    <p className={styles.flightTime}>{segment.arrivalTime}</p>
                                    <p className={styles.flightAirport}>{segment.arrivalAirport}</p>
                                    <p className={styles.flightCity}>{segment.arrivalCity}</p>
                                    {segment.arrivalAirportName && (
                                        <p className={styles.flightAirportName}>{segment.arrivalAirportName}</p>
                                    )}
                                </div>
                            </div>

                            {/* More Details Button */}
                            <button
                                onClick={() => setExpandedFlight(expandedFlight === index ? null : index)}
                                className={styles.moreDetailsButton}
                            >
                                <span>Mais detalhes</span>
                                <ChevronDown className={`${styles.chevronIcon} ${expandedFlight === index ? styles.chevronIconRotated : ''}`} />
                            </button>

                            {/* Expanded Details */}
                            {expandedFlight === index && (
                                <div className={styles.expandedDetails}>
                                    <div className={styles.expandedRow}>
                                        <span className={styles.expandedLabel}>Companhia</span>
                                        <span className={styles.expandedValue}>{segment.airline}</span>
                                    </div>
                                    <div className={styles.expandedRow}>
                                        <span className={styles.expandedLabel}>Número do voo</span>
                                        <span className={styles.expandedValue}>{segment.flightNumber}</span>
                                    </div>
                                    {segment.aircraft && (
                                        <div className={styles.expandedRow}>
                                            <span className={styles.expandedLabel}>Aeronave</span>
                                            <span className={styles.expandedValue}>{segment.aircraft}</span>
                                        </div>
                                    )}
                                    <div className={styles.expandedRow}>
                                        <span className={styles.expandedLabel}>Classe</span>
                                        <span className={styles.expandedValue}>{segment.class || 'Econômica'}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Connection Card - show between segments */}
                        {index < flight.segments.length - 1 && (
                            <div className={styles.connectionCard}>
                                <Clock className={styles.connectionIcon} />
                                <span className={styles.connectionText}>
                                    Espera de <span className={styles.connectionTime}>{flight.connectionTime || 'N/A'}</span> em {segment.arrivalCity}
                                </span>
                            </div>
                        )}
                    </div>
                ))}

                {/* Summary Card */}
                <div className={styles.summaryCard}>
                    <h3 className={styles.summaryTitle}>Resumo da viagem de volta</h3>
                    <div className={styles.summaryRow}>
                        <span className={styles.summaryLabel}>Duração total</span>
                        <span className={styles.summaryValue}>{flight.totalDuration}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span className={styles.summaryLabel}>Escalas</span>
                        <span className={styles.summaryValue}>
                            {flight.stops === 0 ? 'Voo direto' : `${flight.stops} conexão${flight.stops > 1 ? 'ões' : ''}`}
                            {flight.connectionCity && ` (${flight.connectionCity})`}
                        </span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span className={styles.summaryLabel}>Distância</span>
                        <span className={styles.summaryValue}>{estimatedDistance}</span>
                    </div>
                </div>

                {/* View Budget Button */}
                <button onClick={onViewBudget} className={styles.ctaButton}>
                    <span>Ver orçamento completo</span>
                </button>
            </div>
        </div>
    )
}