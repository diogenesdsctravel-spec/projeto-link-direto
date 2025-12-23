export type PublicQuoteMeta = {
    publicId: string
    destinationName: string
    heroImageUrl: string
    title: string
    subtitle?: string
}

export type PublicQuotePayload = {
    meta: PublicQuoteMeta
    versions: {
        id: string
        label: string
        includedItems: string[]
        totalLabel?: string
    }[]
}
