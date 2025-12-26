/**
 * TRANSFER CARD - Overview do Transfer
 * 
 * Exibe card do transfer com storytelling
 * Mostra se está incluído ou não no pacote
 */

import { MapPin, Check, X } from 'lucide-react'
import styles from './TransferCard.module.css'
import type { TransferInfo } from '../../../types/extractedQuoteData'

interface TransferCardProps {
    type: 'outbound' | 'return'
    transfer: TransferInfo
    destination: string
    onViewDetails: () => void
}

// Imagens padrão para transfers
const TRANSFER_IMAGES = {
    outbound: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/0b/f3/67/a6.jpg',
    return: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/07/38/2c/62.jpg'
}

// Storytelling padrão baseado no tipo
const getStorytelling = (type: 'outbound' | 'return', destination: string, included: boolean) => {
    if (type === 'outbound') {
        if (included) {
            return `Ao chegar em ${destination}, um de nossos parceiros estará te esperando no aeroporto com uma placa personalizada. O transfer compartilhado em mini van é confortável, climatizado e perfeito para começar sua viagem com tranquilidade.`
        } else {
            return `O transfer do aeroporto até seu hotel em ${destination} não está incluído neste pacote. Você pode contratar separadamente ou utilizar táxi/transporte por aplicativo.`
        }
    } else {
        if (included) {
            return `No dia da sua partida, o transfer estará esperando no hotel para levá-lo ao aeroporto com toda comodidade. Aproveite os últimos momentos em ${destination} sem preocupações.`
        } else {
            return `O transfer do hotel até o aeroporto não está incluído neste pacote. Recomendamos reservar com antecedência para garantir pontualidade no voo.`
        }
    }
}

export default function TransferCard({
    type,
    transfer,
    destination,
    onViewDetails,
}: TransferCardProps) {
    const title = type === 'outbound' ? 'Seu Transfer' : 'Transfer de Volta'
    const imageUrl = TRANSFER_IMAGES[type]
    const storytelling = getStorytelling(type, destination, transfer.included)

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
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.titleRow}>
                        <h1 className={styles.title}>{title}</h1>

                        {/* Badge de status */}
                        {transfer.included ? (
                            <div className={styles.badgeIncluded}>
                                <Check className={styles.badgeIconIncluded} />
                                <span className={styles.badgeTextIncluded}>Incluído</span>
                            </div>
                        ) : (
                            <div className={styles.badgeNotIncluded}>
                                <X className={styles.badgeIconNotIncluded} />
                                <span className={styles.badgeTextNotIncluded}>Não incluído</span>
                            </div>
                        )}
                    </div>

                    {/* Rota */}
                    {transfer.from && transfer.to && (
                        <div className={styles.route}>
                            <MapPin className={styles.routeIcon} />
                            <span className={styles.routeText}>{transfer.from}</span>
                            <span className={styles.routeArrow}>→</span>
                            <span className={styles.routeText}>{transfer.to}</span>
                        </div>
                    )}
                </div>

                {/* Bottom Section */}
                <div className={styles.bottom}>
                    {/* Storytelling */}
                    <p className={styles.storytelling}>{storytelling}</p>

                    {/* Horário se incluído e disponível */}
                    {transfer.included && transfer.time && (
                        <div className={styles.timeCard}>
                            <div className={styles.timeRow}>
                                <span className={styles.timeLabel}>Horário previsto</span>
                                <span className={styles.timeValue}>
                                    {transfer.date} • {transfer.time}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* CTA Button */}
                    <button onClick={onViewDetails} className={styles.button}>
                        {transfer.included ? 'Ver detalhes do transfer' : 'Ver opções de transfer'}
                    </button>
                </div>
            </div>
        </div>
    )
}