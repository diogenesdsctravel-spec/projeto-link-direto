/**
 * Serviço de extração de dados de cotação
 *
 * Fluxo:
 * 1. Frontend extrai texto do PDF
 * 2. Envia TEXTO para Edge Function
 * 3. Edge Function chama OpenAI
 * 4. Retorna JSON estruturado
 */

import { processarArquivos } from "./pdfParaTexto"

export interface DadosExtraidos {
    cliente: {
        nome?: string
        email?: string
        telefone?: string
        qtd_adultos?: number
        qtd_criancas?: number
    }

    destino: {
        cidade: string
        estado?: string
        pais: string
    }

    datas: {
        ida: string
        volta?: string
        noites?: number
    }

    vooIda?: {
        companhia: string
        numero_voo?: string
        origem_codigo: string
        origem_cidade: string
        destino_codigo: string
        destino_cidade: string
        data: string
        horario_saida: string
        horario_chegada: string
        duracao: string
        conexoes: number
        bagagem?: string
    }

    vooVolta?: {
        companhia: string
        numero_voo?: string
        origem_codigo: string
        origem_cidade: string
        destino_codigo: string
        destino_cidade: string
        data: string
        horario_saida: string
        horario_chegada: string
        duracao: string
        conexoes: number
        bagagem?: string
    }

    hotel?: {
        nome: string
        endereco?: string
        estrelas?: number
        checkin: string
        checkout: string
        noites: number
        tipo_quarto?: string
        regime?: string
    }

    financeiro: {
        valor_total: number
        moeda: string
        valor_por_pessoa?: number
    }

    observacoes?: string[]
    confianca: number
}

/**
 * Converte File para base64 data URL
 */
async function fileParaDataUrl(arquivo: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(arquivo)
    })
}

/**
 * Extrai dados da cotação usando IA
 */
export async function extrairDadosCotacao(
    arquivos: File[],
    instrucaoExtra?: string
): Promise<DadosExtraidos> {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !anonKey) {
        throw new Error("VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não configuradas")
    }

    console.log("Processando arquivos...")
    const { textos, imagens, avisos } = await processarArquivos(arquivos)

    avisos.forEach(aviso => console.warn(aviso))

    const textoConcatenado = textos.join("\n\n---\n\n")

    const imagensBase64: { tipo: string; conteudo: string }[] = []
    for (const img of imagens) {
        const dataUrl = await fileParaDataUrl(img)
        imagensBase64.push({
            tipo: img.type,
            conteudo: dataUrl
        })
    }

    if (!textoConcatenado && imagensBase64.length === 0) {
        throw new Error("Nenhum conteúdo extraído dos arquivos. Verifique se o PDF tem texto selecionável.")
    }

    console.log(`Enviando para IA: ${textoConcatenado.length} caracteres de texto, ${imagensBase64.length} imagem(ns)`)

    const resp = await fetch(`${supabaseUrl}/functions/v1/extrair-cotacao`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": anonKey,
            "Authorization": `Bearer ${anonKey}`
        },
        body: JSON.stringify({
            texto: textoConcatenado,
            imagens: imagensBase64,
            instrucaoIA: instrucaoExtra ?? ""
        })
    })

    const rawText = await resp.text()

    if (!resp.ok) {
        let msg = rawText
        try {
            const j = JSON.parse(rawText)
            msg = j?.error || j?.message || j?.details || rawText
        } catch { }
        throw new Error(`Erro na Edge Function: ${resp.status} - ${msg}`)
    }

    try {
        return JSON.parse(rawText) as DadosExtraidos
    } catch {
        throw new Error("Resposta da IA não é JSON válido")
    }
}

/**
 * Aplica os dados extraídos no formulário
 */
export function aplicarDadosNoForm(dados: DadosExtraidos, form: any) {
    const d: any = dados || {}

    console.log("aplicarDadosNoForm setters", {
        setClienteNome: typeof form?.setClienteNome,
        setDestinoNome: typeof form?.setDestinoNome,
        setDataInicio: typeof form?.setDataInicio,
        setValorTotal: typeof form?.setValorTotal,
        setVooIdaCompanhia: typeof form?.setVooIdaCompanhia,
        setHotelNome: typeof form?.setHotelNome
    })

    const clienteNome =
        d?.cliente?.nome ??
        d?.cliente?.Nome ??
        d?.cliente?.clienteNome ??
        ""

    const clienteEmail =
        d?.cliente?.email ??
        d?.cliente?.Email ??
        d?.cliente?.clienteEmail ??
        ""

    if (typeof form?.setClienteNome === "function") {
        form.setClienteNome((clienteNome || "").trim() ? clienteNome : "Pendente")
    }
    if (typeof form?.setClienteEmail === "function" && clienteEmail) {
        form.setClienteEmail(clienteEmail)
    }

    const destinoCidade =
        d?.destino?.cidade ??
        d?.destino?.nome ??
        d?.destino?.Destino ??
        ""

    const destinoEstado =
        d?.destino?.estado ??
        d?.destino?.uf ??
        ""

    const destinoPais =
        d?.destino?.pais ??
        d?.destino?.Pais ??
        "Brasil"

    if (typeof form?.setDestinoNome === "function") {
        form.setDestinoNome(destinoCidade || "")
    }
    if (typeof form?.setDestinoEstado === "function") {
        form.setDestinoEstado(destinoEstado || "")
    }
    if (typeof form?.setDestinoPais === "function") {
        form.setDestinoPais(destinoPais || "Brasil")
    }

    const dataInicio =
        d?.datas?.ida ??
        d?.datas?.inicio ??
        d?.hotel?.checkin ??
        ""

    const dataFim =
        d?.datas?.volta ??
        d?.datas?.fim ??
        d?.hotel?.checkout ??
        ""

    const noites =
        d?.datas?.noites ??
        d?.hotel?.noites ??
        0

    if (typeof form?.setDataInicio === "function" && dataInicio) form.setDataInicio(dataInicio)
    if (typeof form?.setDataFim === "function" && dataFim) form.setDataFim(dataFim)
    if (typeof form?.setDestinoDuracao === "function" && noites) form.setDestinoDuracao(`${noites} noites`)

    if (d?.vooIda) {
        form?.setVooIdaAtivo?.(true)
        form?.setVooIdaCompanhia?.(d.vooIda.companhia || "")
        form?.setVooIdaNumero?.(d.vooIda.numero_voo || "")
        form?.setVooIdaData?.(d.vooIda.data || "")
        form?.setVooIdaOrigemCodigo?.(d.vooIda.origem_codigo || "")
        form?.setVooIdaOrigemCidade?.(d.vooIda.origem_cidade || "")
        form?.setVooIdaDestinoCodigo?.(d.vooIda.destino_codigo || "")
        form?.setVooIdaDestinoCidade?.(d.vooIda.destino_cidade || "")
        form?.setVooIdaHorarioSaida?.(d.vooIda.horario_saida || "")
        form?.setVooIdaHorarioChegada?.(d.vooIda.horario_chegada || "")
        form?.setVooIdaDuracao?.(d.vooIda.duracao || "")
        form?.setVooIdaConexoes?.(d.vooIda.conexoes || 0)
        if (d.vooIda.bagagem) form?.setVooIdaBagagem?.(d.vooIda.bagagem)
    } else {
        form?.setVooIdaAtivo?.(false)
    }

    if (d?.vooVolta) {
        form?.setVooVoltaAtivo?.(true)
        form?.setVooVoltaCompanhia?.(d.vooVolta.companhia || "")
        form?.setVooVoltaNumero?.(d.vooVolta.numero_voo || "")
        form?.setVooVoltaData?.(d.vooVolta.data || "")
        form?.setVooVoltaOrigemCodigo?.(d.vooVolta.origem_codigo || "")
        form?.setVooVoltaOrigemCidade?.(d.vooVolta.origem_cidade || "")
        form?.setVooVoltaDestinoCodigo?.(d.vooVolta.destino_codigo || "")
        form?.setVooVoltaDestinoCidade?.(d.vooVolta.destino_cidade || "")
        form?.setVooVoltaHorarioSaida?.(d.vooVolta.horario_saida || "")
        form?.setVooVoltaHorarioChegada?.(d.vooVolta.horario_chegada || "")
        form?.setVooVoltaDuracao?.(d.vooVolta.duracao || "")
        form?.setVooVoltaConexoes?.(d.vooVolta.conexoes || 0)
        if (d.vooVolta.bagagem) form?.setVooVoltaBagagem?.(d.vooVolta.bagagem)
    } else {
        form?.setVooVoltaAtivo?.(false)
    }

    if (d?.hotel) {
        form?.setHotelAtivo?.(true)
        form?.setHotelNome?.(d.hotel.nome || "")
        if (d.hotel.estrelas) form?.setHotelEstrelas?.(d.hotel.estrelas)
        if (d.hotel.endereco) form?.setHotelLocalizacao?.(d.hotel.endereco)
        if (d.hotel.noites) form?.setHotelNoites?.(d.hotel.noites)
        if (d.hotel.regime) form?.setHotelRegime?.(d.hotel.regime)
    } else {
        form?.setHotelAtivo?.(false)
    }

    const valorTotal =
        d?.financeiro?.valor_total ??
        d?.financeiro?.valorTotal ??
        d?.financeiro?.total ??
        d?.financeiro?.valor ??
        null

    if (typeof form?.setValorTotal === "function") {
        const v = valorTotal === null || valorTotal === undefined ? "" : String(valorTotal)
        form.setValorTotal(v ? v.replace(".", ",") : "")
    }

    const obs: string[] = Array.isArray(d?.observacoes) ? d.observacoes.slice(0) : []

    const adultos = d?.cliente?.qtd_adultos ?? d?.cliente?.adultos ?? null
    const criancas = d?.cliente?.qtd_criancas ?? d?.cliente?.criancas ?? null
    if (adultos !== null || criancas !== null) {
        obs.push(`Passageiros: ${adultos ?? 0} adulto(s), ${criancas ?? 0} criança(s)`)
    }

    if (typeof form?.setObservacoesFinanceiras === "function" && obs.length > 0) {
        form.setObservacoesFinanceiras(obs.join("\n"))
    }

    if (!destinoCidade && d?.destino?.cidade && typeof form?.setDestinoNome === "function") {
        form.setDestinoNome(d.destino.cidade)
    }
}
