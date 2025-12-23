type MetaSpec = {
    title?: string
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
}

function upsertMeta(property: string, content: string) {
    const head = document.head
    const selector = `meta[property="${property}"]`
    let el = head.querySelector(selector) as HTMLMetaElement | null
    if (!el) {
        el = document.createElement("meta")
        el.setAttribute("property", property)
        head.appendChild(el)
    }
    el.setAttribute("content", content)
}

export function applyHeadMeta(spec: MetaSpec) {
    if (spec.title) document.title = spec.title
    if (spec.ogTitle) upsertMeta("og:title", spec.ogTitle)
    if (spec.ogDescription) upsertMeta("og:description", spec.ogDescription)
    if (spec.ogImage) upsertMeta("og:image", spec.ogImage)
}
