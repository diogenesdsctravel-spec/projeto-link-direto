/**
 * TRANSFER CARD - Overview do Transfer
 * 
 * Exibe card do transfer com storytelling
 * Mostra se está incluído ou não no pacote
 */

import { ImageWithFallback } from './figma/ImageWithFallback';
import { MapPin, Check, X } from 'lucide-react';
import type { TransferInfo } from '../../../types/extractedQuoteData';

interface TransferCardProps {
    type: 'outbound' | 'return';
    transfer: TransferInfo;
    destination: string;
    onViewDetails: () => void;
}

// Imagens padrão para transfers
const TRANSFER_IMAGES = {
    outbound: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/0b/f3/67/a6.jpg',
    return: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/07/38/2c/62.jpg'
};

// Storytelling padrão baseado no tipo
const getStorytelling = (type: 'outbound' | 'return', destination: string, included: boolean) => {
    if (type === 'outbound') {
        if (included) {
            return `Ao chegar em ${destination}, um de nossos parceiros estará te esperando no aeroporto com uma placa personalizada. O transfer compartilhado em mini van é confortável, climatizado e perfeito para começar sua viagem com tranquilidade.`;
        } else {
            return `O transfer do aeroporto até seu hotel em ${destination} não está incluído neste pacote. Você pode contratar separadamente ou utilizar táxi/transporte por aplicativo.`;
        }
    } else {
        if (included) {
            return `No dia da sua partida, o transfer estará esperando no hotel para levá-lo ao aeroporto com toda comodidade. Aproveite os últimos momentos em ${destination} sem preocupações.`;
        } else {
            return `O transfer do hotel até o aeroporto não está incluído neste pacote. Recomendamos reservar com antecedência para garantir pontualidade no voo.`;
        }
    }
};

export function TransferCard({
    type,
    transfer,
    destination,
    onViewDetails,
}: TransferCardProps) {
    const title = type === 'outbound' ? 'Seu Transfer' : 'Transfer de Volta';
    const imageUrl = TRANSFER_IMAGES[type];
    const storytelling = getStorytelling(type, destination, transfer.included);

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
                {/* Top Section - Main Title */}
                <div className="pt-12">
                    <div className="flex items-center gap-3 mb-2">
                        <h1
                            className="text-white text-2xl font-medium"
                            style={{ textShadow: '0 2px 16px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.8)' }}
                        >
                            {title}
                        </h1>
                        {/* Badge de status */}
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${transfer.included
                                ? 'bg-[#50cfad]/20 backdrop-blur-sm'
                                : 'bg-red-500/20 backdrop-blur-sm'
                            }`}>
                            {transfer.included ? (
                                <>
                                    <Check className="w-4 h-4 text-[#50cfad]" />
                                    <span className="text-[#50cfad] text-sm">Incluído</span>
                                </>
                            ) : (
                                <>
                                    <X className="w-4 h-4 text-red-400" />
                                    <span className="text-red-400 text-sm">Não incluído</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Rota */}
                    {transfer.from && transfer.to && (
                        <div
                            className="flex items-center gap-2 text-[#50cfad]"
                            style={{ textShadow: '0 2px 16px rgba(0,0,0,0.9)' }}
                        >
                            <MapPin className="w-4 h-4" />
                            <span>{transfer.from}</span>
                            <span>→</span>
                            <span>{transfer.to}</span>
                        </div>
                    )}
                </div>

                {/* Bottom Section - Card Details */}
                <div className="space-y-6 pb-24">
                    {/* Storytelling */}
                    <p
                        className="text-white leading-relaxed text-lg"
                        style={{ textShadow: '0 2px 16px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.8)' }}
                    >
                        {storytelling}
                    </p>

                    {/* Horário se incluído e disponível */}
                    {transfer.included && transfer.time && (
                        <div
                            className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-white/80">Horário previsto</span>
                                <span className="text-white font-medium">{transfer.date} • {transfer.time}</span>
                            </div>
                        </div>
                    )}

                    {/* View Details Button */}
                    <button
                        onClick={onViewDetails}
                        className="w-full bg-[#50cfad] hover:bg-[#50cfad]/90 text-[#09077D] py-4 px-4 rounded-xl transition-colors shadow-lg font-medium"
                    >
                        {transfer.included ? 'Ver detalhes do transfer' : 'Ver opções de transfer'}
                    </button>
                </div>
            </div>
        </div>
    );
}