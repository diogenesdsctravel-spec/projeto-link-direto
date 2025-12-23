export type ExperienceFormItem = {
    experienceId: string
    title: string
    subtitle?: string
    enabled: boolean
    imageUrl?: string
}

export type TemplateForm = {
    destinationKey: string

    heroImageUrl?: string
    heroTitle?: string
    heroSubtitle?: string

    experiences: ExperienceFormItem[]

    hotelCarouselImageUrls?: string[]

    transferImageUrl?: string

    finalNote?: string
}
