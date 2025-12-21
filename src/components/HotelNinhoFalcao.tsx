import { ImageWithFallback } from './figma/ImageWithFallback';
import { Star, Wifi, Coffee, Utensils, Snowflake, Home, Car, Dumbbell, Wind, Tv, Bath } from 'lucide-react';
import { useState } from 'react';
import type { ScreenProps } from '../types/cotacao';
import { getHotel } from '../types/cotacao';

// Mapa de ícones para amenidades
const amenidadeIcons: Record<string, React.ReactNode> = {
    "wi-fi": <Wifi className="w-5 h-5 text-[#50cfad]" />,
    "wifi": <Wifi className="w-5 h-5 text-[#50cfad]" />,
    "café da manhã": <Coffee className="w-5 h-5 text-[#50cfad]" />,
    "café": <Coffee className="w-5 h-5 text-[#50cfad]" />,
    "restaurante": <Utensils className="w-5 h-5 text-[#50cfad]" />,
    "lareira": <Home className="w-5 h-5 text-[#50cfad]" />,
    "vista": <Snowflake className="w-5 h-5 text-[#50cfad]" />,
    "vista montanhas": <Snowflake className="w-5 h-5 text-[#50cfad]" />,
    "spa": <Star className="w-5 h-5 text-[#50cfad]" />,
    "estacionamento": <Car className="w-5 h-5 text-[#50cfad]" />,
    "academia": <Dumbbell className="w-5 h-5 text-[#50cfad]" />,
    "ar condicionado": <Wind className="w-5 h-5 text-[#50cfad]" />,
    "tv": <Tv className="w-5 h-5 text-[#50cfad]" />,
    "banheira": <Bath className="w-5 h-5 text-[#50cfad]" />,
    "piscina": <Bath className="w-5 h-5 text-[#50cfad]" />,
};

// Imagem padrão caso não tenha imagens
const imagemPadrao = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80";

export function HotelNinhoFalcao({ cotacaoData, onNext, onPrev }: ScreenProps) {
    const { snapshot } = cotacaoData;

    // Extrai dados do hotel
    const hotel = getHotel(snapshot);

    // Se não houver hotel, mostra mensagem
    if (!hotel) {
        return (
            <div className="h-full flex items-center justify-center bg-white">
                <p className="text-gray-500">Hospedagem não incluída neste pacote</p>
            </div>
        );
    }

    // Dados do hotel
    const nome = hotel.nome || "Hotel";
    const localizacao = hotel.localizacao || snapshot.meta?.destino_nome || "";
    const categoria = hotel.categoria || "";
    const estrelas = hotel.estrelas || 0;
    const noites = hotel.noites || 0;
    const regime = hotel.regime || "";
    const descricao = hotel.descricao || "";
    const amenidades = hotel.amenidades || [];
    const imagens = hotel.imagens && hotel.imagens.length > 0 ? hotel.imagens : [imagemPadrao];
    const avaliacao = hotel.avaliacao;
    const observacoes = hotel.observacoes || "";

    // Estado do carrossel
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState(0);

    // Carrossel horizontal de imagens
    const handleImageTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.targetTouches[0].clientX);
    };

    const handleImageTouchEnd = (e: React.TouchEvent) => {
        const touchEndX = e.changedTouches[0].clientX;
        const distanceX = touchStartX - touchEndX;

        if (Math.abs(distanceX) > 50) {
            if (distanceX > 0 && currentImageIndex < imagens.length - 1) {
                setCurrentImageIndex(prev => prev + 1);
            }
            if (distanceX < 0 && currentImageIndex > 0) {
                setCurrentImageIndex(prev => prev - 1);
            }
        }

        setTouchStartX(0);
    };

    // Função para obter ícone da amenidade
    const getAmenidadeIcon = (amenidade: string) => {
        const key = amenidade.toLowerCase();
        for (const [termo, icon] of Object.entries(amenidadeIcons)) {
            if (key.includes(termo)) {
                return icon;
            }
        }
        return <Star className="w-5 h-5 text-[#50cfad]" />;
    };

    return (
        <div className="h-full flex flex-col bg-white relative overflow-hidden">
            {/* Status Bar iOS */}
            <div className="absolute top-0 left-0 right-0 h-12 z-50 flex items-center justify-between px-6 pt-2">
                <span className="text-white text-sm drop-shadow-lg">9:41</span>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-3 border border-white rounded-sm" />
                    <div className="w-6 h-3 border border-white rounded-sm" />
                    <div className="w-6 h-3 bg-white rounded-sm" />
                </div>
            </div>

            {/* Imagem hero do hotel - carrossel horizontal */}
            <div
                className="relative h-[380px] flex-shrink-0"
                onTouchStart={handleImageTouchStart}
                onTouchEnd={handleImageTouchEnd}
            >
                <ImageWithFallback
                    src={imagens[currentImageIndex]}
                    alt={nome}
                    className="w-full h-full object-cover transition-opacity duration-300"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-white pointer-events-none" />

                {/* Dots do carrossel */}
                {imagens.length > 1 && (
                    <div className="absolute top-20 left-0 right-0 flex items-center justify-center gap-1.5 z-10 pointer-events-none">
                        {imagens.map((_, index) => (
                            <div
                                key={index}
                                className={`h-1.5 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>
                )}

                {/* Badge categoria */}
                {categoria && (
                    <div className="absolute top-16 right-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-1 shadow-lg pointer-events-none">
                        <Star className="w-4 h-4 fill-[#50cfad] text-[#50cfad]" />
                        <span className="text-sm text-[#09077d]">{categoria}</span>
                    </div>
                )}
            </div>

            {/* Conteúdo scrollável */}
            <div data-scrollable="true" className="flex-1 overflow-y-auto -mt-6 relative z-10">
                <div className="bg-white rounded-t-3xl px-6 pt-6 pb-32">
                    <h1 className="text-[#09077d] text-3xl mb-2">
                        {nome}
                    </h1>

                    {localizacao && (
                        <p className="text-gray-500 text-sm mb-4">
                            {localizacao}
                        </p>
                    )}

                    {/* Estrelas e avaliação */}
                    <div className="flex items-center gap-3 mb-6">
                        {estrelas > 0 && (
                            <div className="flex items-center gap-1">
                                {Array.from({ length: estrelas }).map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-[#50cfad] text-[#50cfad]" />
                                ))}
                            </div>
                        )}
                        {avaliacao && (
                            <span className="text-sm text-gray-600">
                                {avaliacao.nota} • {avaliacao.total_avaliacoes} avaliações
                            </span>
                        )}
                    </div>

                    {/* Descrição */}
                    {descricao && (
                        <p className="text-gray-700 text-sm leading-relaxed mb-6">
                            {descricao}
                        </p>
                    )}

                    {amenidades.length > 0 && (
                        <>
                            <div className="h-px bg-gray-200 mb-6" />

                            <h3 className="text-[#09077d] text-lg mb-4">
                                O que este lugar oferece
                            </h3>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {amenidades.slice(0, 6).map((amenidade, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#50cfad]/10 flex items-center justify-center">
                                            {getAmenidadeIcon(amenidade)}
                                        </div>
                                        <span className="text-sm text-gray-700">{amenidade}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Info box */}
                    <div className="bg-gradient-to-r from-[#50cfad]/10 to-[#09077d]/5 rounded-2xl p-4 border border-[#50cfad]/20">
                        <p className="text-[#09077d] text-sm">
                            <span className="font-semibold">✨ Incluso na sua estadia:</span>{' '}
                            {noites > 0 && `${noites} noite${noites > 1 ? 's' : ''}`}
                            {regime && ` • ${regime}`}
                            {observacoes && ` • ${observacoes}`}
                        </p>
                    </div>
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
                        Deslize para continuar a experiência
                    </p>
                </div>

                <div className="flex items-center justify-center gap-2 mt-4">
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-[#50cfad]" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                </div>
            </div>
        </div>
    );
}