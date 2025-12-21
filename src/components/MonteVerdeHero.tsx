import { ChevronDown, MapPin } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { ScreenProps } from '../types/cotacao';

export function MonteVerdeHero({ cotacaoData, onNext }: ScreenProps) {
    const { snapshot } = cotacaoData;

    // Dados do cliente
    const clienteNome = snapshot.cliente?.nome || "Viajante";

    // Dados do destino
    const destinoNome = snapshot.meta?.destino_nome || "Destino";
    const destinoEstado = snapshot.meta?.destino_estado || "";
    const destinoImagem = snapshot.meta?.destino_imagem || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080";
    const duracao = snapshot.meta?.duracao || "sua viagem";
    const tagline = snapshot.meta?.tagline || "Preparamos uma experiência pensada em cada detalhe.";

    // Monta label do destino (ex: "Monte Verde · MG" ou "Paris · França")
    const destinoLabel = destinoEstado
        ? `${destinoNome} · ${destinoEstado}`
        : destinoNome;

    return (
        <div className="h-full flex flex-col bg-black relative overflow-hidden">
            {/* Status Bar iOS */}
            <div className="absolute top-0 left-0 right-0 h-12 z-50 flex items-center justify-between px-6 pt-2">
                <span className="text-white text-sm">9:41</span>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-3 border border-white rounded-sm" />
                    <div className="w-6 h-3 border border-white rounded-sm" />
                    <div className="w-6 h-3 bg-white rounded-sm" />
                </div>
            </div>

            <div className="relative h-full w-full">
                <ImageWithFallback
                    src={destinoImagem}
                    alt={destinoNome}
                    className="w-full h-full object-cover object-center"
                />

                <div className="absolute inset-0 bg-[#50cfad]/[0.12]" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#50cfad]/5 via-transparent to-[#09077d]/60" />

                {/* Badge do destino */}
                <div className="absolute top-16 left-6 bg-black/40 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 border border-white/10">
                    <MapPin className="w-3.5 h-3.5 text-[#50cfad]" />
                    <span className="text-white/90 text-xs tracking-wide">{destinoLabel}</span>
                </div>

                {/* Conteúdo principal */}
                <div className="absolute inset-0 flex flex-col items-start justify-end px-8 pb-32">
                    <div className="space-y-4 max-w-sm">
                        <p className="text-white/70 text-sm tracking-wider uppercase">
                            {clienteNome},
                        </p>

                        <h1 className="text-white text-4xl leading-tight tracking-tight">
                            {tagline.split('.')[0]}.
                            {tagline.split('.').slice(1).map((part, i) => (
                                <span key={i}><br />{part.trim()}</span>
                            ))}
                        </h1>

                        <p className="text-white/80 text-base leading-relaxed">
                            {duracao} onde tudo está resolvido.<br />
                            Você só precisa estar presente.
                        </p>
                    </div>
                </div>

                {/* Indicadores de navegação */}
                <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#50cfad]" />
                        <div className="w-2 h-2 rounded-full bg-white/20" />
                        <div className="w-2 h-2 rounded-full bg-white/20" />
                        <div className="w-2 h-2 rounded-full bg-white/20" />
                        <div className="w-2 h-2 rounded-full bg-white/20" />
                        <div className="w-2 h-2 rounded-full bg-white/20" />
                        <div className="w-2 h-2 rounded-full bg-white/20" />
                        <div className="w-2 h-2 rounded-full bg-white/20" />
                    </div>

                    <button onClick={onNext} className="flex flex-col items-center gap-1">
                        <ChevronDown className="w-5 h-5 text-white/60 animate-bounce" strokeWidth={1.5} />
                    </button>
                </div>

                {/* Rodapé */}
                <div className="absolute bottom-3 left-0 right-0 text-center">
                    <p className="text-white/30 text-[10px] tracking-widest uppercase">
                        DSC Travel
                    </p>
                </div>
            </div>
        </div>
    );
}