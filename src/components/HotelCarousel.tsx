type Props = {
    imageUrls: string[]
}

export default function HotelCarousel({ imageUrls }: Props) {
    return (
        <div style={{ marginTop: 12 }}>
            <div
                data-role="carousel"
                style={{
                    display: "flex",
                    gap: 12,
                    overflowX: "auto",
                    scrollSnapType: "x mandatory",
                    WebkitOverflowScrolling: "touch",
                    paddingBottom: 6,
                }}
            >
                {imageUrls.map((url, idx) => (
                    <div
                        key={`${url}-${idx}`}
                        style={{
                            flex: "0 0 86%",
                            scrollSnapAlign: "start",
                            borderRadius: 18,
                            overflow: "hidden",
                            border: "1px solid #e5e7eb",
                            background: "#ffffff",
                        }}
                    >
                        <img
                            src={url}
                            alt=""
                            style={{
                                width: "100%",
                                height: 280,
                                objectFit: "cover",
                                display: "block",
                            }}
                        />
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 10, display: "flex", gap: 6, justifyContent: "center" }}>
                {imageUrls.slice(0, 8).map((_, idx) => (
                    <div
                        key={idx}
                        style={{
                            width: 6,
                            height: 6,
                            borderRadius: 999,
                            background: "#e5e7eb",
                        }}
                    />
                ))}
            </div>
        </div>
    )
}
