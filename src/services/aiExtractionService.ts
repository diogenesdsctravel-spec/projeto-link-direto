/**
 * AI EXTRACTION SERVICE - VERSÃO COM MÚLTIPLOS ARQUIVOS
 *
 * Extrai TODOS os dados de cotações de viagem:
 * - Suporta múltiplos PDFs e imagens
 * - Consolida dados de várias fontes
 * - Extrai detalhes de conexões de prints adicionais
 */

import type { ExtractedQuoteData, ExtractionResult } from "../types/extractedQuoteData"
import { generateExperiencesForDestination } from "./experienceGeneratorService"

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

const EXTRACTION_PROMPT = `Você é um assistente especializado em extrair dados de cotações de viagem brasileiras.

IMPORTANTE: Você pode receber MÚLTIPLAS imagens de DIFERENTES fontes:
- PDF principal da cotação
- Prints adicionais com detalhes de conexões/escalas
- Prints com informações de bagagem
- Outras imagens complementares

Sua tarefa é CONSOLIDAR todas as informações em uma única cotação completa.

═══════════════════════════════════════════════════════════════
REGRAS CRÍTICAS PARA IDENTIFICAR ORIGEM E DESTINO:
═══════════════════════════════════════════════════════════════

1. ORIGEM DO CLIENTE = primeiro aeroporto do VOO DE IDA (de onde o avião DECOLA)

2. DESTINO TURÍSTICO (campo "destination"):
   USE SEU CONHECIMENTO DE MUNDO para identificar onde o hotel REALMENTE fica:
   - "Pousada La Sierra" → Campos do Jordão
   - "Bella Gramado Resort" → Gramado
   - "Hotel & Spa do Vinho" → Bento Gonçalves
   - "Krystal Cancún" → Cancún
   - "Dreams Sands Cancún" → Cancún

   O AEROPORTO DE CHEGADA frequentemente NÃO é o destino turístico:
   - POA (Porto Alegre) serve: Gramado, Canela, Bento Gonçalves
   - GRU/CGH (São Paulo) serve: Campos do Jordão, Atibaia
   - CUN serve: Cancún, Riviera Maya, Playa del Carmen

═══════════════════════════════════════════════════════════════
REGRAS PARA MÚLTIPLAS IMAGENS:
═══════════════════════════════════════════════════════════════

1. PRIORIDADE: Se a mesma informação aparecer em múltiplas imagens, 
   use a MAIS DETALHADA (ex: print de conexão > resumo do PDF)

2. CONEXÕES/ESCALAS: Procure em TODAS as imagens por:
   - Detalhes de cada trecho do voo
   - Aeroportos de conexão
   - Tempos de espera
   - Números de voo de cada segmento

3. CONSOLIDAÇÃO: Combine informações complementares:
   - PDF pode ter preço e hotel
   - Print pode ter detalhes das escalas
   - Outra imagem pode ter bagagem

═══════════════════════════════════════════════════════════════
EXTRAIA DETALHADAMENTE:
═══════════════════════════════════════════════════════════════

1. VOOS - Para CADA segmento extraia:
   - Companhia aérea e código (ex: "Avianca", "AV")
   - Número do voo (ex: "AD415")
   - Aeronave se disponível (ex: "Airbus 320/200")
   - Classe (ex: "Econômica")
   - Data, horários de partida e chegada
   - Aeroportos (código e nome completo)
   - Duração do trecho
   - Tempo de conexão entre trechos

   ATENÇÃO ESPECIAL ÀS ESCALAS:
   - Se o voo tem "2 escalas", deve haver 3 segmentos
   - Se o voo tem "1 escala", deve haver 2 segmentos
   - Extraia TODOS os segmentos de TODAS as imagens

2. BAGAGEM - Para CADA trecho (ida e volta) identifique:
   - Item pessoal (mochila/bolsa): incluído ou não
   - Mala de mão (10kg): incluído ou não
   - Mala despachada (23kg): incluído ou não
   
   ATENÇÃO: A bagagem pode variar entre trechos do mesmo voo!

3. TRANSFERS - Extraia:
   - Se está incluído no pacote
   - Tipo (compartilhado/privativo)
   - De onde para onde
   - Data e horário se disponível

4. ITENS ADICIONAIS - Extraia cada item separado:
   - Passeios (ex: "Passeio a Chichén Itzá")
   - Seguro viagem
   - Outros serviços
   - Quantidade de pessoas e valor de cada

5. PAGAMENTO - Extraia:
   - Valor total do pacote
   - Valor dos adicionais separados
   - Opções de parcelamento
   - Desconto à vista se houver

6. O QUE ESTÁ INCLUSO - Liste tudo que o pacote inclui:
   - Voos
   - Hotel
   - Café da manhã / All inclusive
   - Transfers
   - Bagagem
   - Taxas

7. REGIME ALIMENTAR DO HOTEL (mealPlan) - MUITO IMPORTANTE:
   Procure por termos como:
   - "All inclusive" ou "All Inclusive" → mealPlan: "All Inclusive"
   - "Café da manhã incluso" → mealPlan: "Café da manhã incluso"
   - "Meia pensão" → mealPlan: "Meia pensão"
   - "Pensão completa" → mealPlan: "Pensão completa"
   - "Apenas hospedagem" ou sem menção → mealPlan: null
   
   ATENÇÃO: Não invente! Se não encontrar informação sobre refeições, use null.

═══════════════════════════════════════════════════════════════

Retorne APENAS JSON válido, sem markdown ou explicações:

{
  "destination": "cidade turística onde o HOTEL fica",
  "destinationAirport": "código do aeroporto",
  "origin": "cidade de origem",
  "originAirport": "código do aeroporto",
  "travelDate": "data ida",
  "returnDate": "data volta",
  "totalNights": 7,
  "passengers": "2 adultos",
  "passengerNames": ["Nome1", "Nome2"],
  
  "outboundFlight": {
    "type": "outbound",
    "segments": [
      {
        "airline": "Azul",
        "airlineCode": "AD",
        "flightNumber": "AD415",
        "aircraft": "Airbus 320",
        "class": "Econômica",
        "date": "qua. 12 fev. 2025",
        "departureTime": "05:35",
        "arrivalTime": "09:10",
        "departureAirport": "SSA",
        "departureCity": "Salvador",
        "departureAirportName": "Aeroporto Internacional de Salvador",
        "arrivalAirport": "GRU",
        "arrivalCity": "São Paulo",
        "arrivalAirportName": "Aeroporto Internacional de Guarulhos",
        "duration": "2h 35m"
      },
      {
        "airline": "Azul",
        "airlineCode": "AD",
        "flightNumber": "AD8750",
        "aircraft": "Airbus 330",
        "class": "Econômica",
        "date": "qua. 12 fev. 2025",
        "departureTime": "12:30",
        "arrivalTime": "18:45",
        "departureAirport": "GRU",
        "departureCity": "São Paulo",
        "departureAirportName": "Aeroporto Internacional de Guarulhos",
        "arrivalAirport": "CUN",
        "arrivalCity": "Cancún",
        "arrivalAirportName": "Aeroporto Internacional de Cancún",
        "duration": "9h 15m"
      }
    ],
    "totalDuration": "18h 26m",
    "stops": 2,
    "stopInfo": "2 escalas em São Paulo e Cidade do México",
    "connectionTime": "3h 20m",
    "connectionCity": "São Paulo"
  },
  
  "returnFlight": {
    "type": "return",
    "segments": [...],
    "totalDuration": "10h 40m",
    "stops": 1,
    "stopInfo": "1 escala em São Paulo",
    "connectionTime": "2h 15m",
    "connectionCity": "São Paulo"
  },
  
  "outboundBaggage": {
    "personalItem": {
      "type": "personal",
      "description": "1 item pessoal",
      "included": true
    },
    "carryOn": {
      "type": "carryOn",
      "description": "Mala de mão 10kg",
      "weight": "10kg",
      "included": true
    },
    "checked": {
      "type": "checked",
      "description": "Mala despachada 23kg",
      "weight": "23kg",
      "included": true
    }
  },
  
  "returnBaggage": {
    "personalItem": {
      "type": "personal",
      "description": "1 item pessoal",
      "included": true
    },
    "carryOn": {
      "type": "carryOn",
      "description": "Mala de mão 10kg",
      "weight": "10kg",
      "included": true
    },
    "checked": {
      "type": "checked",
      "description": "Mala despachada 23kg",
      "weight": "23kg",
      "included": true
    }
  },
  
  "hotel": {
    "name": "Dreams Sands Cancún Resort & Spa",
    "stars": 5,
    "address": "BLVD. KUKULCAN KM 8.5",
    "checkIn": "qui. 12 fev. 2026",
    "checkInTime": "15:00",
    "checkOut": "qua. 18 fev. 2026",
    "checkOutTime": "12:00",
    "nights": 6,
    "guests": "2 adultos",
    "roomType": "Quarto Standard",
    "mealPlan": "All Inclusive"
  },
  
  "transfers": {
    "outbound": {
      "included": true,
      "type": "Privado",
      "vehicle": "Auto",
      "from": "Aeroporto de Cancún",
      "to": "Hotel",
      "date": "12 fev. 2026",
      "passengers": "2 adultos",
      "freeCancellation": true
    },
    "return": {
      "included": true,
      "type": "Privado",
      "vehicle": "Auto",
      "from": "Hotel",
      "to": "Aeroporto de Cancún",
      "date": "18 fev. 2026",
      "passengers": "2 adultos",
      "freeCancellation": true
    }
  },
  
  "additionalItems": [
    {
      "name": "Seguro viagem",
      "description": "Cobertura completa",
      "quantity": "2 pessoas",
      "price": "R$ 500",
      "included": false
    }
  ],
  
  "includedItems": [
    { "name": "Voos de ida e volta", "included": true },
    { "name": "6 noites de hotel", "included": true },
    { "name": "All Inclusive", "included": true },
    { "name": "Transfers", "included": true },
    { "name": "Taxas de embarque", "included": true }
  ],
  
  "payment": {
    "totalPrice": "R$ 27.758",
    "pricePerPerson": "R$ 13.879",
    "installments": {
      "quantity": 10,
      "value": "R$ 2.775,80",
      "interestFree": true
    },
    "currency": "BRL"
  },
  
  "totalPrice": "R$ 27.758",
  "quotationDate": "27 de dezembro de 2025",
  "suggestedExperiences": []
}

IMPORTANTE:
- Se algum dado não estiver disponível, use null ou omita o campo
- Para bagagem, se não especificado, assuma que item pessoal e mala de mão estão incluídos
- Para transfers, se não mencionado, assuma included: false
- Extraia TODOS os segmentos de voo de TODAS as imagens, incluindo conexões
- O totalPrice deve ser o valor TOTAL do pacote
- Para mealPlan: procure EXATAMENTE o que está escrito. NÃO INVENTE!
- CONSOLIDE informações de múltiplas imagens em uma única resposta completa
`

/**
 * Converte arquivo para base64
 */
function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            const result = reader.result as string
            const base64 = result.split(",")[1]
            resolve(base64)
        }
        reader.onerror = reject
    })
}

/**
 * Converte PDF para array de imagens base64 usando pdf.js
 */
async function convertPDFToImages(file: File): Promise<string[]> {
    const pdfjsLib = (window as any).pdfjsLib

    if (!pdfjsLib) {
        throw new Error("PDF.js não carregado. Recarregue a página.")
    }

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

    const images: string[] = []
    const scale = 2.0

    const maxPages = Math.min(pdf.numPages, 8)

    for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale })

        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")!
        canvas.height = viewport.height
        canvas.width = viewport.width

        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise

        const base64 = canvas.toDataURL("image/jpeg", 0.9).split(",")[1]
        images.push(base64)
    }

    return images
}

/**
 * Aplica valores padrão para campos não extraídos
 */
function applyDefaults(data: any): ExtractedQuoteData {
    // Default bagagem
    const defaultBaggage = {
        personalItem: {
            type: "personal" as const,
            description: "1 item pessoal",
            included: true
        },
        carryOn: {
            type: "carryOn" as const,
            description: "Mala de mão 10kg",
            weight: "10kg",
            included: true
        },
        checked: {
            type: "checked" as const,
            description: "Mala despachada 23kg",
            weight: "23kg",
            included: false
        }
    }

    // Default transfer
    const defaultTransfer = {
        included: false,
        from: "",
        to: ""
    }

    return {
        ...data,
        outboundBaggage: data.outboundBaggage || defaultBaggage,
        returnBaggage: data.returnBaggage || defaultBaggage,
        transfers: data.transfers || {
            outbound: defaultTransfer,
            return: defaultTransfer
        },
        additionalItems: data.additionalItems || [],
        includedItems: data.includedItems || [],
        payment: data.payment || {
            totalPrice: data.totalPrice || "A consultar",
            currency: "BRL"
        }
    }
}

/**
 * Envia imagens para OpenAI Vision
 */
async function sendToOpenAI(
    images: Array<{ base64: string; mimeType: string }>
): Promise<ExtractedQuoteData> {
    const imageContents = images.map(img => ({
        type: "image_url" as const,
        image_url: {
            url: `data:${img.mimeType};base64,${img.base64}`,
            detail: "high" as const
        }
    }))

    console.log(`📤 Enviando ${images.length} imagens para OpenAI...`)

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: [{ type: "text", text: EXTRACTION_PROMPT }, ...imageContents]
                }
            ],
            max_tokens: 6000,
            temperature: 0.1
        })
    })

    if (!response.ok) {
        const errorData = await response.json()
        console.error("Erro OpenAI:", errorData)
        throw new Error(errorData.error?.message || `Erro ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || "{}"

    const cleanJson = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim()

    console.log("📄 Resposta OpenAI (raw):", cleanJson)

    let parsedData = JSON.parse(cleanJson)

    // Aplicar valores padrão
    parsedData = applyDefaults(parsedData)

    // Gerar experiências com o cérebro especializado
    if (parsedData.destination) {
        console.log("🧠 Chamando cérebro de experiências para:", parsedData.destination)
        const experiences = await generateExperiencesForDestination(parsedData.destination)
        parsedData.suggestedExperiences = experiences
    }

    console.log("✅ Dados extraídos completos:", parsedData)

    return {
        ...parsedData,
        extractedAt: new Date().toISOString()
    }
}

/**
 * Função principal de extração - SUPORTA MÚLTIPLOS ARQUIVOS
 */
export async function extractQuoteFromFiles(files: File[]): Promise<ExtractionResult> {
    try {
        console.log(`🔍 Extraindo de ${files.length} arquivo(s):`, files.map(f => f.name))

        let allImages: Array<{ base64: string; mimeType: string }> = []

        for (const file of files) {
            console.log(`📁 Processando: ${file.name} (${file.type})`)

            if (file.type === "application/pdf") {
                console.log("📑 Convertendo PDF para imagens...")
                const pdfImages = await convertPDFToImages(file)
                const images = pdfImages.map(base64 => ({ base64, mimeType: "image/jpeg" }))
                allImages.push(...images)
                console.log(`✅ Convertidas ${images.length} páginas do PDF`)
            } else if (file.type.startsWith("image/")) {
                const base64 = await fileToBase64(file)
                allImages.push({ base64, mimeType: file.type })
                console.log(`✅ Imagem adicionada: ${file.name}`)
            } else {
                console.warn(`⚠️ Formato não suportado: ${file.name} (${file.type})`)
            }
        }

        if (allImages.length === 0) {
            throw new Error("Nenhum arquivo válido. Use PDF ou imagens (PNG, JPG).")
        }

        console.log(`🚀 Enviando ${allImages.length} imagens para OpenAI...`)
        const data = await sendToOpenAI(allImages)

        console.log("✅ Extração completa!")

        return { success: true, data }
    } catch (error) {
        console.error("❌ Erro na extração:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Erro desconhecido"
        }
    }
}

/**
 * Função de compatibilidade - aceita um único arquivo
 * @deprecated Use extractQuoteFromFiles para suportar múltiplos arquivos
 */
export async function extractQuoteFromFile(file: File): Promise<ExtractionResult> {
    return extractQuoteFromFiles([file])
}

/**
 * Verifica se a API está configurada
 */
export function isAIConfigured(): boolean {
    return !!OPENAI_API_KEY && OPENAI_API_KEY.startsWith("sk-")
}

/**
 * Carrega pdf.js da CDN (chamar no início do app)
 */
export function loadPDFJS(): Promise<void> {
    return new Promise((resolve, reject) => {
        if ((window as any).pdfjsLib) {
            resolve()
            return
        }

        const script = document.createElement("script")
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        script.onload = () => {
            const pdfjsLib = (window as any).pdfjsLib
            pdfjsLib.GlobalWorkerOptions.workerSrc =
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"
            console.log("✅ PDF.js carregado com sucesso")
            resolve()
        }
        script.onerror = () => reject(new Error("Falha ao carregar PDF.js"))
        document.head.appendChild(script)
    })
}