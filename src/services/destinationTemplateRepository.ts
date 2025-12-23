import type { DestinationKey } from "../types/destinationTemplate"
import type { DestinationTemplate } from "../types/destinationTemplate"

export interface DestinationTemplateRepository {
    getByDestinationKey(destinationKey: DestinationKey): Promise<DestinationTemplate | null>
    upsert(template: DestinationTemplate): Promise<void>
}
