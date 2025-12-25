/* ScreenView.tsx */

import styles from "./ScreenView.module.css"
import shared from "./shared.module.css"
import type { ScreenTemplate } from "../../../types/destinationTemplate"
import IncludedBadge from "../../../components/IncludedBadge"
import HotelCarousel from "../../../components/HotelCarousel"

interface ScreenViewProps {
    screen: ScreenTemplate
    index: number
    total: number
    isActive: boolean
}

export default function ScreenView({ screen, index, total, isActive }: ScreenViewProps) {
    const isHero = screen.type === "hero"
    const isHotel = screen.type === "hotel"
    const isExperiences = screen.type === "experiences"
    const isFlight = screen.type === "flight"
    const isSummary = screen.type === "summary"

    function scrollToNext() {
        const container = document.getElementById("quote-container")
        if (container) {
            const currentScroll = container.scrollTop
            container.scrollTo({ top: currentScroll + window.innerHeight, behavior: "smooth" })
        }
    }

    return (
        <div className={styles.container}>
            {screen.imageUrl && (
                <div
                    className={styles.background}
                    style={{ backgroundImage: `url(${screen.imageUrl})` }}
                >
                    <div className={isHero ? styles.overlayDark : styles.overlayLight} />
                </div>
            )}

            <div className={`${styles.pagination} ${isHero ? styles.paginationDark : styles.paginationLight}`}>
                {index + 1}/{total}
            </div>

            <div className={`${styles.content} ${isHero ? styles.contentHero : styles.contentDefault}`}>
                {isHero && (
                    <>
                        <div className={styles.heroBlock}>
                            <p className={styles.heroClientName}>{screen.title}</p>
                            <h1 className={styles.heroTitle}>{screen.subtitle}</h1>
                            <p className={styles.heroSubtitle}>{screen.body}</p>
                        </div>

                        <div className={styles.heroCtaSticky}>
                            <button onClick={scrollToNext} className={shared.ctaButton}>
                                Veja onde você vai se hospedar
                            </button>
                        </div>
                    </>
                )}

                {!isHero && (
                    <>
                        {screen.includedStatus && !isSummary && (
                            <div style={{ marginBottom: 12 }}>
                                <IncludedBadge status={screen.includedStatus} />
                            </div>
                        )}

                        <h1 className={styles.titleLight}>{screen.title}</h1>

                        {screen.subtitle && (
                            <p className={styles.subtitleLight}>{screen.subtitle}</p>
                        )}

                        {screen.body && (
                            <p className={styles.bodyLight}>{screen.body}</p>
                        )}

                        {isHotel && screen.hotelCarouselImageUrls && (
                            <div style={{ marginTop: 20 }}>
                                <HotelCarousel imageUrls={screen.hotelCarouselImageUrls || []} />
                            </div>
                        )}

                        {isExperiences && (screen as any).experienceItems && (
                            <div className={styles.experiencesGrid}>
                                {(screen as any).experienceItems.map((exp: any, i: number) => (
                                    <div key={i} className={styles.experienceItem}>
                                        <div className={styles.experienceIcon}>{exp.icon}</div>
                                        <div className={styles.experienceTitle}>{exp.title}</div>
                                        <div className={styles.experienceSubtitle}>{exp.subtitle}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {isFlight && (screen as any).flightData && (
                            <div className={styles.flightCard}>
                                <div className={styles.flightHeader}>
                                    {(screen as any).flightData.airline} · {(screen as any).flightData.flightNumber}
                                </div>
                                <div className={styles.flightRoute}>
                                    <div className={styles.flightPoint}>
                                        <div className={styles.flightTime}>{(screen as any).flightData.departureTime}</div>
                                        <div className={styles.flightAirport}>{(screen as any).flightData.departureAirport}</div>
                                        <div className={styles.flightCity}>{(screen as any).flightData.departureCity}</div>
                                    </div>
                                    <div className={styles.flightMiddle}>
                                        <div className={styles.flightDuration}>{(screen as any).flightData.duration}</div>
                                        <div className={styles.flightLine}>
                                            <div className={styles.flightPlane}>✈️</div>
                                        </div>
                                        {(screen as any).flightData.stops > 0 && (
                                            <div className={styles.flightStops}>
                                                {(screen as any).flightData.stops} parada{(screen as any).flightData.stops > 1 ? "s" : ""}
                                            </div>
                                        )}
                                    </div>
                                    <div className={`${styles.flightPoint} ${styles.flightPointRight}`}>
                                        <div className={styles.flightTime}>{(screen as any).flightData.arrivalTime}</div>
                                        <div className={styles.flightAirport}>{(screen as any).flightData.arrivalAirport}</div>
                                        <div className={styles.flightCity}>{(screen as any).flightData.arrivalCity}</div>
                                    </div>
                                </div>
                                <div className={styles.flightDate}>{(screen as any).flightData.date}</div>
                            </div>
                        )}

                        {isSummary && (screen as any).totalPrice && (
                            <div className={styles.summaryPrice}>
                                <div className={styles.summaryLabel}>Valor total</div>
                                <div className={styles.summaryValue}>{(screen as any).totalPrice}</div>
                                <div className={styles.summaryNote}>Parcelamos em até 10x sem juros</div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {index < total - 1 && !isHero && (
                <div className={styles.scrollHint}>
                    <span>Deslize para continuar</span>
                    <span>↓</span>
                </div>
            )}
        </div>
    )
}
