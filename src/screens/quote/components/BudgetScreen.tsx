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

import { ArrowLeft, Users, Calendar, Palmtree, Check } from 'lucide-react'
import styles from './BudgetScreen.module.css'
import type { ExtractedQuoteData, IncludedItem } from '../../../types/extractedQuoteData'

interface BudgetScreenProps {
    data: ExtractedQuoteData
    clientName: string
    onBack: () => void
    onConfirm?: () => void
}

export default function BudgetScreen({
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
    } = data

    // Formatar período da viagem
    const formatPeriod = () => {
        const travelDate = data.travelDate || ''
        const returnDate = data.returnDate || ''

        // Extrair dia e mês
        const extractDate = (dateStr: string) => {
            const match = dateStr.match(/(\d{1,2})\s*(?:de\s*)?(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)/i)
            if (match) {
                return `${match[1]} de ${match[2]}`
            }
            return dateStr
        }

        // Extrair ano
        const yearMatch = returnDate.match(/(\d{4})/)
        const year = yearMatch ? yearMatch[1] : new Date().getFullYear()

        return `${extractDate(travelDate)} a ${extractDate(returnDate)}, ${year}`
    }

    // Itens inclusos padrão se não extraídos
    const defaultIncludedItems: IncludedItem[] = [
        { name: 'Voos de ida e volta', included: true },
        { name: `${totalNights} noites de hotel`, included: true },
        { name: hotel?.mealPlan || 'Café da manhã', included: true },
        { name: 'Transfers', included: data.transfers?.outbound?.included || false },
        { name: 'Taxas de embarque', included: true }
    ]

    const displayIncludedItems = includedItems.length > 0 ? includedItems : defaultIncludedItems

    // Nome do passageiro principal
    const mainPassengerName = passengerNames?.[0] || clientName || 'Viajante'

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <button onClick={onBack} className={styles.backButton}>
                    <ArrowLeft className={styles.backIcon} />
                    <span>Voltar</span>
                </button>

                <h1 className={styles.headerTitle}>Resumo do pacote</h1>
                <p className={styles.headerSubtitle}>
                    {mainPassengerName}, sua aventura está pronta
                </p>
            </div>

            {/* Content */}
            <div className={styles.content}>
                {/* Trip Summary Card */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Detalhes da viagem</h2>

                    <div className={styles.detailsList}>
                        {/* Passageiros */}
                        <div className={styles.detailItem}>
                            <div className={styles.detailIconWrapper}>
                                <Users className={styles.detailIcon} />
                            </div>
                            <div>
                                <p className={styles.detailText}>{passengers}</p>
                                <p className={styles.detailSubtext}>
                                    {passengerNames?.join(' e ') || `${mainPassengerName} e acompanhante`}
                                </p>
                            </div>
                        </div>

                        {/* Período */}
                        <div className={styles.detailItem}>
                            <div className={styles.detailIconWrapper}>
                                <Calendar className={styles.detailIcon} />
                            </div>
                            <div>
                                <p className={styles.detailText}>{totalNights} noites em {destination}</p>
                                <p className={styles.detailSubtext}>{formatPeriod()}</p>
                            </div>
                        </div>

                        {/* Pacote */}
                        <div className={styles.detailItem}>
                            <div className={styles.detailIconWrapper}>
                                <Palmtree className={styles.detailIcon} />
                            </div>
                            <div>
                                <p className={styles.detailText}>Pacote completo</p>
                                <p className={styles.detailSubtext}>
                                    Voos + Hotel {hotel?.mealPlan ? `+ ${hotel.mealPlan}` : ''}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Package Value Card */}
                <div className={styles.card}>
                    <div className={styles.priceRow}>
                        <div>
                            <p className={styles.priceLabel}>Pacote {destination}</p>
                            <p className={styles.priceDescription}>{totalNights} noites • {passengers}</p>
                        </div>
                        <span className={styles.priceValue}>{totalPrice}</span>
                    </div>
                </div>

                {/* Optional Items - só mostra se houver */}
                {additionalItems.length > 0 && (
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Itens adicionais</h2>

                        {additionalItems.map((item, index) => (
                            <div key={index} className={styles.additionalItem}>
                                <div>
                                    <p className={styles.additionalName}>{item.name}</p>
                                    <p className={styles.additionalDetails}>
                                        {item.quantity}{item.description ? ` • ${item.description}` : ''}
                                    </p>
                                </div>
                                <span className={styles.additionalPrice}>{item.price}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Total Price Card */}
                <div className={styles.totalCard}>
                    <p className={styles.totalLabel}>Valor total</p>
                    <h1 className={styles.totalValue}>
                        {payment?.totalPrice || totalPrice}
                    </h1>

                    {payment?.installments && (
                        <p className={styles.installmentText}>
                            Parcelamos em até {payment.installments.quantity}x {payment.installments.interestFree ? 'sem juros' : ''}
                        </p>
                    )}

                    {/* Payment Options */}
                    {(payment?.installments || payment?.cashDiscount) && (
                        <div className={styles.paymentOptions}>
                            {payment.installments && (
                                <div className={`${styles.paymentRow} ${styles.paymentRowMain}`}>
                                    <span className={styles.paymentLabel}>{payment.installments.quantity}x de</span>
                                    <span className={styles.paymentValue}>{payment.installments.value}</span>
                                </div>
                            )}
                            {payment.cashDiscount && (
                                <div className={`${styles.paymentRow} ${styles.paymentRowSecondary}`}>
                                    <span className={styles.paymentLabel}>
                                        À vista com {payment.cashDiscount.percentage}% desconto
                                    </span>
                                    <span className={styles.paymentValue}>{payment.cashDiscount.finalPrice}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* What's Included */}
                <div className={styles.includedCard}>
                    <h3 className={styles.includedTitle}>O que está incluso no pacote?</h3>
                    <div className={styles.includedGrid}>
                        {displayIncludedItems.filter(item => item.included).map((item, index) => (
                            <div key={index} className={styles.includedItem}>
                                <Check className={styles.includedIcon} />
                                <span className={styles.includedText}>{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Button */}
                <button onClick={onConfirm} className={styles.ctaButton}>
                    Confirmar e pagar
                </button>

                {/* Footer Text */}
                <p className={styles.footerText}>
                    Ao confirmar, você concorda com os termos de serviço e política de cancelamento do DSC TRAVEL
                </p>
            </div>
        </div>
    )
}