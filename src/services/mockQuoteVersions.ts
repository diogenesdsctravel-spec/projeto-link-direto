import type { QuoteVersionRepository } from "./quoteVersionRepository"
import type { QuoteVersion } from "../types/quoteVersion"

function buildMockVersion(publicId: string, versionId: string): QuoteVersion {
    return {
        publicId,
        versionId,
        title: "Versão 1",
        sections: [
            {
                kind: "hero",
                headline: "Sua viagem começa aqui",
                subheadline: "Uma proposta pensada para você",
                imageUrl: "https://images.unsplash.com/photo-1526401485004-2aa7a8b7c4f9?auto=format&fit=crop&w=1600&q=60",
            },
            {
                kind: "text",
                title: "Panorama",
                body: "Aqui vai o panorama da viagem em formato de história, para o cliente se imaginar dentro do destino.",
            },
        ],
    }
}

export const mockQuoteVersionRepository: QuoteVersionRepository = {
    async getVersion(publicId: string, versionId: string) {
        const v = buildMockVersion(publicId, versionId)
        return v
    },
}
