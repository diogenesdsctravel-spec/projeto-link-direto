import { useEffect, useState } from "react"
import type { Snapshot, VooDados, HotelDados, TransferDados, ExperienciaDestino } from "../../../types/cotacao"

type Mensagem = { tipo: "sucesso" | "erro"; texto: string } | null

export function useCotacaoForm(supabase: any) {
    const [slug, setSlug] = useState("")
    const [mensagem, setMensagem] = useState<Mensagem>(null)
    const [salvando, setSalvando] = useState(false)

    const [clienteNome, setClienteNome] = useState("")
    const [clienteEmail, setClienteEmail] = useState("")

    const [destinoNome, setDestinoNome] = useState("")
    const [destinoEstado, setDestinoEstado] = useState("")
    const [destinoPais, setDestinoPais] = useState("Brasil")
    const [destinoImagem, setDestinoImagem] = useState("")
    const [destinoTagline, setDestinoTagline] = useState("")
    const [destinoDuracao, setDestinoDuracao] = useState("")
    const [dataInicio, setDataInicio] = useState("")
    const [dataFim, setDataFim] = useState("")

    const [vooIdaAtivo, setVooIdaAtivo] = useState(true)
    const [vooIdaCompanhia, setVooIdaCompanhia] = useState("")
    const [vooIdaNumero, setVooIdaNumero] = useState("")
    const [vooIdaData, setVooIdaData] = useState("")
    const [vooIdaDiaSemana, setVooIdaDiaSemana] = useState("")
    const [vooIdaOrigemCodigo, setVooIdaOrigemCodigo] = useState("")
    const [vooIdaOrigemCidade, setVooIdaOrigemCidade] = useState("")
    const [vooIdaDestinoCodigo, setVooIdaDestinoCodigo] = useState("")
    const [vooIdaDestinoCidade, setVooIdaDestinoCidade] = useState("")
    const [vooIdaHorarioSaida, setVooIdaHorarioSaida] = useState("")
    const [vooIdaHorarioChegada, setVooIdaHorarioChegada] = useState("")
    const [vooIdaDuracao, setVooIdaDuracao] = useState("")
    const [vooIdaBagagem, setVooIdaBagagem] = useState("")
    const [vooIdaConexoes, setVooIdaConexoes] = useState(0)

    const [vooVoltaAtivo, setVooVoltaAtivo] = useState(true)
    const [vooVoltaCompanhia, setVooVoltaCompanhia] = useState("")
    const [vooVoltaNumero, setVooVoltaNumero] = useState("")
    const [vooVoltaData, setVooVoltaData] = useState("")
    const [vooVoltaDiaSemana, setVooVoltaDiaSemana] = useState("")
    const [vooVoltaOrigemCodigo, setVooVoltaOrigemCodigo] = useState("")
    const [vooVoltaOrigemCidade, setVooVoltaOrigemCidade] = useState("")
    const [vooVoltaDestinoCodigo, setVooVoltaDestinoCodigo] = useState("")
    const [vooVoltaDestinoCidade, setVooVoltaDestinoCidade] = useState("")
    const [vooVoltaHorarioSaida, setVooVoltaHorarioSaida] = useState("")
    const [vooVoltaHorarioChegada, setVooVoltaHorarioChegada] = useState("")
    const [vooVoltaDuracao, setVooVoltaDuracao] = useState("")
    const [vooVoltaBagagem, setVooVoltaBagagem] = useState("")
    const [vooVoltaConexoes, setVooVoltaConexoes] = useState(0)

    const [hotelAtivo, setHotelAtivo] = useState(true)
    const [hotelNome, setHotelNome] = useState("")
    const [hotelCategoria, setHotelCategoria] = useState("")
    const [hotelEstrelas, setHotelEstrelas] = useState(0)
    const [hotelLocalizacao, setHotelLocalizacao] = useState("")
    const [hotelNoites, setHotelNoites] = useState(0)
    const [hotelRegime, setHotelRegime] = useState("Café da manhã incluso")
    const [hotelDescricao, setHotelDescricao] = useState("")
    const [hotelAmenidades, setHotelAmenidades] = useState("")
    const [hotelImagens, setHotelImagens] = useState("")
    const [hotelNotaAvaliacao, setHotelNotaAvaliacao] = useState("")
    const [hotelTotalAvaliacoes, setHotelTotalAvaliacoes] = useState("")

    const [transferIdaAtivo, setTransferIdaAtivo] = useState(true)
    const [transferIdaTipo, setTransferIdaTipo] = useState("Carro privativo")
    const [transferIdaOrigemNome, setTransferIdaOrigemNome] = useState("")
    const [transferIdaOrigemCidade, setTransferIdaOrigemCidade] = useState("")
    const [transferIdaDestinoNome, setTransferIdaDestinoNome] = useState("")
    const [transferIdaDestinoCidade, setTransferIdaDestinoCidade] = useState("")
    const [transferIdaDuracao, setTransferIdaDuracao] = useState("")
    const [transferIdaDistancia, setTransferIdaDistancia] = useState("")

    const [transferVoltaAtivo, setTransferVoltaAtivo] = useState(true)
    const [transferVoltaTipo, setTransferVoltaTipo] = useState("Carro privativo")
    const [transferVoltaOrigemNome, setTransferVoltaOrigemNome] = useState("")
    const [transferVoltaOrigemCidade, setTransferVoltaOrigemCidade] = useState("")
    const [transferVoltaDestinoNome, setTransferVoltaDestinoNome] = useState("")
    const [transferVoltaDestinoCidade, setTransferVoltaDestinoCidade] = useState("")
    const [transferVoltaDuracao, setTransferVoltaDuracao] = useState("")
    const [transferVoltaDistancia, setTransferVoltaDistancia] = useState("")

    const [experiencias, setExperiencias] = useState<ExperienciaDestino[]>([])

    const [valorTotal, setValorTotal] = useState("")
    const [parcelamento, setParcelamento] = useState("em até 10x sem juros")
    const [observacoesFinanceiras, setObservacoesFinanceiras] = useState("")

    const [destinosCatalogo, setDestinosCatalogo] = useState<any[]>([])
    const [hoteisCatalogo, setHoteisCatalogo] = useState<any[]>([])
    const [experienciasCatalogo, setExperienciasCatalogo] = useState<any[]>([])

    const carregarCatalogos = async () => {
        const [destinos, hoteis, experienciasCat] = await Promise.all([
            supabase.from("destinos").select("*").order("nome"),
            supabase.from("hoteis").select("*").order("nome"),
            supabase.from("experiencias").select("*").order("titulo"),
        ])

        if (destinos.data) setDestinosCatalogo(destinos.data)
        if (hoteis.data) setHoteisCatalogo(hoteis.data)
        if (experienciasCat.data) setExperienciasCatalogo(experienciasCat.data)
    }

    useEffect(() => {
        carregarCatalogos()
    }, [])

    useEffect(() => {
        console.log("STATE mudou", {
            clienteNome,
            destinoNome,
            destinoPais,
            dataInicio,
            dataFim,
            valorTotal,
            vooIdaCompanhia,
            vooVoltaCompanhia,
            hotelNome,
        })
    }, [clienteNome, destinoNome, destinoPais, dataInicio, dataFim, valorTotal, vooIdaCompanhia, vooVoltaCompanhia, hotelNome])

    const getDiaSemana = (dataStr: string): string => {
        if (!dataStr) return ""
        const dias = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]
        const data = new Date(dataStr + "T12:00:00")
        return dias[data.getDay()]
    }

    useEffect(() => {
        if (vooIdaData) setVooIdaDiaSemana(getDiaSemana(vooIdaData))
    }, [vooIdaData])

    useEffect(() => {
        if (vooVoltaData) setVooVoltaDiaSemana(getDiaSemana(vooVoltaData))
    }, [vooVoltaData])

    const carregarExperienciasDestino = async (destinoId: string) => {
        const { data } = await supabase.from("experiencias").select("*").eq("destino_id", destinoId).order("titulo")
        if (data && data.length > 0) {
            setExperiencias(
                data.map((exp: any) => ({
                    icone: exp.icone || "✨",
                    titulo: exp.titulo,
                    subtitulo: exp.subtitulo || "",
                    imagem: exp.imagem || "",
                }))
            )
        }
    }

    const selecionarDestino = (destinoId: string) => {
        const destino = destinosCatalogo.find(d => d.id === destinoId)
        if (!destino) return

        setDestinoNome(destino.nome || "")
        setDestinoEstado(destino.estado || "")
        setDestinoPais(destino.pais || "Brasil")
        setDestinoImagem(destino.imagem_principal || "")
        setDestinoTagline(destino.tagline || "")

        carregarExperienciasDestino(destinoId)
    }

    const carregarImagensHotel = async (hotelId: string) => {
        const { data } = await supabase
            .from("imagens")
            .select("url")
            .eq("referencia_id", hotelId)
            .eq("tipo", "hotel")
            .order("ordem")
        if (data && data.length > 0) setHotelImagens(data.map((img: any) => img.url).join("\n"))
    }

    const selecionarHotel = (hotelId: string) => {
        const hotel = hoteisCatalogo.find(h => h.id === hotelId)
        if (!hotel) return

        setHotelNome(hotel.nome || "")
        setHotelCategoria(hotel.categoria || "")
        setHotelEstrelas(hotel.estrelas || 0)
        setHotelLocalizacao(hotel.localizacao || "")
        setHotelRegime(hotel.regime || "Café da manhã incluso")
        setHotelDescricao(hotel.descricao || "")
        setHotelAmenidades((hotel.amenidades || []).join(", "))
        setHotelNotaAvaliacao(hotel.nota_avaliacao?.toString() || "")
        setHotelTotalAvaliacoes(hotel.total_avaliacoes?.toString() || "")

        carregarImagensHotel(hotelId)
    }

    const adicionarExperiencia = () => {
        setExperiencias([...experiencias, { icone: "✨", titulo: "", subtitulo: "", imagem: "" }])
    }

    const atualizarExperiencia = (index: number, campo: keyof ExperienciaDestino, valor: string) => {
        const novas = [...experiencias]
        novas[index] = { ...novas[index], [campo]: valor }
        setExperiencias(novas)
    }

    const removerExperiencia = (index: number) => {
        setExperiencias(experiencias.filter((_, i) => i !== index))
    }

    const montarSnapshot = (): Snapshot => {
        const itens: Snapshot["itens"] = []

        if (vooIdaAtivo && vooIdaCompanhia) {
            const vooDados: VooDados = {
                direcao: "ida",
                companhia: vooIdaCompanhia,
                numero_voo: vooIdaNumero || undefined,
                data: vooIdaData,
                dia_semana: vooIdaDiaSemana,
                origem: { codigo: vooIdaOrigemCodigo, cidade: vooIdaOrigemCidade },
                destino: { codigo: vooIdaDestinoCodigo, cidade: vooIdaDestinoCidade },
                horario_saida: vooIdaHorarioSaida,
                horario_chegada: vooIdaHorarioChegada,
                duracao: vooIdaDuracao,
                bagagem: vooIdaBagagem || undefined,
                conexoes: vooIdaConexoes,
            }
            itens.push({ tipo: "voo", incluido: true, titulo: "Voo de Ida", subtitulo: vooIdaCompanhia, dados: vooDados })
        }

        if (vooVoltaAtivo && vooVoltaCompanhia) {
            const vooDados: VooDados = {
                direcao: "volta",
                companhia: vooVoltaCompanhia,
                numero_voo: vooVoltaNumero || undefined,
                data: vooVoltaData,
                dia_semana: vooVoltaDiaSemana,
                origem: { codigo: vooVoltaOrigemCodigo, cidade: vooVoltaOrigemCidade },
                destino: { codigo: vooVoltaDestinoCodigo, cidade: vooVoltaDestinoCidade },
                horario_saida: vooVoltaHorarioSaida,
                horario_chegada: vooVoltaHorarioChegada,
                duracao: vooVoltaDuracao,
                bagagem: vooVoltaBagagem || undefined,
                conexoes: vooVoltaConexoes,
            }
            itens.push({ tipo: "voo", incluido: true, titulo: "Voo de Volta", subtitulo: vooVoltaCompanhia, dados: vooDados })
        }

        if (hotelAtivo && hotelNome) {
            const hotelDados: HotelDados = {
                nome: hotelNome,
                categoria: hotelCategoria || undefined,
                estrelas: hotelEstrelas || undefined,
                localizacao: hotelLocalizacao,
                noites: hotelNoites,
                regime: hotelRegime,
                descricao: hotelDescricao || undefined,
                amenidades: hotelAmenidades
                    .split(",")
                    .map(a => a.trim())
                    .filter(Boolean),
                imagens: hotelImagens
                    .split("\n")
                    .map(url => url.trim())
                    .filter(Boolean),
                avaliacao: hotelNotaAvaliacao
                    ? {
                        nota: parseFloat(hotelNotaAvaliacao),
                        total_avaliacoes: parseInt(hotelTotalAvaliacoes) || 0,
                    }
                    : undefined,
            }
            itens.push({ tipo: "hotel", incluido: true, titulo: hotelNome, subtitulo: hotelCategoria, dados: hotelDados })
        }

        if (transferIdaAtivo && transferIdaOrigemNome) {
            const transferDados: TransferDados = {
                direcao: "ida",
                tipo: transferIdaTipo,
                origem: { nome: transferIdaOrigemNome, cidade: transferIdaOrigemCidade },
                destino: { nome: transferIdaDestinoNome, cidade: transferIdaDestinoCidade },
                duracao: transferIdaDuracao,
                distancia: transferIdaDistancia || undefined,
            }
            itens.push({ tipo: "transfer", incluido: true, titulo: "Transfer de Ida", subtitulo: transferIdaTipo, dados: transferDados })
        }

        if (transferVoltaAtivo && transferVoltaOrigemNome) {
            const transferDados: TransferDados = {
                direcao: "volta",
                tipo: transferVoltaTipo,
                origem: { nome: transferVoltaOrigemNome, cidade: transferVoltaOrigemCidade },
                destino: { nome: transferVoltaDestinoNome, cidade: transferVoltaDestinoCidade },
                duracao: transferVoltaDuracao,
                distancia: transferVoltaDistancia || undefined,
            }
            itens.push({
                tipo: "transfer",
                incluido: true,
                titulo: "Transfer de Volta",
                subtitulo: transferVoltaTipo,
                dados: transferDados,
            })
        }

        return {
            version: "1.0",
            meta: {
                destino_nome: destinoNome,
                destino_estado: destinoEstado || undefined,
                destino_pais: destinoPais,
                destino_imagem: destinoImagem,
                tagline: destinoTagline || undefined,
                duracao: destinoDuracao || undefined,
                data_inicio: dataInicio || undefined,
                data_fim: dataFim || undefined,
                moeda: "BRL",
            },
            cliente: {
                nome: clienteNome,
                email: clienteEmail || undefined,
            },
            financeiro: {
                valor_total: parseFloat(valorTotal.replace(",", ".")) || 0,
                parcelamento,
                observacoes: observacoesFinanceiras || undefined,
            },
            itens,
            experiencias: experiencias.filter(e => e.titulo),
        }
    }

    const salvarNoCatalogo = async () => {
        if (destinoNome) {
            const { data: destinoExiste } = await supabase.from("destinos").select("id").eq("nome", destinoNome).maybeSingle()
            if (!destinoExiste) {
                await supabase.from("destinos").insert({
                    nome: destinoNome,
                    estado: destinoEstado || null,
                    pais: destinoPais,
                    imagem_principal: destinoImagem || null,
                    tagline: destinoTagline || null,
                })
            }
        }

        if (hotelNome) {
            const { data: hotelExiste } = await supabase.from("hoteis").select("id").eq("nome", hotelNome).maybeSingle()
            if (!hotelExiste) {
                await supabase.from("hoteis").insert({
                    nome: hotelNome,
                    categoria: hotelCategoria || null,
                    estrelas: hotelEstrelas || null,
                    localizacao: hotelLocalizacao || null,
                    regime: hotelRegime || null,
                    descricao: hotelDescricao || null,
                    amenidades: hotelAmenidades
                        .split(",")
                        .map(a => a.trim())
                        .filter(Boolean),
                    nota_avaliacao: hotelNotaAvaliacao ? parseFloat(hotelNotaAvaliacao) : null,
                    total_avaliacoes: hotelTotalAvaliacoes ? parseInt(hotelTotalAvaliacoes) : null,
                })
            }
        }
    }

    const criarCotacaoRascunho = async (args?: {
        slug?: string
        cliente_nome?: string
        destino_nome?: string
    }) => {
        setMensagem(null)

        const agora = new Date().toISOString()

        const slugFinal =
            args?.slug && args.slug.trim()
                ? args.slug.trim()
                : `draft-${Date.now().toString(36)}`

        const clienteNomeFinal =
            args?.cliente_nome && args.cliente_nome.trim()
                ? args.cliente_nome.trim()
                : "Pendente"

        const destinoNomeFinal =
            args?.destino_nome && args.destino_nome.trim()
                ? args.destino_nome.trim()
                : "Pendente"

        const snapshotVazio: Snapshot = {
            version: "1.0",
            meta: {
                destino_nome: destinoNomeFinal,
                destino_pais: destinoPais || "Brasil",
                destino_imagem: "",
                moeda: "BRL",
            },
            cliente: { nome: clienteNomeFinal },
            financeiro: { valor_total: 0, parcelamento: "em até 10x sem juros" },
            itens: [],
            experiencias: [],
        }

        const { error } = await supabase.from("cotacoes").insert({
            slug: slugFinal,
            status: "rascunho",
            cliente_nome: clienteNomeFinal,
            destino_nome: destinoNomeFinal,
            valor_total: null,
            parcelamento: "em até 10x sem juros",
            snapshot: snapshotVazio as any,
            created_at: agora,
            updated_at: agora,
        })

        if (error) {
            setMensagem({ tipo: "erro", texto: error.message })
            throw error
        }

        setSlug(slugFinal)
        return slugFinal
    }

    const criarRascunho = async (args: { instrucaoIA: string; arquivos: File[] }) => {
        setMensagem(null)

        const novoSlug = `cotacao-${Date.now()}`
        const agora = new Date().toISOString()
        const expiraEm = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

        const snapshot: Snapshot = {
            version: "1.0",
            meta: {
                destino_nome: "",
                destino_estado: undefined,
                destino_pais: "Brasil",
                destino_imagem: "",
                tagline: undefined,
                duracao: undefined,
                data_inicio: undefined,
                data_fim: undefined,
                moeda: "BRL",
            },
            cliente: {
                nome: "Pendente",
                email: undefined,
            },
            financeiro: {
                valor_total: 0,
                parcelamento: "em até 10x sem juros",
                observacoes: args.instrucaoIA || undefined,
            },
            itens: [],
            experiencias: [],
        }

        const payload = {
            slug: novoSlug,
            status: "rascunho",
            cliente_nome: "Pendente",
            destino_nome: "Pendente",
            valor_total: null,
            parcelamento: "em até 10x sem juros",
            destino_estado: null,
            destino_imagem: null,
            snapshot,
            expires_at: expiraEm,
            updated_at: agora,
        }

        setSalvando(true)
        try {
            const { data, error } = await supabase.from("cotacoes").insert(payload).select("slug").single()

            if (error) throw error

            const slugCriado = data?.slug || novoSlug
            setSlug(slugCriado)
            return slugCriado
        } finally {
            setSalvando(false)
        }
    }

    const salvarCotacao = async () => {
        setMensagem(null)

        if (!slug.trim()) return setMensagem({ tipo: "erro", texto: "Preencha o slug" })
        if (!clienteNome.trim()) return setMensagem({ tipo: "erro", texto: "Preencha o nome do cliente" })
        if (!destinoNome.trim()) return setMensagem({ tipo: "erro", texto: "Preencha o destino" })

        setSalvando(true)

        try {
            const snapshot = montarSnapshot()
            const agora = new Date().toISOString()
            const expiraEm = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

            const { data: existente } = await supabase.from("cotacoes").select("id").eq("slug", slug.trim()).maybeSingle()

            const payload = {
                slug: slug.trim(),
                cliente_nome: clienteNome.trim(),
                cliente_email: clienteEmail.trim() || null,
                valor_total: parseFloat(valorTotal.replace(",", ".")) || null,
                parcelamento: parcelamento || null,
                destino_nome: destinoNome,
                destino_estado: destinoEstado || null,
                destino_imagem: destinoImagem || null,
                status: "enviada",
                snapshot,
                expires_at: expiraEm,
                updated_at: agora,
            }

            if (existente?.id) {
                const confirmou = confirm("Este slug já existe. Deseja atualizar?")
                if (!confirmou) {
                    setSalvando(false)
                    return
                }
                const { error } = await supabase.from("cotacoes").update(payload).eq("id", existente.id)
                if (error) throw error
                setMensagem({ tipo: "sucesso", texto: "Cotação atualizada com sucesso!" })
            } else {
                const { error } = await supabase.from("cotacoes").insert(payload)
                if (error) throw error
                setMensagem({ tipo: "sucesso", texto: "Cotação criada com sucesso!" })
            }

            await salvarNoCatalogo()
        } catch (err: any) {
            setMensagem({ tipo: "erro", texto: err?.message || "Erro ao salvar" })
        } finally {
            setSalvando(false)
        }
    }

    const carregarCotacao = async () => {
        if (!slug.trim()) return setMensagem({ tipo: "erro", texto: "Informe o slug para carregar" })

        const { data, error } = await supabase.from("cotacoes").select("*").eq("slug", slug.trim()).single()
        if (error || !data) return setMensagem({ tipo: "erro", texto: "Cotação não encontrada" })

        const s = data.snapshot as Snapshot

        setClienteNome(s.cliente?.nome || data.cliente_nome || "")
        setClienteEmail(s.cliente?.email || data.cliente_email || "")

        setDestinoNome(s.meta?.destino_nome || data.destino_nome || "")
        setDestinoEstado(s.meta?.destino_estado || data.destino_estado || "")
        setDestinoPais(s.meta?.destino_pais || "Brasil")
        setDestinoImagem(s.meta?.destino_imagem || data.destino_imagem || "")
        setDestinoTagline(s.meta?.tagline || "")
        setDestinoDuracao(s.meta?.duracao || "")
        setDataInicio(s.meta?.data_inicio || "")
        setDataFim(s.meta?.data_fim || "")

        setValorTotal(s.financeiro?.valor_total?.toString().replace(".", ",") || "")
        setParcelamento(s.financeiro?.parcelamento || "em até 10x sem juros")
        setObservacoesFinanceiras(s.financeiro?.observacoes || "")

        const vooIda = s.itens?.find(i => i.tipo === "voo" && (i.dados as VooDados).direcao === "ida")
        if (vooIda) {
            const v = vooIda.dados as VooDados
            setVooIdaAtivo(true)
            setVooIdaCompanhia(v.companhia || "")
            setVooIdaNumero(v.numero_voo || "")
            setVooIdaData(v.data || "")
            setVooIdaDiaSemana(v.dia_semana || "")
            setVooIdaOrigemCodigo(v.origem?.codigo || "")
            setVooIdaOrigemCidade(v.origem?.cidade || "")
            setVooIdaDestinoCodigo(v.destino?.codigo || "")
            setVooIdaDestinoCidade(v.destino?.cidade || "")
            setVooIdaHorarioSaida(v.horario_saida || "")
            setVooIdaHorarioChegada(v.horario_chegada || "")
            setVooIdaDuracao(v.duracao || "")
            setVooIdaBagagem(v.bagagem || "")
            setVooIdaConexoes(v.conexoes || 0)
        } else {
            setVooIdaAtivo(false)
        }

        const vooVolta = s.itens?.find(i => i.tipo === "voo" && (i.dados as VooDados).direcao === "volta")
        if (vooVolta) {
            const v = vooVolta.dados as VooDados
            setVooVoltaAtivo(true)
            setVooVoltaCompanhia(v.companhia || "")
            setVooVoltaNumero(v.numero_voo || "")
            setVooVoltaData(v.data || "")
            setVooVoltaDiaSemana(v.dia_semana || "")
            setVooVoltaOrigemCodigo(v.origem?.codigo || "")
            setVooVoltaOrigemCidade(v.origem?.cidade || "")
            setVooVoltaDestinoCodigo(v.destino?.codigo || "")
            setVooVoltaDestinoCidade(v.destino?.cidade || "")
            setVooVoltaHorarioSaida(v.horario_saida || "")
            setVooVoltaHorarioChegada(v.horario_chegada || "")
            setVooVoltaDuracao(v.duracao || "")
            setVooVoltaBagagem(v.bagagem || "")
            setVooVoltaConexoes(v.conexoes || 0)
        } else {
            setVooVoltaAtivo(false)
        }

        const hotel = s.itens?.find(i => i.tipo === "hotel")
        if (hotel) {
            const h = hotel.dados as HotelDados
            setHotelAtivo(true)
            setHotelNome(h.nome || "")
            setHotelCategoria(h.categoria || "")
            setHotelEstrelas(h.estrelas || 0)
            setHotelLocalizacao(h.localizacao || "")
            setHotelNoites(h.noites || 0)
            setHotelRegime(h.regime || "")
            setHotelDescricao(h.descricao || "")
            setHotelAmenidades((h.amenidades || []).join(", "))
            setHotelImagens((h.imagens || []).join("\n"))
            setHotelNotaAvaliacao(h.avaliacao?.nota?.toString() || "")
            setHotelTotalAvaliacoes(h.avaliacao?.total_avaliacoes?.toString() || "")
        } else {
            setHotelAtivo(false)
        }

        const transferIda = s.itens?.find(i => i.tipo === "transfer" && (i.dados as TransferDados).direcao === "ida")
        if (transferIda) {
            const t = transferIda.dados as TransferDados
            setTransferIdaAtivo(true)
            setTransferIdaTipo(t.tipo || "Carro privativo")
            setTransferIdaOrigemNome(t.origem?.nome || "")
            setTransferIdaOrigemCidade(t.origem?.cidade || "")
            setTransferIdaDestinoNome(t.destino?.nome || "")
            setTransferIdaDestinoCidade(t.destino?.cidade || "")
            setTransferIdaDuracao(t.duracao || "")
            setTransferIdaDistancia(t.distancia || "")
        } else {
            setTransferIdaAtivo(false)
        }

        const transferVolta = s.itens?.find(i => i.tipo === "transfer" && (i.dados as TransferDados).direcao === "volta")
        if (transferVolta) {
            const t = transferVolta.dados as TransferDados
            setTransferVoltaAtivo(true)
            setTransferVoltaTipo(t.tipo || "Carro privativo")
            setTransferVoltaOrigemNome(t.origem?.nome || "")
            setTransferVoltaOrigemCidade(t.origem?.cidade || "")
            setTransferVoltaDestinoNome(t.destino?.nome || "")
            setTransferVoltaDestinoCidade(t.destino?.cidade || "")
            setTransferVoltaDuracao(t.duracao || "")
            setTransferVoltaDistancia(t.distancia || "")
        } else {
            setTransferVoltaAtivo(false)
        }

        setExperiencias(s.experiencias || [])

        setMensagem({ tipo: "sucesso", texto: "Cotação carregada!" })
    }

    const iniciarNovaCotacao = () => {
        setMensagem(null)
        setSlug("")

        setClienteNome("")
        setClienteEmail("")

        setDestinoNome("")
        setDestinoEstado("")
        setDestinoPais("Brasil")
        setDestinoImagem("")
        setDestinoTagline("")
        setDestinoDuracao("")
        setDataInicio("")
        setDataFim("")

        setVooIdaAtivo(true)
        setVooIdaCompanhia("")
        setVooIdaNumero("")
        setVooIdaData("")
        setVooIdaDiaSemana("")
        setVooIdaOrigemCodigo("")
        setVooIdaOrigemCidade("")
        setVooIdaDestinoCodigo("")
        setVooIdaDestinoCidade("")
        setVooIdaHorarioSaida("")
        setVooIdaHorarioChegada("")
        setVooIdaDuracao("")
        setVooIdaBagagem("")
        setVooIdaConexoes(0)

        setVooVoltaAtivo(true)
        setVooVoltaCompanhia("")
        setVooVoltaNumero("")
        setVooVoltaData("")
        setVooVoltaDiaSemana("")
        setVooVoltaOrigemCodigo("")
        setVooVoltaOrigemCidade("")
        setVooVoltaDestinoCodigo("")
        setVooVoltaDestinoCidade("")
        setVooVoltaHorarioSaida("")
        setVooVoltaHorarioChegada("")
        setVooVoltaDuracao("")
        setVooVoltaBagagem("")
        setVooVoltaConexoes(0)

        setHotelAtivo(true)
        setHotelNome("")
        setHotelCategoria("")
        setHotelEstrelas(0)
        setHotelLocalizacao("")
        setHotelNoites(0)
        setHotelRegime("Café da manhã incluso")
        setHotelDescricao("")
        setHotelAmenidades("")
        setHotelImagens("")
        setHotelNotaAvaliacao("")
        setHotelTotalAvaliacoes("")

        setTransferIdaAtivo(true)
        setTransferIdaTipo("Carro privativo")
        setTransferIdaOrigemNome("")
        setTransferIdaOrigemCidade("")
        setTransferIdaDestinoNome("")
        setTransferIdaDestinoCidade("")
        setTransferIdaDuracao("")
        setTransferIdaDistancia("")

        setTransferVoltaAtivo(true)
        setTransferVoltaTipo("Carro privativo")
        setTransferVoltaOrigemNome("")
        setTransferVoltaOrigemCidade("")
        setTransferVoltaDestinoNome("")
        setTransferVoltaDestinoCidade("")
        setTransferVoltaDuracao("")
        setTransferVoltaDistancia("")

        setExperiencias([])

        setValorTotal("")
        setParcelamento("em até 10x sem juros")
        setObservacoesFinanceiras("")
    }

    return {
        slug,
        setSlug,

        mensagem,
        salvando,

        clienteNome,
        setClienteNome,
        clienteEmail,
        setClienteEmail,

        destinoNome,
        setDestinoNome,
        destinoEstado,
        setDestinoEstado,
        destinoPais,
        setDestinoPais,
        destinoImagem,
        setDestinoImagem,
        destinoTagline,
        setDestinoTagline,
        destinoDuracao,
        setDestinoDuracao,
        dataInicio,
        setDataInicio,
        dataFim,
        setDataFim,

        vooIdaAtivo,
        setVooIdaAtivo,
        vooIdaCompanhia,
        setVooIdaCompanhia,
        vooIdaNumero,
        setVooIdaNumero,
        vooIdaData,
        setVooIdaData,
        vooIdaDiaSemana,
        setVooIdaDiaSemana,
        vooIdaOrigemCodigo,
        setVooIdaOrigemCodigo,
        vooIdaOrigemCidade,
        setVooIdaOrigemCidade,
        vooIdaDestinoCodigo,
        setVooIdaDestinoCodigo,
        vooIdaDestinoCidade,
        setVooIdaDestinoCidade,
        vooIdaHorarioSaida,
        setVooIdaHorarioSaida,
        vooIdaHorarioChegada,
        setVooIdaHorarioChegada,
        vooIdaDuracao,
        setVooIdaDuracao,
        vooIdaBagagem,
        setVooIdaBagagem,
        vooIdaConexoes,
        setVooIdaConexoes,

        vooVoltaAtivo,
        setVooVoltaAtivo,
        vooVoltaCompanhia,
        setVooVoltaCompanhia,
        vooVoltaNumero,
        setVooVoltaNumero,
        vooVoltaData,
        setVooVoltaData,
        vooVoltaDiaSemana,
        setVooVoltaDiaSemana,
        vooVoltaOrigemCodigo,
        setVooVoltaOrigemCodigo,
        vooVoltaOrigemCidade,
        setVooVoltaOrigemCidade,
        vooVoltaDestinoCodigo,
        setVooVoltaDestinoCodigo,
        vooVoltaDestinoCidade,
        setVooVoltaDestinoCidade,
        vooVoltaHorarioSaida,
        setVooVoltaHorarioSaida,
        vooVoltaHorarioChegada,
        setVooVoltaHorarioChegada,
        vooVoltaDuracao,
        setVooVoltaDuracao,
        vooVoltaBagagem,
        setVooVoltaBagagem,
        vooVoltaConexoes,
        setVooVoltaConexoes,

        hotelAtivo,
        setHotelAtivo,
        hotelNome,
        setHotelNome,
        hotelCategoria,
        setHotelCategoria,
        hotelEstrelas,
        setHotelEstrelas,
        hotelLocalizacao,
        setHotelLocalizacao,
        hotelNoites,
        setHotelNoites,
        hotelRegime,
        setHotelRegime,
        hotelDescricao,
        setHotelDescricao,
        hotelAmenidades,
        setHotelAmenidades,
        hotelImagens,
        setHotelImagens,
        hotelNotaAvaliacao,
        setHotelNotaAvaliacao,
        hotelTotalAvaliacoes,
        setHotelTotalAvaliacoes,

        transferIdaAtivo,
        setTransferIdaAtivo,
        transferIdaTipo,
        setTransferIdaTipo,
        transferIdaOrigemNome,
        setTransferIdaOrigemNome,
        transferIdaOrigemCidade,
        setTransferIdaOrigemCidade,
        transferIdaDestinoNome,
        setTransferIdaDestinoNome,
        transferIdaDestinoCidade,
        setTransferIdaDestinoCidade,
        transferIdaDuracao,
        setTransferIdaDuracao,
        transferIdaDistancia,
        setTransferIdaDistancia,

        transferVoltaAtivo,
        setTransferVoltaAtivo,
        transferVoltaTipo,
        setTransferVoltaTipo,
        transferVoltaOrigemNome,
        setTransferVoltaOrigemNome,
        transferVoltaOrigemCidade,
        setTransferVoltaOrigemCidade,
        transferVoltaDestinoNome,
        setTransferVoltaDestinoNome,
        transferVoltaDestinoCidade,
        setTransferVoltaDestinoCidade,
        transferVoltaDuracao,
        setTransferVoltaDuracao,
        transferVoltaDistancia,
        setTransferVoltaDistancia,

        experiencias,
        adicionarExperiencia,
        atualizarExperiencia,
        removerExperiencia,

        valorTotal,
        setValorTotal,
        parcelamento,
        setParcelamento,
        observacoesFinanceiras,
        setObservacoesFinanceiras,

        destinosCatalogo,
        hoteisCatalogo,
        experienciasCatalogo,

        carregarCotacao,
        salvarCotacao,
        criarCotacaoRascunho,
        criarRascunho,
        montarSnapshot,
        selecionarDestino,
        selecionarHotel,

        iniciarNovaCotacao,
    }
}
