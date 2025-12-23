import type { QuoteVersionRepository } from "./quoteVersionRepository"
import type { QuoteVersion } from "../types/quoteVersion"

function buildMockVersion(publicId: string, versionId: string): QuoteVersion {
    return {
        publicId,
        versionId,
        clientName: "João",
        label: "Opção 1",
        destinationKey: "buenos-aires",
        items: [],
    }
}

export const mockQuoteVersionRepository: QuoteVersionRepository = {
    async getVersion(publicId: string, versionId: string) {
        return buildMockVersion(publicId, versionId)
    },
}
