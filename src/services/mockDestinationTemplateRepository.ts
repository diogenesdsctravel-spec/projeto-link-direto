import type { DestinationKey, DestinationTemplate } from "../types/destinationTemplate"
import type { DestinationTemplateRepository } from "./destinationTemplateRepository"
import { getMockTemplateBuenosAires } from "./buenosAiresNarrative"

const templatesByKey: Partial<Record<DestinationKey, DestinationTemplate>> = {
    "buenos-aires": getMockTemplateBuenosAires(),
}

export const mockDestinationTemplateRepository: DestinationTemplateRepository = {
    async getByDestinationKey(destinationKey: DestinationKey) {
        return templatesByKey[destinationKey] ?? getMockTemplateBuenosAires()
    },

    async upsert(template: DestinationTemplate) {
        templatesByKey[template.destinationKey] = template
    },
}
