/**
 * BUDGET SCREEN - RESUMO DO PACOTE E PAGAMENTO
 * 
 * Exibe:
 * - Detalhes da viagem (passageiros, noites, destino)
 * - Preço do pacote base
 * - Itens adicionais (passeios, seguro)
 * - Valor total com parcelamento
 * - O que está incluso
 */

import { ArrowLeft, Users, Calendar, Palmtree, Check } from 'lucide-react';
import type {
    ExtractedQuoteData,
    AdditionalItem,
    IncludedItem,
    PaymentConditions
} from '../../../types/extractedQuoteData';

interface BudgetScreenProps {
    data: ExtractedQuoteData;
    clientName: string;
    onBack: () => void;
    onConfirm?: () => void;
}

export function BudgetScreen({
    data,
    clientName,
    onBack,
    onConfirm
}: BudgetScreenProps) {
    const {
        destination,
        totalNights,
        passengers,
        passengerNames,
        hotel,
        additionalItems = [],
        includedItems = [],
        payment,
        totalPrice
    } = data;

    // Formatar período da viagem
    const formatPeriod = () => {
        const travelDate = data.travelDate || '';
        const returnDate = data.returnDate || '';

        // Extrair dia e mês
        const extractDate = (dateStr: string) => {
            const match = dateStr.match(/(\d{1,2})\s*\.?\s*(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)/i);
            if (match) {
                return `${match[1]} de ${match[2]}`;
            }
            return dateStr;
        };

        // Extrair ano
        const yearMatch = returnDate.match(/(\d{4})/);
        const year = yearMatch ? yearMatch[1] : new Date().getFullYear();

        return `${extractDate(travelDate)} a ${extractDate(returnDate)}, ${year}`;
    };

    // Calcular total dos adicionais
    const calculateAdditionalsTotal = () => {
        let total = 0;
        additionalItems.forEach(item => {
            if (!item.included) {
                const priceNum = parseFloat(
                    item.price.replace(/[R$\s.]/g, '').replace(',', '.')
                );
                if (!isNaN(priceNum)) {
                    total += priceNum;
                }
            }
        });
        return total;
    };

    // Formatar preço
    const formatPrice = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    // Itens inclusos padrão se não extraídos
    const defaultIncludedItems: IncludedItem[] = [
        { name: 'Voos de ida e volta', included: true },
        { name: `${totalNights} noites de hotel`, included: true },
        { name: hotel?.mealPlan || 'Café da manhã', included: true },
        { name: 'Transfers', included: data.transfers?.outbound?.included || false },
        { name: 'Bagagem inclusa', included: data.outboundBaggage?.checked?.included || false },
        { name: 'Taxas de embarque', included: true }
    ];

    const displayIncludedItems = includedItems.length > 0 ? includedItems : defaultIncludedItems;

    // Nome do passageiro principal
    const mainPassengerName = passengerNames?.[0] || clientName || 'Viajante';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-[#09077D] px-4 pt-16 pb-8">
                <button onClick={onBack} className="mb-6 flex items-center gap-2 text-white">
                    <ArrowLeft className="w-6 h-6" />
                    <span>Voltar</span>
                </button>

                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-white text-2xl">Resumo do pacote</h1>
                    <div className="bg-[#50cfad] px-3 py-1 rounded-full">
                        <span className="text-[#09077D] text-sm font-medium">5/5</span>
                    </div>
                </div>
                <p className="text-white/80">{mainPassengerName}, sua aventura está pronta</p>
            </div>

            <div className="px-4 -mt-4 pb-24">
                {/* Trip Summary Card */}
                <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
                    <h2 className="text-[#09077D] text-lg font-medium mb-4">Detalhes da viagem</h2>

                    <div className="space-y-3">
                        {/* Passageiros */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#50cfad]/10 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-[#50cfad]" />
                            </div>
                            <div>
                                <p className="text-gray-900">{passengers}</p>
                                <p className="text-xs text-gray-500">
                                    {passengerNames?.join(' e ') || `${mainPassengerName} e acompanhante`}
                                </p>
                            </div>
                        </div>

                        {/* Período */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#50cfad]/10 rounded-full flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-[#50cfad]" />
                            </div>
                            <div>
                                <p className="text-gray-900">{totalNights} noites em {destination}</p>
                                <p className="text-xs text-gray-500">{formatPeriod()}</p>
                            </div>
                        </div>

                        {/* Pacote */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#50cfad]/10 rounded-full flex items-center justify-center">
                                <Palmtree className="w-5 h-5 text-[#50cfad]" />
                            </div>
                            <div>
                                <p className="text-gray-900">Pacote completo</p>
                                <p className="text-xs text-gray-500">
                                    Voos + Hotel {hotel?.mealPlan ? `+ ${hotel.mealPlan}` : ''}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Package Value Card */}
                <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
                    <div className="flex items-center justify-between py-3">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">Pacote {destination}</p>
                            <p className="text-gray-900 text-lg">{totalNights} noites • {passengers}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[#09077D] text-2xl font-medium">{totalPrice}</p>
                        </div>
                    </div>
                </div>

                {/* Optional Items - só mostra se houver */}
                {additionalItems.length > 0 && (
                    <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
                        <h2 className="text-[#09077D] text-lg font-medium mb-4">Itens adicionais</h2>

                        <div className="space-y-4">
                            {additionalItems.map((item, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center justify-between ${index < additionalItems.length - 1 ? 'pb-4 border-b border-gray-100' : ''
                                        }`}
                                >
                                    <div className="flex-1">
                                        <p className="text-gray-900 mb-1">{item.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {item.quantity}{item.description ? ` • ${item.description}` : ''}
                                        </p>
                                    </div>
                                    <p className="text-gray-900 ml-4 font-medium">{item.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Total Price Card */}
                <div className="bg-[#09077D] rounded-2xl p-6 mb-4 shadow-lg">
                    <p className="text-white/80 text-center mb-2">Valor total</p>
                    <h1 className="text-white text-5xl text-center font-medium mb-3">
                        {payment?.totalPrice || totalPrice}
                    </h1>

                    {payment?.installments && (
                        <p className="text-white/90 text-center text-sm mb-4">
                            Parcelamos em até {payment.installments.quantity}x {payment.installments.interestFree ? 'sem juros' : ''}
                        </p>
                    )}

                    {/* Payment Options */}
                    {(payment?.installments || payment?.cashDiscount) && (
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-2">
                            {payment.installments && (
                                <div className="flex justify-between text-white text-sm">
                                    <span>{payment.installments.quantity}x de</span>
                                    <span className="font-medium">{payment.installments.value}</span>
                                </div>
                            )}
                            {payment.cashDiscount && (
                                <div className="flex justify-between text-white/70 text-xs">
                                    <span>À vista com {payment.cashDiscount.percentage}% desconto</span>
                                    <span>{payment.cashDiscount.finalPrice}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* What's Included */}
                <div className="bg-[#50cfad]/10 rounded-2xl p-5 mb-4">
                    <h3 className="text-[#09077D] font-medium mb-3">O que está incluso no pacote?</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {displayIncludedItems.filter(item => item.included).map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-[#50cfad]" />
                                <span className="text-sm text-gray-700">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Button */}
                <button
                    onClick={onConfirm}
                    className="w-full bg-[#50cfad] text-[#09077D] py-4 rounded-2xl text-lg shadow-lg mb-4 font-medium"
                >
                    Confirmar e pagar
                </button>

                {/* Info */}
                <p className="text-xs text-gray-500 text-center px-4">
                    Ao confirmar, você concorda com os termos de serviço e política de cancelamento do DSC TRAVEL
                </p>
            </div>
        </div>
    );
}