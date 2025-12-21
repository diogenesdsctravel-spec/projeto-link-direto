type Props = {
    clienteNome: string
    setClienteNome: (v: string) => void
    clienteEmail: string
    setClienteEmail: (v: string) => void
}

export function ClienteTab(props: Props) {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-medium mb-4">Dados do Cliente</h2>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2"
                    value={props.clienteNome}
                    onChange={(e) => props.setClienteNome(e.target.value)}
                    placeholder="Ex: João Silva"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                    type="email"
                    className="w-full border rounded-lg px-3 py-2"
                    value={props.clienteEmail}
                    onChange={(e) => props.setClienteEmail(e.target.value)}
                    placeholder="Ex: joao@email.com"
                />
            </div>
        </div>
    )
}
