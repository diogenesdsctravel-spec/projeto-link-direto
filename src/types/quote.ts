export type DestinationKey = string

export type QuoteVersionSummary = {
    versionId: string
    label: string
}

export type QuoteSummary = {
    quoteId: string
    publicId: string
    clientName: string
    destinationKey: DestinationKey
    destinationName: string
    expiresAtIso: string
    versions: QuoteVersionSummary[]
}
