/**
 * TRANSFER CARD - Overview do Transfer
 * 
 * Redesign com mesmo padrão estrutural do HotelScreen:
 * - Background blur
 * - Header scrollável
 * - Imagem principal
 * - Cards azuis com informações
 * - Botão CTA fixo no bottom
 * 
 * ⚠️ TODOS OS DADOS SÃO DINÂMICOS - extraídos do PDF
 */

import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, MapPin, Check, X, CheckCircle } from 'lucide-react'
import styles from './TransferCard.module.css'
import type { TransferInfo } from '../../../types/extractedQuoteData'

// Variantes de animação
const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
    }
}

interface TransferCardProps {
    type: 'outbound' | 'return'
    transfer: TransferInfo
    destination: string
    arrivalCity: string
    hotelName?: string
    hotelAddress?: string
    onBack?: () => void
    onViewDetails: () => void
}

// Imagens padrão (podem ser substituídas por URLs do banco)
const TRANSFER_IMAGES = {
    outbound: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/0b/f3/67/a6.jpg',
    return: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/07/38/2c/62.jpg'
}

export default function TransferCard({
    type,
    transfer,
    destination,
    arrivalCity,
    hotelName,
    hotelAddress,
    onBack,
    onViewDetails,
}: TransferCardProps) {
    const isOutbound = type === 'outbound'
    const title = isOutbound ? 'Seu Transfer' : 'Transfer de Volta'
    const imageUrl = TRANSFER_IMAGES[type]

    // Storytelling DSC Travel - dinâmico com dados reais
    const getStorytelling = () => {
        if (isOutbound) {
            return `Ao chegar em ${arrivalCity}, um dos parceiros da DSC Travel estará te esperando no aeroporto com uma placa personalizada para levá-lo até seu hotel em ${destination}. O transfer é confortável, climatizado e perfeito para começar sua viagem com tranquilidade.`
        } else {
            return `No dia da sua partida, um dos parceiros da DSC Travel estará aguardando no lobby do hotel para levá-lo ao aeroporto de ${arrivalCity}. Aproveite os últimos momentos em ${destination} sem preocupações com o transporte.`
        }
    }

    // Rota do transfer - dinâmico
    const getRoute = () => {
        // Se tiver dados específicos do transfer, usa eles
        if (transfer.from && transfer.to) {
            return `${transfer.from} → ${transfer.to}`
        }
        // Fallback com dados da cotação
        if (isOutbound) {
            return `Aeroporto de ${arrivalCity} → Hotel em ${destination}`
        } else {
            return `Hotel em ${destination} → Aeroporto de ${arrivalCity}`
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
            {/* Background com blur */}
            <div className={styles.backgroundBlur}>
                <img
                    src={imageUrl}
                    alt=""
                    className={styles.backgroundImage}
                />
            </div>

            {/* Gradiente superior */}
            <div className={styles.gradientTop}></div>

            {/* Gradiente inferior */}
            <div className={styles.gradientBottom}></div>

            {/* Botão voltar - absoluto */}
            {onBack && (
                <motion.button
                    className={styles.backButton}
                    onClick={onBack}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <ArrowLeft size={20} />
                </motion.button>
            )}

            {/* Conteúdo scrollável */}
            <div className={styles.scrollContent}>
                {/* Header com título + badge */}
                <motion.div
                    className={styles.header}
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                >
                    <div className={styles.titleRow}>
                        <h1 className={styles.title}>{title}</h1>

                        {/* Badge de status */}
                        {transfer.included ? (
                            <span className={styles.badgeIncluded}>
                                <Check size={16} />
                                <span>incluído</span>
                            </span>
                        ) : (
                            <span className={styles.badgeNotIncluded}>
                                <X size={16} />
                                <span>não incluído</span>
                            </span>
                        )}
                    </div>

                    <div className={styles.routeRow}>
                        <MapPin size={18} className={styles.routeIcon} />
                        <p className={styles.routeText}>{getRoute()}</p>
                    </div>
                </motion.div>

                {/* Imagem principal */}
                <motion.div
                    className={styles.imageContainer}
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ delay: 0.1 }}
                >
                    <img
                        src={imageUrl}
                        alt="Transfer"
                        className={styles.mainImage}
                    />
                </motion.div>

                {/* Texto descritivo */}
                <motion.p
                    className={styles.description}
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ delay: 0.2 }}
                >
                    {getStorytelling()}
                </motion.p>

                {/* Card - O que está incluído (só se transfer incluído) */}
                {transfer.included && (
                    <motion.div
                        className={styles.infoCard}
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ delay: 0.3 }}
                    >
                        <h3 className={styles.cardTitle}>O que está incluído</h3>

                        <div className={styles.checkList}>
                            {transfer.details && transfer.details.length > 0 ? (
                                // Usa detalhes extraídos do PDF
                                transfer.details.map((detail, index) => (
                                    <div key={index} className={styles.checkItem}>
                                        <CheckCircle size={20} className={styles.checkIcon} />
                                        <span>{detail}</span>
                                    </div>
                                ))
                            ) : (
                                // Fallback se não tiver detalhes
                                <>
                                    <div className={styles.checkItem}>
                                        <CheckCircle size={20} className={styles.checkIcon} />
                                        <span>Motorista com placa personalizada</span>
                                    </div>
                                    <div className={styles.checkItem}>
                                        <CheckCircle size={20} className={styles.checkIcon} />
                                        <span>Veículo confortável e climatizado</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Card - Informações do voo - DADOS DINÂMICOS */}
                {(transfer.date || transfer.time || hotelName) && (
                    <motion.div
                        className={styles.infoCard}
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ delay: 0.4 }}
                    >
                        <h3 className={styles.cardTitle}>
                            {isOutbound ? 'Informações da chegada' : 'Informações da partida'}
                        </h3>

                        <div className={styles.flightInfo}>
                            {(transfer.date || transfer.time) && (
                                <div className={styles.infoBlock}>
                                    <span className={styles.infoLabel}>
                                        {isOutbound ? 'CHEGADA' : 'PARTIDA'}
                                    </span>
                                    {transfer.date && (
                                        <span className={styles.infoValue}>{transfer.date}</span>
                                    )}
                                    {transfer.time && (
                                        <span className={styles.infoSubvalue}>
                                            {transfer.time} - Aeroporto de {arrivalCity}
                                        </span>
                                    )}
                                </div>
                            )}

                            {hotelName && (
                                <>
                                    <div className={styles.infoDivider}></div>

                                    <div className={styles.infoBlock}>
                                        <span className={styles.infoLabel}>
                                            {isOutbound ? 'DESTINO' : 'ORIGEM'}
                                        </span>
                                        <span className={styles.infoValue}>{hotelName}</span>
                                        {hotelAddress && (
                                            <span className={styles.infoSubvalue}>{hotelAddress}</span>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* CTA Fixo */}
            <motion.button
                onClick={onViewDetails}
                className={styles.ctaButton}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
            >
                {getButtonText()}
                <ArrowRight size={20} strokeWidth={2.5} />
            </motion.button>
        </div>
    )
}