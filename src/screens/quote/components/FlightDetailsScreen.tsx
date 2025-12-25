/**
 * FLIGHT DETAILS SCREEN - DETALHES DO VOO DE IDA
 * 
 * Exibe todos os segmentos do voo com:
 * - Informações da companhia aérea
 * - Bagagem por trecho
 * - Tempo de conexão
 * - Resumo da viagem
 */

import { ArrowLeft, Plane, Clock, ChevronDown, Briefcase, Check, X, ArrowRight, Backpack } from 'lucide-react';
import { useState } from 'react';
import type { FlightLeg, BaggageInfo } from '../../../types/extractedQuoteData';

interface FlightDetailsScreenProps {
    flight: FlightLeg;
    baggage: BaggageInfo;
    origin: string;
    destination: string;
    onBack: () => void;
    onViewReturn: () => void;
}

export function FlightDetailsScreen({
    flight,
    baggage,
    origin,
    destination,
    onBack,
    onViewReturn
}: FlightDetailsScreenProps) {
    const [expandedFlight, setExpandedFlight] = useState<number | null>(null);

    // Calcular distância aproximada (pode ser melhorado)
    const estimatedDistance = "~4.200 km";

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-[#09077D] px-4 pt-16 pb-8">
                <button onClick={onBack} className="mb-6 flex items-center gap-2 text-white">
                    <ArrowLeft className="w-6 h-6" />
                    <span>Voltar</span>
                </button>

                <h1 className="text-white text-2xl mb-2">Detalhes do voo</h1>
                <p className="text-white/80">{origin} → {destination}</p>
            </div>

            <div className="px-4 -mt-4 pb-24">
                {flight.segments.map((segment, index) => (
                    <div key={index}>
                        {/* Flight Segment Card */}
                        <div className="bg-white rounded-2xl p-5 mb-3 shadow-sm">
                            {/* Airline Header */}
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#09077D] rounded-lg flex items-center justify-center">
                                        <span className="text-white text-xs font-medium">
                                            {segment.airlineCode || segment.airline?.substring(0, 2).toUpperCase() || 'XX'}
                                        </span>
                                    </div>
                                    <span className="text-gray-900">{segment.airline}</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">Voo Nº {segment.flightNumber}</p>
                                    {segment.aircraft && (
                                        <p className="text-xs text-gray-500">{segment.aircraft}</p>
                                    )}
                                    <p className="text-xs text-gray-500">Classe: {segment.class || 'Econômica'}</p>
                                </div>
                            </div>

                            {/* Baggage Info */}
                            <div className="mb-5 flex items-center justify-center gap-6 py-3">
                                {/* Item pessoal */}
                                <div className="flex items-center gap-2">
                                    <Backpack className={`w-4 h-4 ${baggage.personalItem.included ? 'text-[#50cfad]' : 'text-gray-300'}`} />
                                    <span className="text-sm text-gray-700">1 item</span>
                                    {baggage.personalItem.included ? (
                                        <Check className="w-4 h-4 text-[#50cfad]" />
                                    ) : (
                                        <X className="w-4 h-4 text-gray-400" />
                                    )}
                                </div>
                                <div className="w-px h-6 bg-gray-200"></div>

                                {/* Mala de mão */}
                                <div className="flex items-center gap-2">
                                    <Briefcase className={`w-5 h-5 ${baggage.carryOn.included ? 'text-[#50cfad]' : 'text-gray-300'}`} />
                                    <span className="text-sm text-gray-700">{baggage.carryOn.weight || '10kg'}</span>
                                    {baggage.carryOn.included ? (
                                        <Check className="w-4 h-4 text-[#50cfad]" />
                                    ) : (
                                        <X className="w-4 h-4 text-gray-400" />
                                    )}
                                </div>
                                <div className="w-px h-6 bg-gray-200"></div>

                                {/* Mala despachada */}
                                <div className="flex items-center gap-2">
                                    <Briefcase className={`w-6 h-6 ${baggage.checked.included ? 'text-[#50cfad]' : 'text-gray-300'}`} />
                                    <span className={`text-sm ${baggage.checked.included ? 'text-gray-700' : 'text-gray-400'}`}>
                                        {baggage.checked.weight || '23kg'}
                                    </span>
                                    {baggage.checked.included ? (
                                        <Check className="w-4 h-4 text-[#50cfad]" />
                                    ) : (
                                        <X className="w-4 h-4 text-gray-400" />
                                    )}
                                </div>
                            </div>

                            {/* Flight Times */}
                            <div className="flex items-start justify-between mb-5">
                                {/* Departure */}
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 mb-1">{segment.date}</p>
                                    <p className="text-3xl text-gray-900 mb-3">{segment.departureTime}</p>
                                    <p className="text-[#50cfad] font-medium mb-1">{segment.departureAirport}</p>
                                    <p className="text-sm text-gray-600 mb-0.5">{segment.departureCity}</p>
                                    {segment.departureAirportName && (
                                        <p className="text-xs text-gray-500">{segment.departureAirportName}</p>
                                    )}
                                </div>

                                {/* Duration */}
                                <div className="flex flex-col items-center mx-4 pt-8">
                                    <p className="text-xs text-gray-500 mb-2">Duração</p>
                                    <p className="text-sm text-gray-900 mb-2">{segment.duration}</p>
                                    <div className="text-xs text-gray-400 text-center">Horários em hora local</div>
                                </div>

                                {/* Arrival */}
                                <div className="flex-1 text-right">
                                    <p className="text-xs text-gray-500 mb-1">{segment.date}</p>
                                    <p className="text-3xl text-gray-900 mb-3">{segment.arrivalTime}</p>
                                    <p className="text-[#50cfad] font-medium mb-1">{segment.arrivalAirport}</p>
                                    <p className="text-sm text-gray-600 mb-0.5">{segment.arrivalCity}</p>
                                    {segment.arrivalAirportName && (
                                        <p className="text-xs text-gray-500">{segment.arrivalAirportName}</p>
                                    )}
                                </div>
                            </div>

                            {/* More Details Button */}
                            <button
                                onClick={() => setExpandedFlight(expandedFlight === index ? null : index)}
                                className="w-full flex items-center justify-center gap-2 text-[#09077D] py-2 border-t border-gray-100"
                            >
                                <span className="text-sm">Mais detalhes</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${expandedFlight === index ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Expanded Details */}
                            {expandedFlight === index && (
                                <div className="pt-4 mt-4 border-t border-gray-100 space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Companhia</span>
                                        <span className="text-sm text-gray-900">{segment.airline}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Número do voo</span>
                                        <span className="text-sm text-gray-900">{segment.flightNumber}</span>
                                    </div>
                                    {segment.aircraft && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">Aeronave</span>
                                            <span className="text-sm text-gray-900">{segment.aircraft}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Classe</span>
                                        <span className="text-sm text-gray-900">{segment.class || 'Econômica'}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Connection Wait Time - show between segments */}
                        {index < flight.segments.length - 1 && (
                            <div className="bg-gray-100 rounded-xl py-4 px-5 mb-3 flex items-center justify-center gap-2">
                                <Clock className="w-4 h-4 text-gray-600" />
                                <span className="text-sm text-gray-700">
                                    Espera de <strong>{flight.connectionTime || 'N/A'}</strong> em {segment.arrivalCity}
                                </span>
                            </div>
                        )}
                    </div>
                ))}

                {/* Summary Card */}
                <div className="bg-[#50cfad]/10 rounded-2xl p-5 mt-6">
                    <h3 className="text-[#09077D] font-medium mb-3">Resumo da viagem</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Duração total</span>
                            <span className="text-sm text-gray-900">{flight.totalDuration}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Escalas</span>
                            <span className="text-sm text-gray-900">
                                {flight.stops === 0 ? 'Voo direto' : `${flight.stops} conexão${flight.stops > 1 ? 'ões' : ''}`}
                                {flight.connectionCity && ` (${flight.connectionCity})`}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Distância</span>
                            <span className="text-sm text-gray-900">{estimatedDistance}</span>
                        </div>
                    </div>
                </div>

                {/* View Return Flight Button */}
                <button
                    onClick={onViewReturn}
                    className="w-full bg-[#50cfad] text-[#09077D] py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg mt-4 font-medium"
                >
                    Ver voo de volta
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}