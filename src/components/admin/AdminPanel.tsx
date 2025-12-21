import { useState } from "react"
import { AdminHeader } from "./AdminHeader"
import { AdminTabs } from "./AdminTabs"
import { AdminUploadStep } from "./AdminUploadStep"
import { useCotacaoForm } from "./hooks/useCotacaoForm"
import { CotacoesLista } from "./CotacoesLista"
import { extrairDadosCotacao, aplicarDadosNoForm } from "../../services/extrairDadosOpenAI"

import { ClienteTab } from "./tabs/ClienteTab"
import { DestinoTab } from "./tabs/DestinoTab"
import { VoosTab } from "./tabs/VoosTab"
import { HotelTab } from "./tabs/HotelTab"
import { TransfersTab } from "./tabs/TransfersTab"
import { ExperienciasTab } from "./tabs/ExperienciasTab"
import { FinanceiroTab } from "./tabs/FinanceiroTab"
import { ResumoTab } from "./tabs/ResumoTab"

type Props = { user: any; supabase: any }

type Tab =
    | "cliente"
    | "destino"
    | "voos"
    | "hotel"
    | "transfers"
    | "experiencias"
    | "financeiro"
    | "resumo"

export function AdminPanel({ user, supabase }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>("cliente")
    const [showLista, setShowLista] = useState(true)
    const [showUpload, setShowUpload] = useState(false)
    const [processandoIA, setProcessandoIA] = useState(false)
    const [mensagemIA, setMensagemIA] = useState<{ tipo: "sucesso" | "erro" | "aviso"; texto: string } | null>(null)
    const form = useCotacaoForm(supabase)

    async function handleSelectCotacao(slug: string) {
        form.setSlug(slug)
        await form.carregarCotacao()
        setShowLista(false)
        setShowUpload(false)
        setActiveTab("cliente")
    }

    function handleNovaCotacao() {
        form.iniciarNovaCotacao()
        setMensagemIA(null)
        setShowLista(false)
        setShowUpload(true)
        setActiveTab("cliente")
    }

    async function handleProcessarUpload({ arquivos, instrucaoIA }: { arquivos: File[]; instrucaoIA: string }) {
        setMensagemIA(null)
        setProcessandoIA(true)

        try {
            console.log("Extraindo dados com IA...", arquivos.length, "arquivo(s)")
            const dadosExtraidos = await extrairDadosCotacao(arquivos, instrucaoIA)
            console.log("Dados extraídos:", dadosExtraidos)
            console.log("Form disponível:", Object.keys(form))

            console.log("Tipo do form:", typeof form)
            console.log("form.setDestinoNome existe?", typeof form.setDestinoNome)

            aplicarDadosNoForm(dadosExtraidos, form)

            console.log("Form após aplicar:", {
                clienteNome: form.clienteNome,
                destinoNome: form.destinoNome,
                valorTotal: form.valorTotal
            })

            const nomeCliente = dadosExtraidos.cliente?.nome?.split(" ")[0]?.toLowerCase() || "cliente"
            const destino = dadosExtraidos.destino?.cidade?.toLowerCase().replace(/\s+/g, "-") || "destino"
            const timestamp = Date.now().toString(36)
            const slugGerado = `${nomeCliente}-${destino}-${timestamp}`

            await form.criarCotacaoRascunho({
                slug: slugGerado,
                cliente_nome: dadosExtraidos.cliente?.nome || "Pendente",
                destino_nome: dadosExtraidos.destino?.cidade || "Pendente",
            })

            setShowUpload(false)
            setActiveTab("cliente")

            if (dadosExtraidos.confianca >= 80) {
                setMensagemIA({
                    tipo: "sucesso",
                    texto: `Dados extraídos com ${dadosExtraidos.confianca}% de confiança. Revise e salve.`
                })
            } else if (dadosExtraidos.confianca >= 50) {
                setMensagemIA({
                    tipo: "aviso",
                    texto: `Extração com ${dadosExtraidos.confianca}% de confiança. Alguns campos podem precisar de ajuste.`
                })
            } else {
                setMensagemIA({
                    tipo: "aviso",
                    texto: `Extração com baixa confiança (${dadosExtraidos.confianca}%). Revise todos os campos.`
                })
            }

            setShowLista(true)
        } catch (error: any) {
            console.error("Erro ao processar:", error)
            setMensagemIA({
                tipo: "erro",
                texto: error.message || "Erro ao processar arquivos. Tente novamente."
            })
        } finally {
            setProcessandoIA(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminHeader user={user} supabase={supabase} />

            <div className="max-w-4xl mx-auto p-6">
                {showLista ? (
                    <div className="bg-white rounded-lg border overflow-hidden">
                        <div className="p-6">
                            <CotacoesLista
                                supabase={supabase}
                                onSelectCotacao={handleSelectCotacao}
                                onNovaCotacao={handleNovaCotacao}
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between gap-3 mb-3">
                            <button
                                onClick={() => {
                                    setShowLista(true)
                                    setShowUpload(false)
                                    setMensagemIA(null)
                                }}
                                className="px-3 py-2 rounded border bg-white hover:bg-gray-50 text-sm"
                            >
                                Voltar para lista
                            </button>
                        </div>

                        {mensagemIA && (
                            <div
                                className={`mb-4 p-4 rounded-lg text-sm ${mensagemIA.tipo === "sucesso"
                                    ? "bg-green-50 text-green-800 border border-green-200"
                                    : mensagemIA.tipo === "aviso"
                                        ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
                                        : "bg-red-50 text-red-800 border border-red-200"
                                    }`}
                            >
                                {mensagemIA.texto}
                            </div>
                        )}

                        {showUpload ? (
                            <>
                                {processandoIA && (
                                    <div className="mb-4 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
                                            <div>
                                                <p className="font-medium text-blue-900">Processando com IA...</p>
                                                <p className="text-sm text-blue-700">
                                                    Extraindo dados da cotação. Isso pode levar alguns segundos.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <AdminUploadStep onContinuar={handleProcessarUpload} />
                            </>
                        ) : (
                            <div className="bg-white rounded-lg border overflow-hidden">
                                <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                                <div className="p-6">
                                    {activeTab === "cliente" && <ClienteTab form={form} />}
                                    {activeTab === "destino" && <DestinoTab form={form} />}
                                    {activeTab === "voos" && <VoosTab form={form} />}
                                    {activeTab === "hotel" && <HotelTab form={form} />}
                                    {activeTab === "transfers" && <TransfersTab form={form} />}
                                    {activeTab === "experiencias" && <ExperienciasTab form={form} />}
                                    {activeTab === "financeiro" && <FinanceiroTab form={form} />}
                                    {activeTab === "resumo" && <ResumoTab form={form} />}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
