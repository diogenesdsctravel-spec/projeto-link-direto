/**
 * DIAGNÓSTICO ISOLADO - Teste End-to-End
 * 
 * Este arquivo testa cada etapa do fluxo para identificar onde quebra:
 * 1. Criar cotação com versions
 * 2. Salvar no Supabase
 * 3. Buscar do Supabase
 * 4. Verificar se versions está presente
 * 
 * Acesse: /app/diagnostico
 */

import { useState } from "react"
import { quoteRepository } from "../../services/hybridQuoteRepository"
import { isSupabaseConfigured } from "../../services/supabaseClient"

export default function Diagnostico() {
    const [logs, setLogs] = useState<string[]>([])
    const [running, setRunning] = useState(false)

    function log(msg: string) {
        console.log(msg)
        setLogs(prev => [...prev, `${new Date().toISOString().slice(11, 19)} - ${msg}`])
    }

    async function runDiagnostic() {
        setLogs([])
        setRunning(true)

        try {
            // ETAPA 1: Verificar configuração
            log("=== ETAPA 1: CONFIGURAÇÃO ===")
            log(`Supabase configurado: ${isSupabaseConfigured()}`)

            // ETAPA 2: Criar cotação de teste
            log("")
            log("=== ETAPA 2: CRIAR COTAÇÃO ===")

            const testData = {
                clientName: "TESTE-DIAGNOSTICO",
                destinationKey: "cancun",
                extractedData: {
                    totalPrice: "R$ 9.999",
                    destination: "Cancún",
                    origin: "São Paulo"
                }
            }

            log(`Dados de entrada: ${JSON.stringify(testData)}`)

            const created = await quoteRepository.create(testData)

            log(`Cotação criada:`)
            log(`  - ID: ${created.id}`)
            log(`  - PublicId: ${created.publicId}`)
            log(`  - ClientName: ${created.clientName}`)
            log(`  - Versions: ${JSON.stringify(created.versions)}`)
            log(`  - Versions.length: ${created.versions?.length || 0}`)

            // ETAPA 3: Buscar cotação pelo ID interno
            log("")
            log("=== ETAPA 3: BUSCAR POR ID ===")

            const byId = await quoteRepository.getById(created.id)

            if (byId) {
                log(`Encontrado por ID:`)
                log(`  - Versions: ${JSON.stringify(byId.versions)}`)
                log(`  - Versions.length: ${byId.versions?.length || 0}`)
            } else {
                log(`❌ NÃO encontrado por ID!`)
            }

            // ETAPA 4: Buscar cotação pelo publicId
            log("")
            log("=== ETAPA 4: BUSCAR POR PUBLIC_ID ===")

            const byPublicId = await quoteRepository.getByPublicId(created.publicId)

            if (byPublicId) {
                log(`Encontrado por publicId:`)
                log(`  - Versions: ${JSON.stringify(byPublicId.versions)}`)
                log(`  - Versions.length: ${byPublicId.versions?.length || 0}`)
            } else {
                log(`❌ NÃO encontrado por publicId!`)
            }

            // ETAPA 5: Fetch direto no Supabase
            log("")
            log("=== ETAPA 5: FETCH DIRETO SUPABASE ===")

            const response = await fetch(
                `https://tlwfrmzrhldjbxetmdfb.supabase.co/rest/v1/quotes?public_id=eq.${created.publicId}&select=*`,
                {
                    headers: {
                        apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsd2ZybXpyaGxkamJ4ZXRtZGZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNjE1NjksImV4cCI6MjA4MTYzNzU2OX0.8_mEyugrdhudeZVle7-YZIaHUY74QaZe1cMlnBOt1Do"
                    }
                }
            )

            const data = await response.json()

            if (data && data[0]) {
                log(`Dados brutos do Supabase:`)
                log(`  - versions (raw): ${JSON.stringify(data[0].versions)}`)
                log(`  - versions.length: ${data[0].versions?.length || 0}`)
            } else {
                log(`❌ Não encontrado no Supabase!`)
            }

            // RESULTADO FINAL
            log("")
            log("=== RESULTADO ===")

            const hasVersions = created.versions && created.versions.length > 0
            const supabaseHasVersions = data[0]?.versions && data[0].versions.length > 0

            if (hasVersions && supabaseHasVersions) {
                log(`✅ SUCESSO! Versions criada corretamente.`)
                log(`Link para testar: https://dsc-travel.netlify.app/q/${created.publicId}`)
            } else {
                log(`❌ FALHA!`)
                if (!hasVersions) log(`  - quoteRepository.create() NÃO retornou versions`)
                if (!supabaseHasVersions) log(`  - Supabase NÃO salvou versions`)
            }

        } catch (error: any) {
            log(`❌ ERRO: ${error.message}`)
            log(error.stack || "")
        }

        setRunning(false)
    }

    return (
        <div style={{ padding: 24, fontFamily: "monospace", maxWidth: 900, margin: "0 auto" }}>
            <h1 style={{ fontSize: 20, marginBottom: 16 }}>🔬 Diagnóstico End-to-End</h1>

            <button
                onClick={runDiagnostic}
                disabled={running}
                style={{
                    padding: "12px 24px",
                    fontSize: 16,
                    fontWeight: "bold",
                    background: running ? "#ccc" : "#111",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    cursor: running ? "not-allowed" : "pointer",
                    marginBottom: 24
                }}
            >
                {running ? "Executando..." : "🚀 Executar Diagnóstico"}
            </button>

            <div style={{
                background: "#1a1a1a",
                color: "#0f0",
                padding: 16,
                borderRadius: 8,
                minHeight: 400,
                whiteSpace: "pre-wrap",
                fontSize: 13,
                lineHeight: 1.6,
                overflow: "auto"
            }}>
                {logs.length === 0
                    ? "Clique no botão para iniciar o diagnóstico..."
                    : logs.join("\n")
                }
            </div>
        </div>
    )
}