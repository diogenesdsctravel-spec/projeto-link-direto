/**
 * TIPOS PARA EXTRAÇÃO DE DADOS DE VIAGEM
 * 
 * Estrutura para dados extraídos de PDFs de cotação
 */

export type FlightSegment = {
    airline: string           // Ex: "LATAM Airlines"
    flightNumber: string      // Ex: "LA4605"
    date: string              // Ex: "30 jan. 2026"
    departureTime: string     // Ex: "10:40"
    arrivalTime: string       // Ex: "12:35"
    departureAirport: string  // Ex: "VDC"
    departureCity: string     // Ex: "Vitória da Conquista"
    arrivalAirport: string    // Ex: "GRU"
    arrivalCity: string       // Ex: "São Paulo"
    duration: string          // Ex: "1h 55m"
    class: string             // Ex: "Econômica"
}

export type FlightLeg = {
    type: "outbound" | "return"
    segments: FlightSegment[]
    totalDuration: string     // Ex: "6h 20m"
    stops: number             // Ex: 1
    stopInfo?: string         // Ex: "Espera de 1h 30m em São Paulo"
}

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
    mealPlan: string          // Ex: "Só hospedagem"
}

export type BaggageInfo = {
    carryOn: boolean          // Bagagem de mão incluída
    checked: boolean          // Bagagem despachada incluída
    personalItem: boolean     // Mochila/bolsa incluída
}

export type ExtractedQuoteData = {
    // Identificação
    clientName?: string
    destination: string       // Ex: "Buenos Aires"
    origin: string            // Ex: "Vitória da Conquista"

    // Datas
    travelDate: string        // Ex: "30 jan. 2026"
    returnDate: string        // Ex: "06 fev. 2026"
    totalNights: number       // Ex: 7

    // Voos
    outboundFlight: FlightLeg
    returnFlight: FlightLeg

    // Hotel
    hotel: HotelInfo

    // Bagagem
    outboundBaggage: BaggageInfo
    returnBaggage: BaggageInfo

    // Preço
    totalPrice: string        // Ex: "R$ 7.910"
    pricePerPerson?: string   // Se disponível
    passengers: string        // Ex: "2 adultos"

    // Meta
    quotationDate: string     // Ex: "09 de dezembro de 2025"
    extractedAt: string       // ISO timestamp
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