import type { QuoteRepository } from "./quoteRepository"
import { mockQuoteRepository } from "./quoteRepository"
import type { DestinationTemplateRepository } from "./destinationTemplateRepository"
import { mockDestinationTemplateRepository } from "./mockDestinationTemplateRepository"
import type { QuoteVersionRepository } from "./quoteVersionRepository"
import type { TemplateFormRepository } from "./templateFormRepository"
import { mockTemplateFormRepository } from "./mockTemplateFormRepository"
import { localStorageTemplateFormRepository } from "./repositories/localStorageTemplateFormRepository"
import { getAppEnv } from "./env"

export type Repositories = {
    quoteRepository: QuoteRepository
    destinationTemplateRepository: DestinationTemplateRepository
    quoteVersionRepository: QuoteVersionRepository
    templateFormRepository: TemplateFormRepository
}

const appEnv = getAppEnv()

export const repositories: Repositories =
    appEnv === "real"
        ? {
            quoteRepository: mockQuoteRepository,
            destinationTemplateRepository: mockDestinationTemplateRepository,
            quoteVersionRepository: {
                async getVersion(publicId: string, versionId: string) {
                    return {
                        publicId,
                        versionId,
                        title: "Versão 1",
                        sections: [
                            {
                                kind: "hero",
                                headline: "Sua viagem começa aqui",
                                subheadline: "Uma proposta pensada para você",
                                imageUrl:
                                    "https://images.unsplash.com/photo-1526401485004-2aa7a8b7c4f9?auto=format&fit=crop&w=1600&q=60",
                            },
                            {
                                kind: "text",
                                title: "Panorama",
                                body:
                                    "Aqui vai o panorama da viagem em formato de história, para o cliente se imaginar dentro do destino.",
                            },
                        ],
                    }
                },
            },
            templateFormRepository: mockTemplateFormRepository,
        }
        : {
            quoteRepository: mockQuoteRepository,
            destinationTemplateRepository: mockDestinationTemplateRepository,
            quoteVersionRepository: {
                async getVersion(publicId: string, versionId: string) {
                    return {
                        publicId,
                        versionId,
                        title: "Versão 1",
                        sections: [
                            {
                                kind: "hero",
                                headline: "Sua viagem começa aqui",
                                subheadline: "Uma proposta pensada para você",
                                imageUrl:
                                    "https://images.unsplash.com/photo-1526401485004-2aa7a8b7c4f9?auto=format&fit=crop&w=1600&q=60",
                            },
                            {
                                kind: "text",
                                title: "Panorama",
                                body:
                                    "Aqui vai o panorama da viagem em formato de história, para o cliente se imaginar dentro do destino.",
                            },
                        ],
                    }
                },
            },
            templateFormRepository: localStorageTemplateFormRepository,
        }
