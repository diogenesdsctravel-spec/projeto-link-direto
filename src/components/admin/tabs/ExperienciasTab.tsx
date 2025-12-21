import type { ExperienciaDestino } from "../../../types/cotacao";

type Props = {
    experiencias: ExperienciaDestino[];
    adicionar: () => void;
    atualizar: (i: number, campo: keyof ExperienciaDestino, v: string) => void;
    remover: (i: number) => void;
};

export function ExperienciasTab({ experiencias, adicionar, atualizar, remover }: Props) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <h2 className="text-lg font-medium">Experiências</h2>
                <button onClick={adicionar} className="px-3 py-1 bg-green-500 text-white rounded">
                    + Adicionar
                </button>
            </div>

            {experiencias.map((exp, i) => (
                <div key={i} className="border rounded p-3 space-y-2">
                    <input
                        className="w-full border rounded px-2 py-1"
                        placeholder="Ícone"
                        value={exp.icone}
                        onChange={(e) => atualizar(i, "icone", e.target.value)}
                    />

                    <input
                        className="w-full border rounded px-2 py-1"
                        placeholder="Título"
                        value={exp.titulo}
                        onChange={(e) => atualizar(i, "titulo", e.target.value)}
                    />

                    <input
                        className="w-full border rounded px-2 py-1"
                        placeholder="Subtítulo"
                        value={exp.subtitulo}
                        onChange={(e) => atualizar(i, "subtitulo", e.target.value)}
                    />

                    <input
                        className="w-full border rounded px-2 py-1"
                        placeholder="Imagem (URL)"
                        value={exp.imagem}
                        onChange={(e) => atualizar(i, "imagem", e.target.value)}
                    />

                    <div className="pt-2">
                        <button onClick={() => remover(i)} className="text-red-600 text-sm hover:underline">
                            Remover
                        </button>
                    </div>
                </div>
            ))}

            {experiencias.length === 0 && (
                <p className="text-sm text-gray-500">Nenhuma experiência adicionada.</p>
            )}
        </div>
    );
}
