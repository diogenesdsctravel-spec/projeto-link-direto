import styles from "./HeroScreen.module.css"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import type { ScreenTemplate } from "../../../types/destinationTemplate"

interface HeroScreenProps {
    screen: ScreenTemplate
    onNext?: () => void
}

export default function HeroScreen({ screen, onNext }: HeroScreenProps) {
    function handleNext() {
        if (onNext) {
            onNext()
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.background}>
                <ImageWithFallback
                    src={screen.imageUrl}
                    alt="Destino"
                    className={styles.image}
                />
                <div className={styles.overlay}></div>
            </div>
            <div className={styles.content}>
                <div className={styles.textBlock}>
                    <p className={styles.clientName}>{screen.title}</p>
                    <h1 className={styles.title}>{screen.subtitle}</h1>
                    <p className={styles.subtitle}>{screen.body}</p>
                    <button className={styles.button} onClick={handleNext}>
                        Veja onde você vai se hospedar
                    </button>
                </div>
            </div>
        </div>
    )
}