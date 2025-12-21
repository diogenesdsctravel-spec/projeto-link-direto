export function DestinoTab({ form }: { form: any }) {
    const {
        destinoNome,
        destinoEstado,
        destinoPais,
        destinoImagem,
        destinoTagline,
        destinoDuracao,
        dataInicio,
        dataFim,
        setDestinoNome,
        setDestinoEstado,
        setDestinoPais,
        setDestinoImagem,
        setDestinoTagline,
        setDestinoDuracao,
        setDataInicio,
        setDataFim
    } = form

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-medium">Destino</h2>

            <input
                className="w-full border rounded px-3 py-2"
                placeholder="Nome do destino"
                value={destinoNome}
                onChange={e => setDestinoNome(e.target.value)}
            />

            <input
                className="w-full border rounded px-3 py-2"
                placeholder="Estado"
                value={destinoEstado}
                onChange={e => setDestinoEstado(e.target.value)}
            />

            <input
                className="w-full border rounded px-3 py-2"
                placeholder="País"
                value={destinoPais}
                onChange={e => setDestinoPais(e.target.value)}
            />

            <input
                className="w-full border rounded px-3 py-2"
                placeholder="Imagem principal (URL)"
                value={destinoImagem}
                onChange={e => setDestinoImagem(e.target.value)}
            />

            <input
                className="w-full border rounded px-3 py-2"
                placeholder="Tagline"
                value={destinoTagline}
                onChange={e => setDestinoTagline(e.target.value)}
            />

            <input
                className="w-full border rounded px-3 py-2"
                placeholder="Duração"
                value={destinoDuracao}
                onChange={e => setDestinoDuracao(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
                <input
                    type="date"
                    className="border rounded px-3 py-2"
                    value={dataInicio}
                    onChange={e => setDataInicio(e.target.value)}
                />
                <input
                    type="date"
                    className="border rounded px-3 py-2"
                    value={dataFim}
                    onChange={e => setDataFim(e.target.value)}
                />
            </div>
        </div>
    )
}
