import styles from "../styles/QuoteVersion.module.css"

interface PaginationProps {
    index: number
    total: number
    light?: boolean
}

export default function Pagination({ index, total, light = false }: PaginationProps) {
    return (
        <div className={`${styles.pagination} ${light ? styles.paginationDark : styles.paginationLight}`}>
            {index + 1}/{total}
        </div>
    )
}