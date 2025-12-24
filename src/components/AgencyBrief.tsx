/**
 * AGENCY BRIEF - 3 TELAS
 * 
 * Jornada de confiança:
 * 1. CONEXÃO PESSOAL → Quem está me atendendo?
 * 2. ESTRUTURA → Esse lugar é sério?
 * 3. PROVA SOCIAL → Outras pessoas confiam?
 */

import { useEffect, useState } from "react"
import { getAgencyProfile, type AgencyProfile } from "../services/agencyService"

interface AgencyBriefProps {
    clientName: string
}

export default function AgencyBrief({ clientName }: AgencyBriefProps) {
    const [agency, setAgency] = useState<AgencyProfile | null>(null)

    useEffect(() => {
        getAgencyProfile().then(setAgency)
    }, [])

    if (!agency) return null

    return (
        <>
            {/* TELA 1: CONEXÃO PESSOAL */}
            <BriefScreen1 agency={agency} clientName={clientName} />

            {/* TELA 2: ESTRUTURA */}
            <BriefScreen2 agency={agency} />

            {/* TELA 3: PROVA SOCIAL */}
            <BriefScreen3 agency={agency} />
        </>
    )
}

/**
 * TELA 1: CONEXÃO PESSOAL
 * "Quem está me atendendo?"
 */
function BriefScreen1({
    agency,
    clientName
}: {
    agency: AgencyProfile
    clientName: string
}) {
    return (
        <div
            style={{
                height: "100vh",
                scrollSnapAlign: "start",
                position: "relative",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Background - Foto do dono confiante */}
            {agency.ownerPhotoUrl ? (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url(${agency.ownerPhotoUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center top",
                        zIndex: 0,
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `linear-gradient(to bottom, 
                                rgba(9, 7, 125, 0.2) 0%, 
                                rgba(9, 7, 125, 0.6) 50%,
                                rgba(9, 7, 125, 0.95) 100%)`,
                        }}
                    />
                </div>
            ) : (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: agency.colorPrimary,
                        zIndex: 0,
                    }}
                />
            )}

            {/* Conteúdo */}
            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: 24,
                    paddingBottom: 80,
                }}
            >
                {/* Saudação */}
                <h1
                    style={{
                        margin: 0,
                        fontSize: 38,
                        fontWeight: 900,
                        color: "#ffffff",
                        lineHeight: 1.1,
                    }}
                >
                    Olá, {clientName}!
                </h1>

                {/* Apresentação */}
                <p
                    style={{
                        margin: 0,
                        marginTop: 20,
                        fontSize: 19,
                        color: "rgba(255,255,255,0.95)",
                        lineHeight: 1.5,
                    }}
                >
                    Sou {agency.ownerName}, da {agency.agencyName}.
                </p>

                <p
                    style={{
                        margin: 0,
                        marginTop: 8,
                        fontSize: 19,
                        color: "rgba(255,255,255,0.9)",
                        lineHeight: 1.5,
                    }}
                >
                    {agency.welcomeText}
                </p>

                {/* Cidade */}
                <div
                    style={{
                        marginTop: 28,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    <span style={{ fontSize: 16 }}>📍</span>
                    <span style={{
                        fontSize: 15,
                        color: "rgba(255,255,255,0.7)",
                        fontWeight: 500,
                    }}>
                        {agency.city}
                    </span>
                </div>
            </div>

            {/* Scroll hint */}
            <ScrollHint />
        </div>
    )
}

/**
 * TELA 2: ESTRUTURA
 * "Esse lugar é sério?"
 */
function BriefScreen2({ agency }: { agency: AgencyProfile }) {
    // Usa fachada (mais impactante) ou interior
    const backgroundUrl = agency.storeFacadeUrl || agency.storeInteriorUrl

    return (
        <div
            style={{
                height: "100vh",
                scrollSnapAlign: "start",
                position: "relative",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Background - Foto da loja */}
            {backgroundUrl ? (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url(${backgroundUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        zIndex: 0,
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `linear-gradient(to bottom, 
                                rgba(9, 7, 125, 0.3) 0%, 
                                rgba(9, 7, 125, 0.7) 50%,
                                rgba(9, 7, 125, 0.98) 100%)`,
                        }}
                    />
                </div>
            ) : (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: agency.colorPrimary,
                        zIndex: 0,
                    }}
                />
            )}

            {/* Conteúdo */}
            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: 24,
                    paddingBottom: 80,
                }}
            >
                {/* Título */}
                <h2
                    style={{
                        margin: 0,
                        fontSize: 28,
                        fontWeight: 900,
                        color: "#ffffff",
                        lineHeight: 1.2,
                    }}
                >
                    Uma agência de verdade.
                </h2>

                <p
                    style={{
                        margin: 0,
                        marginTop: 8,
                        fontSize: 18,
                        color: "rgba(255,255,255,0.85)",
                        lineHeight: 1.4,
                    }}
                >
                    Com estrutura para cuidar da sua viagem.
                </p>

                {/* Credenciais */}
                <div
                    style={{
                        marginTop: 28,
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                    }}
                >
                    <CredentialItem
                        icon="🏢"
                        text="Loja física em Vitória da Conquista"
                        accent={agency.colorAccent}
                    />
                    <CredentialItem
                        icon="📅"
                        text={`${agency.yearsInBusiness} anos de mercado`}
                        accent={agency.colorAccent}
                    />
                    <CredentialItem
                        icon="💬"
                        text="Atendimento presencial ou online"
                        accent={agency.colorAccent}
                    />
                </div>
            </div>

            {/* Scroll hint */}
            <ScrollHint />
        </div>
    )
}

/**
 * TELA 3: PROVA SOCIAL
 * "Outras pessoas confiam?"
 */
function BriefScreen3({ agency }: { agency: AgencyProfile }) {
    return (
        <div
            style={{
                height: "100vh",
                scrollSnapAlign: "start",
                position: "relative",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Background - Foto atendendo cliente */}
            {agency.ownerServingPhotoUrl ? (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url(${agency.ownerServingPhotoUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        zIndex: 0,
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `linear-gradient(to bottom, 
                                rgba(9, 7, 125, 0.3) 0%, 
                                rgba(9, 7, 125, 0.75) 50%,
                                rgba(9, 7, 125, 0.98) 100%)`,
                        }}
                    />
                </div>
            ) : (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: agency.colorPrimary,
                        zIndex: 0,
                    }}
                />
            )}

            {/* Conteúdo */}
            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: 24,
                    paddingBottom: 80,
                }}
            >
                {/* Tagline */}
                <h2
                    style={{
                        margin: 0,
                        fontSize: 26,
                        fontWeight: 900,
                        color: "#ffffff",
                        lineHeight: 1.2,
                    }}
                >
                    {agency.tagline}
                </h2>

                {/* Diferenciais */}
                <div
                    style={{
                        marginTop: 24,
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                    }}
                >
                    {agency.differentials.map((diff, index) => (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                padding: "12px 16px",
                                borderRadius: 12,
                                background: "rgba(255,255,255,0.1)",
                                backdropFilter: "blur(10px)",
                            }}
                        >
                            <span style={{ fontSize: 20 }}>{diff.icon}</span>
                            <span style={{
                                fontSize: 15,
                                color: "#ffffff",
                                fontWeight: 500,
                            }}>
                                {diff.text}
                            </span>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div
                    style={{
                        marginTop: 28,
                        padding: "16px 20px",
                        borderRadius: 16,
                        background: agency.colorAccent,
                        textAlign: "center",
                    }}
                >
                    <span style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#ffffff",
                    }}>
                        Veja a viagem que preparei para você ↓
                    </span>
                </div>
            </div>
        </div>
    )
}

/**
 * Item de credencial (Tela 2)
 */
function CredentialItem({
    icon,
    text,
    accent
}: {
    icon: string
    text: string
    accent: string
}) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
            }}
        >
            <div
                style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                }}
            >
                {icon}
            </div>
            <span style={{
                fontSize: 16,
                color: "#ffffff",
                fontWeight: 500,
            }}>
                {text}
            </span>
        </div>
    )
}

/**
 * Indicador de scroll
 */
function ScrollHint() {
    return (
        <div
            style={{
                position: "absolute",
                bottom: 24,
                left: "50%",
                transform: "translateX(-50%)",
                color: "rgba(255,255,255,0.5)",
                fontSize: 12,
                textAlign: "center",
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
            }}
        >
            <span>Deslize para continuar</span>
            <span style={{ fontSize: 16 }}>↓</span>
        </div>
    )
}

/**
 * Exporta número de telas do brief
 * Para usar no cálculo de paginação
 */
export const AGENCY_BRIEF_SCREENS_COUNT = 3