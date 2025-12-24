import styles from "../styles/QuoteVersion.module.css"
import type { AgencyProfile } from "../../../services/agencyService"

interface BriefScreen2Props {
    agency: AgencyProfile
}

export default function BriefScreen2({ agency }: BriefScreen2Props) {
    const backgroundUrl = agency.storeFacadeUrl || agency.storeInteriorUrl

    function scrollToNext() {
        const container = document.getElementById("quote-container")
        if (container) {
            container.scrollTo({ top: window.innerHeight * 2, behavior: "smooth" })
        }
    }

    return (
        <div className={styles.briefScreen2}>
            {/* Background */}
            {backgroundUrl ? (
                <div
                    className={styles.briefScreen2Background}
                    style={{ backgroundImage: `url(${backgroundUrl})` }}
                >
                    <div className={styles.briefScreen2Overlay} />
                </div>
            ) : (
                <div
                    className={styles.briefScreen2Background}
                    style={{ background: agency.colorPrimary }}
                />
            )}

            {/* Conteúdo */}
            <div className={styles.briefScreen2Content}>
                <h2 className={styles.briefScreen2Title}>
                    Nada aqui é improvisado.
                </h2>

                <p className={styles.briefScreen2Subtitle}>
                    Sua viagem é construída com critério, clareza e acompanhamento real.
                </p>

                <div className={styles.briefScreen2Items}>
                    <div className={styles.briefScreen2Item}>
                        <h3>Planejamento</h3>
                        <p>Antes de qualquer sugestão.</p>
                    </div>

                    <div className={styles.briefScreen2Item}>
                        <h3>Curadoria</h3>
                        <p>Menos opções. Melhores escolhas.</p>
                    </div>

                    <div className={styles.briefScreen2Item}>
                        <h3>Acompanhamento</h3>
                        <p>Você não fica sozinho.</p>
                    </div>
                </div>

                <button onClick={scrollToNext} className={styles.ctaButton}>
                    Ver como sua viagem foi desenhada
                </button>
            </div>
        </div>
    )
}
