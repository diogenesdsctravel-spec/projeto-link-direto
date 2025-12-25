import styles from "./BriefScreen3.module.css"
import { ImageWithFallback } from "./figma/ImageWithFallback"

interface BriefScreen3Props {
    agency: {
        ownerServingPhotoUrl?: string
    }
}

export default function BriefScreen3({ agency }: BriefScreen3Props) {
    function scrollToNext() {
        const container = document.getElementById("quote-container")
        if (container) {
            container.scrollTo({ top: window.innerHeight * 3, behavior: "smooth" })
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.background}>
                <ImageWithFallback
                    src={agency.ownerServingPhotoUrl || "https://images.unsplash.com/photo-1740818576358-7596eb883cf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdWx0YW50JTIwaGVscGluZyUyMGN1c3RvbWVyfGVufDF8fHx8MTc2NjY3NzM5MXww&ixlib=rb-4.1.0&q=80&w=1080"}
                    alt="Atendimento DSC Travel"
                    className={styles.image}
                />
                <div className={styles.overlay}></div>
            </div>
            <div className={styles.content}>
                <div className={styles.textContent}>
                    <h1 className={styles.title}>Fazemos isso todos os dias.</h1>
                    <p className={styles.subtitle}>
                        Confiança construída com experiência e dedicação.
                    </p>
                    <div className={styles.items}>
                        <div className={styles.item}>
                            <h3 className={styles.itemTitle}>+3.000 famílias</h3>
                            <p className={styles.itemText}>Atendidas com excelência.</p>
                        </div>
                        <div className={styles.item}>
                            <h3 className={styles.itemTitle}>Nota 5.0 no Google</h3>
                            <p className={styles.itemText}>Avaliação máxima dos clientes.</p>
                        </div>
                        <div className={styles.item}>
                            <h3 className={styles.itemTitle}>Suporte completo</h3>
                            <p className={styles.itemText}>Durante toda a viagem.</p>
                        </div>
                    </div>
                </div>
                <button className={styles.button} onClick={scrollToNext}>
                    Ver o roteiro criado para você
                </button>
            </div>
        </div>
    )
}