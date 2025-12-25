export type DestinationKey = string

export type IncludedStatus = "included" | "not_included"

export type ExperienceTemplate = {
    experienceId: string
    title: string
    subtitle?: string
    description?: string
    imageUrl?: string
}

export type ScreenType =
    | "hero"
    | "experiences"
    | "flight_outbound"
    | "transfer_outbound"
    | "hotel"
    | "transfer_return"
    | "flight_return"
    | "summary"

export type ScreenTemplate = {
    screenId: string
    type: ScreenType
    title?: string
    subtitle?: string
    imageUrl?: string
    includedStatus?: IncludedStatus
    hotelCarouselImageUrls?: string[]
    experienceItems?: ExperienceTemplate[]
}

export type DestinationTemplate = {
    destinationKey: DestinationKey
    destinationName: string
    heroImageUrl?: string
    experiences: ExperienceTemplate[]
    screens: ScreenTemplate[]
    updatedAtIso: string
}
