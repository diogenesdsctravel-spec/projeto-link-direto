import { useState, useEffect } from "react";
import { Search, ExternalLink, Calendar, User, MapPin, Eye, Edit2 } from "lucide-react";

interface Cotacao {
    id: string;
    slug: string;
    cliente_nome: string;
    cliente_email?: string;
    destino_nome?: string;
    valor_total?: number;
    status: string;
    created_at: string;
    updated_at: string;
}

interface CotacoesListaProps {
    supabase: any;
    onSelectCotacao: (slug: string) => void;
    onNovaCotacao: () => void;
}

export function CotacoesLista({ supabase, onSelectCotacao, onNovaCotacao }: CotacoesListaProps) {
    const [cotacoes, setCotacoes] = useState<Cotacao[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [filtroStatus, setFiltroStatus] = useState<string>("todos");

    useEffect(() => {
        carregarCotacoes();
    }, []);

    const carregarCotacoes = async () => {
        setLoading(true);

        const agora = new Date().toISOString();

        const { data, error } = await supabase
            .from("cotacoes")
            .select("id, slug, cliente_nome, cliente_email, destino_nome, valor_total, status, created_at, updated_at")
            .or(`expires_at.is.null,expires_at.gt.${agora}`)
            .order("updated_at", { ascending: false });

        if (!error && data) {
            setCotacoes(data);
        }

        setLoading(false);
    };

    const cotacoesFiltradas = cotacoes.filter((c) => {
        const matchBusca =
            busca === "" ||
            c.cliente_nome?.toLowerCase().includes(busca.toLowerCase()) ||
            c.destino_nome?.toLowerCase().includes(busca.toLowerCase());

        const matchStatus = filtroStatus === "todos" || c.status === filtroStatus;

        return matchBusca && matchStatus;
    });

    const formatarData = (dataStr: string): string => {
        if (!dataStr) return "-";
        const data = new Date(dataStr);
        return data.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatarValor = (valor?: number): string => {
        if (!valor) return "-";
        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const getStatusBadge = (cotacao: Cotacao) => {
        const statusStyles: Record<string, string> = {
            rascunho: "bg-yellow-100 text-yellow-700",
            enviada: "bg-blue-100 text-blue-700",
            visualizada: "bg-purple-100 text-purple-700",
            confirmada: "bg-green-100 text-green-700",
        };

        const style = statusStyles[cotacao.status] || "bg-gray-100 text-gray-600";
        const label = cotacao.status.charAt(0).toUpperCase() + cotacao.status.slice(1);

        return <span className={`px-2 py-1 text-xs rounded-full ${style}`}>{label}</span>;
    };

    const getLinkPublico = (slug: string): string => {
        return `${window.location.origin}/projeto-link-direto/${slug}`;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Cotações</h2>

                <div className="flex items-center gap-3">
                    <button
                        onClick={onNovaCotacao}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-[#09077d] text-white hover:opacity-90"
                    >
                        Nova cotação
                    </button>

                    <button onClick={carregarCotacoes} className="text-sm text-[#09077d] hover:underline">
                        Atualizar
                    </button>
                </div>
            </div>

            <div className="flex gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por cliente ou destino..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                </div>
                <select
                    className="border rounded-lg px-3 py-2 text-sm"
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                >
                    <option value="todos">Todos os status</option>
                    <option value="rascunho">Rascunho</option>
                    <option value="enviada">Enviada</option>
                    <option value="visualizada">Visualizada</option>
                    <option value="confirmada">Confirmada</option>
                </select>
            </div>

            {loading ? (
                <div className="text-center py-8 text-gray-500">Carregando...</div>
            ) : cotacoesFiltradas.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    {busca || filtroStatus !== "todos"
                        ? "Nenhuma cotação encontrada com esses filtros"
                        : "Nenhuma cotação criada ainda"}
                </div>
            ) : (
                <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                                    Cotação
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                                    Cliente
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                                    Destino
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                                    Valor
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                                    Status
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                                    Atualizado
                                </th>
                                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {cotacoesFiltradas.map((cotacao) => (
                                <tr key={cotacao.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-sm text-gray-900">{cotacao.slug}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-700">{cotacao.cliente_nome || "-"}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-700">{cotacao.destino_nome || "-"}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-gray-700">{formatarValor(cotacao.valor_total)}</span>
                                    </td>
                                    <td className="px-4 py-3">{getStatusBadge(cotacao)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-500">{formatarData(cotacao.updated_at)}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onSelectCotacao(cotacao.slug)}
                                                className="p-2 text-gray-500 hover:text-[#09077d] hover:bg-[#09077d]/5 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <a
                                                href={getLinkPublico(cotacao.slug)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-gray-500 hover:text-[#50cfad] hover:bg-[#50cfad]/5 rounded-lg transition-colors"
                                                title="Ver cotação"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </a>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(getLinkPublico(cotacao.slug));
                                                    alert("Link copiado!");
                                                }}
                                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                                title="Copiar link"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="text-sm text-gray-500">
                {cotacoesFiltradas.length} de {cotacoes.length} cotação(ões)
            </div>
        </div>
    );
}
