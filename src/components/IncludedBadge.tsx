import type { IncludedStatus } from "../types/destinationTemplate"

type Props = {
    status: IncludedStatus
}

export default function IncludedBadge({ status }: Props) {
    const isIncluded = status === "included"

    return (
        <div
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                borderRadius: 999,
                border: "1px solid #e5e7eb",
                fontSize: 12,
                color: "#111827",
                background: "#ffffff",
            }}
        >
            <span style={{ fontWeight: 700 }}>{isIncluded ? "Incluído" : "Não incluído"}</span>
            <span style={{ color: "#6b7280" }}>{isIncluded ? "no seu pacote" : "no seu pacote"}</span>
        </div>
    )
}
