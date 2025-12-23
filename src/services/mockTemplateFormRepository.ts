import type { TemplateFormRepository } from "./templateFormRepository"
import type { TemplateForm } from "../types/templateForm"

const store: Record<string, TemplateForm> = {}

export const mockTemplateFormRepository: TemplateFormRepository = {
    async getByDestinationKey(destinationKey: string) {
        return store[destinationKey] ?? null
    },
    async upsert(form: TemplateForm) {
        store[form.destinationKey] = form
    },
}
