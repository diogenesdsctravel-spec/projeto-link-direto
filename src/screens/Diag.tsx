import { useMemo, useState } from "react"
import { repositories } from "../services/repositories"
import { getAppEnv } from "../services/env"

type Check = {
    name: string
    ok: boolean
    details?: string
}

function safeTypeof(x: unknown) {
    return typeof x
}

export default function Diag() {
    const [publicId, setPublicId] = useState("mock-123")
    const [versionId, setVersionId] = useState("v1")
    const [running, setRunning] = useState(false)
    const [checks, setChecks] = useState<Check[]>([])
    const [result, setResult] = useState<any>(null)

    const env = useMemo(() => {
        try {
            return getAppEnv()
        } catch {
            return "unknown"
        }
    }, [])

    async function run() {
        setRunning(true)
        setChecks([])
        setResult(null)

        const list: Check[] = []

        const qvr: any = repositories.quoteVersionRepository as any
        const dtr: any = repositories.destinationTemplateRepository as any

        list.push({
            name: "repositories.quoteVersionRepository existe",
            ok: !!qvr,
            details: safeTypeof(qvr),
        })

        list.push({
            name: "quoteVersionRepository.getVersion existe",
            ok: typeof qvr?.getVersion === "function",
            details: safeTypeof(qvr?.getVersion),
        })

        list.push({
            name: "repositories.destinationTemplateRepository existe",
            ok: !!dtr,
            details: safeTypeof(dtr),
        })

        list.push({
            name: "destinationTemplateRepository.getByDestinationKey existe",
            ok: typeof dtr?.getByDestinationKey === "function",
            details: safeTypeof(dtr?.getByDestinationKey),
        })

        setChecks(list)

        try {
            if (typeof qvr?.getVersion !== "function") {
                setResult({ error: "getVersion não é função" })
                return
            }

            const version = await qvr.getVersion(publicId, versionId)

            if (!version) {
                setResult({ version: null, error: "getVersion retornou null" })
                return
            }

            const destinationKey = (version as any).destinationKey
            const hasDestinationKey = typeof destinationKey === "string" && destinationKey.length > 0

            const next: any = {
                version,
                destinationKey,
                hasDestinationKey,
            }

            if (!hasDestinationKey) {
                setResult({
                    ...next,
                    error: "version não tem destinationKey (string)",
                })
                return
            }

            if (typeof dtr?.getByDestinationKey !== "function") {
                setResult({
                    ...next,
                    error: "getByDestinationKey não é função",
                })
                return
            }

            const template = await dtr.getByDestinationKey(destinationKey)
            next.template = template

            if (!template) {
                setResult({
                    ...next,
                    error: "template retornou null para esse destinationKey",
                })
                return
            }

            const screens = (template as any).screens
            next.screensCount = Array.isArray(screens) ? screens.length : null
            next.hasScreensArray = Array.isArray(screens)

            setResult(next)
        } catch (e: any) {
            setResult({ error: "exceção", message: String(e?.message ?? e) })
        } finally {
            setRunning(false)
        }
    }

    return (
        <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 900, margin: "0 auto" }}>
            <div style={{ fontSize: 22, fontWeight: 900 }}>Diagnóstico</div>
            <div style={{ marginTop: 6, fontSize: 13, color: "#6b7280" }}>appEnv: {String(env)}</div>

            <div style={{ marginTop: 16, padding: 16, borderRadius: 16, border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: 14, fontWeight: 900 }}>Teste de carregamento de versão</div>

                <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <input
                        value={publicId}
                        onChange={(e) => setPublicId(e.target.value)}
                        placeholder="publicId"
                        style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid #e5e7eb", minWidth: 220 }}
                    />
                    <input
                        value={versionId}
                        onChange={(e) => setVersionId(e.target.value)}
                        placeholder="versionId"
                        style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid #e5e7eb", minWidth: 120 }}
                    />
                    <button
                        onClick={run}
                        disabled={running}
                        style={{
                            padding: "10px 12px",
                            borderRadius: 12,
                            border: "1px solid #111827",
                            background: "#111827",
                            color: "#fff",
                            fontWeight: 900,
                            cursor: running ? "not-allowed" : "pointer",
                        }}
                    >
                        {running ? "Rodando..." : "Rodar diagnóstico"}
                    </button>
                </div>

                <div style={{ marginTop: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 900 }}>Checks</div>
                    <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                        {checks.map((c) => (
                            <div key={c.name} style={{ fontSize: 13 }}>
                                <span style={{ fontWeight: 900 }}>{c.ok ? "OK" : "FALHA"}</span>{" "}
                                {c.name}
                                {c.details ? <span style={{ color: "#6b7280" }}> ({c.details})</span> : null}
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 900 }}>Resultado</div>
                    <pre style={{ marginTop: 8, padding: 12, borderRadius: 12, background: "#f9fafb", overflowX: "auto" }}>
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            </div>

            <div style={{ marginTop: 14, fontSize: 12, color: "#6b7280" }}>
                Apague esta tela depois que a falha for encontrada.
            </div>
        </div>
    )
}
