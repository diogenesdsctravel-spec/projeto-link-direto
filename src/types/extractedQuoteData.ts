/**
 * TIPOS PARA EXTRAÇÃO DE DADOS DE VIAGEM
 * 
 * Estrutura completa para dados extraídos de PDFs de cotação
 * Inclui: voos, bagagem, transfers, hotel, adicionais, pagamento
 */

// ============================================
// VOOS
// ============================================

export type FlightSegment = {
    airline: string           // Ex: "LATAM Airlines"
    airlineCode: string       // Ex: "LA", "AV", "G3"
    flightNumber: string      // Ex: "LA4605"
    aircraft?: string         // Ex: "Airbus 320/200"
    class: string             // Ex: "Econômica"
    date: string              // Ex: "30 jan. 2026"
    departureTime: string     // Ex: "10:40"
    arrivalTime: string       // Ex: "12:35"
    departureAirport: string  // Ex: "VDC"
    departureCity: string     // Ex: "Vitória da Conquista"
    departureAirportName?: string // Ex: "Aeroporto Internacional de Guarulhos"
    arrivalAirport: string    // Ex: "GRU"
    arrivalCity: string       // Ex: "São Paulo"
    arrivalAirportName?: string // Ex: "Aeroporto Internacional Benito Juárez"
    duration: string          // Ex: "1h 55m"
}

export type FlightLeg = {
    type: "outbound" | "return"
    segments: FlightSegment[]
    totalDuration: string     // Ex: "6h 20m"
    stops: number             // Ex: 1
    stopInfo?: string         // Ex: "Espera de 1h 30m em São Paulo"
    connectionTime?: string   // Ex: "3h 20m"
    connectionCity?: string   // Ex: "Cidade do México"
}

// ============================================
// BAGAGEM
// ============================================

export type BaggageItem = {
    type: "personal" | "carryOn" | "checked"
    description: string       // Ex: "1 item pessoal", "Mala de mão 10kg", "Mala despachada 23kg"
    weight?: string           // Ex: "10kg", "23kg"
    included: boolean         // Se está incluído no trecho
}

export type BaggageInfo = {
    personalItem: BaggageItem  // Mochila/bolsa pequena
    carryOn: BaggageItem       // Mala de mão (10kg)
    checked: BaggageItem       // Mala despachada (23kg)
}

// ============================================
// HOTEL
// ============================================

export type HotelInfo = {
    name: string              // Ex: "Waldorf Hotel"
    stars: number             // Ex: 3
    address: string           // Ex: "Paraguay 450"
    checkIn: string           // Ex: "Sex. 30 jan. 2026"
    checkInTime: string       // Ex: "15:00"
    checkOut: string          // Ex: "Sex. 06 fev. 2026"
    checkOutTime: string      // Ex: "10:00"
    nights: number            // Ex: 7
    guests: string            // Ex: "2 adultos"
    roomType: string          // Ex: "Doble Matrimonial Standard"
    mealPlan: string          // Ex: "Café da manhã incluso"
}

// ============================================
// TRANSFERS
// ============================================

export type TransferInfo = {
    included: boolean         // Se transfer está incluso no pacote
    type?: string             // Ex: "Compartilhado", "Privativo"
    vehicle?: string          // Ex: "Mini Van Compartilhada"
    date?: string             // Ex: "15 Jan 2025"
    time?: string             // Ex: "14:30"
    from: string              // Ex: "Aeroporto de Cancún"
    to: string                // Ex: "Hotel - Zona Hoteleira"
    passengers?: string       // Ex: "4 passageiros"
    luggage?: string          // Ex: "4 malas"
    handLuggage?: string      // Ex: "4 bolsas"
    freeCancellation?: boolean
    details?: string[]        // Informações adicionais
}

export type TransfersData = {
    outbound: TransferInfo    // Transfer de ida (aeroporto → hotel)
    return: TransferInfo      // Transfer de volta (hotel → aeroporto)
}

// ============================================
// ITENS ADICIONAIS (Passeios, Seguro, etc)
// ============================================

export type AdditionalItem = {
    name: string              // Ex: "Passeio a Chichén Itzá"
    description?: string      // Ex: "Day tour com guia"
    quantity: string          // Ex: "2 pessoas"
    price: string             // Ex: "R$ 1.840"
    included: boolean         // Se já está no pacote ou é opcional
}

// ============================================
// PAGAMENTO
// ============================================

export type PaymentConditions = {
    totalPrice: string        // Ex: "R$ 19.757"
    pricePerPerson?: string   // Ex: "R$ 9.878,50"
    installments?: {
        quantity: number      // Ex: 10
        value: string         // Ex: "R$ 1.975,70"
        interestFree: boolean // Sem juros
    }
    cashDiscount?: {
        percentage: number    // Ex: 5
        finalPrice: string    // Ex: "R$ 18.769,15"
    }
    currency: string          // Ex: "BRL"
}

// ============================================
// O QUE ESTÁ INCLUSO
// ============================================

export type IncludedItem = {
    name: string              // Ex: "Voos de ida e volta"
    included: boolean
}

// ============================================
// DADOS COMPLETOS EXTRAÍDOS
// ============================================

export type ExtractedQuoteData = {
    // Identificação
    clientName?: string
    destination: string       // Ex: "Buenos Aires"
    destinationAirport?: string // Ex: "EZE"
    origin: string            // Ex: "Vitória da Conquista"
    originAirport?: string    // Ex: "VDC"

    // Datas
    travelDate: string        // Ex: "30 jan. 2026"
    returnDate: string        // Ex: "06 fev. 2026"
    totalNights: number       // Ex: 7

    // Passageiros
    passengers: string        // Ex: "2 adultos"
    passengerNames?: string[] // Ex: ["Ingrid", "Acompanhante"]

    // Voos
    outboundFlight: FlightLeg
    returnFlight: FlightLeg

    // Bagagem por trecho
    outboundBaggage: BaggageInfo
    returnBaggage: BaggageInfo

    // Hotel
    hotel: HotelInfo

    // Transfers
    transfers: TransfersData

    // Itens adicionais (passeios, seguro, etc)
    additionalItems: AdditionalItem[]

    // O que está incluso no pacote
    includedItems: IncludedItem[]

    // Pagamento
    payment: PaymentConditions

    // Preço (mantido para compatibilidade)
    totalPrice: string        // Ex: "R$ 7.910"
    pricePerPerson?: string   // Se disponível

    // Meta
    quotationDate: string     // Ex: "09 de dezembro de 2025"
    extractedAt: string       // ISO timestamp

    // Experiências sugeridas pela IA
    suggestedExperiences?: Array<{
        icon: string
        title: string
        subtitle: string
        description?: string
        searchTerm?: string
    }>
}

/**
 * Resultado da extração
 */
export type ExtractionResult = {
    success: boolean
    data?: ExtractedQuoteData
    error?: string
    rawText?: string
}

/**
 * Valores padrão para bagagem não especificada
 */
export const DEFAULT_BAGGAGE: BaggageInfo = {
    personalItem: {
        type: "personal",
        description: "1 item pessoal",
        included: true
    },
    carryOn: {
        type: "carryOn",
        description: "Mala de mão 10kg",
        weight: "10kg",
        included: true
    },
    checked: {
        type: "checked",
        description: "Mala despachada 23kg",
        weight: "23kg",
        included: false
    }
}

/**
 * Valores padrão para transfer não especificado
 */
export const DEFAULT_TRANSFER: TransferInfo = {
    included: false,
    from: "",
    to: ""
}

/**
 * Itens comumente inclusos em pacotes
 */
export const COMMON_INCLUDED_ITEMS: string[] = [
    "Voos de ida e volta",
    "Hospedagem",
    "Café da manhã",
    "Transfers",
    "Bagagem inclusa",
    "Taxas de embarque"
]