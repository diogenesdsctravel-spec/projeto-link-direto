/**
 * AI EXTRACTION SERVICE - VERSÃO FINAL
 * 
 * Estratégia:
 * - Imagens: envia direto para OpenAI Vision
 * - PDFs: converte para imagens usando pdf.js e canvas, depois envia
 */

import type { ExtractedQuoteData, ExtractionResult } from "../types/extractedQuoteData"

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

const EXTRACTION_PROMPT = `Você é um assistente especializado em extrair dados de cotações de viagem brasileiras.

Analise esta(s) imagem(ns) de cotação e extraia TODOS os dados em formato JSON.

EXTRAIA:
- Origem e destino da viagem
- Datas de ida e volta
- TODOS os voos com: companhia, número, horários, aeroportos, duração
- Conexões/escalas se houver
- Hotel: nome, endereço, check-in/out, tipo de quarto
- Informações de bagagem
- Preço total

Retorne APENAS JSON válido, sem markdown ou explicações.

{
  "destination": "cidade",
  "origin": "cidade",
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
    "stops": 0
  },
  "returnFlight": {
    "segments": [...],
    "totalDuration": "Xh XXm",
    "stops": 0
  },
  "hotel": {
    "name": "nome",
    "stars": 3,
    "address": "endereço",
    "checkIn": "data",
    "checkInTime": "HH:MM",
    "checkOut": "data",
    "checkOutTime": "HH:MM",
    "nights": 7,
    "roomType": "tipo"
  },
  "totalPrice": "R$ X.XXX",
  "quotationDate": "data"
}`

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
    // Carregar pdf.js da CDN
    const pdfjsLib = (window as any).pdfjsLib

    if (!pdfjsLib) {
        throw new Error("PDF.js não carregado. Recarregue a página.")
    }

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

    const images: string[] = []
    const scale = 2.0 // Alta resolução para melhor OCR

    // Converter cada página (máximo 8 páginas)
    const maxPages = Math.min(pdf.numPages, 8)

    for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale })

        // Criar canvas
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")!
        canvas.height = viewport.height
        canvas.width = viewport.width

        // Renderizar página no canvas
        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise

        // Converter para base64 (JPEG para menor tamanho)
        const base64 = canvas.toDataURL("image/jpeg", 0.9).split(",")[1]
        images.push(base64)
    }

    return images
}

/**
 * Envia imagens para OpenAI Vision
 */
async function sendToOpenAI(images: Array<{ base64: string; mimeType: string }>): Promise<ExtractedQuoteData> {
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
                    content: [
                        { type: "text", text: EXTRACTION_PROMPT },
                        ...imageContents
                    ]
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

    // Limpar JSON
    const cleanJson = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim()

    console.log("Resposta OpenAI:", cleanJson)

    return {
        ...JSON.parse(cleanJson),
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
            // PDF: converter para imagens primeiro
            console.log("Convertendo PDF para imagens...")
            const pdfImages = await convertPDFToImages(file)
            images = pdfImages.map(base64 => ({ base64, mimeType: "image/jpeg" }))
            console.log(`Convertidas ${images.length} páginas`)

        } else if (file.type.startsWith("image/")) {
            // Imagem: usar diretamente
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
        // Verificar se já está carregado
        if ((window as any).pdfjsLib) {
            resolve()
            return
        }

        // Carregar script
        const script = document.createElement("script")
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        script.onload = () => {
            // Configurar worker
            const pdfjsLib = (window as any).pdfjsLib
            pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"
            console.log("PDF.js carregado com sucesso")
            resolve()
        }
        script.onerror = () => reject(new Error("Falha ao carregar PDF.js"))
        document.head.appendChild(script)
    })
}