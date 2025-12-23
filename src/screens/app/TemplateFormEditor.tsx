import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { repositories } from "../../services/repositories"
import type { TemplateForm } from "../../types/templateForm"

function buildEmptyForm(destinationKey: string): TemplateForm {
    return {
        destinationKey,
        heroImageUrl: "",
        experiences: [],
        hotelCarouselImageUrls: ["", "", "", "", ""],
        transferImageUrl: "",
        finalNote: "",
    }
}

export default function TemplateFormEditor() {
    const params = useParams()
    const destinationKey = String(params.destinationKey ?? "")
    const [form, setForm] = useState<TemplateForm | null>(null)
    const [status, setStatus] = useState<"idle" | "loading" | "saving" | "saved" | "error">("idle")

    const canRender = useMemo(() => destinationKey.length > 0, [destinationKey])

    useEffect(() => {
        if (!canRender) return

        setStatus("loading")
        repositories.templateFormRepository
            .getByDestinationKey(destinationKey)
            .then((existing) => {
                setForm(existing ?? buildEmptyForm(destinationKey))
                setStatus("idle")
            })
            .catch(() => {
                setStatus("error")
            })
    }, [canRender, destinationKey])

    if (!canRender) {
        return (
            <div style={{ padding: 18, fontFamily: "system-ui" }}>
                destinationKey inválido
            </div>
        )
    }

    if (!form) {
        return (
            <div style={{ padding: 18, fontFamily: "system-ui" }}>
                carregando...
            </div>
        )
    }

    async function save() {
        try {
            setStatus("saving")
            await repositories.templateFormRepository.upsert(form)
            setStatus("saved")
            window.setTimeout(() => setStatus("idle"), 900)
        } catch {
            setStatus("error")
        }
    }

    return (
        <div style={{ padding: 18, fontFamily: "system-ui", maxWidth: 880, margin: "0 auto" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>
                Editor de Template
            </div>

            <div style={{ marginTop: 6, fontSize: 13, color: "#6b7280" }}>
                destino: {form.destinationKey}
            </div>

            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Hero image URL</div>
                    <input
                        value={form.heroImageUrl ?? ""}
                        onChange={(e) => setForm({ ...form, heroImageUrl: e.target.value })}
                        placeholder="cole a URL aqui"
                        style={{
                            width: "100%",
                            marginTop: 8,
                            padding: "12px 12px",
                            borderRadius: 12,
                            border: "1px solid #e5e7eb",
                            outline: "none",
                            fontSize: 14,
                        }}
                    />
                </div>

                <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Hotel carousel (5 URLs)</div>

                    <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
                        {(form.hotelCarouselImageUrls ?? ["", "", "", "", ""]).slice(0, 5).map((value, idx) => (
                            <input
                                key={idx}
                                value={value}
                                onChange={(e) => {
                                    const next = [...(form.hotelCarouselImageUrls ?? ["", "", "", "", ""])]
                                    next[idx] = e.target.value
                                    setForm({ ...form, hotelCarouselImageUrls: next })
                                }}
                                placeholder={`URL ${idx + 1}`}
                                style={{
                                    width: "100%",
                                    padding: "12px 12px",
                                    borderRadius: 12,
                                    border: "1px solid #e5e7eb",
                                    outline: "none",
                                    fontSize: 14,
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <button
                        onClick={save}
                        disabled={status === "saving" || status === "loading"}
                        style={{
                            padding: "12px 14px",
                            borderRadius: 14,
                            border: "1px solid #111827",
                            background: "#111827",
                            color: "#ffffff",
                            fontWeight: 800,
                            cursor: status === "saving" || status === "loading" ? "not-allowed" : "pointer",
                        }}
                    >
                        {status === "saving" ? "Salvando..." : "Salvar"}
                    </button>

                    <div style={{ fontSize: 13, color: status === "error" ? "#b91c1c" : "#6b7280" }}>
                        {status === "saved" ? "Salvo" : status === "error" ? "Erro ao salvar" : ""}
                    </div>
                </div>
            </div>
        </div>
    )
}
