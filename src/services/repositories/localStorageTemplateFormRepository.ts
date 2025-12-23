import type { TemplateFormRepository } from "../templateFormRepository"

type StoredTemplateForm = {
    destinationKey: string
    heroImageUrl: string
    hotelCarouselImageUrls: string[]
    transferImageUrl?: string
    finalNote?: string
    updatedAtIso: string
}

const STORAGE_PREFIX = "dsc:templateForm:"

function buildKey(destinationKey: string) {
    return `${STORAGE_PREFIX}${destinationKey}`
}

function safeParse(json: string | null): StoredTemplateForm | null {
    if (!json) return null
    try {
        return JSON.parse(json) as StoredTemplateForm
    } catch {
        return null
    }
}

export const localStorageTemplateFormRepository: TemplateFormRepository = {
    async getByDestinationKey(destinationKey: string) {
        const raw = localStorage.getItem(buildKey(destinationKey))
        const parsed = safeParse(raw)
        if (!parsed) return null

        return {
            destinationKey: parsed.destinationKey,
            heroImageUrl: parsed.heroImageUrl,
            experiences: [],
            hotelCarouselImageUrls: parsed.hotelCarouselImageUrls,
            transferImageUrl: parsed.transferImageUrl ?? "",
            finalNote: parsed.finalNote ?? "",
        }
    },

    async upsert(input) {
        const payload: StoredTemplateForm = {
            destinationKey: input.destinationKey,
            heroImageUrl: input.heroImageUrl,
            hotelCarouselImageUrls: input.hotelCarouselImageUrls,
            transferImageUrl: input.transferImageUrl ?? "",
            finalNote: input.finalNote ?? "",
            updatedAtIso: new Date().toISOString(),
        }

        localStorage.setItem(buildKey(input.destinationKey), JSON.stringify(payload))

        return input
    },
}
