/**
 * TRANSFER DETAILS - Detalhes completos do Transfer
 * 
 * Redesign com mesmo padrão estrutural do HotelScreen:
 * - Background blur
 * - Header scrollável
 * - Cards azuis com informações detalhadas
 * - Botão CTA fixo no bottom
 * 
 * ⚠️ TODOS OS DADOS SÃO DINÂMICOS - extraídos do PDF
 */

import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, MapPin, Users, Luggage, Briefcase, Check, AlertCircle } from 'lucide-react'
import styles from './TransferDetails.module.css'
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

interface TransferDetailsProps {
    type: 'outbound' | 'return'
    transfer: TransferInfo
    onBack: () => void
    onNext: () => void
}

// Imagens padrão para transfers (podem vir do banco no futuro)
const TRANSFER_IMAGES = {
    outbound: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/0b/f3/67/a6.jpg',
    return: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/07/38/2c/62.jpg'
}

export default function TransferDetails({
    type,
    transfer,
    onBack,
    onNext,
}: TransferDetailsProps) {
    const isOutbound = type === 'outbound'
    const title = isOutbound ? 'Transfer - Ida' : 'Transfer - Volta'
    const imageUrl = TRANSFER_IMAGES[type]

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
            <motion.button
                className={styles.backButton}
                onClick={onBack}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <ArrowLeft size={20} />
            </motion.button>

            {/* Conteúdo scrollável */}
            <div className={styles.scrollContent}>
                {/* Header */}
                <motion.div
                    className={styles.header}
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                >
                    <div className={styles.titleRow}>
                        <h1 className={styles.title}>{title}</h1>
                        {!transfer.included && (
                            <span className={styles.badgeNotIncluded}>Não incluído</span>
                        )}
                    </div>

                    {transfer.from && transfer.to && (
                        <div className={styles.routeRow}>
                            <MapPin size={18} className={styles.routeIcon} />
                            <p className={styles.routeText}>{transfer.from} → {transfer.to}</p>
                        </div>
                    )}
                </motion.div>

                {/* Card de detalhes - Só mostra se incluído E tiver dados */}
                {transfer.included && (transfer.date || transfer.time || transfer.vehicle || transfer.passengers) && (
                    <motion.div
                        className={styles.infoCard}
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ delay: 0.1 }}
                    >
                        <h3 className={styles.cardTitle}>Detalhes do transfer</h3>

                        <div className={styles.detailsList}>
                            {/* Data e horário - DINÂMICO */}
                            {(transfer.date || transfer.time) && (
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Data e horário</span>
                                    <span className={styles.detailValue}>
                                        {transfer.date}{transfer.time && ` • ${transfer.time}`}
                                    </span>
                                </div>
                            )}

                            {/* Veículo - DINÂMICO */}
                            {transfer.vehicle && (
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Veículo</span>
                                    <span className={styles.detailValue}>{transfer.vehicle}</span>
                                </div>
                            )}

                            {/* Passageiros - DINÂMICO */}
                            {transfer.passengers && (
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Passageiros</span>
                                    <span className={styles.detailValue}>
                                        <Users size={16} className={styles.detailIcon} />
                                        {transfer.passengers}
                                    </span>
                                </div>
                            )}

                            {/* Bagagem - DINÂMICO */}
                            {(transfer.luggage || transfer.handLuggage) && (
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Bagagem</span>
                                    <span className={styles.detailValue}>
                                        {transfer.luggage && (
                                            <>
                                                <Luggage size={16} className={styles.detailIcon} />
                                                {transfer.luggage}
                                            </>
                                        )}
                                        {transfer.handLuggage && (
                                            <>
                                                <Briefcase size={16} className={styles.detailIcon} />
                                                {transfer.handLuggage}
                                            </>
                                        )}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Cancelamento grátis - DINÂMICO */}
                        {transfer.freeCancellation && (
                            <div className={styles.freeCancellation}>
                                <Check size={20} className={styles.checkIconGreen} />
                                <span>Cancelamento grátis</span>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Card quando NÃO incluído */}
                {!transfer.included && (
                    <motion.div
                        className={styles.alertCard}
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ delay: 0.1 }}
                    >
                        <AlertCircle size={24} className={styles.alertIcon} />
                        <div>
                            <h3 className={styles.alertTitle}>Transfer não incluído</h3>
                            <p className={styles.alertText}>
                                Este pacote não inclui transfer. Você precisará providenciar seu próprio transporte do aeroporto até o hotel e vice-versa.
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Card de informações - DINÂMICO */}
                {transfer.details && transfer.details.length > 0 && (
                    <motion.div
                        className={styles.infoCard}
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className={styles.cardTitle}>
                            {transfer.included ? 'Informações importantes' : 'Alternativas de transporte'}
                        </h3>

                        <div className={styles.checkList}>
                            {transfer.details.map((info, index) => (
                                <div key={index} className={styles.checkItem}>
                                    <Check size={20} className={styles.checkIcon} />
                                    <span>{info}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* CTA Fixo */}
            <motion.button
                onClick={onNext}
                className={styles.ctaButton}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
            >
                Continuar
                <ArrowRight size={20} strokeWidth={2.5} />
            </motion.button>
        </div>
    )
}