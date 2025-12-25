/**
 * TRANSFER DETAILS - Detalhes completos do Transfer
 * 
 * Exibe informações detalhadas:
 * - Rota (de/para)
 * - Data e horário
 * - Veículo
 * - Passageiros e bagagem
 * - Informações importantes
 */

import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight, Users, Luggage, Briefcase, Check, ArrowLeft, X, AlertCircle } from 'lucide-react';
import type { TransferInfo } from '../../../types/extractedQuoteData';

interface TransferDetailsProps {
    type: 'outbound' | 'return';
    transfer: TransferInfo;
    onBack: () => void;
}

// Imagens padrão para transfers
const TRANSFER_IMAGES = {
    outbound: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/0b/f3/67/a6.jpg',
    return: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/07/38/2c/62.jpg'
};

// Informações padrão quando transfer incluído
const DEFAULT_INFO = [
    'O motorista estará com uma placa personalizada',
    'Transfer compartilhado em mini van climatizada',
    'Água mineral cortesia durante o trajeto'
];

// Informações quando não incluído
const NOT_INCLUDED_INFO = [
    'Você pode contratar transfer privativo separadamente',
    'Táxis disponíveis na saída do aeroporto',
    'Aplicativos de transporte funcionam na região'
];

export function TransferDetails({
    type,
    transfer,
    onBack,
}: TransferDetailsProps) {
    const title = type === 'outbound' ? 'Transfer - Ida' : 'Transfer - Volta';
    const imageUrl = TRANSFER_IMAGES[type];

    return (
        <div className="relative h-screen overflow-hidden">
            {/* Full Screen Image with overlay */}
            <ImageWithFallback
                src={imageUrl}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />

            {/* Content overlaid on image */}
            <div className="relative h-full flex flex-col justify-between p-6 text-white">
                {/* Top Section - Back Button */}
                <div className="pt-12">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-white hover:text-[#50cfad] transition-colors"
                        style={{ textShadow: '0 2px 16px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.8)' }}
                    >
                        <ArrowLeft className="w-5 h-5" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.9))' }} />
                        <span>Voltar</span>
                    </button>
                </div>

                {/* Bottom Section - Card Details */}
                <div className="space-y-6 pb-24">
                    {/* Route Title */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <h2
                                className="text-white text-xl font-medium"
                                style={{ textShadow: '0 2px 16px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.8)' }}
                            >
                                {title}
                            </h2>
                            {!transfer.included && (
                                <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full">
                                    Não incluído
                                </span>
                            )}
                        </div>

                        {transfer.from && transfer.to && (
                            <div
                                className="flex items-center gap-2 text-[#50cfad]"
                                style={{ textShadow: '0 2px 16px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.8)' }}
                            >
                                <span>{transfer.from}</span>
                                <ArrowRight className="w-4 h-4" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.9))' }} />
                                <span>{transfer.to}</span>
                            </div>
                        )}
                    </div>

                    {/* Details Card - Só mostra se incluído */}
                    {transfer.included ? (
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-2xl">
                            <div className="space-y-4">
                                {/* Data e horário */}
                                {(transfer.date || transfer.time) && (
                                    <>
                                        <div className="flex items-center justify-between">
                                            <span className="text-white/80">Data e horário</span>
                                            <span className="text-white">
                                                {transfer.date}{transfer.time && ` • ${transfer.time}`}
                                            </span>
                                        </div>
                                        <div className="h-px bg-white/10" />
                                    </>
                                )}

                                {/* Veículo */}
                                {transfer.vehicle && (
                                    <>
                                        <div className="flex items-center justify-between">
                                            <span className="text-white/80">Veículo</span>
                                            <span className="text-white">{transfer.vehicle}</span>
                                        </div>
                                        <div className="h-px bg-white/10" />
                                    </>
                                )}

                                {/* Passageiros */}
                                {transfer.passengers && (
                                    <>
                                        <div className="flex items-center justify-between">
                                            <span className="text-white/80">Passageiros</span>
                                            <div className="flex items-center gap-2 text-white">
                                                <Users className="w-4 h-4" />
                                                <span>{transfer.passengers}</span>
                                            </div>
                                        </div>
                                        <div className="h-px bg-white/10" />
                                    </>
                                )}

                                {/* Bagagem */}
                                {(transfer.luggage || transfer.handLuggage) && (
                                    <>
                                        <div className="flex items-center justify-between">
                                            <span className="text-white/80">Bagagem</span>
                                            <div className="flex items-center gap-4 text-white">
                                                {transfer.luggage && (
                                                    <div className="flex items-center gap-2">
                                                        <Luggage className="w-4 h-4" />
                                                        <span>{transfer.luggage}</span>
                                                    </div>
                                                )}
                                                {transfer.handLuggage && (
                                                    <div className="flex items-center gap-2">
                                                        <Briefcase className="w-4 h-4" />
                                                        <span>{transfer.handLuggage}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="h-px bg-white/10" />
                                    </>
                                )}

                                {/* Cancelamento grátis */}
                                {transfer.freeCancellation && (
                                    <div className="flex items-center gap-2 text-[#50cfad]">
                                        <Check className="w-5 h-5" />
                                        <span>Cancelamento grátis</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Card quando NÃO incluído */
                        <div className="bg-red-500/10 backdrop-blur-md rounded-2xl p-5 border border-red-500/20 shadow-2xl">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="text-white font-medium mb-2">Transfer não incluído</h3>
                                    <p className="text-white/80 text-sm">
                                        Este pacote não inclui transfer. Você precisará providenciar seu próprio transporte do aeroporto até o hotel e vice-versa.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Informações Adicionais */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-2xl">
                        <h3 className="text-white font-medium mb-3">
                            {transfer.included ? 'Informações importantes' : 'Alternativas de transporte'}
                        </h3>
                        <ul className="space-y-2 text-white/90 text-sm">
                            {(transfer.included ? (transfer.details || DEFAULT_INFO) : NOT_INCLUDED_INFO).map((info, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-[#50cfad] mt-0.5 flex-shrink-0" />
                                    <span>{info}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}