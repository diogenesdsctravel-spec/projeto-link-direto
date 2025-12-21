import { ImageWithFallback } from './figma/ImageWithFallback';
import type { ScreenProps } from '../types/cotacao';

// Experiências padrão caso o snapshot não tenha
const experienciasPadrao = [
    {
        imagem: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        icone: "✨",
        titulo: "Experiência única",
        subtitulo: "Momentos inesquecíveis",
    },
];

export function MonteVerdeExperiencias({ cotacaoData, onNext, onPrev }: ScreenProps) {
    const { snapshot } = cotacaoData;

    // Dados do destino
    const destinoNome = snapshot.meta?.destino_nome || "seu destino";
    const duracao = snapshot.meta?.duracao || "sua viagem";

    // Experiências do snapshot ou padrão
    const experiencias = snapshot.experiencias && snapshot.experiencias.length > 0
        ? snapshot.experiencias
        : experienciasPadrao;

    return (
        <div className="h-full flex flex-col bg-white relative overflow-hidden">
            {/* Status Bar iOS */}
            <div className="absolute top-0 left-0 right-0 h-12 z-50 flex items-center justify-between px-6 pt-2 bg-gradient-to-b from-black/20 to-transparent">
                <span className="text-white text-sm drop-shadow-lg">9:41</span>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-3 border border-white rounded-sm" />
                    <div className="w-6 h-3 border border-white rounded-sm" />
                    <div className="w-6 h-3 bg-white rounded-sm" />
                </div>
            </div>

            {/* Header fixo */}
            <div className="relative z-10 pt-14 pb-6 px-6 bg-white">
                <h1 className="text-[#09077d] text-2xl mb-1">
                    {duracao} em {destinoNome}
                </h1>
                <p className="text-gray-600 text-sm">Experiências que esperam por você</p>
            </div>

            {/* Conteúdo scrollável */}
            <div data-scrollable="true" className="flex-1 overflow-y-auto px-6 pb-24">
                <div className="grid grid-cols-2 gap-4">
                    {experiencias.map((exp, index) => (
                        <div
                            key={index}
                            className="relative rounded-2xl overflow-hidden aspect-[3/4] group"
                        >
                            <ImageWithFallback
                                src={exp.imagem}
                                alt={exp.titulo}
                                className="w-full h-full object-cover"
                            />

                            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />

                            <div className="absolute inset-0 flex flex-col justify-between p-4">
                                <div className="text-3xl">{exp.icone}</div>

                                <div>
                                    <h3 className="text-white text-base mb-1">{exp.titulo}</h3>
                                    <p className="text-white/80 text-xs leading-snug">{exp.subtitulo}</p>
                                </div>
                            </div>

                            <div className="absolute inset-0 border-2 border-[#50cfad]/0 group-hover:border-[#50cfad]/30 transition-colors rounded-2xl pointer-events-none" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom fixo */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-8 pb-8 px-6 z-20">
                <div className="flex flex-col items-center gap-3">
                    <svg
                        className="w-8 h-8 text-[#50cfad] animate-bounce"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg>

                    <p className="text-[#09077d] text-sm text-center">
                        Deslize para começar a viver uma experiência que vai mudar a sua vida
                    </p>
                </div>

                <div className="flex items-center justify-center gap-2 mt-4">
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-[#50cfad]" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                </div>
            </div>
        </div>
    );
}