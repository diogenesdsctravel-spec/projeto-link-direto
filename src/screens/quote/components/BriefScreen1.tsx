import { motion } from "framer-motion"
import { ArrowRight, ArrowLeft } from "lucide-react"
import styles from "./BriefScreen1.module.css"

/**
 * BRIEF SCREEN 1 - "ISSO É REAL"
 * 
 * Segunda tela do fluxo narrativo (após QuoteIndex)
 * Mostra a equipe DSC Travel e a proposta de valor humano
 * 
 * 🎬 ANIMAÇÕES (mesmo padrão do QuoteIndex):
 * - Background: zoom sutil contínuo via CSS
 * - Badge: fade in de cima
 * - Título: fade in com stagger
 * - Descrição: fade in com stagger
 * - Botão: fade in + hover/tap suaves
 * - Dots: fade in
 */

// Variantes de animação - SUAVES E LENTAS (mesmo padrão do QuoteIndex)
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

interface BriefScreen1Props {
    agency?: {
        ownerPhotoUrl?: string
    } | null
    clientName?: string
    onBack?: () => void
    onNext?: () => void
}

export default function BriefScreen1({ agency, onBack, onNext }: BriefScreen1Props) {

    // Imagem da equipe DSC
    const backgroundImage = agency?.ownerPhotoUrl
        || "https://tlwfrmzrhldjbxetmdfb.supabase.co/storage/v1/object/public/images/FOTO%20CONFIANTE.JPG"

    return (
        <div className={styles.container}>
            {/* Background com zoom sutil via CSS */}
            <div className={styles.background}>
                <img
                    src={backgroundImage}
                    alt="Equipe DSC Travel"
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

                {/* Badge emocional */}
                <motion.div className={styles.badge} variants={badgeVariants}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#50CFAD" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>Pessoas reais cuidando de você</span>
                </motion.div>

                {/* Título narrativo */}
                <div className={styles.titleGroup}>
                    <motion.h1 className={styles.mainTitle} variants={itemVariants}>
                        <span className={styles.emphasis}>ISSO É REAL</span>
                        <span className={styles.connector}>Nossa equipe te acompanha</span>
                    </motion.h1>

                    <motion.p className={styles.description} variants={itemVariants}>
                        Não é automático. Não é frio.<br />
                        São <strong>pessoas</strong> que entendem de viagem,<br />
                        que <strong>sentem</strong> o que você precisa,<br />
                        que <strong>cuidam</strong> de cada detalhe como se fosse a viagem delas.
                    </motion.p>
                </div>

                {/* CTA */}
                <motion.button
                    onClick={onNext}
                    className={styles.ctaButton}
                    variants={itemVariants}
                    whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
                    whileTap={{ scale: 0.99, transition: { duration: 0.1 } }}
                >
                    Continuar minha história
                    <ArrowRight size={20} strokeWidth={2.5} />
                </motion.button>

                {/* Progress dots */}
                <motion.div className={styles.progressHint} variants={itemVariants}>
                    <span className={styles.progressDot} style={{ opacity: 0.4 }}></span>
                    <span className={styles.progressDot}></span>
                    <span className={styles.progressDot} style={{ opacity: 0.3 }}></span>
                </motion.div>
            </motion.div>
        </div>
    )
}