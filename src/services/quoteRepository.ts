import type { QuoteSummary } from "../types/quote"
import { getMockQuoteByPublicId } from "./mockData"

export interface QuoteRepository {
    getQuoteByPublicId(publicId: string): Promise<QuoteSummary>
}

export const mockQuoteRepository: QuoteRepository = {
    async getQuoteByPublicId(publicId: string) {
        return getMockQuoteByPublicId(publicId)
    },
}
