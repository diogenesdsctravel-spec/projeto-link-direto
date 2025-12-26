import { useState, useRef } from "react"
import styles from "./HotelScreen.module.css"
import type { ScreenTemplate } from "../../../types/destinationTemplate"

interface HotelScreenProps {
    screen: ScreenTemplate
    destination: string
    nights: number
    onNext?: () => void
}

export default function HotelScreen({ screen, destination, nights, onNext }: HotelScreenProps) {
    const images = screen.hotelCarouselImageUrls || [screen.imageUrl || ""]
    const [currentSlide, setCurrentSlide] = useState(0)
    const touchStartX = useRef(0)
    const touchStartY = useRef(0)

    // Extrair dados do body
    const bodyLines = (screen.body || "").split("\n").filter(line => line.trim())
    const checkInLine = bodyLines.find(line => line.toLowerCase().includes("check-in")) || ""
    const checkOutLine = bodyLines.find(line => line.toLowerCase().includes("check-out")) || ""

    const checkIn = checkInLine.replace(/check-in:\s*/i, "").trim()
    const checkOut = checkOutLine.replace(/check-out:\s*/i, "").trim()

    const hotelName = (screen.title || "").replace(/\s*★+\s*$/, "").trim()

    function handleNext() {
        if (onNext) {
            onNext()
        }
    }

    function nextSlide() {
        setCurrentSlide((prev) => (prev + 1) % images.length)
    }

    function prevSlide() {
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)
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

    return (
        <div
            className={styles.container}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Carousel backgrounds */}
            {images.map((img, index) => (
                <div
                    key={index}
                    className={styles.slideBackground}
                    style={{
                        backgroundImage: `url(${img})`,
                        opacity: currentSlide === index ? 1 : 0,
                    }}
                />
            ))}

            {/* Overlay */}
            <div className={styles.overlay} />

            {/* Content */}
            <div className={styles.content}>
                <div className={styles.spacer} />

                <div className={styles.hotelInfo}>
                    <p className={styles.location}>
                        {destination.toUpperCase()} · {nights} {nights === 1 ? "DIA" : "DIAS"}
                    </p>

                    <h1 className={styles.hotelName}>{hotelName}</h1>

                    <p className={styles.description}>{screen.subtitle}</p>

                    <div className={styles.dates}>
                        {checkIn && <p className={styles.dateText}>Chegada: {checkIn}</p>}
                        {checkOut && <p className={styles.dateText}>Partida: {checkOut}</p>}
                    </div>
                </div>

                {/* Dots */}
                {images.length > 1 && (
                    <div className={styles.dots}>
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`${styles.dot} ${currentSlide === index ? styles.dotActive : styles.dotInactive}`}
                                aria-label={`Ir para foto ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                <button className={styles.button} onClick={handleNext}>
                    Ver detalhes da sua estadia
                </button>
            </div>
        </div>
    )
}