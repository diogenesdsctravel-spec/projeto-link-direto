import styles from "../styles/QuoteVersion.module.css"
import type { ScreenTemplate } from "../../../types/destinationTemplate"
import IncludedBadge from "../../../components/IncludedBadge"
import HotelCarousel from "../../../components/HotelCarousel"
import FlightCard from "./FlightCard"
import Pagination from "./Pagination"
import ScrollHint from "./ScrollHint"

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
        <div className={styles.screenView}>
            {/* Background Image */}
            {screen.imageUrl && (
                <div
                    className={styles.screenBackground}
                    style={{ backgroundImage: `url(${screen.imageUrl})` }}
                >
                    <div className={isHero ? styles.screenOverlayDark : styles.screenOverlayLight} />
                </div>
            )}

            {/* Pagination */}
            <Pagination index={index} total={total} light={isHero} />

            {/* Content */}
            <div className={`${styles.screenContent} ${isHero ? styles.screenContentHero : styles.screenContentDefault}`}>

                {/* Hero específico */}
                {isHero && (
                    <>
                        <p className={styles.heroClientName}>{screen.title}</p>
                        <h1 className={styles.heroTitle}>{screen.subtitle}</h1>
                        <p className={styles.heroSubtitle}>{screen.body}</p>
                        <button onClick={scrollToNext} className={styles.ctaButton}>
                            Veja onde você vai se hospedar
                        </button>
                    </>
                )}

                {/* Outras telas */}
                {!isHero && (
                    <>
                        {/* Badge */}
                        {screen.includedStatus && !isSummary && (
                            <div style={{ marginBottom: 12 }}>
                                <IncludedBadge status={screen.includedStatus} />
                            </div>
                        )}

                        {/* Title */}
                        <h1 className={styles.screenTitleLight}>{screen.title}</h1>

                        {/* Subtitle */}
                        {screen.subtitle && (
                            <p className={styles.screenSubtitleLight}>{screen.subtitle}</p>
                        )}

                        {/* Body */}
                        {screen.body && (
                            <p className={styles.screenBodyLight}>{screen.body}</p>
                        )}

                        {/* Hotel Carousel */}
                        {isHotel && screen.hotelCarouselImageUrls && (
                            <div style={{ marginTop: 20 }}>
                                <HotelCarousel imageUrls={screen.hotelCarouselImageUrls || []} />
                            </div>
                        )}

                        {/* Experiences Grid */}
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

                        {/* Flight Card */}
                        {isFlight && (screen as any).flightData && (
                            <FlightCard data={(screen as any).flightData} />
                        )}

                        {/* Summary Price */}
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

            {/* Scroll hint */}
            {index < total - 1 && !isHero && (
                <ScrollHint light={isHero} />
            )}
        </div>
    )
}
