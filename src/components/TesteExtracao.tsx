/**
 * TESTE ISOLADO - Fluxo completo de extração e salvamento
 * 
 * Este componente testa:
 * 1. Estados React para o formulário
 * 2. Aplicação de dados extraídos
 * 3. Salvamento no Supabase
 * 4. Visualização do resultado
 */

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"

// Configura Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Dados simulados (o que a IA retornaria para Buenos Aires)
const DADOS_SIMULADOS = {
    cliente: {
        nome: "João Silva",
        qtd_adultos: 2
    },
    destino: {
        cidade: "Buenos Aires",
        pais: "Argentina"
    },
    datas: {
        ida: "2026-01-30",
        volta: "2026-02-06",
        noites: 7
    },
    vooIda: {
        companhia: "LATAM Airlines Group",
        numero_voo: "LA4605",
        origem_codigo: "VDC",
        origem_cidade: "Vitória da Conquista",
        destino_codigo: "AEP",
        destino_cidade: "Buenos Aires",
        data: "2026-01-30",
        horario_saida: "10:40",
        horario_chegada: "17:00",
        duracao: "6h20m",
        conexoes: 1,
        bagagem: "23kg"
    },
    vooVolta: {
        companhia: "LATAM Airlines Group",
        numero_voo: "LA8131",
        origem_codigo: "EZE",
        origem_cidade: "Buenos Aires",
        destino_codigo: "VDC",
        destino_cidade: "Vitória da Conquista",
        data: "2026-02-06",
        horario_saida: "02:30",
        horario_chegada: "09:55",
        duracao: "7h25m",
        conexoes: 1,
        bagagem: "23kg"
    },
    hotel: {
        nome: "Waldorf Hotel",
        endereco: "Paraguay 450",
        estrelas: 3,
        checkin: "2026-01-30",
        checkout: "2026-02-06",
        noites: 7,
        regime: "Só hospedagem"
    },
    financeiro: {
        valor_total: 7910,
        moeda: "BRL",
        valor_por_pessoa: 3955
    },
    confianca: 95
}

export function TesteExtracao() {
    // Estados do formulário
    const [clienteNome, setClienteNome] = useState("")
    const [destinoNome, setDestinoNome] = useState("")
    const [destinoPais, setDestinoPais] = useState("")
    const [dataInicio, setDataInicio] = useState("")
    const [dataFim, setDataFim] = useState("")
    const [noites, setNoites] = useState("")

    const [vooIdaCompanhia, setVooIdaCompanhia] = useState("")
    const [vooIdaNumero, setVooIdaNumero] = useState("")
    const [vooIdaOrigem, setVooIdaOrigem] = useState("")
    const [vooIdaDestino, setVooIdaDestino] = useState("")
    const [vooIdaHorarios, setVooIdaHorarios] = useState("")

    const [vooVoltaCompanhia, setVooVoltaCompanhia] = useState("")
    const [vooVoltaNumero, setVooVoltaNumero] = useState("")
    const [vooVoltaOrigem, setVooVoltaOrigem] = useState("")
    const [vooVoltaDestino, setVooVoltaDestino] = useState("")
    const [vooVoltaHorarios, setVooVoltaHorarios] = useState("")

    const [hotelNome, setHotelNome] = useState("")
    const [hotelEstrelas, setHotelEstrelas] = useState("")
    const [hotelRegime, setHotelRegime] = useState("")

    const [valorTotal, setValorTotal] = useState("")

    const [slug, setSlug] = useState("")
    const [mensagem, setMensagem] = useState("")
    const [etapa, setEtapa] = useState(1)

    // ETAPA 1: Aplicar dados simulados no formulário
    function aplicarDados() {
        const d = DADOS_SIMULADOS

        // Cliente
        setClienteNome(d.cliente.nome || "")

        // Destino
        setDestinoNome(d.destino.cidade)
        setDestinoPais(d.destino.pais)

        // Datas
        setDataInicio(d.datas.ida)
        setDataFim(d.datas.volta)
        setNoites(`${d.datas.noites} noites`)

        // Voo Ida
        if (d.vooIda) {
            setVooIdaCompanhia(d.vooIda.companhia)
            setVooIdaNumero(d.vooIda.numero_voo)
            setVooIdaOrigem(`${d.vooIda.origem_codigo} - ${d.vooIda.origem_cidade}`)
            setVooIdaDestino(`${d.vooIda.destino_codigo} - ${d.vooIda.destino_cidade}`)
            setVooIdaHorarios(`${d.vooIda.horario_saida} → ${d.vooIda.horario_chegada}`)
        }

        // Voo Volta
        if (d.vooVolta) {
            setVooVoltaCompanhia(d.vooVolta.companhia)
            setVooVoltaNumero(d.vooVolta.numero_voo)
            setVooVoltaOrigem(`${d.vooVolta.origem_codigo} - ${d.vooVolta.origem_cidade}`)
            setVooVoltaDestino(`${d.vooVolta.destino_codigo} - ${d.vooVolta.destino_cidade}`)
            setVooVoltaHorarios(`${d.vooVolta.horario_saida} → ${d.vooVolta.horario_chegada}`)
        }

        // Hotel
        if (d.hotel) {
            setHotelNome(d.hotel.nome)
            setHotelEstrelas(`${d.hotel.estrelas} estrelas`)
            setHotelRegime(d.hotel.regime)
        }

        // Financeiro
        setValorTotal(d.financeiro.valor_total.toString())

        // Gera slug
        const slugGerado = `teste-buenos-aires-${Date.now().toString(36)}`
        setSlug(slugGerado)

        setMensagem("✅ Dados aplicados com sucesso!")
        setEtapa(2)
    }

    // ETAPA 2: Salvar no Supabase
    async function salvarNoSupabase() {
        if (!slug || !clienteNome || !destinoNome) {
            setMensagem("❌ Preencha os campos obrigatórios")
            return
        }

        setMensagem("Salvando...")

        const snapshot = {
            version: "1.0",
            meta: {
                destino_nome: destinoNome,
                destino_pais: destinoPais,
                destino_imagem: "",
                data_inicio: dataInicio,
                data_fim: dataFim,
                duracao: noites,
                moeda: "BRL"
            },
            cliente: {
                nome: clienteNome
            },
            financeiro: {
                valor_total: parseFloat(valorTotal) || 0,
                parcelamento: "em até 12x sem juros"
            },
            itens: [
                {
                    tipo: "voo",
                    incluido: true,
                    titulo: "Voo de Ida",
                    subtitulo: vooIdaCompanhia,
                    dados: {
                        direcao: "ida",
                        companhia: vooIdaCompanhia,
                        numero_voo: vooIdaNumero,
                        data: dataInicio,
                        origem: { codigo: "VDC", cidade: "Vitória da Conquista" },
                        destino: { codigo: "AEP", cidade: "Buenos Aires" },
                        horario_saida: "10:40",
                        horario_chegada: "17:00",
                        duracao: "6h20m",
                        conexoes: 1
                    }
                },
                {
                    tipo: "voo",
                    incluido: true,
                    titulo: "Voo de Volta",
                    subtitulo: vooVoltaCompanhia,
                    dados: {
                        direcao: "volta",
                        companhia: vooVoltaCompanhia,
                        numero_voo: vooVoltaNumero,
                        data: dataFim,
                        origem: { codigo: "EZE", cidade: "Buenos Aires" },
                        destino: { codigo: "VDC", cidade: "Vitória da Conquista" },
                        horario_saida: "02:30",
                        horario_chegada: "09:55",
                        duracao: "7h25m",
                        conexoes: 1
                    }
                },
                {
                    tipo: "hotel",
                    incluido: true,
                    titulo: hotelNome,
                    subtitulo: hotelEstrelas,
                    dados: {
                        nome: hotelNome,
                        estrelas: 3,
                        noites: 7,
                        regime: hotelRegime,
                        localizacao: "Paraguay 450, Buenos Aires"
                    }
                }
            ],
            experiencias: [
                { icone: "🥩", titulo: "Parrilla argentina", subtitulo: "Os melhores cortes" },
                { icone: "💃", titulo: "Show de tango", subtitulo: "San Telmo" },
                { icone: "🏛️", titulo: "La Boca", subtitulo: "Caminito colorido" },
                { icone: "🛍️", titulo: "Palermo Soho", subtitulo: "Compras e cafés" },
                { icone: "⚽", titulo: "La Bombonera", subtitulo: "Estádio do Boca" },
                { icone: "🍷", titulo: "Vinho Malbec", subtitulo: "Degustação" }
            ]
        }

        const payload = {
            slug,
            cliente_nome: clienteNome,
            destino_nome: destinoNome,
            destino_estado: null,
            destino_imagem: null,
            valor_total: parseFloat(valorTotal) || null,
            parcelamento: "em até 12x sem juros",
            status: "enviada",
            snapshot,
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString()
        }

        try {
            const { error } = await supabase.from("cotacoes").insert(payload)

            if (error) {
                setMensagem(`❌ Erro: ${error.message}`)
                return
            }

            setMensagem(`✅ Cotação salva! Slug: ${slug}`)
            setEtapa(3)
        } catch (err: any) {
            setMensagem(`❌ Erro: ${err.message}`)
        }
    }

    // ETAPA 3: Link para visualizar
    const linkCotacao = `${window.location.origin}/projeto-link-direto/${slug}`

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">🧪 Teste Isolado - Fluxo Completo</h1>

                {/* Barra de progresso */}
                <div className="flex gap-2 mb-8">
                    <div className={`flex-1 h-2 rounded ${etapa >= 1 ? "bg-blue-500" : "bg-gray-300"}`} />
                    <div className={`flex-1 h-2 rounded ${etapa >= 2 ? "bg-blue-500" : "bg-gray-300"}`} />
                    <div className={`flex-1 h-2 rounded ${etapa >= 3 ? "bg-green-500" : "bg-gray-300"}`} />
                </div>

                {/* Mensagem */}
                {mensagem && (
                    <div className={`mb-6 p-4 rounded-lg ${mensagem.startsWith("✅") ? "bg-green-100 text-green-800" :
                            mensagem.startsWith("❌") ? "bg-red-100 text-red-800" :
                                "bg-blue-100 text-blue-800"
                        }`}>
                        {mensagem}
                    </div>
                )}

                {/* ETAPA 1 */}
                {etapa === 1 && (
                    <div className="bg-white rounded-lg p-6 shadow">
                        <h2 className="text-lg font-semibold mb-4">Etapa 1: Simular extração da IA</h2>
                        <p className="text-gray-600 mb-4">
                            Vamos simular os dados que a IA extrairia de um PDF de Buenos Aires.
                        </p>
                        <pre className="bg-gray-50 p-4 rounded text-xs mb-4 overflow-auto max-h-60">
                            {JSON.stringify(DADOS_SIMULADOS, null, 2)}
                        </pre>
                        <button
                            onClick={aplicarDados}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                        >
                            Aplicar dados no formulário
                        </button>
                    </div>
                )}

                {/* ETAPA 2 */}
                {etapa === 2 && (
                    <div className="bg-white rounded-lg p-6 shadow">
                        <h2 className="text-lg font-semibold mb-4">Etapa 2: Revisar e salvar</h2>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                                <input
                                    value={slug}
                                    onChange={e => setSlug(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                                <input
                                    value={clienteNome}
                                    onChange={e => setClienteNome(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Destino</label>
                                <input
                                    value={destinoNome}
                                    onChange={e => setDestinoNome(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                                <input
                                    value={destinoPais}
                                    onChange={e => setDestinoPais(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data Ida</label>
                                <input
                                    value={dataInicio}
                                    onChange={e => setDataInicio(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data Volta</label>
                                <input
                                    value={dataFim}
                                    onChange={e => setDataFim(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                        </div>

                        <div className="border-t pt-4 mb-4">
                            <h3 className="font-medium mb-2">✈️ Voo de Ida</h3>
                            <p className="text-sm text-gray-600">
                                {vooIdaCompanhia} {vooIdaNumero} | {vooIdaOrigem} → {vooIdaDestino} | {vooIdaHorarios}
                            </p>
                        </div>

                        <div className="border-t pt-4 mb-4">
                            <h3 className="font-medium mb-2">✈️ Voo de Volta</h3>
                            <p className="text-sm text-gray-600">
                                {vooVoltaCompanhia} {vooVoltaNumero} | {vooVoltaOrigem} → {vooVoltaDestino} | {vooVoltaHorarios}
                            </p>
                        </div>

                        <div className="border-t pt-4 mb-4">
                            <h3 className="font-medium mb-2">🏨 Hotel</h3>
                            <p className="text-sm text-gray-600">
                                {hotelNome} | {hotelEstrelas} | {hotelRegime}
                            </p>
                        </div>

                        <div className="border-t pt-4 mb-6">
                            <h3 className="font-medium mb-2">💰 Valor Total</h3>
                            <input
                                value={valorTotal}
                                onChange={e => setValorTotal(e.target.value)}
                                className="w-32 border rounded px-3 py-2 text-lg font-bold"
                            />
                            <span className="ml-2 text-gray-600">BRL</span>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setEtapa(1)}
                                className="px-6 py-3 border rounded-lg font-medium hover:bg-gray-50"
                            >
                                Voltar
                            </button>
                            <button
                                onClick={salvarNoSupabase}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                            >
                                Salvar no Supabase
                            </button>
                        </div>
                    </div>
                )}

                {/* ETAPA 3 */}
                {etapa === 3 && (
                    <div className="bg-white rounded-lg p-6 shadow">
                        <h2 className="text-lg font-semibold mb-4">✅ Etapa 3: Cotação salva!</h2>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                            <p className="text-green-800 mb-2">A cotação foi salva com sucesso.</p>
                            <p className="text-sm text-green-700">Slug: <strong>{slug}</strong></p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Link para visualizar:</label>
                            <div className="flex gap-2">
                                <input
                                    value={linkCotacao}
                                    readOnly
                                    className="flex-1 border rounded px-3 py-2 bg-gray-50"
                                />
                                <button
                                    onClick={() => navigator.clipboard.writeText(linkCotacao)}
                                    className="px-4 py-2 border rounded hover:bg-gray-50"
                                >
                                    Copiar
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <a
                                href={linkCotacao}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                            >
                                Abrir cotação
                            </a>
                            <button
                                onClick={() => {
                                    setEtapa(1)
                                    setMensagem("")
                                    setSlug("")
                                    setClienteNome("")
                                    setDestinoNome("")
                                }}
                                className="px-6 py-3 border rounded-lg font-medium hover:bg-gray-50"
                            >
                                Fazer outro teste
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}