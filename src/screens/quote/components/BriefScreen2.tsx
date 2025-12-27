import { motion } from "framer-motion"
import { ArrowRight, ArrowLeft } from "lucide-react"
import styles from "./BriefScreen2.module.css"

/**
 * BRIEF SCREEN 2 - "ESTÁ PRONTO?"
 * 
 * Terceira tela do fluxo narrativo (após BriefScreen1)
 * Momento de transição - prepara o cliente para ver o roteiro
 * 
 * 🎬 ANIMAÇÕES (mesmo padrão do QuoteIndex e BriefScreen1):
 * - Background: zoom sutil contínuo via CSS
 * - Badge: fade in absoluto no topo
 * - Título: fade in com stagger
 * - Descrição: fade in com stagger
 * - Botão: fade in + hover/tap suaves (absoluto no bottom)
 * - Dots: fade in (absoluto no bottom)
 */

// Variantes de animação - SUAVES E LENTAS (mesmo padrão)
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.4
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1]
        }
    }
}

const badgeVariants = {
    hidden: { opacity: 0, y: -15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0.2
        }
    }
}

interface BriefScreen2Props {
    agency?: {
        officePhotoUrl?: string
    } | null
    onBack?: () => void
    onNext?: () => void
}

export default function BriefScreen2({ agency, onBack, onNext }: BriefScreen2Props) {

    // Imagem do escritório/preparação
    const backgroundImage = agency?.officePhotoUrl
        || "https://lh3.googleusercontent.com/p/AF1QipMMxs6JOGDJdZQOlamgssyu6jfLeg7prvBH9W7L=s1360-w1360-h1020-rw"

    return (
        <div className={styles.container}>
            {/* Background com zoom sutil via CSS */}
            <div className={styles.background}>
                <img
                    src={backgroundImage}
                    alt="Preparação da viagem"
                    className={styles.backgroundImage}
                />
                <div className={styles.overlay}></div>
            </div>

            {/* Conteúdo */}
            <motion.div
                className={styles.content}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Botão voltar */}
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

                {/* Badge emocional - absoluto no topo */}
                <motion.div className={styles.badge} variants={badgeVariants}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#50CFAD" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span>Tudo já está preparado</span>
                </motion.div>

                {/* Título narrativo */}
                <div className={styles.titleGroup}>
                    <motion.h1 className={styles.mainTitle} variants={itemVariants}>
                        <span className={styles.emphasis}>ESTÁ PRONTO?</span>
                        <span className={styles.connector}>Sua viagem começa agora</span>
                    </motion.h1>

                    <motion.p className={styles.description} variants={itemVariants}>
                        Cada hotel escolhido a dedo.<br />
                        Cada experiência pensada para você.<br />
                        Cada transfer no momento certo.<br />
                        <br />
                        <strong>Respira fundo. É hora de viajar.</strong>
                    </motion.p>
                </div>

                {/* CTA - absoluto no bottom */}
                <motion.button
                    onClick={onNext}
                    className={styles.ctaButton}
                    variants={itemVariants}
                    whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
                    whileTap={{ scale: 0.99, transition: { duration: 0.1 } }}
                >
                    Começar minha jornada
                    <ArrowRight size={20} strokeWidth={2.5} />
                </motion.button>

                {/* Progress dots - absoluto no bottom */}
                <motion.div className={styles.progressHint} variants={itemVariants}>
                    <span className={styles.progressDot} style={{ opacity: 0.4 }}></span>
                    <span className={styles.progressDot} style={{ opacity: 0.4 }}></span>
                    <span className={styles.progressDot}></span>
                </motion.div>
            </motion.div>
        </div>
    )
}