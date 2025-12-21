export function AdminSlugBar({ form }: { form: any }) {
    const { slug, setSlug, carregarCotacao, salvarCotacao, mensagem, salvando } = form;

    const linkCliente = slug.trim()
        ? `${window.location.origin}/projeto-link-direto/${slug.trim()}`
        : "(defina o slug)";

    return (
        <div className="bg-white rounded-lg border p-4 mb-6">
            <div className="flex gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug da cotação</label>
                    <input
                        type="text"
                        className="w-full border rounded-lg px-3 py-2"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                        placeholder="ex: joao-monte-verde"
                    />
                </div>
                <button onClick={carregarCotacao} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                    Carregar
                </button>
                <button
                    onClick={salvarCotacao}
                    disabled={salvando}
                    className="px-6 py-2 bg-[#09077d] text-white rounded-lg hover:bg-[#09077d]/90 disabled:opacity-50"
                >
                    {salvando ? "Salvando..." : "Salvar"}
                </button>
            </div>

            <div className="mt-3 text-sm text-gray-500">
                Link:{" "}
                <a href={linkCliente} target="_blank" className="text-[#09077d] hover:underline">
                    {linkCliente}
                </a>
            </div>

            {mensagem && (
                <div
                    className={`mt-3 p-3 rounded-lg text-sm ${mensagem.tipo === "sucesso" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                        }`}
                >
                    {mensagem.texto}
                </div>
            )}
        </div>
    );
}
