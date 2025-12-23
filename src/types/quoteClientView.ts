export type QuoteClientView = {
    publicId: string
    clientName: string
    destinationName: string
    versions: {
        versionId: string
        label: string
    }[]
}
