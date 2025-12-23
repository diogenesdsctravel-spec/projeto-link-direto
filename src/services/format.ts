export function formatDatePtBr(iso: string): string {
    return new Date(iso).toLocaleDateString("pt-BR")
}
