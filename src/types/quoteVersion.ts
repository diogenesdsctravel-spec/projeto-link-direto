export type Money = {
    amount: number
    currency: "BRL" | "USD"
}

export type QuoteItemType = "flight" | "transfer" | "hotel" | "experience" | "fee" | "note"

export type QuoteItem = {
    itemId: string
    type: QuoteItemType
    title: string
    subtitle?: string
    includedStatus?: "included" | "not_included"
    price?: Money
}

export type QuoteVersion = {
    publicId: string
    versionId: string
    label: string
    clientName: string
    destinationKey: string
    createdAtIso: string
    updatedAtIso: string
    items: QuoteItem[]
    total?: Money
}
