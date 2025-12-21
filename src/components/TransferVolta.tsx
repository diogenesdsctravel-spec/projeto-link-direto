import { ImageWithFallback } from './figma/ImageWithFallback';
import { Car, Check, MapPin } from 'lucide-react';
import type { ScreenProps } from '../types/cotacao';
import { getTransfer } from '../types/cotacao';

export function TransferVolta({ cotacaoData, onNext, onPrev }: ScreenProps) {
    const { snapshot } = cotacaoData;

    // Extrai dados do transfer de volta
    const transfer = getTransfer(snapshot, "volta");

    // Se não houver transfer, mostra mensagem
    if (!transfer) {
        return (
            <div className="h-full flex items-center justify-center bg-white">
                <p className="text-gray-500">Transfer de volta não incluído neste pacote</p>
            </div>
        );
    }

    // Dados do transfer
    const tipo = transfer.tipo || "Transfer privativo";
    const origemNome = transfer.origem?.nome || "Origem";
    const origemCidade = transfer.origem?.cidade || "";
    const destinoNome = transfer.destino?.nome || "Destino";
    const destinoCidade = transfer.destino?.cidade || "";
    const duracao = transfer.duracao || "--";
    const distancia = transfer.distancia || "";
    const observacoes = transfer.observacoes || "";

    // Dados do destino (para textos)
    const destinoViagem = snapshot.meta?.destino_nome || origemCidade || "seu destino";

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
                    src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80"
                    alt="Transfer de volta"
                    className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-white" />

                <div className="absolute top-24 left-0 right-0 flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                        <Car className="w-8 h-8 text-white" />
                    </div>
                </div>
            </div>

            {/* Conteúdo scrollável */}
            <div data-scrollable="true" className="flex-1 overflow-y-auto -mt-6 relative z-10">
                <div className="bg-white rounded-t-3xl px-6 pt-8 pb-32">
                    <h1 className="text-[#09077d] text-3xl mb-3 leading-tight">
                        Levando {destinoViagem}<br />
                        no coração
                    </h1>

                    <div className="space-y-5 mb-8 text-gray-700 leading-relaxed">
                        <p>
                            Após dias transformadores,{' '}
                            <span className="text-[#09077d] font-medium">nosso parceiro te busca</span>{' '}
                            para uma jornada de <span className="text-[#09077d] font-medium">{duracao}</span> de volta.
                        </p>

                        <p>
                            Você contempla pela última vez as{' '}
                            <span className="text-[#09077d] font-medium">paisagens e memórias</span>{' '}
                            — mas agora leva tudo isso dentro de você.
                        </p>

                        <p>
                            O retorno é tranquilo, com tempo para processar as memórias criadas
                            e planejar o próximo encontro.
                        </p>

                        {observacoes && (
                            <p className="text-sm text-gray-600 italic">
                                {observacoes}
                            </p>
                        )}
                    </div>

                    <div className="inline-flex items-center gap-2 bg-[#50cfad]/10 border border-[#50cfad]/30 rounded-full px-4 py-2.5 mb-8">
                        <Check className="w-4 h-4 text-[#50cfad]" />
                        <span className="text-sm text-[#09077d]">Transfer privativo incluído</span>
                    </div>

                    <div className="h-px bg-gray-200 mb-6" />

                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Tipo de transporte</p>
                                <p className="text-[#09077d] font-medium">{tipo}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 mb-1">Conforto</p>
                                <p className="text-[#09077d] font-medium">Premium • AC</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <div className="text-center flex-1">
                                <div className="flex items-center justify-center mb-2">
                                    <MapPin className="w-4 h-4 text-[#09077d]" />
                                </div>
                                <p className="text-xs text-gray-500 mb-1">Origem</p>
                                <p className="text-sm text-[#09077d] font-medium">{origemNome}</p>
                                {origemCidade && <p className="text-xs text-gray-600">{origemCidade}</p>}
                            </div>

                            <div className="flex-1 flex flex-col items-center justify-center px-4">
                                <div className="w-full relative h-12 flex items-center">
                                    <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
                                        <path
                                            d="M 0,20 Q 25,5 50,20 T 100,20"
                                            stroke="url(#gradient-transfer-volta)"
                                            strokeWidth="2"
                                            fill="none"
                                            className="drop-shadow-sm"
                                        />
                                        <defs>
                                            <linearGradient id="gradient-transfer-volta" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#50cfad" />
                                                <stop offset="100%" stopColor="#09077d" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <Car className="w-5 h-5 text-[#09077d] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{duracao} de viagem</p>
                            </div>

                            <div className="text-center flex-1">
                                <div className="flex items-center justify-center mb-2">
                                    <div className="w-3 h-3 rounded-full bg-[#50cfad]" />
                                </div>
                                <p className="text-xs text-gray-500 mb-1">Destino</p>
                                <p className="text-sm text-[#09077d] font-medium">{destinoNome}</p>
                                {destinoCidade && <p className="text-xs text-gray-600">{destinoCidade}</p>}
                            </div>
                        </div>

                        {distancia && (
                            <div className="text-center pt-3 border-t border-gray-200">
                                <p className="text-xs text-gray-500">Distância aproximada</p>
                                <p className="text-sm text-[#09077d] font-medium">{distancia}</p>
                            </div>
                        )}
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
                        Deslize para ver seu voo de volta
                    </p>
                </div>

                <div className="flex items-center justify-center gap-2 mt-4">
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-[#50cfad]" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                </div>
            </div>
        </div>
    );
}