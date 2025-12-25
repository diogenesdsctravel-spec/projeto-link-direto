/**
 * TRIP DETAILS CONTENT - VOO DE IDA (Overview)
 * 
 * Exibe resumo do voo de ida com dados dinâmicos extraídos do PDF
 */

import { Plane, MapPin, Calendar, Briefcase, Backpack } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { FlightLeg, BaggageInfo } from '../../../types/extractedQuoteData';

interface TripDetailsContentProps {
    destination: string;
    flight: FlightLeg;
    baggage: BaggageInfo;
    travelDate: string;
    onViewDetails: () => void;
}

export function TripDetailsContent({
    destination,
    flight,
    baggage,
    travelDate,
    onViewDetails
}: TripDetailsContentProps) {
    // Pegar primeiro e último segmento para mostrar origem → destino
    const firstSegment = flight.segments[0];
    const lastSegment = flight.segments[flight.segments.length - 1];

    if (!firstSegment) {
        return (
            <div className="relative min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Dados do voo não disponíveis</p>
            </div>
        );
    }

    // Formatar data curta (ex: "12 fev")
    const formatShortDate = (dateStr: string) => {
        const match = dateStr.match(/(\d{1,2})\s*\.?\s*(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)/i);
        if (match) {
            return `${match[1]} ${match[2]}`;
        }
        return dateStr;
    };

    // Determinar tipo de voo
    const flightType = flight.stops === 0 ? 'Voo direto' : `${flight.stops} conexão`;

    return (
        <div className="relative min-h-screen">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
                <ImageWithFallback
                    src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80"
                    alt="Airplane"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#09077D]"></div>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 min-h-screen flex flex-col justify-end pt-20 pb-24">
                {/* Bottom Content */}
                <div className="px-4">
                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                            <MapPin className="w-4 h-4 text-[#50cfad]" />
                            <span className="text-white text-sm">Voo incluído</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                            <Calendar className="w-4 h-4 text-[#50cfad]" />
                            <span className="text-white text-sm">{formatShortDate(travelDate)}</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl text-white mb-3 leading-tight">
                        Sua aventura começa em {destination}
                    </h1>

                    {/* Description */}
                    <p className="text-white/90 text-lg mb-6">
                        {flightType} de {firstSegment.departureCity} às {firstSegment.departureTime}, chegada às {lastSegment.arrivalTime}
                    </p>

                    {/* Flight Card - Compact */}
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 mb-4">
                        <div className="flex items-center justify-between mb-5">
                            {/* Departure */}
                            <div>
                                <p className="text-4xl text-[#09077D] mb-1">{firstSegment.departureTime}</p>
                                <p className="text-[#50cfad] font-medium">{firstSegment.departureAirport}</p>
                                <p className="text-sm text-gray-600">{firstSegment.departureCity}</p>
                            </div>

                            {/* Duration */}
                            <div className="flex-1 flex flex-col items-center mx-3">
                                <p className="text-sm text-gray-500 mb-2">{flight.totalDuration}</p>
                                <div className="w-full flex items-center">
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                    <Plane className="w-5 h-5 text-[#50cfad] mx-2 rotate-90" />
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">{firstSegment.airline}</p>
                            </div>

                            {/* Arrival */}
                            <div className="text-right">
                                <p className="text-4xl text-[#09077D] mb-1">{lastSegment.arrivalTime}</p>
                                <p className="text-[#50cfad] font-medium">{lastSegment.arrivalAirport}</p>
                                <p className="text-sm text-gray-600">{lastSegment.arrivalCity}</p>
                            </div>
                        </div>

                        {/* Baggage Icons */}
                        <div className="flex items-center justify-center gap-4 pt-3 border-t border-gray-200">
                            {/* Item pessoal */}
                            <div className="flex items-center gap-1.5">
                                <Backpack className={`w-4 h-4 ${baggage.personalItem.included ? 'text-[#50cfad]' : 'text-gray-300'}`} />
                                <span className={`text-xs ${baggage.personalItem.included ? 'text-gray-600' : 'text-gray-400'}`}>
                                    1 item
                                </span>
                            </div>

                            {/* Mala de mão */}
                            <div className="flex items-center gap-1.5">
                                <Briefcase className={`w-5 h-5 ${baggage.carryOn.included ? 'text-[#50cfad]' : 'text-gray-300'}`} />
                                <span className={`text-xs ${baggage.carryOn.included ? 'text-gray-600' : 'text-gray-400'}`}>
                                    {baggage.carryOn.weight || '10kg'}
                                </span>
                            </div>

                            {/* Mala despachada */}
                            <div className="flex items-center gap-1.5">
                                <Briefcase className={`w-6 h-6 ${baggage.checked.included ? 'text-[#50cfad]' : 'text-gray-300'}`} />
                                <span className={`text-xs ${baggage.checked.included ? 'text-gray-600' : 'text-gray-400'}`}>
                                    {baggage.checked.weight || '23kg'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={onViewDetails}
                        className="w-full bg-[#50cfad] text-[#09077D] py-4 rounded-2xl text-lg flex items-center justify-center gap-2 shadow-lg font-medium"
                    >
                        Ver detalhes do voo
                        <span className="text-xl">→</span>
                    </button>
                </div>
            </div>
        </div>
    );
}