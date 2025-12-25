/**
 * EXPERIENCE GENERATOR SERVICE
 * 
 * Cérebro especializado em gerar experiências narrativas para destinos.
 * Separado da extração de PDF para melhor qualidade e manutenção.
 */

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

export interface GeneratedExperience {
    icon: string
    title: string
    subtitle: string
    description: string
    searchTerm: string
}

const EXPERIENCE_PROMPT = `Você é um copywriter especializado em turismo de luxo.

Sua tarefa: gerar 6 experiências ICÔNICAS para o destino informado.

FORMATO OBRIGATÓRIO (retorne APENAS um array JSON):
[
  {
    "icon": "emoji",
    "title": "Nome do lugar (1-3 palavras)",
    "subtitle": "Frase de impacto emocional (5-10 palavras)",
    "description": "2-3 frases sensoriais e convidativas. Faça o turista se imaginar lá.",
    "searchTerm": "termo para buscar foto"
  }
]

EXEMPLOS DE QUALIDADE:

{
  "icon": "🏔️",
  "title": "Lago Negro",
  "subtitle": "O cartão-postal mais fotografado da Serra Gaúcha",
  "description": "Caminhe entre hortênsias e araucárias ao redor do lago mais encantador de Gramado. Alugue um pedalinho e navegue pelas águas calmas cercado pela mata nativa. O cenário parece saído de um conto europeu.",
  "searchTerm": "Lago Negro Gramado"
}

{
  "icon": "🏛️",
  "title": "Chichén Itzá",
  "subtitle": "Uma das 7 maravilhas do mundo moderno",
  "description": "Visite a pirâmide de Kukulcán e sinta a energia milenar dos Maias. O complexo arqueológico impressiona pela precisão astronômica e grandiosidade. Uma experiência que conecta você com uma das civilizações mais fascinantes da história.",
  "searchTerm": "Chichén Itzá pirâmide"
}

{
  "icon": "🍷",
  "title": "Degustação de Malbec",
  "subtitle": "Os melhores vinhos argentinos em taça",
  "description": "Prove os Malbecs premiados em uma vinícola tradicional de Mendoza. O sommelier guia você pelos aromas e sabores enquanto o pôr do sol colore os Andes ao fundo. Uma experiência que aguça todos os sentidos.",
  "searchTerm": "degustação vinho Mendoza"
}

REGRAS:
- title: Nome PRÓPRIO e REAL do lugar (não genérico)
- subtitle: Gancho emocional que gera curiosidade
- description: OBRIGATÓRIO - 2-3 frases com verbos de ação ("caminhe", "prove", "sinta", "descubra")
- Inclua detalhes SENSORIAIS (cores, texturas, sabores, sons)
- Foque no que o turista pode FAZER e SENTIR

PROIBIDO:
- Títulos genéricos ("Gastronomia local", "Pontos turísticos")
- Descrições vazias ou ausentes
- Tom de guia técnico
- Mais de 3 frases na description

Retorne APENAS o array JSON, sem explicações.`

/**
 * Gera experiências para um destino usando IA especializada
 */
export async function generateExperiencesForDestination(
    destination: string
): Promise<GeneratedExperience[]> {
    if (!OPENAI_API_KEY) {
        console.error("⚠️ OpenAI API key não configurada")
        return getDefaultExperiences(destination)
    }

    try {
        console.log(`🧠 Gerando experiências para: ${destination}`)

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: EXPERIENCE_PROMPT
                    },
                    {
                        role: "user",
                        content: `Gere 6 experiências icônicas para: ${destination}`
                    }
                ],
                max_tokens: 2000,
                temperature: 0.7
            })
        })

        if (!response.ok) {
            throw new Error(`Erro OpenAI: ${response.status}`)
        }

        const data = await response.json()
        const content = data.choices[0]?.message?.content || "[]"

        // Limpar e parsear JSON
        const cleanJson = content
            .replace(/```json\n?/g, "")
            .replace(/```\n?/g, "")
            .trim()

        const experiences = JSON.parse(cleanJson) as GeneratedExperience[]

        console.log(`✅ ${experiences.length} experiências geradas`)

        // Validar que todas têm description
        const validExperiences = experiences.map(exp => ({
            icon: exp.icon || "📍",
            title: exp.title || "Experiência",
            subtitle: exp.subtitle || "",
            description: exp.description || "",
            searchTerm: exp.searchTerm || exp.title
        }))

        return validExperiences

    } catch (error) {
        console.error("❌ Erro ao gerar experiências:", error)
        return getDefaultExperiences(destination)
    }
}

/**
 * Experiências padrão (fallback)
 */
function getDefaultExperiences(destination: string): GeneratedExperience[] {
    return [
        {
            icon: "📸",
            title: "Centro Histórico",
            subtitle: `Descubra a alma de ${destination}`,
            description: `Caminhe pelas ruas históricas e sinta a energia única de ${destination}. Cada esquina revela uma nova surpresa arquitetônica. O passado e o presente se encontram em cada detalhe.`,
            searchTerm: `centro histórico ${destination}`
        },
        {
            icon: "🍽️",
            title: "Gastronomia Local",
            subtitle: "Sabores que contam histórias",
            description: `Prove os pratos típicos que fazem de ${destination} um destino gastronômico. Ingredientes frescos e receitas tradicionais se combinam em experiências inesquecíveis. Cada refeição é uma celebração da cultura local.`,
            searchTerm: `gastronomia ${destination}`
        },
        {
            icon: "🌅",
            title: "Mirante",
            subtitle: "A vista que você nunca vai esquecer",
            description: `Contemple ${destination} do alto e entenda por que este lugar é tão especial. O pôr do sol pinta o céu de cores que parecem irreais. Tenha sua câmera pronta para o momento perfeito.`,
            searchTerm: `mirante ${destination}`
        },
        {
            icon: "🏛️",
            title: "Patrimônio Cultural",
            subtitle: "História viva em cada detalhe",
            description: `Explore os monumentos e construções que contam a história de ${destination}. Cada pedra guarda séculos de memórias. Uma viagem no tempo sem sair do lugar.`,
            searchTerm: `patrimônio histórico ${destination}`
        },
        {
            icon: "🌿",
            title: "Natureza",
            subtitle: "Reconecte-se com o verde",
            description: `Respire o ar puro e deixe a natureza de ${destination} renovar suas energias. Trilhas, paisagens e momentos de paz te esperam. A natureza aqui é generosa e surpreendente.`,
            searchTerm: `natureza ${destination}`
        },
        {
            icon: "🛍️",
            title: "Compras Locais",
            subtitle: "Leve um pedaço do destino com você",
            description: `Descubra o artesanato e os produtos típicos de ${destination}. Cada peça conta uma história e carrega a essência do lugar. Presentes únicos que você só encontra aqui.`,
            searchTerm: `artesanato ${destination}`
        }
    ]
}