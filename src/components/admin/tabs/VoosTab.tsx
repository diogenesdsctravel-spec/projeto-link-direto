type Props = {
    origem: string
    destino: string
    setOrigem: (v: string) => void
    setDestino: (v: string) => void
}

export function VoosTab({ origem, destino, setOrigem, setDestino }: Props) {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-medium">Voos</h2>

            <input
                className="w-full border rounded px-3 py-2"
                placeholder="Origem"
                value={origem}
                onChange={e => setOrigem(e.target.value)}
            />

            <input
                className="w-full border rounded px-3 py-2"
                placeholder="Destino"
                value={destino}
                onChange={e => setDestino(e.target.value)}
            />
        </div>
    )
}
