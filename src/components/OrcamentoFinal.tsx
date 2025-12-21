import { Heart, Plane, Home, Car, Sparkles, Check, MapPin, Star, Compass } from 'lucide-react';
import type { ScreenProps } from '../types/cotacao';
import { formatCurrencySplit, hasItem, getHotel, getVoo } from '../types/cotacao';

// Mapa de ícones por tipo de item
const tipoIcons: Record<string, React.ReactNode> = {
    voo: <Plane className="w-5 h-5 text-[#50cfad]" />,
    hotel: <Home className="w-5 h-5 text-[#50cfad]" />,
    transfer: <Car className="w-5 h-5 text-[#50cfad]" />,
    experiencia: <Heart className="w-5 h-5 text-[#50cfad]" />,
    passeio: <Compass className="w-5 h-5 text-[#50cfad]" />,
    seguro: <Star className="w-5 h-5 text-[#50cfad]" />,
    outro: <Sparkles className="w-5 h-5 text-[#50cfad]" />,
};

export function OrcamentoFinal({ cotacaoData, onPrev }: ScreenProps) {
    const { snapshot } = cotacaoData;

    // Dados do cliente
    const clienteNome = snapshot.cliente?.nome || "Viajante";

    // Dados financeiros
    const valorTotal = snapshot.financeiro?.valor_total || 0;
    const parcelamento = snapshot.financeiro?.parcelamento || "em até 10x sem juros";
    const observacoesFinanceiras = snapshot.financeiro?.observacoes || "";

    // Dados do destino
    const destinoNome = snapshot.meta?.destino_nome || "seu destino";

    // Formata valor
    const { inteiro, decimal } = formatCurrencySplit(valorTotal);

    // Monta resumo dos itens incluídos
    const itensIncluidos = snapshot.itens?.filter(item => item.incluido) || [];

    // Gera descrição automática dos itens
    const gerarDescricaoItem = (item: typeof itensIncluidos[0]): string => {
        switch (item.tipo) {
            case "voo": {
                const vooIda = getVoo(snapshot, "ida");
                const vooVolta = getVoo(snapshot, "volta");
                if (vooIda && vooVolta) {
                    return `${vooIda.companhia || "Aéreo"} • ${vooIda.origem?.codigo || ""}-${vooIda.destino?.codigo || ""}-${vooVolta.destino?.codigo || ""} • Bagagem incluída`;
                }
                return item.subtitulo || "Passagem aérea";
            }
            case "hotel": {
                const hotel = getHotel(snapshot);
                if (hotel) {
                    return `${hotel.noites || ""} noite${(hotel.noites || 0) > 1 ? "s" : ""} • ${hotel.regime || "Café da manhã"}${hotel.amenidades?.includes("SPA") ? " • SPA incluso" : ""}`;
                }
                return item.subtitulo || "Hospedagem";
            }
            case "transfer":
                return item.subtitulo || "Conforto total";
            case "experiencia":
            case "passeio":
                return item.subtitulo || "Experiência única";
            default:
                return item.subtitulo || "";
        }
    };

    // Agrupa itens por tipo para exibição
    const itensAgrupados = itensIncluidos.reduce((acc, item) => {
        // Agrupa voos em um único item
        if (item.tipo === "voo") {
            if (!acc.find(i => i.tipo === "voo")) {
                acc.push({
                    tipo: "voo",
                    titulo: "Voos Ida e Volta",
                    descricao: gerarDescricaoItem(item),
                });
            }
        }
        // Agrupa transfers em um único item
        else if (item.tipo === "transfer") {
            if (!acc.find(i => i.tipo === "transfer")) {
                acc.push({
                    tipo: "transfer",
                    titulo: "Transfers Privativos",
                    descricao: gerarDescricaoItem(item),
                });
            }
        }
        // Outros itens aparecem individualmente
        else {
            acc.push({
                tipo: item.tipo,
                titulo: item.titulo,
                descricao: gerarDescricaoItem(item),
            });
        }
        return acc;
    }, [] as Array<{ tipo: string; titulo: string; descricao: string }>);

    // Se não houver itens, adiciona itens padrão baseado no que existe
    if (itensAgrupados.length === 0) {
        if (hasItem(snapshot, "voo")) {
            itensAgrupados.push({ tipo: "voo", titulo: "Voos Ida e Volta", descricao: "Passagens aéreas incluídas" });
        }
        if (hasItem(snapshot, "hotel")) {
            itensAgrupados.push({ tipo: "hotel", titulo: "Hospedagem", descricao: "Hotel selecionado" });
        }
        if (hasItem(snapshot, "transfer")) {
            itensAgrupados.push({ tipo: "transfer", titulo: "Transfers", descricao: "Traslados incluídos" });
        }
    }

    // Adiciona experiências se houver
    if (snapshot.experiencias && snapshot.experiencias.length > 0 && !itensAgrupados.find(i => i.tipo === "experiencia")) {
        itensAgrupados.push({
            tipo: "experiencia",
            titulo: "Experiências Exclusivas",
            descricao: "Aventura, gastronomia e muito charme",
        });
    }

    const handleConfirmarOrcamento = async () => {
        // Registra evento de confirmação
        const slug = cotacaoData.cotacao?.slug;
        if (slug) {
            try {
                const { createClient } = await import("@supabase/supabase-js");
                const supabase = createClient(
                    import.meta.env.VITE_SUPABASE_URL!,
                    import.meta.env.VITE_SUPABASE_ANON_KEY!
                );
                await supabase.from("cotacao_events").insert({
                    slug,
                    type: "confirm_click",
                    screen: 7,
                });
            } catch {
                // falha silenciosa
            }
        }

        alert(`Obrigado pelo interesse, ${clienteNome}! Em breve nossa equipe entrará em contato para finalizar sua viagem dos sonhos! 💚`);
    };

    return (
        <div className="h-full flex flex-col bg-gradient-to-b from-[#09077d] via-[#09077d]/95 to-[#09077d] relative overflow-hidden">
            {/* Status Bar iOS */}
            <div className="absolute top-0 left-0 right-0 h-12 z-50 flex items-center justify-between px-6 pt-2">
                <span className="text-white text-sm drop-shadow-lg">9:41</span>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-3 border border-white rounded-sm" />
                    <div className="w-6 h-3 border border-white rounded-sm" />
                    <div className="w-6 h-3 bg-white rounded-sm" />
                </div>
            </div>

            {/* Conteúdo scrollável */}
            <div data-scrollable="true" className="flex-1 overflow-y-auto px-6 pt-16 pb-32">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#50cfad]/20 mb-4">
                        <Sparkles className="w-8 h-8 text-[#50cfad]" />
                    </div>

                    <h1 className="text-white text-3xl mb-3">
                        Sua Experiência<br />Completa em {destinoNome}
                    </h1>

                    <p className="text-white/70 text-sm leading-relaxed max-w-[280px] mx-auto">
                        {clienteNome}, preparamos cada detalhe desta jornada pensando em você.
                        Uma experiência inesquecível te espera.
                    </p>
                </div>

                {/* Itens incluídos */}
                {itensAgrupados.length > 0 && (
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 mb-6 border border-white/20">
                        <h3 className="text-white text-sm mb-4 opacity-80">
                            O que está incluído:
                        </h3>

                        <div className="space-y-4">
                            {itensAgrupados.map((item, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#50cfad]/20 flex items-center justify-center flex-shrink-0">
                                        {tipoIcons[item.tipo] || tipoIcons.outro}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white text-sm">{item.titulo}</p>
                                        <p className="text-white/60 text-xs mt-0.5">
                                            {item.descricao}
                                        </p>
                                    </div>
                                    <Check className="w-4 h-4 text-[#50cfad] flex-shrink-0 mt-1" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-3 mb-6">
                    <div className="h-px flex-1 bg-white/20" />
                    <Sparkles className="w-4 h-4 text-[#50cfad]" />
                    <div className="h-px flex-1 bg-white/20" />
                </div>

                {/* Valor total */}
                <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/30 shadow-2xl">
                    <p className="text-white/70 text-sm mb-2 text-center">
                        Investimento total para sua experiência:
                    </p>

                    <div className="text-center mb-4">
                        <div className="flex items-start justify-center gap-1">
                            <span className="text-[#50cfad] text-2xl mt-2">R$</span>
                            <span className="text-white text-6xl tracking-tight">{inteiro}</span>
                            <span className="text-white/70 text-2xl mt-2">,{decimal}</span>
                        </div>
                    </div>

                    <div className="bg-[#50cfad]/10 rounded-2xl px-4 py-3 border border-[#50cfad]/30">
                        <p className="text-white/90 text-xs text-center leading-relaxed">
                            💳 <span className="text-[#50cfad]">Parcelamento disponível</span> {parcelamento}
                            {observacoesFinanceiras && ` • ${observacoesFinanceiras}`}
                        </p>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-white/60 text-xs leading-relaxed max-w-[300px] mx-auto">
                        "Uma viagem não se mede em quilômetros, mas em momentos
                        que ficam gravados para sempre no coração." 💚
                    </p>
                </div>
            </div>

            {/* Bottom fixo */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#09077d] via-[#09077d] to-transparent pt-8 pb-8 px-6 z-20">
                <button
                    onClick={handleConfirmarOrcamento}
                    className="w-full bg-[#50cfad] hover:bg-[#50cfad]/90 active:scale-[0.98] text-white py-5 rounded-2xl transition-all duration-200 shadow-xl shadow-[#50cfad]/30 mb-4"
                >
                    <span className="flex items-center justify-center gap-2">
                        <Heart className="w-5 h-5 fill-white" />
                        <span className="text-base">Confirmar Minha Viagem dos Sonhos</span>
                    </span>
                </button>

                <button className="w-full text-white/70 hover:text-white text-sm py-3 transition-colors">
                    Preciso de mais informações
                </button>

                <div className="flex items-center justify-center gap-2 mt-4">
                    <div className="w-2 h-2 rounded-full bg-white/30" />
                    <div className="w-2 h-2 rounded-full bg-white/30" />
                    <div className="w-2 h-2 rounded-full bg-white/30" />
                    <div className="w-2 h-2 rounded-full bg-white/30" />
                    <div className="w-2 h-2 rounded-full bg-white/30" />
                    <div className="w-2 h-2 rounded-full bg-white/30" />
                    <div className="w-2 h-2 rounded-full bg-white/30" />
                    <div className="w-8 h-2 rounded-full bg-[#50cfad]" />
                </div>
            </div>
        </div>
    );
}