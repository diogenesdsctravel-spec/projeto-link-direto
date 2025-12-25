/**
 * AI EXTRACTION SERVICE - VERSÃO CORRIGIDA
 *
 * Estratégia:
 * - Imagens: envia direto para OpenAI Vision
 * - PDFs: converte para imagens usando pdf.js e canvas, depois envia
 *
 * CORREÇÃO: Prompt melhorado para identificar destino TURÍSTICO corretamente
 */

import type { ExtractedQuoteData, ExtractionResult } from "../types/extractedQuoteData"
import { generateExperiencesForDestination } from "./experienceGeneratorService"

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

const EXTRACTION_PROMPT = `Você é um assistente especializado em extrair dados de cotações de viagem brasileiras.

Analise esta(s) imagem(ns) de cotação e extraia TODOS os dados em formato JSON.

═══════════════════════════════════════════════════════════════
REGRAS CRÍTICAS PARA IDENTIFICAR ORIGEM E DESTINO:
═══════════════════════════════════════════════════════════════

1. ORIGEM DO CLIENTE = primeiro aeroporto do VOO DE IDA (de onde o avião DECOLA)

2. DESTINO TURÍSTICO (campo "destination"):

   USE SEU CONHECIMENTO DE MUNDO para identificar onde o hotel REALMENTE fica:
   - "Pousada La Sierra" → Campos do Jordão (não São Paulo)
   - "Bella Gramado Resort" → Gramado (não Porto Alegre)
   - "Hotel & Spa do Vinho" → Bento Gonçalves (não Porto Alegre)
   - "Hotel & Spa do Vinho Autograph Collection" → Bento Gonçalves
   - "Krystal Cancún" → Cancún

   O AEROPORTO DE CHEGADA frequentemente NÃO é o destino turístico:
   - POA (Porto Alegre) serve: Gramado, Canela, Bento Gonçalves
   - GRU/CGH (São Paulo) serve: Campos do Jordão, Atibaia, Monte Verde
   - FLN (Florianópolis) serve: praias de SC
   - SDU/GIG (Rio) serve: Búzios, Angra dos Reis, Paraty

   SEMPRE pesquise em seu conhecimento: "Onde fica [NOME DO HOTEL]?"

   Se não souber onde o hotel fica, use: "Destino a confirmar"

3. IGNORE para definir destino:
   - Nome da agência de viagens
   - Cidade de origem do cliente
   - Título do PDF que menciona cidades
   - Aeroporto de chegada (use apenas como pista secundária)

═══════════════════════════════════════════════════════════════

EXTRAIA:
- Destino TURÍSTICO (baseado na LOCALIZAÇÃO REAL do hotel)
- Origem do cliente (primeiro aeroporto do voo de ida)
- Datas de ida e volta
- TODOS os voos com: companhia, número, horários, aeroportos, duração
- Conexões/escalas se houver
- Hotel: nome, endereço, check-in/out, tipo de quarto
- Informações de bagagem
- Preço total

Retorne APENAS JSON válido, sem markdown ou explicações.

{
  "destination": "cidade turística onde o HOTEL fica (use conhecimento de mundo)",
  "destinationAirport": "código do aeroporto de destino",
  "origin": "cidade de origem do cliente",
  "originAirport": "código do aeroporto de origem",
  "travelDate": "data ida",
  "returnDate": "data volta",
  "totalNights": numero,
  "passengers": "X adultos",
  "outboundFlight": {
    "segments": [
      {
        "airline": "cia",
        "flightNumber": "XX1234",
        "date": "DD MMM AAAA",
        "departureTime": "HH:MM",
        "arrivalTime": "HH:MM",
        "departureAirport": "XXX",
        "departureCity": "cidade",
        "arrivalAirport": "XXX",
        "arrivalCity": "cidade",
        "duration": "Xh XXm"
      }
    ],
    "totalDuration": "Xh XXm",
    "stops": 0,
    "stopInfo": "conexão em CIDADE se houver"
  },
  "returnFlight": {
    "segments": [...],
    "totalDuration": "Xh XXm",
    "stops": 0,
    "stopInfo": "conexão em CIDADE se houver"
  },
  "hotel": {
    "name": "nome completo",
    "stars": 4,
    "address": "endereço",
    "checkIn": "data",
    "checkInTime": "14:00",
    "checkOut": "data",
    "checkOutTime": "12:00",
    "nights": 7,
    "roomType": "tipo",
    "mealPlan": "café da manhã/all inclusive/etc"
  },
  "transfers": {
    "included": true,
    "type": "compartilhado/privativo",
    "details": "descrição"
  },
  "totalPrice": "R$ X.XXX",
  "quotationDate": "data da cotação",
  "suggestedExperiences": []
}
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

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: [{ type: "text", text: EXTRACTION_PROMPT }, ...imageContents]
                }
            ],
            max_tokens: 4000,
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

    console.log("Resposta OpenAI:", cleanJson)

    const parsedData = JSON.parse(cleanJson)

    // Gerar experiências com o cérebro especializado
    if (parsedData.destination) {
        console.log("🧠 Chamando cérebro de experiências...")
        const experiences = await generateExperiencesForDestination(parsedData.destination)
        parsedData.suggestedExperiences = experiences
    }

    return {
        ...parsedData,
        extractedAt: new Date().toISOString()
    }
}

/**
 * Função principal de extração
 */
export async function extractQuoteFromFile(file: File): Promise<ExtractionResult> {
    try {
        console.log("Extraindo de:", file.name, file.type)

        let images: Array<{ base64: string; mimeType: string }> = []

        if (file.type === "application/pdf") {
            console.log("Convertendo PDF para imagens...")
            const pdfImages = await convertPDFToImages(file)
            images = pdfImages.map(base64 => ({ base64, mimeType: "image/jpeg" }))
            console.log(`Convertidas ${images.length} páginas`)
        } else if (file.type.startsWith("image/")) {
            const base64 = await fileToBase64(file)
            images = [{ base64, mimeType: file.type }]
        } else {
            throw new Error("Formato não suportado. Use PDF ou imagem.")
        }

        console.log("Enviando para OpenAI...")
        const data = await sendToOpenAI(images)

        console.log("Extração completa:", data)

        return { success: true, data }
    } catch (error) {
        console.error("Erro:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Erro desconhecido"
        }
    }
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
            console.log("PDF.js carregado com sucesso")
            resolve()
        }
        script.onerror = () => reject(new Error("Falha ao carregar PDF.js"))
        document.head.appendChild(script)
    })
}
