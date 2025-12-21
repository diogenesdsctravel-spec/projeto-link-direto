type Props = {
    ida: string
    volta: string
    setIda: (v: string) => void
    setVolta: (v: string) => void
}

export function TransfersTab({ ida, volta, setIda, setVolta }: Props) {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-medium">Transfers</h2>

            <input
                className="w-full border rounded px-3 py-2"
                placeholder="Transfer ida"
                value={ida}
                onChange={e => setIda(e.target.value)}
            />

            <input
                className="w-full border rounded px-3 py-2"
                placeholder="Transfer volta"
                value={volta}
                onChange={e => setVolta(e.target.value)}
            />
        </div>
    )
}
