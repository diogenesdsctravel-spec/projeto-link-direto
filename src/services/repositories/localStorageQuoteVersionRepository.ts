import type { QuoteVersionRepository } from "../quoteVersionRepository"

const STORAGE_PREFIX = "dsc:quoteVersion:"

function buildKey(publicId: string, versionId: string) {
    return `${STORAGE_PREFIX}${publicId}:${versionId}`
}

function safeParse<T>(raw: string | null): T | null {
    if (!raw) return null
    try {
        return JSON.parse(raw) as T
    } catch {
        return null
    }
}

export const localStorageQuoteVersionRepository: QuoteVersionRepository = {
    async getByPublicIdAndVersionId(publicId: string, versionId: string) {
        const raw = localStorage.getItem(buildKey(publicId, versionId))
        return safeParse(raw)
    },

    async upsert(input) {
        localStorage.setItem(buildKey(input.publicId, input.versionId), JSON.stringify(input))
        return input
    },
}
