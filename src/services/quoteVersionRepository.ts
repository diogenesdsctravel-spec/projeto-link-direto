import type { QuoteVersion } from "../types/quoteVersion"

export type QuoteVersionRepository = {
    getVersion: (publicId: string, versionId: string) => Promise<QuoteVersion | null>
}
