import type { QuoteSummary } from "../types/quote"

export function getMockQuoteByPublicId(publicId: string): QuoteSummary {
    const now = new Date()
    const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    return {
        quoteId: "q_001",
        publicId,
        clientName: "João",
        destinationKey: "buenos-aires",
        destinationName: "Buenos Aires",
        expiresAtIso: expires.toISOString(),
        versions: [
            { versionId: "v1", label: "Opção 1" },
            { versionId: "v2", label: "Opção 2" },
            { versionId: "v3", label: "Opção 3" },
        ],
    }
}
