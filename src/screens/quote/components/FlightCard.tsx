import styles from "../styles/QuoteVersion.module.css"

interface FlightData {
    airline: string
    flightNumber: string
    date: string
    departureTime: string
    departureAirport: string
    departureCity: string
    arrivalTime: string
    arrivalAirport: string
    arrivalCity: string
    duration: string
    stops: number
    stopInfo?: string
}

interface FlightCardProps {
    data: FlightData
}

export default function FlightCard({ data }: FlightCardProps) {
    return (
        <div className={styles.flightCard}>
            <div className={styles.flightHeader}>
                {data.airline} · {data.flightNumber}
            </div>

            <div className={styles.flightRoute}>
                <div className={styles.flightPoint}>
                    <div className={styles.flightTime}>{data.departureTime}</div>
                    <div className={styles.flightAirport}>{data.departureAirport}</div>
                    <div className={styles.flightCity}>{data.departureCity}</div>
                </div>

                <div className={styles.flightMiddle}>
                    <div className={styles.flightDuration}>{data.duration}</div>
                    <div className={styles.flightLine}>
                        <div className={styles.flightPlane}>✈️</div>
                    </div>
                    {data.stops > 0 && (
                        <div className={styles.flightStops}>
                            {data.stops} parada{data.stops > 1 ? "s" : ""}
                        </div>
                    )}
                </div>

                <div className={`${styles.flightPoint} ${styles.flightPointRight}`}>
                    <div className={styles.flightTime}>{data.arrivalTime}</div>
                    <div className={styles.flightAirport}>{data.arrivalAirport}</div>
                    <div className={styles.flightCity}>{data.arrivalCity}</div>
                </div>
            </div>

            <div className={styles.flightDate}>{data.date}</div>
        </div>
    )
}