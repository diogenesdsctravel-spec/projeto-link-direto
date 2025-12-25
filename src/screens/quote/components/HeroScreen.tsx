import styles from "./HeroScreen.module.css"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import type { ScreenTemplate } from "../../../types/destinationTemplate"

interface HeroScreenProps {
    screen: ScreenTemplate
}

export default function HeroScreen({ screen }: HeroScreenProps) {
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
                    <button className={styles.button} onClick={scrollToNext}>
                        Veja onde você vai se hospedar
                    </button>
                </div>
            </div>
        </div>
    )
}