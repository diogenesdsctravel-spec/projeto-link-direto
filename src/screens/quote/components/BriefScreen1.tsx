import styles from "../styles/QuoteVersion.module.css"
import type { AgencyProfile } from "../../../services/agencyService"

interface BriefScreen1Props {
    agency: AgencyProfile
    clientName: string
}

export default function BriefScreen1({ agency, clientName }: BriefScreen1Props) {
    function scrollToNext() {
        console.log("Botão clicado!")
        const container = document.getElementById("quote-container")
        console.log("Container encontrado:", container)
        if (container) {
            console.log("Scroll height:", container.scrollHeight)
            container.scrollTo({ top: window.innerHeight, behavior: "smooth" })
        }
    }

    return (
        <div className={styles.briefScreen1}>
            <div
                className={styles.briefScreen1Photo}
                style={{
                    backgroundImage: agency.ownerPhotoUrl ? `url(${agency.ownerPhotoUrl})` : undefined,
                    backgroundColor: agency.ownerPhotoUrl ? undefined : "#e5e7eb",
                }}
            />

            <div className={styles.briefScreen1Content}>
                <h1 className={styles.briefScreen1Title}>
                    Cuidamos de cada detalhe por você
                </h1>

                <p className={styles.briefScreen1Subtitle}>
                    Um especialista da DSC Travel acompanha sua viagem do início ao fim.
                </p>

                <button onClick={scrollToNext} className={styles.ctaButton}>
                    Conhecer meu roteiro
                </button>
            </div>
        </div>
    )
}
