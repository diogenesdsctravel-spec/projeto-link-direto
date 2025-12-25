import { useState, useRef } from "react"
import styles from "./ExperienceScreen.module.css"
import type { ExperienceTemplate } from "../../../types/destinationTemplate"

interface ExperienceScreenProps {
    experiences: ExperienceTemplate[]
    destination: string
}

export default function ExperienceScreen({ experiences, destination }: ExperienceScreenProps) {
    const [currentSlide, setCurrentSlide] = useState(0)
    const touchStartX = useRef(0)
    const touchStartY = useRef(0)

    const currentExperience = experiences[currentSlide]

    function scrollToNext() {
        const container = document.getElementById("quote-container")
        if (container) {
            const currentScroll = container.scrollTop
            container.scrollTo({
                top: currentScroll + window.innerHeight,
                behavior: "smooth"
            })
        }
    }

    function nextSlide() {
        setCurrentSlide((prev) => (prev + 1) % experiences.length)
    }

    function prevSlide() {
        setCurrentSlide((prev) => (prev - 1 + experiences.length) % experiences.length)
    }

    function goToSlide(index: number) {
        setCurrentSlide(index)
    }

    function handleTouchStart(e: React.TouchEvent) {
        touchStartX.current = e.touches[0].clientX
        touchStartY.current = e.touches[0].clientY
    }

    function handleTouchEnd(e: React.TouchEvent) {
        const touchEndX = e.changedTouches[0].clientX
        const touchEndY = e.changedTouches[0].clientY

        const diffX = touchStartX.current - touchEndX
        const diffY = touchStartY.current - touchEndY

        // Só muda slide se o swipe for mais horizontal que vertical
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                nextSlide()
            } else {
                prevSlide()
            }
        }
    }

    if (!experiences || experiences.length === 0) {
        return null
    }

    return (
        <div
            className={styles.container}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Carousel backgrounds */}
            {experiences.map((exp, index) => (
                <div
                    key={exp.experienceId || index}
                    className={styles.slideBackground}
                    style={{
                        backgroundImage: `url(${exp.imageUrl})`,
                        opacity: currentSlide === index ? 1 : 0,
                    }}
                />
            ))}

            {/* Overlay */}
            <div className={styles.overlay} />

            {/* Content */}
            <div className={styles.content}>
                <div className={styles.header}>
                    <h2 className={styles.headerTitle}>Experiências que te esperam</h2>
                </div>

                <div className={styles.spacer} />

                <div className={styles.experienceInfo}>
                    <h1 className={styles.experienceName}>{currentExperience.title}</h1>

                    {currentExperience.subtitle && (
                        <p className={styles.experienceSubtitle}>{currentExperience.subtitle}</p>
                    )}

                    {/* ✅ NOVO: Exibir description */}
                    {currentExperience.description && (
                        <p className={styles.experienceDescription}>{currentExperience.description}</p>
                    )}
                </div>

                {/* Dots */}
                {experiences.length > 1 && (
                    <div className={styles.dots}>
                        {experiences.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`${styles.dot} ${currentSlide === index ? styles.dotActive : styles.dotInactive}`}
                                aria-label={`Ir para experiência ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                <button className={styles.button} onClick={scrollToNext}>
                    Continuar
                </button>
            </div>
        </div>
    )
}