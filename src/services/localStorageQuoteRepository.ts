/**
 * LOCAL STORAGE QUOTE REPOSITORY - FASE 7
 * 
 * Permite buscar cotações criadas pelo vendedor usando o publicId
 */

export type Quote = {
    id: string
    publicId?: string
    clientName: string
    destinationKey: string
    versions: QuoteVersion[]
    createdAt: string
}

export type QuoteVersion = {
    versionId: string
    label: string
    price: string
}

export const localStorageQuoteRepository = {
    /**
     * Busca cotação pelo publicId (gerado quando vendedor clica "Copiar Link")
     */
    getByPublicId(publicId: string): Quote | null {
        const quotes = JSON.parse(localStorage.getItem("dsc-quotes") || "[]") as Quote[]
        const found = quotes.find(q => q.publicId === publicId)
        return found || null
    },

    /**
     * Busca cotação pelo ID interno
     */
    getById(id: string): Quote | null {
        const quotes = JSON.parse(localStorage.getItem("dsc-quotes") || "[]") as Quote[]
        const found = quotes.find(q => q.id === id)
        return found || null
    },

    /**
     * Atualiza cotação (usado para adicionar publicId)
     */
    update(quote: Quote): void {
        const quotes = JSON.parse(localStorage.getItem("dsc-quotes") || "[]") as Quote[]
        const index = quotes.findIndex(q => q.id === quote.id)

        if (index !== -1) {
            quotes[index] = quote
            localStorage.setItem("dsc-quotes", JSON.stringify(quotes))
        }
    },

    /**
     * Lista todas as cotações
     */
    list(): Quote[] {
        return JSON.parse(localStorage.getItem("dsc-quotes") || "[]") as Quote[]
    }
}