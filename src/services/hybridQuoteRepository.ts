/**
 * HYBRID QUOTE REPOSITORY
 * 
 * Usa Supabase quando configurado, localStorage como fallback
 * Isso permite desenvolvimento local sem Supabase
 * 
 * ✅ CORRIGIDO: Cria versão padrão automaticamente na criação
 */

import { supabaseQuoteRepository, type Quote, type QuoteVersion } from "./supabaseQuoteRepository"
import { isSupabaseConfigured } from "./supabaseClient"

// Re-exportar tipos
export type { Quote, QuoteVersion }

/**
 * LocalStorage fallback
 */
const localStorageFallback = {
    getAll(): Quote[] {
        return JSON.parse(localStorage.getItem("dsc-quotes") || "[]")
    },

    save(quotes: Quote[]): void {
        localStorage.setItem("dsc-quotes", JSON.stringify(quotes))
    },

    getByPublicId(publicId: string): Quote | null {
        const quotes = this.getAll()
        return quotes.find(q => q.publicId === publicId) || null
    },

    getById(id: string): Quote | null {
        const quotes = this.getAll()
        return quotes.find(q => q.id === id) || null
    },

    create(quote: Quote): Quote {
        const quotes = this.getAll()
        quotes.push(quote)
        this.save(quotes)
        return quote
    },

    update(id: string, updates: Partial<Quote>): Quote | null {
        const quotes = this.getAll()
        const index = quotes.findIndex(q => q.id === id)
        if (index === -1) return null

        quotes[index] = { ...quotes[index], ...updates }
        this.save(quotes)
        return quotes[index]
    }
}

/**
 * REPOSITÓRIO HÍBRIDO
 */
export const quoteRepository = {
    /**
     * Cria nova cotação
     * ✅ Já cria com versão padrão para o botão funcionar
     */
    async create(data: {
        clientName: string
        destinationKey: string
        extractedData?: any
    }): Promise<Quote> {
        const publicId = `q-${Date.now()}`

        // ✅ Criar versão padrão automaticamente
        const totalPrice = data.extractedData?.totalPrice || data.extractedData?.payment?.totalPrice || "A consultar"
        const defaultVersion: QuoteVersion = {
            versionId: "v1",
            label: "Pacote Completo",
            price: totalPrice
        }

        const quote: Quote = {
            id: `quote-${Date.now()}`,
            publicId,
            clientName: data.clientName,
            destinationKey: data.destinationKey,
            versions: [defaultVersion],  // ✅ Já inclui a versão padrão
            extractedData: data.extractedData,
            createdAt: new Date().toISOString()
        }

        if (isSupabaseConfigured()) {
            console.log("💾 Salvando no Supabase...")
            const created = await supabaseQuoteRepository.create(quote)
            if (created) {
                console.log("✅ Salvo no Supabase:", created.id)
                return created
            }
            console.warn("⚠️ Falha no Supabase, usando localStorage")
        }

        // Fallback para localStorage
        console.log("💾 Salvando no localStorage...")
        return localStorageFallback.create(quote)
    },

    /**
     * Busca por publicId (usado pelo cliente)
     */
    async getByPublicId(publicId: string): Promise<Quote | null> {
        if (isSupabaseConfigured()) {
            console.log("🔍 Buscando no Supabase:", publicId)
            const quote = await supabaseQuoteRepository.getByPublicId(publicId)
            if (quote) {
                console.log("✅ Encontrado no Supabase")
                return quote
            }
        }

        // Fallback para localStorage
        console.log("🔍 Buscando no localStorage:", publicId)
        return localStorageFallback.getByPublicId(publicId)
    },

    /**
     * Busca por ID interno
     */
    async getById(id: string): Promise<Quote | null> {
        if (isSupabaseConfigured()) {
            const quote = await supabaseQuoteRepository.getById(id)
            if (quote) return quote
        }

        return localStorageFallback.getById(id)
    },

    /**
     * Atualiza cotação
     */
    async update(id: string, updates: Partial<Quote>): Promise<Quote | null> {
        if (isSupabaseConfigured()) {
            console.log("💾 Atualizando no Supabase...")
            const updated = await supabaseQuoteRepository.update(id, updates)
            if (updated) {
                console.log("✅ Atualizado no Supabase")
                return updated
            }
        }

        // Fallback
        console.log("💾 Atualizando no localStorage...")
        return localStorageFallback.update(id, updates)
    },

    /**
     * Adiciona versão à cotação
     */
    async addVersion(id: string, version: QuoteVersion): Promise<Quote | null> {
        const quote = await this.getById(id)
        if (!quote) return null

        const updatedVersions = [...quote.versions, version]
        return this.update(id, { versions: updatedVersions })
    },

    /**
     * Define publicId e retorna URL
     */
    async generatePublicLink(id: string): Promise<string | null> {
        const quote = await this.getById(id)
        if (!quote) return null

        // Se já tem publicId, retorna
        if (quote.publicId) {
            return quote.publicId
        }

        // Gera novo publicId
        const publicId = `q-${Date.now()}`
        await this.update(id, { publicId })
        return publicId
    }
}