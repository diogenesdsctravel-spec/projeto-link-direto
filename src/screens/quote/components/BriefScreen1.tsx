import styles from "./BriefScreen1.module.css"
import { ImageWithFallback } from "./figma/ImageWithFallback"

interface BriefScreen1Props {
    agency: {
        ownerPhotoUrl?: string
    }
}

export default function BriefScreen1({ agency }: BriefScreen1Props) {
    function scrollToNext() {
        const container = document.getElementById("quote-container")
        if (container) {
            container.scrollTo({ top: window.innerHeight * 1, behavior: "smooth" })
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.imageSection}>
                <ImageWithFallback
                    src={agency.ownerPhotoUrl || "https://images.unsplash.com/photo-1673515336319-20a3ea59c228?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBjb25zdWx0YW50JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2NjY3NzM5MHww&ixlib=rb-4.1.0&q=80&w=1080"}
                    alt="Consultor DSC Travel"
                    className={styles.image}
                />
            </div>
            <div className={styles.contentSection}>
                <div className={styles.content}>
                    <h1 className={styles.title}>Cuidamos de cada detalhe por você</h1>
                    <p className={styles.subtitle}>
                        Um especialista da DSC Travel acompanha sua viagem do início ao fim.
                    </p>
                    <button className={styles.button} onClick={scrollToNext}>
                        Conhecer meu roteiro
                    </button>
                </div>
            </div>
        </div>
    )
}
