import { useMemo, useState } from "react"

type UploadItem = {
    id: string
    file: File
}

type Props = {
    onContinuar: (args: { arquivos: File[]; instrucaoIA: string }) => void
}

function gerarId() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function AdminUploadStep({ onContinuar }: Props) {
    const [itens, setItens] = useState<UploadItem[]>([])
    const [instrucaoIA, setInstrucaoIA] = useState("")

    const arquivos = useMemo(() => itens.map(i => i.file), [itens])

    function onEscolherArquivos(files: FileList | null) {
        if (!files || files.length === 0) return

        const novos: UploadItem[] = Array.from(files).map(file => ({
            id: gerarId(),
            file,
        }))

        setItens(prev => [...prev, ...novos])
    }

    function remover(id: string) {
        setItens(prev => prev.filter(i => i.id !== id))
    }

    const podeContinuar = arquivos.length > 0

    return (
        <div className="bg-white rounded-lg border overflow-hidden">
            <div className="p-6 space-y-6">
                <div>
                    <h2 className="text-lg font-medium text-gray-900">Nova cotação</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Primeiro envie o PDF ou prints. Depois você completa as abas.
                    </p>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        PDF ou prints
                    </label>

                    <div>
                        <input
                            id="upload-cotacao"
                            type="file"
                            multiple
                            accept="application/pdf,image/*"
                            onChange={(e) => onEscolherArquivos(e.target.files)}
                            className="sr-only"
                        />

                        <label
                            htmlFor="upload-cotacao"
                            className="flex items-center justify-between gap-3 w-full border rounded-lg px-4 py-4 cursor-pointer hover:bg-gray-50"
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-2xl leading-none text-gray-700">
                                    +
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-900">Anexar PDF ou prints</span>
                                    <span className="text-sm text-gray-500">Clique no + para escolher arquivos</span>
                                </div>
                            </div>
                        </label>
                    </div>

                    {itens.length > 0 && (
                        <div className="border rounded-lg divide-y">
                            {itens.map(item => (
                                <div key={item.id} className="flex items-center justify-between px-3 py-2">
                                    <div className="text-sm text-gray-700 truncate">
                                        {item.file.name}
                                    </div>
                                    <button
                                        onClick={() => remover(item.id)}
                                        className="text-sm text-gray-600 hover:text-gray-900"
                                    >
                                        Remover
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="text-xs text-gray-500">
                        Dica: pode mandar 1 PDF + prints extras se precisar.
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Instrução para a IA (opcional)
                    </label>

                    <textarea
                        value={instrucaoIA}
                        onChange={(e) => setInstrucaoIA(e.target.value)}
                        placeholder="Ex: deixe o texto mais curto, tire formalidades, destaque o hotel, etc."
                        rows={5}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                </div>

                <div className="flex items-center justify-end gap-3">
                    <button
                        disabled={!podeContinuar}
                        onClick={() => onContinuar({ arquivos, instrucaoIA })}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-900 text-white disabled:opacity-50"
                    >
                        Continuar
                    </button>
                </div>
            </div>
        </div>
    )
}
