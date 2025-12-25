/**
 * DYNAMIC TEMPLATE GENERATOR
 *
 * Gera telas narrativas usando:
 * - Dados REAIS extraídos do PDF (voos, preço, datas)
 * - Dados do BANCO (fotos do destino, hotel, experiências)
 */

import type { ExtractedQuoteData } from "../types/extractedQuoteData"
import type { DestinationTemplate, ScreenTemplate, ExperienceTemplate } from "../types/destinationTemplate"
import { getDestinationByKey, getHotelByName, type Destination, type Hotel } from "./destinationService"

/**
 * Formata data para exibição narrativa
 * "30 jan. 2026" → "30 de janeiro"
 */
function formatDateNarrative(dateStr: string): string {
    if (!dateStr) return ""

    const months: Record<string, string> = {
        "jan": "janeiro",
        "fev": "fevereiro",
        "mar": "março",
        "abr": "abril",
        "mai": "maio",
        "jun": "junho",
        "jul": "julho",
        "ago": "agosto",
        "set": "setembro",
        "out": "outubro",
        "nov": "novembro",
        "dez": "dezembro"
    }

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
 */
function getDayOfWeek(dateStr: string): string {
    const days: Record<string, string> = {
        "seg": "segunda-feira",
        "ter": "terça-feira",
        "qua": "quarta-feira",
        "qui": "quinta-feira",
        "sex": "sexta-feira",
        "sab": "sábado",
        "dom": "domingo"
    }

    const match = dateStr.match(/(seg|ter|qua|qui|sex|sab|dom)/i)
    if (match) {
        return days[match[1].toLowerCase()] || ""
    }
    return ""
}

/**
 * Gera destinationKey a partir do nome do destino
 */
function generateDestinationKey(destination: string): string {
    return destination
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
}

/**
 * Gera tela HERO com dados do banco ou fallback
 */
function generateHeroScreen(
    clientName: string,
    data: ExtractedQuoteData,
    destinationData: Destination | null
): ScreenTemplate {
    const nights = data.totalNights || data.hotel?.nights || 7
    const destination = data.destination || "seu destino"

    void nights
    void destination

    // Usar dados do banco se existirem
    const heroImage =
        destinationData?.heroImageUrl ||
        "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=1200"

    return {
        screenId: "hero",
        type: "hero",
        title: `${clientName},`,
        subtitle: "Alguns dias pensados para você desacelerar.",
        body: "Tudo já está cuidado. Você só precisa estar presente.",
        imageUrl: heroImage,
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
    const destination = data.destination || "seu destino"

    let body = `No dia ${dateNarrative}, sua aventura se encerra. Você decola às ${firstSegment.departureTime} de ${firstSegment.departureCity}.`

    if (hasConnection && flight.segments.length > 1) {
        const lastSegment = flight.segments[flight.segments.length - 1]
        body += `\n\nApós ${flight.totalDuration}, você chega em ${lastSegment.arrivalCity} às ${lastSegment.arrivalTime}.`
    } else {
        body += `\n\nApós ${firstSegment.duration}, você chega em casa às ${firstSegment.arrivalTime}.`
    }

    body += `\n\nMas as memórias de ${destination} vão com você.`

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
 * Gera tela de HOTEL com dados do banco ou fallback
 */
function generateHotelScreen(
    data: ExtractedQuoteData,
    hotelData: Hotel | null
): ScreenTemplate {
    const hotel = data.hotel
    const destination = data.destination || "seu destino"

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

    const stars = "★".repeat(hotel.stars || 4)
    const checkInDate = formatDateNarrative(hotel.checkIn)
    const checkOutDate = formatDateNarrative(hotel.checkOut)

    // Usar fotos do banco se existirem
    const hotelImages =
        hotelData?.imageUrls && hotelData.imageUrls.length > 0
            ? hotelData.imageUrls
            : [
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
                "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800"
            ]

    // Usar descrição do banco se existir
    const shortDescription = hotelData?.shortDescription || `Seu refúgio em ${destination}`

    return {
        screenId: "hotel",
        type: "hotel",
        title: `${hotel.name} ${stars}`,
        subtitle: shortDescription,
        body: `${hotel.nights} noites no coração da cidade.\n\nCheck-in: ${checkInDate} às ${hotel.checkInTime}\nCheck-out: ${checkOutDate} às ${hotel.checkOutTime}\n\nQuarto: ${hotel.roomType}\nEndereço: ${hotel.address}`,
        imageUrl: hotelImages[0],
        hotelCarouselImageUrls: hotelImages,
        includedStatus: "included"
    }
}

/**
 * Gera tela de EXPERIÊNCIAS com dados do banco ou fallback
 */
function generateExperiencesScreen(
    data: ExtractedQuoteData,
    destinationData: Destination | null
): ScreenTemplate {
    const destination = data.destination || "seu destino"

    // Usar experiências do banco se existirem
    const experiences =
        destinationData?.experiences && destinationData.experiences.length > 0
            ? destinationData.experiences
            : getDefaultExperiences(destination)

    return {
        screenId: "experiences",
        type: "experiences",
        title: "Experiências que te esperam",
        subtitle: `${destination} tem muito a oferecer`,
        imageUrl:
            destinationData?.heroImageUrl ||
            "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=1200",
        includedStatus: "included",
        experienceItems: experiences.map(exp => ({
            icon: exp.icon,
            title: exp.title,
            subtitle: exp.subtitle,
            description: (exp as any).description || ""  // ✅ CORREÇÃO: Incluir description
        }))
    }
}

/**
 * Experiências padrão por destino (fallback)
 */
function getDefaultExperiences(destination: string): Array<{ icon: string; title: string; subtitle: string; description?: string }> {
    const lowerDest = destination.toLowerCase()

    if (lowerDest.includes("cancun") || lowerDest.includes("cancún")) {
        return [
            { icon: "🏛️", title: "Chichén Itzá", subtitle: "A 7ª maravilha do mundo", description: "Visite a pirâmide de Kukulcán e sinta a energia milenar dos Maias. O complexo arqueológico impressiona pela precisão astronômica e grandiosidade." },
            { icon: "🐬", title: "Nado com golfinhos", subtitle: "Experiência inesquecível", description: "Interaja com golfinhos em águas cristalinas. Uma conexão única com a natureza que ficará para sempre na memória." },
            { icon: "🚤", title: "Isla Mujeres", subtitle: "Praias paradisíacas", description: "Navegue até esta ilha encantadora com praias de areia branca. Explore as ruas coloridas e mergulhe no mar caribenho." },
            { icon: "🤿", title: "Snorkel em recifes", subtitle: "Vida marinha incrível", description: "Descubra o segundo maior recife de corais do mundo. Peixes coloridos e tartarugas nadam ao seu lado." },
            { icon: "🌮", title: "Gastronomia mexicana", subtitle: "Sabores autênticos", description: "Prove tacos al pastor, ceviche fresco e guacamole preparado na hora. Cada refeição é uma festa de sabores." },
            { icon: "🎉", title: "Vida noturna", subtitle: "Baladas à beira-mar", description: "Dance até o amanhecer nos clubes mais famosos do Caribe. A energia de Cancún não para quando o sol se põe." }
        ]
    }

    if (lowerDest.includes("buenos")) {
        return [
            { icon: "🥩", title: "Jantar em parrilla", subtitle: "Carne argentina no ponto perfeito", description: "Saboreie o melhor corte de carne do mundo, grelhado lentamente sobre brasas. Uma experiência gastronômica incomparável." },
            { icon: "💃", title: "Show de tango", subtitle: "A alma de Buenos Aires", description: "Assista a dançarinos apaixonados em um show de tango autêntico. A música e os movimentos contam histórias de amor e saudade." },
            { icon: "🍷", title: "Degustação de Malbec", subtitle: "Os melhores vinhos argentinos", description: "Prove os Malbecs premiados em uma vinícola tradicional. O sommelier guia você pelos aromas e sabores únicos." },
            { icon: "🏛️", title: "Tour por Recoleta", subtitle: "Arte, história e arquitetura", description: "Caminhe pelo bairro mais elegante da cidade. Visite o famoso cemitério onde descansa Evita Perón." },
            { icon: "⚽", title: "La Bombonera", subtitle: "O templo do futebol argentino", description: "Sinta a vibração do estádio do Boca Juniors. Mesmo vazio, as paredes contam histórias de glórias e paixão." },
            { icon: "🛍️", title: "Compras em Palermo", subtitle: "Moda e design local", description: "Explore as lojas de designers argentinos em Palermo Soho. Peças únicas que você não encontra em outro lugar." }
        ]
    }

    // Fallback genérico
    return [
        { icon: "📸", title: "Pontos turísticos", subtitle: "Os mais famosos", description: "Descubra os lugares mais icônicos do destino. Cada foto conta uma história que você vai querer compartilhar." },
        { icon: "🍽️", title: "Gastronomia local", subtitle: "Sabores típicos", description: "Prove os pratos que definem a cultura local. Cada refeição é uma viagem pelos sabores da região." },
        { icon: "🏛️", title: "Cultura e história", subtitle: "Patrimônio local", description: "Explore museus, monumentos e construções históricas. Entenda a alma do lugar através de sua história." },
        { icon: "🌅", title: "Paisagens", subtitle: "Vistas incríveis", description: "Contemple cenários de tirar o fôlego. Momentos perfeitos para pausar e absorver a beleza ao redor." },
        { icon: "🛍️", title: "Compras", subtitle: "Produtos locais", description: "Leve um pedaço do destino com você. Artesanatos e produtos típicos que contam histórias." },
        { icon: "🎭", title: "Entretenimento", subtitle: "Shows e eventos", description: "Vivencie a energia local em shows e apresentações. A cultura viva que pulsa no coração do destino." }
    ]
}

/**
 * Gera tela de SUMMARY com preço
 */
function generateSummaryScreen(
    data: ExtractedQuoteData,
    clientName: string
): ScreenTemplate {
    const destination = data.destination || "seu destino"
    const nights = data.totalNights || data.hotel?.nights || 7

    return {
        screenId: "summary",
        type: "summary",
        title: "Resumo do seu pacote",
        subtitle: `${clientName}, sua aventura está pronta`,
        body: `${data.passengers || "2 adultos"}\n${nights} noites em ${destination}\nVoos + Hotel + Experiências`,
        totalPrice: data.totalPrice || "A consultar",
        imageUrl: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=1200",
        includedStatus: "included"
    }
}

/**
 * FUNÇÃO PRINCIPAL: Gera template completo
 *
 * AGORA BUSCA DADOS DO SUPABASE!
 */
export async function generateDynamicTemplateAsync(
    clientName: string,
    extractedData: ExtractedQuoteData
): Promise<DestinationTemplate> {
    const destination = extractedData.destination || "Destino"
    const destinationKey = generateDestinationKey(destination)
    const hotelName = extractedData.hotel?.name || ""

    console.log(`🔍 Buscando template para: ${destination} (${destinationKey})`)
    console.log(`🏨 Buscando hotel: ${hotelName}`)

    // Buscar dados do banco
    const [destinationData, hotelData] = await Promise.all([
        getDestinationByKey(destinationKey),
        hotelName ? getHotelByName(hotelName) : Promise.resolve(null)
    ])

    console.log(`📍 Destino encontrado:`, destinationData ? "SIM" : "NÃO")
    console.log(`🏨 Hotel encontrado:`, hotelData ? "SIM" : "NÃO")

    const screens: ScreenTemplate[] = [
        generateHeroScreen(clientName, extractedData, destinationData),
        generateHotelScreen(extractedData, hotelData),
        generateExperiencesScreen(extractedData, destinationData),
        generateOutboundFlightScreen(extractedData),
        generateReturnFlightScreen(extractedData),
        generateSummaryScreen(extractedData, clientName)
    ]

    // ✅ CORREÇÃO: Experiências agora incluem description
    const experiences: ExperienceTemplate[] = (destinationData?.experiences || getDefaultExperiences(destination)).map(
        (exp, index) => ({
            experienceId: `exp-${index}`,
            icon: exp.icon,
            title: exp.title,
            subtitle: exp.subtitle,
            description: (exp as any).description || "",  // ✅ ADICIONADO
            imageUrl: (exp as any).imageUrl || ""
        })
    )

    return {
        destinationKey,
        destinationName: destination,
        screens,
        experiences
    }
}

/**
 * FUNÇÃO SÍNCRONA (para compatibilidade)
 * Usa dados de fallback se não conseguir buscar do banco
 */
export function generateDynamicTemplate(
    clientName: string,
    extractedData: ExtractedQuoteData
): DestinationTemplate {
    const destination = extractedData.destination || "Destino"
    const destinationKey = generateDestinationKey(destination)

    const screens: ScreenTemplate[] = [
        generateHeroScreen(clientName, extractedData, null),
        generateHotelScreen(extractedData, null),
        generateExperiencesScreen(extractedData, null),
        generateOutboundFlightScreen(extractedData),
        generateReturnFlightScreen(extractedData),
        generateSummaryScreen(extractedData, clientName)
    ]

    // ✅ CORREÇÃO: Experiências agora incluem description
    const experiences: ExperienceTemplate[] = getDefaultExperiences(destination).map((exp, index) => ({
        experienceId: `exp-${index}`,
        icon: exp.icon,
        title: exp.title,
        subtitle: exp.subtitle,
        description: exp.description || "",  // ✅ ADICIONADO
        imageUrl: ""
    }))

    return {
        destinationKey,
        destinationName: destination,
        screens,
        experiences
    }
}

/**
 * Verifica se a cotação tem dados extraídos
 */
export function hasExtractedData(quote: any): boolean {
    return !!quote?.extractedData?.destination
}