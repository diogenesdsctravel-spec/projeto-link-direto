import type { TemplateForm } from "../types/templateForm"

export interface TemplateFormRepository {
    getByDestinationKey(destinationKey: string): Promise<TemplateForm | null>
    upsert(form: TemplateForm): Promise<void>
}
