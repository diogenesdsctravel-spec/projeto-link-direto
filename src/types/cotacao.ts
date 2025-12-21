// ============================================================
// SISTEMA DE COTAÇÕES DSC TRAVEL
// Tipos centralizados - v1.0
// ============================================================

// === TIPOS DE DADOS POR ITEM ===

export interface VooDados {
    direcao: "ida" | "volta";
    companhia: string;
    numero_voo?: string;
    data: string;
    dia_semana: string;
    origem: {
        codigo: string;
        cidade: string;
    };
    destino: {
        codigo: string;
        cidade: string;
    };
    horario_saida: string;
    horario_chegada: string;
    duracao: string;
    bagagem?: string;
    conexoes?: number;
    observacoes?: string;
}

export interface HotelDados {
    nome: string;
    categoria?: string;
    estrelas?: number;
    localizacao: string;
    noites: number;
    regime: string;
    checkin?: string;
    checkout?: string;
    imagens: string[];
    amenidades: string[];
    avaliacao?: {
        nota: number;
        total_avaliacoes: number;
    };
    descricao?: string;
    observacoes?: string;
}

export interface TransferDados {
    direcao: "ida" | "volta";
    tipo: string;
    origem: {
        nome: string;
        cidade: string;
    };
    destino: {
        nome: string;
        cidade: string;
    };
    duracao: string;
    distancia?: string;
    observacoes?: string;
}

export interface ExperienciaDados {
    nome: string;
    descricao?: string;
    duracao?: string;
    incluso_no_pacote: boolean;
}

export interface OutroDados {
    descricao: string;
    detalhes?: string;
}

// === ITEM DO PACOTE ===

export type TipoItem = "voo" | "hotel" | "transfer" | "experiencia" | "passeio" | "seguro" | "outro";

export interface ItemPacote {
    tipo: TipoItem;
    incluido: boolean;
    titulo: string;
    subtitulo?: string;
    preco?: number;
    dados: VooDados | HotelDados | TransferDados | ExperienciaDados | OutroDados;
}

// === EXPERIÊNCIA DO DESTINO ===

export interface ExperienciaDestino {
    icone: string;
    titulo: string;
    subtitulo: string;
    imagem: string;
}

// === SNAPSHOT PRINCIPAL ===

export type ScreenId =
    | "hero"
    | "experiencias"
    | "voo_ida"
    | "transfer_ida"
    | "hotel"
    | "transfer_volta"
    | "voo_volta"
    | "orcamento";

export interface Snapshot {
    version: "1.0";

    meta: {
        destino_nome: string;
        destino_estado?: string;
        destino_pais: string;
        destino_imagem: string;
        tagline?: string;
        duracao?: string;
        data_inicio?: string;
        data_fim?: string;
        moeda: string;
    };

    cliente: {
        nome: string;
        email?: string;
    };

    financeiro: {
        valor_total: number;
        valor_por_pessoa?: number;
        parcelamento: string;
        observacoes?: string;
    };

    itens: ItemPacote[];

    experiencias: ExperienciaDestino[];

    screens?: ScreenId[];
}

// === COTAÇÃO COMPLETA (como vem do Supabase) ===

export interface Cotacao {
    id: string;
    slug: string;
    cliente_nome: string;
    cliente_email?: string;
    valor_total?: number;
    parcelamento?: string;
    status: "rascunho" | "enviada" | "visualizada" | "confirmada" | "expirada";
    snapshot: Snapshot;
    destino_nome?: string;
    destino_estado?: string;
    destino_imagem?: string;
    destino_descricao?: string;
    expires_at: string;
    created_at: string;
    updated_at: string;
}

// === PROPS PADRÃO PARA COMPONENTES DE TELA ===

export interface CotacaoData {
    snapshot: Snapshot;
    cotacao: Cotacao;
}

export interface ScreenProps {
    cotacaoData: CotacaoData;
    onNext?: () => void;
    onPrev?: () => void;
}

// === HELPERS DE TIPO ===

/**
 * Extrai um item específico do snapshot por tipo e direção
 */
export function getItemByTipo<T extends ItemPacote["dados"]>(
    snapshot: Snapshot,
    tipo: TipoItem,
    direcao?: "ida" | "volta"
): T | null {
    const item = snapshot.itens.find((i) => {
        if (i.tipo !== tipo) return false;
        if (direcao && "direcao" in i.dados) {
            return (i.dados as VooDados | TransferDados).direcao === direcao;
        }
        return true;
    });
    return item ? (item.dados as T) : null;
}

/**
 * Verifica se um tipo de item existe no snapshot
 */
export function hasItem(snapshot: Snapshot, tipo: TipoItem, direcao?: "ida" | "volta"): boolean {
    return getItemByTipo(snapshot, tipo, direcao) !== null;
}

/**
 * Extrai o hotel do snapshot
 */
export function getHotel(snapshot: Snapshot): HotelDados | null {
    return getItemByTipo<HotelDados>(snapshot, "hotel");
}

/**
 * Extrai voo por direção
 */
export function getVoo(snapshot: Snapshot, direcao: "ida" | "volta"): VooDados | null {
    return getItemByTipo<VooDados>(snapshot, "voo", direcao);
}

/**
 * Extrai transfer por direção
 */
export function getTransfer(snapshot: Snapshot, direcao: "ida" | "volta"): TransferDados | null {
    return getItemByTipo<TransferDados>(snapshot, "transfer", direcao);
}

/**
 * Formata valor em BRL
 */
export function formatCurrency(value: number, moeda: string = "BRL"): string {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: moeda,
    }).format(value);
}

/**
 * Formata valor separando inteiro e decimal (para exibição grande)
 */
export function formatCurrencySplit(value: number): { inteiro: string; decimal: string } {
    const formatted = value.toFixed(2);
    const [inteiro, decimal] = formatted.split(".");
    return {
        inteiro: new Intl.NumberFormat("pt-BR").format(parseInt(inteiro)),
        decimal,
    };
}