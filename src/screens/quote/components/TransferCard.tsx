/**
 * TRANSFER CARD - Overview do Transfer
 * 
 * Se incluído: mostra storytelling DSC Travel e botão para ver detalhes
 * Se não incluído: mostra aviso e botão para próxima tela
 */

import { MapPin, Check, X } from 'lucide-react'
import styles from './TransferCard.module.css'
import type { TransferInfo } from '../../../types/extractedQuoteData'

interface TransferCardProps {
    type: 'outbound' | 'return'
    transfer: TransferInfo
    destination: string
    arrivalCity: string  // Cidade do aeroporto
    onViewDetails: () => void
}

// Imagens originais do TripAdvisor
const TRANSFER_IMAGES = {
    outbound: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/0b/f3/67/a6.jpg',
    return: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/07/38/2c/62.jpg'
}

export default function TransferCard({
    type,
    transfer,
    destination,
    arrivalCity,
    onViewDetails,
}: TransferCardProps) {
    const isOutbound = type === 'outbound'
    const title = isOutbound ? 'Seu Transfer' : 'Transfer de Volta'
    const imageUrl = TRANSFER_IMAGES[type]

    // Storytelling sempre o mesmo - DSC Travel
    const getStorytelling = () => {
        if (isOutbound) {
            return `Ao chegar em ${arrivalCity}, um dos parceiros da DSC Travel estará te esperando no aeroporto com uma placa personalizada para levá-lo até seu hotel em ${destination}. O transfer é confortável, climatizado e perfeito para começar sua viagem com tranquilidade.`
        } else {
            return `No dia da sua partida, um dos parceiros da DSC Travel estará aguardando no lobby do hotel para levá-lo ao aeroporto de ${arrivalCity}. Aproveite os últimos momentos em ${destination} sem preocupações com o transporte.`
        }
    }

    // Texto do botão
    const getButtonText = () => {
        if (transfer.included) {
            return 'Ver detalhes do transfer'
        } else {
            return isOutbound ? 'Continuar' : 'Ver voo de volta'
        }
    }

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
                    <div className={styles.route}>
                        <MapPin className={styles.routeIcon} />
                        <span className={styles.routeText}>
                            {isOutbound
                                ? `Aeroporto de ${arrivalCity} → Hotel em ${destination}`
                                : `Hotel em ${destination} → Aeroporto de ${arrivalCity}`
                            }
                        </span>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className={styles.bottom}>
                    {/* Storytelling */}
                    <p className={styles.storytelling}>{getStorytelling()}</p>

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
                        {getButtonText()}
                    </button>
                </div>
            </div>
        </div>
    )
}