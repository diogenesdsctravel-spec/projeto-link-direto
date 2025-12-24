/**
 * AGENCY SERVICE
 * 
 * Busca dados do perfil da agência no Supabase
 */

import { supabase, isSupabaseConfigured } from "./supabaseClient"

export interface AgencyProfile {
    id: string
    agencyName: string
    ownerName: string
    city: string
    yearsInBusiness: number
    familiesServed: string
    googleRating: string
    installments: string

    // Fotos
    ownerPhotoUrl: string | null
    ownerServingPhotoUrl: string | null
    storeInteriorUrl: string | null
    storeFacadeUrl: string | null
    logoUrl: string | null

    // Textos
    tagline: string
    welcomeText: string

    // Cores
    colorPrimary: string
    colorAccent: string
    colorLight: string
    colorText: string

    // Diferenciais
    differentials: Array<{ icon: string; text: string }>
}

// Dados padrão (fallback)
const defaultAgencyProfile: AgencyProfile = {
    id: "default",
    agencyName: "DSC Travel",
    ownerName: "Diógenes",
    city: "Vitória da Conquista - BA",
    yearsInBusiness: 3,
    familiesServed: "+3.000 famílias atendidas",
    googleRating: "5.0",
    installments: "Até 10x sem juros",

    ownerPhotoUrl: null,
    ownerServingPhotoUrl: null,
    storeInteriorUrl: null,
    storeFacadeUrl: null,
    logoUrl: null,

    tagline: "Não vendemos pacotes. Criamos memórias.",
    welcomeText: "Preparei essa viagem especialmente para você.",

    colorPrimary: "#09077d",
    colorAccent: "#50cfad",
    colorLight: "#f1f5f9",
    colorText: "#64748b",

    differentials: [
        { icon: "✈️", text: "+3.000 famílias atendidas" },
        { icon: "⭐", text: "5.0 no Google" },
        { icon: "🛡️", text: "Suporte durante toda a viagem" },
        { icon: "💳", text: "Até 10x sem juros" }
    ]
}

/**
 * Converte snake_case do banco para camelCase do app
 */
function mapToAgencyProfile(data: any): AgencyProfile {
    return {
        id: data.id,
        agencyName: data.agency_name || defaultAgencyProfile.agencyName,
        ownerName: data.owner_name || defaultAgencyProfile.ownerName,
        city: data.city || defaultAgencyProfile.city,
        yearsInBusiness: data.years_in_business || defaultAgencyProfile.yearsInBusiness,
        familiesServed: data.families_served || defaultAgencyProfile.familiesServed,
        googleRating: data.google_rating || defaultAgencyProfile.googleRating,
        installments: data.installments || defaultAgencyProfile.installments,

        ownerPhotoUrl: data.owner_photo_url,
        ownerServingPhotoUrl: data.owner_serving_photo_url,
        storeInteriorUrl: data.store_interior_url,
        storeFacadeUrl: data.store_facade_url,
        logoUrl: data.logo_url,

        tagline: data.tagline || defaultAgencyProfile.tagline,
        welcomeText: data.welcome_text || defaultAgencyProfile.welcomeText,

        colorPrimary: data.color_primary || defaultAgencyProfile.colorPrimary,
        colorAccent: data.color_accent || defaultAgencyProfile.colorAccent,
        colorLight: data.color_light || defaultAgencyProfile.colorLight,
        colorText: data.color_text || defaultAgencyProfile.colorText,

        differentials: data.differentials || defaultAgencyProfile.differentials
    }
}

/**
 * Busca o perfil da agência
 */
export async function getAgencyProfile(): Promise<AgencyProfile> {
    if (!isSupabaseConfigured()) {
        console.log("📦 Usando perfil padrão da agência (Supabase não configurado)")
        return defaultAgencyProfile
    }

    try {
        const { data, error } = await supabase
            .from("agency_profile")
            .select("*")
            .limit(1)
            .single()

        if (error) {
            console.error("Erro ao buscar agency_profile:", error)
            return defaultAgencyProfile
        }

        if (!data) {
            return defaultAgencyProfile
        }

        console.log("✅ Perfil da agência carregado do Supabase")
        return mapToAgencyProfile(data)

    } catch (err) {
        console.error("Erro ao buscar perfil da agência:", err)
        return defaultAgencyProfile
    }
}

export { defaultAgencyProfile }