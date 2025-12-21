type Props = {
    hotelNome: string
    hotelNoites: number
    setHotelNome: (v: string) => void
    setHotelNoites: (v: number) => void
}

export function HotelTab({ hotelNome, hotelNoites, setHotelNome, setHotelNoites }: Props) {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-medium">Hotel</h2>

            <input
                className="w-full border rounded px-3 py-2"
                placeholder="Nome do hotel"
                value={hotelNome}
                onChange={e => setHotelNome(e.target.value)}
            />

            <input
                type="number"
                className="w-full border rounded px-3 py-2"
                placeholder="Noites"
                value={hotelNoites}
                onChange={e => setHotelNoites(Number(e.target.value))}
            />
        </div>
    )
}
