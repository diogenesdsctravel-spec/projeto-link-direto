/**
 * DYNAMIC TEMPLATE GENERATOR
 * 
 * Gera telas narrativas usando dados REAIS extraídos do PDF
 */

import type { ExtractedQuoteData } from "../types/extractedQuoteData"
import type { DestinationTemplate, ScreenTemplate, ExperienceTemplate } from "../types/destinationTemplate"

/**
 * Formata data para exibição narrativa
 * "30 jan. 2026" → "30 de janeiro"
 */
function formatDateNarrative(dateStr: string): string {
    if (!dateStr) return ""

    const months: Record<string, string> = {
        "jan": "janeiro", "fev": "fevereiro", "mar": "março",
        "abr": "abril", "mai": "maio", "jun": "junho",
        "jul": "julho", "ago": "agosto", "set": "setembro",
        "out": "outubro", "nov": "novembro", "dez": "dezembro"
    }

    // Tentar extrair dia e mês
    const match = dateStr.match(/(\d{1,2})\s*\.?\s*(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)/i)
    if (match) {
        const day = match[1]
        const month = months[match[2].toLowerCase()] || match[2]
        return `${day} de ${month}`
    }

    return dateStr
}

/**
 * Formata dia da semana
 * "Sex. 30 Jan." → "sexta-feira"
 */
function getDayOfWeek(dateStr: string): string {
    const days: Record<string, string> = {
        "seg": "segunda-feira", "ter": "terça-feira", "qua": "quarta-feira",
        "qui": "quinta-feira", "sex": "sexta-feira", "sab": "sábado", "dom": "domingo"
    }

    const match = dateStr.match(/(seg|ter|qua|qui|sex|sab|dom)/i)
    if (match) {
        return days[match[1].toLowerCase()] || ""
    }
    return ""
}

/**
 * Gera tela HERO com nome do cliente e narrativa
 */
function generateHeroScreen(clientName: string, data: ExtractedQuoteData): ScreenTemplate {
    const nights = data.totalNights || data.hotel?.nights || 7

    return {
        screenId: "hero",
        type: "hero",
        title: `${clientName.toUpperCase()},`,
        subtitle: `Buenos Aires te espera: tango, vinho malbec e histórias em cada esquina.`,
        body: `${nights} dias onde tudo está resolvido.\nVocê só precisa estar presente.`,
        imageUrl: "https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=1200",
        includedStatus: "included"
    }
}

/**
 * Gera tela de VOO IDA com dados reais
 */
function generateOutboundFlightScreen(data: ExtractedQuoteData): ScreenTemplate {
    const flight = data.outboundFlight
    const firstSegment = flight?.segments?.[0]

    if (!firstSegment) {
        return {
            screenId: "flight-outbound",
            type: "flight",
            title: "Seu voo de ida",
            subtitle: "Informações do voo não disponíveis",
            imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200",
            includedStatus: "included"
        }
    }

    const dateNarrative = formatDateNarrative(firstSegment.date)
    const dayOfWeek = getDayOfWeek(firstSegment.date)
    const hasConnection = (flight.stops || 0) > 0

    let body = `Na ${dayOfWeek}, ${dateNarrative}, você acorda cedo e decola às ${firstSegment.departureTime} de ${firstSegment.departureCity}.`

    if (hasConnection && flight.segments.length > 1) {
        const lastSegment = flight.segments[flight.segments.length - 1]
        body += `\n\nApós ${flight.totalDuration} de viagem, você pousa em ${lastSegment.arrivalCity} às ${lastSegment.arrivalTime}.`
        body += `\n\n${flight.stopInfo || `Conexão em ${flight.segments[0].arrivalCity}`}`
    } else {
        body += `\n\nApós ${firstSegment.duration} de voo, você pousa em ${firstSegment.arrivalCity} às ${firstSegment.arrivalTime}.`
    }

    return {
        screenId: "flight-outbound",
        type: "flight",
        title: "Sua aventura começa",
        subtitle: `na manhã de ${dateNarrative}`,
        body,
        imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200",
        includedStatus: "included",
        // Dados estruturados para o card de voo
        flightData: {
            airline: firstSegment.airline,
            flightNumber: firstSegment.flightNumber,
            date: firstSegment.date,
            departureTime: firstSegment.departureTime,
            departureAirport: firstSegment.departureAirport,
            departureCity: firstSegment.departureCity,
            arrivalTime: flight.segments[flight.segments.length - 1]?.arrivalTime || firstSegment.arrivalTime,
            arrivalAirport: flight.segments[flight.segments.length - 1]?.arrivalAirport || firstSegment.arrivalAirport,
            arrivalCity: flight.segments[flight.segments.length - 1]?.arrivalCity || firstSegment.arrivalCity,
            duration: flight.totalDuration || firstSegment.duration,
            stops: flight.stops || 0,
            stopInfo: flight.stopInfo
        }
    } as ScreenTemplate
}

/**
 * Gera tela de VOO VOLTA com dados reais
 */
function generateReturnFlightScreen(data: ExtractedQuoteData): ScreenTemplate {
    const flight = data.returnFlight
    const firstSegment = flight?.segments?.[0]

    if (!firstSegment) {
        return {
            screenId: "flight-return",
            type: "flight",
            title: "Seu voo de volta",
            subtitle: "Informações do voo não disponíveis",
            imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200",
            includedStatus: "included"
        }
    }

    const dateNarrative = formatDateNarrative(firstSegment.date)
    const hasConnection = (flight.stops || 0) > 0

    let body = `No dia ${dateNarrative}, sua aventura se encerra. Você decola às ${firstSegment.departureTime} de ${firstSegment.departureCity}.`

    if (hasConnection && flight.segments.length > 1) {
        const lastSegment = flight.segments[flight.segments.length - 1]
        body += `\n\nApós ${flight.totalDuration}, você chega em ${lastSegment.arrivalCity} às ${lastSegment.arrivalTime}.`
    } else {
        body += `\n\nApós ${firstSegment.duration}, você chega em casa às ${firstSegment.arrivalTime}.`
    }

    body += `\n\nMas as memórias de Buenos Aires vão com você.`

    return {
        screenId: "flight-return",
        type: "flight",
        title: "A volta para casa",
        subtitle: `${dateNarrative}`,
        body,
        imageUrl: "https://images.unsplash.com/photo-1583202075489-3de45a71e2de?w=1200",
        includedStatus: "included",
        flightData: {
            airline: firstSegment.airline,
            flightNumber: firstSegment.flightNumber,
            date: firstSegment.date,
            departureTime: firstSegment.departureTime,
            departureAirport: firstSegment.departureAirport,
            departureCity: firstSegment.departureCity,
            arrivalTime: flight.segments[flight.segments.length - 1]?.arrivalTime || firstSegment.arrivalTime,
            arrivalAirport: flight.segments[flight.segments.length - 1]?.arrivalAirport || firstSegment.arrivalAirport,
            arrivalCity: flight.segments[flight.segments.length - 1]?.arrivalCity || firstSegment.arrivalCity,
            duration: flight.totalDuration || firstSegment.duration,
            stops: flight.stops || 0,
            stopInfo: flight.stopInfo
        }
    } as ScreenTemplate
}

/**
 * Gera tela de HOTEL com dados reais
 */
function generateHotelScreen(data: ExtractedQuoteData): ScreenTemplate {
    const hotel = data.hotel

    if (!hotel) {
        return {
            screenId: "hotel",
            type: "hotel",
            title: "Sua hospedagem",
            subtitle: "Informações do hotel não disponíveis",
            imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
            includedStatus: "included"
        }
    }

    const stars = "★".repeat(hotel.stars || 3)
    const checkInDate = formatDateNarrative(hotel.checkIn)
    const checkOutDate = formatDateNarrative(hotel.checkOut)

    return {
        screenId: "hotel",
        type: "hotel",
        title: `${hotel.name} ${stars}`,
        subtitle: `Seu refúgio em Buenos Aires`,
        body: `${hotel.nights} noites no coração da cidade.\n\nCheck-in: ${checkInDate} às ${hotel.checkInTime}\nCheck-out: ${checkOutDate} às ${hotel.checkOutTime}\n\nQuarto: ${hotel.roomType}\nEndereço: ${hotel.address}`,
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
        hotelCarouselImageUrls: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800"
        ],
        includedStatus: "included"
    }
}

/**
 * Gera tela de EXPERIÊNCIAS
 */
function generateExperiencesScreen(): ScreenTemplate {
    return {
        screenId: "experiences",
        type: "experiences",
        title: "Experiências que te esperam",
        subtitle: "Buenos Aires tem muito a oferecer",
        imageUrl: "https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=1200",
        includedStatus: "included",
        experienceItems: [
            { icon: "🥩", title: "Jantar em parrilla tradicional", subtitle: "Carne argentina no ponto perfeito" },
            { icon: "💃", title: "Show de tango em San Telmo", subtitle: "A alma de Buenos Aires" },
            { icon: "🍷", title: "Degustação de Malbec", subtitle: "Os melhores vinhos argentinos" },
            { icon: "🏛️", title: "Tour por Recoleta", subtitle: "Arte, história e arquitetura" },
            { icon: "⚽", title: "La Bombonera", subtitle: "O templo do futebol argentino" },
            { icon: "🛍️", title: "Compras em Palermo", subtitle: "Moda e design local" }
        ]
    }
}

/**
 * Gera tela de SUMMARY com preço
 */
function generateSummaryScreen(data: ExtractedQuoteData, clientName: string): ScreenTemplate {
    return {
        screenId: "summary",
        type: "summary",
        title: "Resumo do seu pacote",
        subtitle: `${clientName}, sua aventura está pronta`,
        body: `${data.passengers || "2 adultos"}\n${data.totalNights || 7} noites em Buenos Aires\nVoos + Hotel + Experiências`,
        totalPrice: data.totalPrice || "A consultar",
        imageUrl: "https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=1200",
        includedStatus: "included"
    }
}

/**
 * FUNÇÃO PRINCIPAL: Gera template completo com dados do PDF
 */
export function generateDynamicTemplate(
    clientName: string,
    extractedData: ExtractedQuoteData
): DestinationTemplate {

    const screens: ScreenTemplate[] = [
        // 1. Hero com nome do cliente
        generateHeroScreen(clientName, extractedData),

        // 2. Hotel
        generateHotelScreen(extractedData),

        // 3. Experiências
        generateExperiencesScreen(),

        // 4. Voo de ida
        generateOutboundFlightScreen(extractedData),

        // 5. Voo de volta
        generateReturnFlightScreen(extractedData),

        // 6. Summary com preço
        generateSummaryScreen(extractedData, clientName)
    ]

    // Experiências para a tela de experiências
    const experiences: ExperienceTemplate[] = [
        { icon: "🥩", title: "Jantar em parrilla", subtitle: "Carne argentina" },
        { icon: "💃", title: "Show de tango", subtitle: "San Telmo" },
        { icon: "🍷", title: "Degustação de Malbec", subtitle: "Vinhos premium" },
        { icon: "🏛️", title: "Tour Recoleta", subtitle: "Arte e história" },
        { icon: "⚽", title: "La Bombonera", subtitle: "Futebol argentino" },
        { icon: "🛍️", title: "Compras Palermo", subtitle: "Design local" }
    ]

    return {
        destinationKey: "buenos-aires",
        destinationName: "Buenos Aires",
        screens,
        experiences
    }
}

/**
 * Verifica se a cotação tem dados extraídos
 */
export function hasExtractedData(quote: any): boolean {
    return !!(quote?.extractedData?.destination)
}