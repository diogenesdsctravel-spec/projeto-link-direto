import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, ArrowLeft, Star, ChevronLeft, ChevronRight } from "lucide-react"
import styles from "./HotelScreen.module.css"
import type { ScreenTemplate } from "../../../types/destinationTemplate"

/**
 * HOTEL SCREEN - Redesign baseado no Figma
 * 
 * Layout com scroll:
 * - Header scrollável (nome + estrelas + endereço)
 * - Carrossel de fotos centralizado
 * - Seção "Destaques da acomodação"
 * - Card azul com datas e amenities
 * - Botão CTA fixo no bottom
 * - Background com blur
 */

// Variantes de animação
const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
    }
}

interface HotelScreenProps {
    screen: ScreenTemplate
    destination: string
    nights: number
    onNext?: () => void
    onBack?: () => void
    checkIn?: string
    checkOut?: string
    roomType?: string
    address?: string
    hotelStars?: number
}

export default function HotelScreen({
    screen,
    destination,
    nights,
    onNext,
    onBack,
    checkIn,
    checkOut,
    address,
    hotelStars = 4
}: HotelScreenProps) {

    // Imagens do carrossel
    const images = screen.hotelCarouselImageUrls || [screen.imageUrl]
    const [currentImage, setCurrentImage] = useState(0)

    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % images.length)
    }

    const prevImage = () => {
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
    }

    // Extrair nome do hotel do título (ex: "Hotel Serra Azul ★★★★")
    const hotelName = screen.title?.replace(/★+/g, '').trim() || "Seu Hotel"

    // Renderizar estrelas
    const renderStars = () => {
        return Array.from({ length: hotelStars }, (_, i) => (
            <Star key={i} size={24} className={styles.star} fill="#FBBF24" color="#FBBF24" />
        ))
    }

    return (
        <div className={styles.container}>
            {/* Background com blur */}
            <div className={styles.backgroundBlur}>
                <img
                    src={images[0]}
                    alt=""
                    className={styles.backgroundImage}
                />
            </div>

            {/* Gradiente superior */}
            <div className={styles.gradientTop}></div>

            {/* Gradiente inferior */}
            <div className={styles.gradientBottom}></div>

            {/* Botão voltar - fixo */}
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
                {/* Header - Nome do hotel */}
                <motion.div
                    className={styles.header}
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                >
                    <h1 className={styles.hotelName}>{hotelName}</h1>
                    <div className={styles.starsRow}>
                        {renderStars()}
                    </div>
                    <p className={styles.address}>{address || `Av. das Hortênsias 4665`}</p>
                </motion.div>

                {/* Carrossel de fotos */}
                <motion.div
                    className={styles.carouselContainer}
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ delay: 0.1 }}
                >
                    <div className={styles.carousel}>
                        <motion.img
                            key={currentImage}
                            src={images[currentImage]}
                            alt={hotelName}
                            className={styles.carouselImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                        />

                        {/* Navegação do carrossel */}
                        {images.length > 1 && (
                            <>
                                <button className={styles.navLeft} onClick={prevImage}>
                                    <ChevronLeft size={24} />
                                </button>
                                <button className={styles.navRight} onClick={nextImage}>
                                    <ChevronRight size={24} />
                                </button>

                                {/* Dots */}
                                <div className={styles.dots}>
                                    {images.map((_, index) => (
                                        <span
                                            key={index}
                                            className={`${styles.dot} ${index === currentImage ? styles.dotActive : ''}`}
                                            onClick={() => setCurrentImage(index)}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>

                {/* Seção de destaques */}
                <motion.div
                    className={styles.highlightsSection}
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className={styles.sectionTitle}>Destaques da acomodação</h2>

                    <p className={styles.description}>
                        Imagine acordar aqui. Seu refúgio em {destination}. Perto de tudo, mas longe do barulho.
                        Um lugar onde o luxo encontra a natureza e o conforto abraça a tranquilidade.
                    </p>
                </motion.div>

                {/* Card de informações */}
                <motion.div
                    className={styles.infoCard}
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ delay: 0.3 }}
                >
                    {/* Datas e noites */}
                    <div className={styles.datesGrid}>
                        <div className={styles.dateItem}>
                            <span className={styles.dateLabel}>CHEGADA</span>
                            <span className={styles.dateValue}>{checkIn || "qua. 18"}</span>
                            <span className={styles.dateValue}>{checkIn ? "" : "mar. 2026"}</span>
                        </div>
                        <div className={styles.dateDivider}></div>
                        <div className={styles.dateItem}>
                            <span className={styles.dateLabel}>DESPEDIDA</span>
                            <span className={styles.dateValue}>{checkOut || "qua. 25"}</span>
                            <span className={styles.dateValue}>{checkOut ? "" : "mar. 2026"}</span>
                        </div>
                        <div className={styles.dateDivider}></div>
                        <div className={styles.dateItem}>
                            <span className={styles.dateLabel}>NOITES</span>
                            <span className={styles.nightsValue}>{nights}</span>
                        </div>
                    </div>

                    {/* Amenity */}
                    <div className={styles.amenityRow}>
                        <div className={styles.amenityIcon}>
                            <div className={styles.checkIcon}></div>
                        </div>
                        <span className={styles.amenityText}>Café colonial incluso</span>
                    </div>
                </motion.div>

                {/* Espaço para o botão fixo */}
                <div className={styles.buttonSpacer}></div>
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
                Ver o que vou viver
                <ArrowRight size={20} strokeWidth={2.5} />
            </motion.button>
        </div>
    )
}