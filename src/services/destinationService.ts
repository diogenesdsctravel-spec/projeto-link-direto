/**
 * DESTINATION SERVICE
 * 
 * Gerencia templates de destinos, hotéis e passeios no Supabase
 */

import { supabase, isSupabaseConfigured } from "./supabaseClient"

// ============================================
// TIPOS
// ============================================

export interface Destination {
    id: string
    destinationName: string
    destinationKey: string
    heroImageUrl: string | null
    heroHeadline: string | null
    heroSubtext: string | null
    experiences: Experience[]
    createdAt: string
}

export interface Experience {
    icon: string
    title: string
    subtitle: string
    imageUrl?: string
}

export interface Hotel {
    id: string
    hotelName: string
    destinationId: string | null
    stars: number | null
    address: string | null
    description: string | null
    shortDescription: string | null
    imageUrls: string[]
    amenities: string[]
    createdAt: string
}

export interface Tour {
    id: string
    tourName: string
    destinationId: string | null
    duration: string | null
    icon: string
    description: string | null
    shortDescription: string | null
    imageUrl: string | null
    includes: string[]
    createdAt: string
}

// ============================================
// DESTINOS
// ============================================

/**
 * Busca destino por key (ex: "cancun", "buenos-aires")
 */
export async function getDestinationByKey(key: string): Promise<Destination | null> {
    if (!isSupabaseConfigured()) {
        console.log("⚠️ Supabase não configurado")
        return null
    }

    try {
        const { data, error } = await supabase
            .from("destinations")
            .select("*")
            .eq("destination_key", key)
            .limit(1)

        if (error) {
            console.error("Erro ao buscar destino:", error)
            return null
        }

        if (!data || data.length === 0) {
            console.log(`📭 Destino "${key}" não encontrado`)
            return null
        }

        console.log(`✅ Destino "${key}" encontrado`)
        return mapDestination(data[0])
    } catch (err) {
        console.error("Erro ao buscar destino:", err)
        return null
    }
}

/**
 * Cria ou atualiza um destino
 */
export async function saveDestination(destination: Partial<Destination> & { destinationKey: string; destinationName: string }): Promise<Destination | null> {
    if (!isSupabaseConfigured()) {
        console.error("⚠️ Supabase não configurado")
        return null
    }

    try {
        const payload = {
            destination_name: destination.destinationName,
            destination_key: destination.destinationKey,
            hero_image_url: destination.heroImageUrl || null,
            hero_headline: destination.heroHeadline || null,
            hero_subtext: destination.heroSubtext || null,
            experiences: destination.experiences || [],
            updated_at: new Date().toISOString()
        }

        // Verificar se já existe
        const existing = await getDestinationByKey(destination.destinationKey)

        if (existing) {
            // Atualizar
            const { data, error } = await supabase
                .from("destinations")
                .update(payload)
                .eq("destination_key", destination.destinationKey)
                .select()
                .single()

            if (error) throw error
            console.log(`✅ Destino "${destination.destinationKey}" atualizado`)
            return mapDestination(data)
        } else {
            // Criar
            const { data, error } = await supabase
                .from("destinations")
                .insert(payload)
                .select()
                .single()

            if (error) throw error
            console.log(`✅ Destino "${destination.destinationKey}" criado`)
            return mapDestination(data)
        }
    } catch (err) {
        console.error("Erro ao salvar destino:", err)
        return null
    }
}

// ============================================
// HOTÉIS
// ============================================

/**
 * Busca hotel por nome
 */
export async function getHotelByName(hotelName: string): Promise<Hotel | null> {
    if (!isSupabaseConfigured()) return null

    try {
        const { data, error } = await supabase
            .from("hotels")
            .select("*")
            .ilike("hotel_name", hotelName)
            .limit(1)

        if (error) {
            console.error("Erro ao buscar hotel:", error)
            return null
        }

        if (!data || data.length === 0) {
            console.log(`📭 Hotel "${hotelName}" não encontrado`)
            return null
        }

        console.log(`✅ Hotel "${hotelName}" encontrado`)
        return mapHotel(data[0])
    } catch (err) {
        console.error("Erro ao buscar hotel:", err)
        return null
    }
}

/**
 * Cria ou atualiza um hotel
 */
export async function saveHotel(hotel: Partial<Hotel> & { hotelName: string }): Promise<Hotel | null> {
    if (!isSupabaseConfigured()) return null

    try {
        const payload = {
            hotel_name: hotel.hotelName,
            destination_id: hotel.destinationId || null,
            stars: hotel.stars || null,
            address: hotel.address || null,
            description: hotel.description || null,
            short_description: hotel.shortDescription || null,
            image_urls: hotel.imageUrls || [],
            amenities: hotel.amenities || [],
            updated_at: new Date().toISOString()
        }

        // Verificar se já existe
        const existing = await getHotelByName(hotel.hotelName)

        if (existing) {
            const { data, error } = await supabase
                .from("hotels")
                .update(payload)
                .eq("id", existing.id)
                .select()
                .single()

            if (error) throw error
            console.log(`✅ Hotel "${hotel.hotelName}" atualizado`)
            return mapHotel(data)
        } else {
            const { data, error } = await supabase
                .from("hotels")
                .insert(payload)
                .select()
                .single()

            if (error) throw error
            console.log(`✅ Hotel "${hotel.hotelName}" criado`)
            return mapHotel(data)
        }
    } catch (err) {
        console.error("Erro ao salvar hotel:", err)
        return null
    }
}

// ============================================
// PASSEIOS
// ============================================

/**
 * Busca passeio por nome
 */
export async function getTourByName(tourName: string): Promise<Tour | null> {
    if (!isSupabaseConfigured()) return null

    try {
        const { data, error } = await supabase
            .from("tours")
            .select("*")
            .ilike("tour_name", `%${tourName}%`)
            .limit(1)

        if (error) {
            console.error("Erro ao buscar passeio:", error)
            return null
        }

        if (!data || data.length === 0) {
            console.log(`📭 Passeio "${tourName}" não encontrado`)
            return null
        }

        return mapTour(data[0])
    } catch (err) {
        console.error("Erro ao buscar passeio:", err)
        return null
    }
}

/**
 * Cria ou atualiza um passeio
 */
export async function saveTour(tour: Partial<Tour> & { tourName: string }): Promise<Tour | null> {
    if (!isSupabaseConfigured()) return null

    try {
        const payload = {
            tour_name: tour.tourName,
            destination_id: tour.destinationId || null,
            duration: tour.duration || null,
            icon: tour.icon || "🎯",
            description: tour.description || null,
            short_description: tour.shortDescription || null,
            image_url: tour.imageUrl || null,
            includes: tour.includes || [],
            updated_at: new Date().toISOString()
        }

        const existing = await getTourByName(tour.tourName)

        if (existing) {
            const { data, error } = await supabase
                .from("tours")
                .update(payload)
                .eq("id", existing.id)
                .select()
                .single()

            if (error) throw error
            return mapTour(data)
        } else {
            const { data, error } = await supabase
                .from("tours")
                .insert(payload)
                .select()
                .single()

            if (error) throw error
            return mapTour(data)
        }
    } catch (err) {
        console.error("Erro ao salvar passeio:", err)
        return null
    }
}

// ============================================
// VERIFICAÇÃO COMPLETA
// ============================================

export interface TemplateCheckResult {
    destinationExists: boolean
    hotelExists: boolean
    destination: Destination | null
    hotel: Hotel | null
    missingItems: string[]
}

/**
 * Verifica se o template existe para a cotação
 */
export async function checkTemplateExists(
    destinationKey: string,
    hotelName: string
): Promise<TemplateCheckResult> {
    const destination = await getDestinationByKey(destinationKey)
    const hotel = await getHotelByName(hotelName)

    const missingItems: string[] = []

    if (!destination) {
        missingItems.push("destination")
    } else if (!destination.heroImageUrl) {
        missingItems.push("destination_hero")
    }

    if (!hotel) {
        missingItems.push("hotel")
    } else if (!hotel.imageUrls || hotel.imageUrls.length === 0) {
        missingItems.push("hotel_images")
    }

    return {
        destinationExists: !!destination && !!destination.heroImageUrl,
        hotelExists: !!hotel && hotel.imageUrls && hotel.imageUrls.length > 0,
        destination,
        hotel,
        missingItems
    }
}

// ============================================
// MAPPERS
// ============================================

function mapDestination(data: any): Destination {
    return {
        id: data.id,
        destinationName: data.destination_name,
        destinationKey: data.destination_key,
        heroImageUrl: data.hero_image_url,
        heroHeadline: data.hero_headline,
        heroSubtext: data.hero_subtext,
        experiences: data.experiences || [],
        createdAt: data.created_at
    }
}

function mapHotel(data: any): Hotel {
    return {
        id: data.id,
        hotelName: data.hotel_name,
        destinationId: data.destination_id,
        stars: data.stars,
        address: data.address,
        description: data.description,
        shortDescription: data.short_description,
        imageUrls: data.image_urls || [],
        amenities: data.amenities || [],
        createdAt: data.created_at
    }
}

function mapTour(data: any): Tour {
    return {
        id: data.id,
        tourName: data.tour_name,
        destinationId: data.destination_id,
        duration: data.duration,
        icon: data.icon || "🎯",
        description: data.description,
        shortDescription: data.short_description,
        imageUrl: data.image_url,
        includes: data.includes || [],
        createdAt: data.created_at
    }
}