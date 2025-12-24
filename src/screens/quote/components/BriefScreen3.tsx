import styles from "../styles/QuoteVersion.module.css"
import type { AgencyProfile } from "../../../services/agencyService"

interface BriefScreen3Props {
    agency: AgencyProfile
}

export default function BriefScreen3({ agency }: BriefScreen3Props) {
    function scrollToNext() {
        console.log("BriefScreen3 - Botão clicado!")
        const container = document.getElementById("quote-container")
        console.log("Container:", container)
        if (container) {
            container.scrollTo({ top: window.innerHeight * 3, behavior: "smooth" })
        }
    }

    return (
        <div className={styles.briefScreen3}>
            {agency.ownerServingPhotoUrl ? (
                <div
                    className={styles.briefScreen3Background}
                    style={{ backgroundImage: `url(${agency.ownerServingPhotoUrl})` }}
                >
                    <div className={styles.briefScreen3Overlay} />
                </div>
            ) : (
                <div
                    className={styles.briefScreen3Background}
                    style={{ background: agency.colorPrimary }}
                />
            )}

            <div className={styles.briefScreen3Content}>
                <h2 className={styles.briefScreen3Title}>
                    Fazemos isso todos os dias.
                </h2>

                <div className={styles.briefScreen3Spacer} />

                <div className={styles.briefScreen3Metrics}>
                    <p className={styles.briefScreen3Metric}>+3.000 famílias atendidas</p>
                    <p className={styles.briefScreen3Metric}>5.0 no Google</p>
                    <p className={styles.briefScreen3Metric}>Suporte durante toda a viagem</p>
                </div>

                <button
                    onClick={scrollToNext}
                    onTouchEnd={scrollToNext}
                    className={styles.ctaButton}
                >
                    Ver o roteiro criado para você
                </button>
            </div>
        </div>
    )
}
