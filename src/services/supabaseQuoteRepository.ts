/**
 * SUPABASE QUOTE REPOSITORY
 * 
 * Persiste cotações no Supabase para funcionar em qualquer dispositivo
 */

import { supabase, isSupabaseConfigured } from "./supabaseClient"
import type { ExtractedQuoteData } from "../types/extractedQuoteData"

export type QuoteVersion = {
    versionId: string
    label: string
    price: string
}

export type Quote = {
    id: string
    publicId: string
    clientName: string
    destinationKey: string
    versions: QuoteVersion[]
    extractedData?: ExtractedQuoteData
    createdAt: string
    expiresAt?: string
}

/**
 * Converte do formato do banco para o formato do app
 */
function fromDatabase(row: any): Quote {
    return {
        id: row.id,
        publicId: row.public_id,
        clientName: row.client_name,
        destinationKey: row.destination_key,
        versions: row.versions || [],
        extractedData: row.extracted_data,
        createdAt: row.created_at,
        expiresAt: row.expires_at
    }
}

/**
 * Converte do formato do app para o formato do banco
 */
function toDatabase(quote: Partial<Quote>) {
    return {
        public_id: quote.publicId,
        client_name: quote.clientName,
        destination_key: quote.destinationKey,
        versions: quote.versions || [],
        extracted_data: quote.extractedData || null
    }
}

export const supabaseQuoteRepository = {
    /**
     * Cria uma nova cotação
     */
    async create(quote: Omit<Quote, "id" | "createdAt">): Promise<Quote | null> {
        if (!isSupabaseConfigured()) {
            console.warn("Supabase não configurado, usando localStorage")
            return null
        }

        const { data, error } = await supabase
            .from("quotes")
            .insert(toDatabase(quote))
            .select()
            .single()

        if (error) {
            console.error("Erro ao criar cotação:", error)
            return null
        }

        return fromDatabase(data)
    },

    /**
     * Busca cotação pelo publicId (usado pelo cliente)
     */
    async getByPublicId(publicId: string): Promise<Quote | null> {
        if (!isSupabaseConfigured()) {
            console.warn("Supabase não configurado")
            return null
        }

        const { data, error } = await supabase
            .from("quotes")
            .select("*")
            .eq("public_id", publicId)
            .single()

        if (error) {
            console.error("Erro ao buscar cotação:", error)
            return null
        }

        return fromDatabase(data)
    },

    /**
     * Busca cotação pelo ID interno
     */
    async getById(id: string): Promise<Quote | null> {
        if (!isSupabaseConfigured()) {
            return null
        }

        const { data, error } = await supabase
            .from("quotes")
            .select("*")
            .eq("id", id)
            .single()

        if (error) {
            console.error("Erro ao buscar cotação:", error)
            return null
        }

        return fromDatabase(data)
    },

    /**
     * Atualiza cotação (adicionar versões, publicId, etc)
     */
    async update(id: string, updates: Partial<Quote>): Promise<Quote | null> {
        if (!isSupabaseConfigured()) {
            return null
        }

        const dbUpdates: any = {}
        if (updates.publicId) dbUpdates.public_id = updates.publicId
        if (updates.versions) dbUpdates.versions = updates.versions
        if (updates.extractedData) dbUpdates.extracted_data = updates.extractedData

        const { data, error } = await supabase
            .from("quotes")
            .update(dbUpdates)
            .eq("id", id)
            .select()
            .single()

        if (error) {
            console.error("Erro ao atualizar cotação:", error)
            return null
        }

        return fromDatabase(data)
    },

    /**
     * Lista todas as cotações (para o vendedor)
     */
    async list(): Promise<Quote[]> {
        if (!isSupabaseConfigured()) {
            return []
        }

        const { data, error } = await supabase
            .from("quotes")
            .select("*")
            .order("created_at", { ascending: false })

        if (error) {
            console.error("Erro ao listar cotações:", error)
            return []
        }

        return data.map(fromDatabase)
    }
}