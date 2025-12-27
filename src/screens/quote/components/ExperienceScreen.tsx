/**
 * EXPERIENCE SCREEN - Experiências que te esperam
 * 
 * Redesign com mesmo padrão estrutural do HotelScreen:
 * - Background blur
 * - Gradientes (top e bottom)
 * - Header scrollável
 * - Imagem principal da experiência
 * - Card azul com descrição
 * - Carrossel com dots
 * - Botão CTA fixo no bottom
 * 
 * ⚠️ TODOS OS DADOS SÃO DINÂMICOS - vem do banco/template
 */

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import styles from "./ExperienceScreen.module.css"
import type { ExperienceTemplate } from "../../../types/destinationTemplate"

// Variantes de animação
const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
    }
}

interface ExperienceScreenProps {
    experiences: ExperienceTemplate[]
    destination: string
    onNext?: () => void
    onBack?: () => void
}

export default function ExperienceScreen({
    experiences,
    destination,
    onNext,
    onBack
}: ExperienceScreenProps) {

    const [currentIndex, setCurrentIndex] = useState(0)

    const nextExperience = () => {
        setCurrentIndex((prev) => (prev + 1) % experiences.length)
    }

    const prevExperience = () => {
        setCurrentIndex((prev) => (prev - 1 + experiences.length) % experiences.length)
    }

    // Fallback se não houver experiências
    if (!experiences || experiences.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.scrollContent}>
                    <p>Nenhuma experiência disponível</p>
                </div>
            </div>
        )
    }

    const current = experiences[currentIndex]

    // Imagem da experiência ou fallback baseado no destino
    const experienceImage = current.imageUrl ||
        `https://source.unsplash.com/800x600/?${destination},${current.title}`

    return (
        <div className={styles.container}>
            {/* Background com blur */}
            <div className={styles.backgroundBlur}>
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentIndex}
                        src={experienceImage}
                        alt=""
                        className={styles.backgroundImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    />
                </AnimatePresence>
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

            {/* Navegação do carrossel - absoluta */}
            {experiences.length > 1 && (
                <>
                    <button className={styles.navButtonLeft} onClick={prevExperience}>
                        <ChevronLeft size={24} />
                    </button>
                    <button className={styles.navButtonRight} onClick={nextExperience}>
                        <ChevronRight size={24} />
                    </button>
                </>
            )}

            {/* Conteúdo scrollável */}
            <div className={styles.scrollContent}>
                {/* Header com badge */}
                <motion.div
                    className={styles.header}
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                >
                    <div className={styles.badge}>
                        <span className={styles.badgeIcon}>{current.icon}</span>
                        <span>{current.subtitle}</span>
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
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentIndex}
                            src={experienceImage}
                            alt={current.title}
                            className={styles.mainImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                        />
                    </AnimatePresence>
                </motion.div>

                {/* Card de informações */}
                <motion.div
                    className={styles.infoCard}
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ delay: 0.2 }}
                >
                    {/* Nome da experiência */}
                    <AnimatePresence mode="wait">
                        <motion.h1
                            key={currentIndex}
                            className={styles.experienceName}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {current.title}
                        </motion.h1>
                    </AnimatePresence>

                    {/* Subtítulo verde */}
                    <p className={styles.highlightText}>Imagine viver isso.</p>

                    {/* Descrição */}
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={currentIndex}
                            className={styles.description}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            {current.description || current.subtitle}
                        </motion.p>
                    </AnimatePresence>
                </motion.div>

                {/* Dots do carrossel */}
                <motion.div
                    className={styles.dots}
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ delay: 0.3 }}
                >
                    {experiences.map((_, index) => (
                        <span
                            key={index}
                            className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
                            onClick={() => setCurrentIndex(index)}
                        />
                    ))}
                </motion.div>
            </div>

            {/* CTA Fixo */}
            <motion.button
                onClick={onNext}
                className={styles.ctaButton}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
            >
                Ver detalhes do voo
                <ArrowRight size={20} strokeWidth={2.5} />
            </motion.button>
        </div>
    )
}