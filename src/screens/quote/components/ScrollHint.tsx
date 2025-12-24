import styles from "../styles/QuoteVersion.module.css"

interface ScrollHintProps {
    light?: boolean
}

export default function ScrollHint({ light = false }: ScrollHintProps) {
    return (
        <div className={styles.scrollHint}>
            <span>Deslize para continuar</span>
            <span className={styles.scrollHintArrow}>↓</span>
        </div>
    )
}