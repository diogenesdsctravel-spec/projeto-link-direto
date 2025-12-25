import styles from "./BriefScreen2.module.css"
import { ImageWithFallback } from "./figma/ImageWithFallback"

interface BriefScreen2Props {
    agency: {
        storeInteriorUrl?: string
    }
}

export default function BriefScreen2({ agency }: BriefScreen2Props) {
    function scrollToNext() {
        const container = document.getElementById("quote-container")
        if (container) {
            container.scrollTo({ top: window.innerHeight * 2, behavior: "smooth" })
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.background}>
                <ImageWithFallback
                    src={agency.storeInteriorUrl || "https://images.unsplash.com/photo-1729691594347-5b47d53f7754?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBhZ2VuY3klMjBzdG9yZSUyMGludGVyaW9yfGVufDF8fHx8MTc2NjY3NzM5MHww&ixlib=rb-4.1.0&q=80&w=1080"}
                    alt="Interior da DSC Travel"
                    className={styles.image}
                />
                <div className={styles.overlay}></div>
            </div>
            <div className={styles.content}>
                <div className={styles.textContent}>
                    <h1 className={styles.title}>Nada aqui é improvisado.</h1>
                    <p className={styles.subtitle}>
                        Sua viagem é construída com critério, clareza e acompanhamento real.
                    </p>
                    <div className={styles.items}>
                        <div className={styles.item}>
                            <h3 className={styles.itemTitle}>Planejamento</h3>
                            <p className={styles.itemText}>Antes de qualquer sugestão.</p>
                        </div>
                        <div className={styles.item}>
                            <h3 className={styles.itemTitle}>Curadoria</h3>
                            <p className={styles.itemText}>Menos opções. Melhores escolhas.</p>
                        </div>
                        <div className={styles.item}>
                            <h3 className={styles.itemTitle}>Acompanhamento</h3>
                            <p className={styles.itemText}>Você não fica sozinho.</p>
                        </div>
                    </div>
                </div>
                <button className={styles.button} onClick={scrollToNext}>
                    Ver como sua viagem foi desenhada
                </button>
            </div>
        </div>
    )
}