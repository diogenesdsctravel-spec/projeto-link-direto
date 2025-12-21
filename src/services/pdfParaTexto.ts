/**
 * Extrai texto de arquivos PDF no navegador usando pdfjs-dist
 */
import * as pdfjsLib from "pdfjs-dist"

// Configura o worker do PDF.js para versão 5.x
// Usa o worker do unpkg que tem a estrutura correta
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

/**
 * Extrai texto de um arquivo PDF
 * Retorna o texto concatenado de todas as páginas
 */
export async function extrairTextoPdf(arquivo: File): Promise<string> {
    // Lê o arquivo como ArrayBuffer
    const arrayBuffer = await arquivo.arrayBuffer()

    // Carrega o PDF
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

    let textoCompleto = ""

    // Itera por todas as páginas
    for (let i = 1; i <= pdf.numPages; i++) {
        const pagina = await pdf.getPage(i)
        const conteudo = await pagina.getTextContent()

        // Extrai o texto dos items
        const textoPagina = conteudo.items
            .map((item: any) => item.str || "")
            .join(" ")
            .trim()

        if (textoPagina) {
            textoCompleto += (textoCompleto ? "\n\n" : "") + `[Página ${i}]\n${textoPagina}`
        }
    }

    return textoCompleto.trim()
}

/**
 * Verifica se o PDF tem texto extraível ou é escaneado (imagem)
 */
export async function verificarPdfTemTexto(arquivo: File): Promise<{
    temTexto: boolean
    texto: string
    paginas: number
}> {
    const texto = await extrairTextoPdf(arquivo)

    // Se tiver menos de 50 caracteres, provavelmente é escaneado
    const temTexto = texto.length > 50

    // Conta páginas
    const arrayBuffer = await arquivo.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

    return {
        temTexto,
        texto,
        paginas: pdf.numPages
    }
}

/**
 * Processa múltiplos arquivos e retorna texto extraído
 * - PDFs: extrai texto
 * - Imagens: retorna indicação para processar separadamente
 */
export async function processarArquivos(arquivos: File[]): Promise<{
    textos: string[]
    imagens: File[]
    avisos: string[]
}> {
    const textos: string[] = []
    const imagens: File[] = []
    const avisos: string[] = []

    for (const arquivo of arquivos) {
        if (arquivo.type === "application/pdf") {
            try {
                const resultado = await verificarPdfTemTexto(arquivo)

                if (resultado.temTexto) {
                    textos.push(resultado.texto)
                } else {
                    avisos.push(`PDF "${arquivo.name}" parece ser escaneado (sem texto extraível). Considere enviar como imagem.`)
                }
            } catch (error: any) {
                avisos.push(`Erro ao processar "${arquivo.name}": ${error.message}`)
            }
        } else if (arquivo.type.startsWith("image/")) {
            imagens.push(arquivo)
        }
    }

    return { textos, imagens, avisos }
}