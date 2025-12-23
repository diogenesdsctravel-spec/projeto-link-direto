import type { PublicQuoteMeta } from "../types/publicQuote"

export type OgMeta = {
    title: string
    description: string
    imageUrl: string
}

export function buildOgMeta(meta: PublicQuoteMeta): OgMeta {
    const title = `${meta.destinationName} | DSC Travel`
    const description =
        meta.subtitle?.trim().length
            ? meta.subtitle
            : "Uma experiência pensada para você. Abra para ver sua proposta."

    return {
        title,
        description,
        imageUrl: meta.heroImageUrl,
    }
}
