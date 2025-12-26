/**
 * TRANSFER DETAILS - Detalhes completos do Transfer
 * 
 * Exibe informações detalhadas:
 * - Rota (de/para)
 * - Data e horário
 * - Veículo
 * - Passageiros e bagagem
 * - Informações importantes
 */

import { ArrowRight, Users, Luggage, Briefcase, Check, ArrowLeft, AlertCircle } from 'lucide-react'
import styles from './TransferDetails.module.css'
import type { TransferInfo } from '../../../types/extractedQuoteData'

interface TransferDetailsProps {
    type: 'outbound' | 'return'
    transfer: TransferInfo
    onBack: () => void
    onNext: () => void
}

// Imagens padrão para transfers
const TRANSFER_IMAGES = {
    outbound: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/0b/f3/67/a6.jpg',
    return: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/07/38/2c/62.jpg'
}

// Informações padrão quando transfer incluído
const DEFAULT_INFO = [
    'O motorista estará com uma placa personalizada',
    'Transfer compartilhado em mini van climatizada',
    'Água mineral cortesia durante o trajeto'
]

// Informações quando não incluído
const NOT_INCLUDED_INFO = [
    'Você pode contratar transfer privativo separadamente',
    'Táxis disponíveis na saída do aeroporto',
    'Aplicativos de transporte funcionam na região'
]

export default function TransferDetails({
    type,
    transfer,
    onBack,
    onNext,
}: TransferDetailsProps) {
    const title = type === 'outbound' ? 'Transfer - Ida' : 'Transfer - Volta'
    const imageUrl = TRANSFER_IMAGES[type]

    return (
        <div className={styles.container}>
            {/* Background Image */}
            <div
                className={styles.background}
                style={{ backgroundImage: `url(${imageUrl})` }}
            />

            {/* Overlay */}
            <div className={styles.overlay} />

            {/* Content */}
            <div className={styles.content}>
                {/* Back Button */}
                <button onClick={onBack} className={styles.backButton}>
                    <ArrowLeft className={styles.backIcon} />
                    <span>Voltar</span>
                </button>

                {/* Bottom Section */}
                <div className={styles.bottom}>
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.titleRow}>
                            <h2 className={styles.title}>{title}</h2>
                            {!transfer.included && (
                                <span className={styles.notIncludedBadge}>Não incluído</span>
                            )}
                        </div>

                        {transfer.from && transfer.to && (
                            <div className={styles.route}>
                                <span className={styles.routeText}>{transfer.from}</span>
                                <ArrowRight className={styles.routeIcon} />
                                <span className={styles.routeText}>{transfer.to}</span>
                            </div>
                        )}
                    </div>

                    {/* Details Card - Só mostra se incluído */}
                    {transfer.included ? (
                        <div className={styles.detailsCard}>
                            {/* Data e horário */}
                            {(transfer.date || transfer.time) && (
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Data e horário</span>
                                    <span className={styles.detailValue}>
                                        {transfer.date}{transfer.time && ` • ${transfer.time}`}
                                    </span>
                                </div>
                            )}

                            {/* Veículo */}
                            {transfer.vehicle && (
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Veículo</span>
                                    <span className={styles.detailValue}>{transfer.vehicle}</span>
                                </div>
                            )}

                            {/* Passageiros */}
                            {transfer.passengers && (
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Passageiros</span>
                                    <span className={styles.detailValue}>
                                        <Users className={styles.detailIcon} />
                                        {transfer.passengers}
                                    </span>
                                </div>
                            )}

                            {/* Bagagem */}
                            {(transfer.luggage || transfer.handLuggage) && (
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Bagagem</span>
                                    <span className={styles.detailValue}>
                                        {transfer.luggage && (
                                            <>
                                                <Luggage className={styles.detailIcon} />
                                                {transfer.luggage}
                                            </>
                                        )}
                                        {transfer.handLuggage && (
                                            <>
                                                <Briefcase className={styles.detailIcon} />
                                                {transfer.handLuggage}
                                            </>
                                        )}
                                    </span>
                                </div>
                            )}

                            {/* Cancelamento grátis */}
                            {transfer.freeCancellation && (
                                <div className={styles.freeCancellation}>
                                    <Check className={styles.checkIcon} />
                                    <span>Cancelamento grátis</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Card quando NÃO incluído */
                        <div className={styles.notIncludedCard}>
                            <AlertCircle className={styles.alertIcon} />
                            <div>
                                <h3 className={styles.notIncludedTitle}>Transfer não incluído</h3>
                                <p className={styles.notIncludedText}>
                                    Este pacote não inclui transfer. Você precisará providenciar seu próprio transporte do aeroporto até o hotel e vice-versa.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Info Card */}
                    <div className={styles.infoCard}>
                        <h3 className={styles.infoTitle}>
                            {transfer.included ? 'Informações importantes' : 'Alternativas de transporte'}
                        </h3>
                        <ul className={styles.infoList}>
                            {(transfer.included ? (transfer.details || DEFAULT_INFO) : NOT_INCLUDED_INFO).map((info, index) => (
                                <li key={index} className={styles.infoItem}>
                                    <Check className={styles.infoIcon} />
                                    <span className={styles.infoText}>{info}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Botão Continuar */}
                    <button onClick={onNext} className={styles.button}>
                        Continuar
                    </button>
                </div>
            </div>
        </div>
    )
}