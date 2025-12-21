import { ImageWithFallback } from './figma/ImageWithFallback';
import { Plane, Check } from 'lucide-react';
import type { ScreenProps } from '../types/cotacao';
import { getVoo } from '../types/cotacao';

export function VooIda({ cotacaoData, onNext, onPrev }: ScreenProps) {
    const { snapshot } = cotacaoData;

    // Extrai dados do voo de ida
    const voo = getVoo(snapshot, "ida");

    // Se não houver voo, mostra mensagem
    if (!voo) {
        return (
            <div className="h-full flex items-center justify-center bg-white">
                <p className="text-gray-500">Voo de ida não incluído neste pacote</p>
            </div>
        );
    }

    // Dados do voo
    const companhia = voo.companhia || "Companhia Aérea";
    const data = voo.data || "";
    const diaSemana = voo.dia_semana || "";
    const origemCodigo = voo.origem?.codigo || "---";
    const origemCidade = voo.origem?.cidade || "Origem";
    const destinoCodigo = voo.destino?.codigo || "---";
    const destinoCidade = voo.destino?.cidade || "Destino";
    const horarioSaida = voo.horario_saida || "--:--";
    const horarioChegada = voo.horario_chegada || "--:--";
    const duracao = voo.duracao || "--";
    const conexoes = voo.conexoes ?? 0;
    const bagagem = voo.bagagem || "";

    // Formata data para exibição (ex: "02/04 • Quarta")
    const dataFormatada = data ? `${data.split('-').reverse().slice(0, 2).join('/')} • ${diaSemana}` : diaSemana;

    // Texto de conexões
    const conexaoTexto = conexoes === 0 ? "Voo direto, sem escalas" : `${conexoes} conexão(ões)`;

    return (
        <div className="h-full flex flex-col bg-white relative overflow-hidden">
            {/* Status Bar iOS */}
            <div className="absolute top-0 left-0 right-0 h-12 z-50 flex items-center justify-between px-6 pt-2">
                <span className="text-white text-sm drop-shadow-lg">9:41</span>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-3 border border-white rounded-sm" />
                    <div className="w-6 h-3 border border-white rounded-sm" />
                    <div className="w-6 h-3 bg-white rounded-sm" />
                </div>
            </div>

            {/* Hero Visual */}
            <div className="relative h-[45%] flex-shrink-0">
                <ImageWithFallback
                    src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80"
                    alt="Vista aérea ao amanhecer"
                    className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-white" />

                <div className="absolute top-24 left-0 right-0 flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                        <Plane className="w-8 h-8 text-white" />
                    </div>
                </div>
            </div>

            {/* Conteúdo scrollável */}
            <div data-scrollable="true" className="flex-1 overflow-y-auto -mt-6 relative z-10">
                <div className="bg-white rounded-t-3xl px-6 pt-8 pb-32">
                    <h1 className="text-[#09077d] text-3xl mb-3 leading-tight">
                        Sua aventura começa<br />
                        {diaSemana ? `na ${diaSemana.toLowerCase()}` : "em breve"}
                    </h1>

                    <div className="space-y-5 mb-8 text-gray-700 leading-relaxed">
                        <p>
                            {diaSemana && (
                                <>
                                    Na <span className="text-[#09077d] font-medium">{diaSemana}, {data}</span>,
                                </>
                            )}{' '}
                            você decola às <span className="text-[#09077d] font-medium">{horarioSaida}</span> de{' '}
                            {origemCidade}.
                        </p>

                        <p>
                            Após <span className="text-[#09077d] font-medium">{duracao} de voo</span>,
                            você pousa em {destinoCidade} às <span className="text-[#09077d] font-medium">{horarioChegada}</span>,
                            pronto(a) para começar sua jornada.
                        </p>

                        {bagagem && (
                            <p className="text-sm text-gray-600 italic">
                                Bagagem: {bagagem}
                            </p>
                        )}
                    </div>

                    <div className="inline-flex items-center gap-2 bg-[#50cfad]/10 border border-[#50cfad]/30 rounded-full px-4 py-2.5 mb-8">
                        <Check className="w-4 h-4 text-[#50cfad]" />
                        <span className="text-sm text-[#09077d]">{conexaoTexto}</span>
                    </div>

                    <div className="h-px bg-gray-200 mb-6" />

                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Companhia</p>
                                <p className="text-[#09077d] font-medium">{companhia}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 mb-1">Data</p>
                                <p className="text-[#09077d] font-medium">{dataFormatada}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <div className="text-center">
                                <p className="text-2xl text-[#09077d] font-medium mb-1">{horarioSaida}</p>
                                <p className="text-xs text-gray-500">{origemCodigo}</p>
                                <p className="text-xs text-gray-600">{origemCidade}</p>
                            </div>

                            <div className="flex-1 flex items-center justify-center px-4">
                                <div className="flex-1 h-px bg-gradient-to-r from-[#09077d] to-[#50cfad]" />
                                <Plane className="w-5 h-5 text-[#50cfad] mx-2 rotate-90" />
                                <div className="flex-1 h-px bg-gradient-to-r from-[#50cfad] to-[#09077d]" />
                            </div>

                            <div className="text-center">
                                <p className="text-2xl text-[#09077d] font-medium mb-1">{horarioChegada}</p>
                                <p className="text-xs text-gray-500">{destinoCodigo}</p>
                                <p className="text-xs text-gray-600">{destinoCidade}</p>
                            </div>
                        </div>

                        <div className="text-center pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-500">Duração do voo</p>
                            <p className="text-sm text-[#09077d] font-medium">{duracao}</p>
                        </div>
                    </div>

                    <div className="h-8" />
                </div>
            </div>

            {/* Bottom fixo */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-8 pb-8 px-6 z-20">
                <div className="flex flex-col items-center gap-3">
                    <svg
                        className="w-8 h-8 text-[#50cfad] animate-bounce"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg>

                    <p className="text-[#09077d] text-sm text-center">
                        Deslize para ver como você vai do aeroporto ao hotel
                    </p>
                </div>

                <div className="flex items-center justify-center gap-2 mt-4">
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-[#50cfad]" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                </div>
            </div>
        </div>
    );
}