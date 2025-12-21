type Props = {
    valorTotal: string
    parcelamento: string
    observacoes: string
    setValorTotal: (v: string) => void
    setParcelamento: (v: string) => void
    setObservacoes: (v: string) => void
}

export function FinanceiroTab(props: Props) {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-medium">Financeiro</h2>

            <input
                className="w-full border rounded px-3 py-2"
                placeholder="Valor total"
                value={props.valorTotal}
                onChange={e => props.setValorTotal(e.target.value)}
            />

            <input
                className="w-full border rounded px-3 py-2"
                placeholder="Parcelamento"
                value={props.parcelamento}
                onChange={e => props.setParcelamento(e.target.value)}
            />

            <textarea
                className="w-full border rounded px-3 py-2"
                placeholder="Observações"
                value={props.observacoes}
                onChange={e => props.setObservacoes(e.target.value)}
            />
        </div>
    )
}
