import { useState } from "react";
import { extrairDadosCotacao, aplicarDadosNoForm } from "../services/extrairDadosOpenAI";
import { useCotacaoForm } from "../components/admin/hooks/useCotacaoForm";
import { supabase } from "../lib/supabase";

export function TesteCotacaoIsolado() {
    const form = useCotacaoForm(supabase);
    const [arquivo, setArquivo] = useState<File | null>(null);
    const [log, setLog] = useState<string>("");

    async function processar() {
        if (!arquivo) {
            alert("Anexe um PDF");
            return;
        }

        setLog("Processando PDF...");

        try {
            const dados = await extrairDadosCotacao([arquivo]);
            setLog("Dados extraídos com sucesso");

            aplicarDadosNoForm(dados, form);
            setLog("Dados aplicados no form");
        } catch (e: any) {
            setLog("Erro: " + e.message);
        }
    }

    return (
        <div style={{ padding: 24, maxWidth: 800 }}>
            <h1>Teste isolado – Upload PDF</h1>

            <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setArquivo(e.target.files?.[0] ?? null)}
            />

            <br /><br />

            <button onClick={processar}>
                Processar PDF
            </button>

            <hr />

            <h3>Resultado</h3>

            <div>clienteNome: {form.clienteNome}</div>
            <div>destinoNome: {form.destinoNome}</div>
            <div>destinoPais: {form.destinoPais}</div>
            <div>hotelNome: {form.hotelNome}</div>
            <div>valorTotal: {form.valorTotal}</div>

            <hr />

            <strong>Log:</strong>
            <pre>{log}</pre>
        </div>
    );
}
