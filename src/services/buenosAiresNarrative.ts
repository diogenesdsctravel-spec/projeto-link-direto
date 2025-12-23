import type { DestinationTemplate } from "../types/destinationTemplate"

/**
 * TEMPLATE NARRATIVO — BUENOS AIRES
 * 
 * PRINCÍPIOS APLICADOS:
 * 1. Valor antes de preço (preço só no summary final)
 * 2. Narrativa emocional > descrição técnica
 * 3. Tom: "Buenos Aires te espera" (direto, pessoal, evocativo)
 * 4. Ordem: emoção → logística → fechamento
 * 
 * MUDANÇAS PRINCIPAIS:
 * - Textos reescritos com narrativa emocional
 * - Ordem reorganizada (hotel e experiences antes de logística)
 * - Campo "body" adicionado em telas logísticas
 * - Campo "price" preparado no summary
 */

export function getMockTemplateBuenosAires(): DestinationTemplate {
    const now = new Date().toISOString()

    return {
        destinationKey: "buenos-aires",
        destinationName: "Buenos Aires",
        heroImageUrl: "https://images.unsplash.com/photo-1544986581-efac024faf62?auto=format&fit=crop&w=1400&q=60",

        // Experiências enriquecidas com narrativa
        experiences: [
            {
                experienceId: "exp_1",
                title: "Tango autêntico",
                subtitle: "Uma noite em uma milonga tradicional, longe das armadilhas turísticas"
            },
            {
                experienceId: "exp_2",
                title: "Pôr do sol em Puerto Madero",
                subtitle: "Caminhada ao lado da água, vinhos e gastronomia de ponta"
            },
            {
                experienceId: "exp_3",
                title: "Recoleta e seus segredos",
                subtitle: "Cemitério histórico, cafés elegantes e livrarias centenárias"
            },
            {
                experienceId: "exp_4",
                title: "Palermo de dia e de noite",
                subtitle: "Parques, feiras de design, bares escondidos e a melhor gastronomia"
            },
            {
                experienceId: "exp_5",
                title: "Domingo em San Telmo",
                subtitle: "Feira de antiguidades, tango de rua e atmosfera boêmia"
            },
            {
                experienceId: "exp_6",
                title: "Experiências gastronômicas",
                subtitle: "Degustação de malbec, parrillas e doce de leite artesanal"
            },
        ],

        screens: [
            // ==========================================
            // BLOCO 1: PREPARAÇÃO E APRESENTAÇÃO
            // ==========================================
            {
                screenId: "s0",
                type: "intro",
                title: "Preparamos algo especial para você",
                subtitle: "Antes de ver as opções, sinta a viagem.",
                body: "Cuidamos de cada detalhe para que você se imagine na viagem antes mesmo de decidir. Não é apenas uma cotação — é um convite para viver a experiência.",
                imageUrl: "https://images.unsplash.com/photo-1544918872-1b1b0f8b8d98?auto=format&fit=crop&w=1400&q=80",
            },

            // ==========================================
            // BLOCO 2: DESTINO (HERO)
            // ==========================================
            {
                screenId: "s1",
                type: "hero",
                title: "Buenos Aires te espera: tango, vinho malbec e histórias em cada esquina",
                subtitle: "Sete dias onde cada momento tem sabor de descoberta",
                imageUrl: "https://images.unsplash.com/photo-1544986581-efac024faf62?auto=format&fit=crop&w=1400&q=60",
            },

            // ==========================================
            // BLOCO 3: EXPERIÊNCIA EMOCIONAL
            // (hotel → experiences)
            // ==========================================
            {
                screenId: "s5",
                type: "hotel",
                title: "Seu refúgio em Palermo",
                subtitle: "A poucos passos dos melhores bares e parques da cidade",
                body: "Um hotel que não é apenas um lugar para dormir, mas sua base para explorar Buenos Aires como um local. Você acorda e já está no coração do melhor bairro da cidade.",
                includedStatus: "included",
                hotelCarouselImageUrls: [
                    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=60",
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=60",
                    "https://images.unsplash.com/photo-1551887373-6c5bd8d9c0b1?auto=format&fit=crop&w=1400&q=60",
                    "https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=1400&q=60",
                    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1400&q=60",
                ],
            },
            {
                screenId: "s2",
                type: "experiences",
                title: "Seis experiências que transformam turista em portenho",
                subtitle: "Uma semana inteira para sentir Buenos Aires no ritmo certo: nem turístico demais, nem corrido. Você vai viver a cidade, não apenas visitá-la.",
                experienceItems: [
                    { experienceId: "exp_1", title: "Tango autêntico" },
                    { experienceId: "exp_2", title: "Pôr do sol em Puerto Madero" },
                    { experienceId: "exp_3", title: "Recoleta e seus segredos" },
                    { experienceId: "exp_4", title: "Palermo de dia e de noite" },
                    { experienceId: "exp_5", title: "Domingo em San Telmo" },
                    { experienceId: "exp_6", title: "Experiências gastronômicas" },
                ],
            },

            // ==========================================
            // BLOCO 4: LOGÍSTICA (agrupada)
            // (voos → transfers)
            // ==========================================
            {
                screenId: "s3",
                type: "flight_outbound",
                title: "Seu voo de ida",
                subtitle: "O começo da história",
                body: "Você embarca e, em poucas horas, estará respirando o ar portenho. A viagem começa aqui.",
                includedStatus: "included",
            },
            {
                screenId: "s7",
                type: "flight_return",
                title: "Seu voo de volta",
                subtitle: "Levando Buenos Aires com você",
                body: "Você volta diferente. Com histórias, sabores na memória e a vontade de voltar.",
                includedStatus: "included",
            },
            {
                screenId: "s4",
                type: "transfer_outbound",
                title: "Te buscamos no aeroporto",
                subtitle: "A viagem começa no desembarque",
                body: "Nada de filas ou confusão. Você sai do aeroporto e já está a caminho do hotel, relaxado.",
                includedStatus: "not_included",
            },
            {
                screenId: "s6",
                type: "transfer_return",
                title: "Te levamos de volta",
                subtitle: "Sem pressa, sem estresse",
                body: "No último dia, você só precisa curtir as últimas horas. A gente cuida do resto.",
                includedStatus: "not_included",
            },

            // ==========================================
            // BLOCO 5: FECHAMENTO (summary com preço)
            // ==========================================
            {
                screenId: "s8",
                type: "summary",
                title: "Tudo o que está incluso",
                subtitle: "E o investimento para viver tudo isso",
                body: "Agora que você sentiu a viagem, vamos ao que importa: quanto custa transformar esse sonho em realidade.",
                // Nota: campo "price" será adicionado dinamicamente pelas versões
            },
        ],

        updatedAtIso: now,
    }
}

/**
 * CHECKLIST DE VALIDAÇÃO:
 * 
 * ✅ Princípio #1: Valor antes de preço
 *    - Preço só aparece no summary (última tela)
 *    - Toda experiência emocional vem antes
 * 
 * ✅ Princípio #2: Fluxo manual antes de IA
 *    - Textos escritos manualmente
 *    - Narrativa humana, não gerada
 * 
 * ✅ Princípio #4: Experiência do cliente > conveniência
 *    - Ordem narrativa (não ordem operacional)
 *    - Emoção primeiro, logística depois
 * 
 * ✅ Tom conversacional
 *    - Uso de "você/te" (direto)
 *    - Verbos ativos ("te espera", "você vive")
 *    - Específico, não genérico
 * 
 * ✅ Agrupamento lógico
 *    - Voos juntos
 *    - Transfers juntos
 *    - Experiências agrupadas
 */